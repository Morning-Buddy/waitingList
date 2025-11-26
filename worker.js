// Cloudflare Worker: Morning Buddy waitlist → Brevo (improved reliability)
export default {
  async fetch(request, env, ctx) {
    const corsHeaders = buildCorsHeaders(request);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Only allow POST
    if (request.method !== "POST") {
      return jsonResponse(
        { ok: false, error: "Method not allowed" },
        405,
        corsHeaders
      );
    }

    try {
      // 1) Parse body (JSON or form data)
      const payload = await getSignupPayload(request);
      const rawName = (payload.name || "").toString().trim();
      const rawEmail = (payload.email || "").toString().trim().toLowerCase();

      // 2) Basic validation – keep it simple so we don't block real people
      if (!rawEmail || !isValidEmail(rawEmail)) {
        return jsonResponse(
          { ok: false, error: "Please enter a valid email address." },
          400,
          corsHeaders
        );
      }

      // 3) Env / configuration validation
      const listId = Number(env.WAITLIST_LIST_ID);
      if (!Number.isFinite(listId)) {
        console.error("WAITLIST_LIST_ID is missing or not numeric");
        return jsonResponse(
          {
            ok: false,
            error: "Server configuration error. Please try again later.",
          },
          500,
          corsHeaders
        );
      }

      if (!env.BREVO_API_KEY) {
        console.error("BREVO_API_KEY is missing");
        return jsonResponse(
          {
            ok: false,
            error: "Server configuration error. Please try again later.",
          },
          500,
          corsHeaders
        );
      }

      // 4) Create / update contact in Brevo with retry logic
      const contactPayload = {
        email: rawEmail,
        attributes: {
          FIRSTNAME: rawName || "",
        },
        listIds: [listId],
        updateEnabled: true,
      };

      let contactRes;
      let contactBodyText = "";
      let lastError = null;

      // Try up to 2 times (initial + 1 retry) for transient failures
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          contactRes = await fetchWithTimeout(
            "https://api.brevo.com/v3/contacts",
            {
              method: "POST",
              headers: {
                "api-key": env.BREVO_API_KEY,
                "Content-Type": "application/json",
                accept: "application/json",
              },
              body: JSON.stringify(contactPayload),
            },
            15000 // 15s timeout (increased from 10s)
          );

          contactBodyText = await contactRes.text().catch(() => "");

          // Success or handled error - break out of retry loop
          if (contactRes.ok) {
            break;
          }

          // Check if this is a "duplicate contact" scenario (treat as success)
          if (isDuplicateContactError(contactRes.status, contactBodyText)) {
            console.log("Brevo: contact already exists, treating as success.");
            break;
          }

          // For 4xx errors (except duplicates), don't retry - it's a client error
          if (contactRes.status >= 400 && contactRes.status < 500) {
            break;
          }

          // For 5xx errors, retry once after a brief delay
          if (attempt === 0 && contactRes.status >= 500) {
            console.warn(`Brevo returned ${contactRes.status}, retrying...`);
            await sleep(1000); // Wait 1 second before retry
            continue;
          }

          break;
        } catch (err) {
          lastError = err;
          console.error(`Brevo contact attempt ${attempt + 1} failed:`, err.message);

          // If it's a timeout or network error, retry once
          if (attempt === 0) {
            await sleep(1000);
            continue;
          }

          break;
        }
      }

      // Check final result
      if (!contactRes || !contactRes.ok) {
        // If it's a duplicate, treat as success
        if (contactRes && isDuplicateContactError(contactRes.status, contactBodyText)) {
          // Continue to success response below
        } else {
          // Real error – fail gracefully
          console.error(
            "Brevo contact error:",
            contactRes?.status || "no response",
            lastError?.message || ""
          );
          return jsonResponse(
            {
              ok: false,
              error:
                "We couldn't add you to the waiting list just now. Please try again in a minute.",
            },
            502,
            corsHeaders
          );
        }
      }

      // 5) Optional: send welcome email using Brevo template (fire-and-forget)
      if (env.WELCOME_TEMPLATE_ID && env.BREVO_API_KEY) {
        const templateId = Number(env.WELCOME_TEMPLATE_ID);
        if (Number.isFinite(templateId)) {
          const emailPayload = {
            to: [{ email: rawEmail, name: rawName || undefined }],
            templateId,
          };

          ctx.waitUntil(
            (async () => {
              try {
                const emailRes = await fetchWithTimeout(
                  "https://api.brevo.com/v3/smtp/email",
                  {
                    method: "POST",
                    headers: {
                      "api-key": env.BREVO_API_KEY,
                      "Content-Type": "application/json",
                      accept: "application/json",
                    },
                    body: JSON.stringify(emailPayload),
                  },
                  10000 // 10s timeout for email send
                );

                if (!emailRes.ok) {
                  console.error(
                    "Brevo welcome email error:",
                    emailRes.status
                  );
                }
              } catch (err) {
                console.error("Brevo welcome email crashed:", err.message);
              }
            })()
          );
        } else {
          console.warn("WELCOME_TEMPLATE_ID is set but not numeric");
        }
      }

      // 6) Success – keep user-facing message simple & friendly
      return jsonResponse(
        { ok: true, message: "You're on the Morning Buddy waitlist 🎉" },
        200,
        corsHeaders
      );
    } catch (err) {
      console.error("Worker unexpected error:", err.message || err);
      return jsonResponse(
        {
          ok: false,
          error: "Unexpected server error. Please try again shortly.",
        },
        500,
        buildCorsHeaders(request)
      );
    }
  },
};

/**
 * Check if the error from Brevo indicates a duplicate contact
 * (which we should treat as success)
 */
function isDuplicateContactError(status, bodyText) {
  // Brevo returns 400 with "already exist" message for duplicates
  if (status === 400 && bodyText) {
    const lowerBody = bodyText.toLowerCase();
    return (
      lowerBody.includes("already exist") ||
      lowerBody.includes("duplicate") ||
      lowerBody.includes("contact already")
    );
  }
  return false;
}

/**
 * Simple sleep helper for retry delays
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parse the incoming request body in a tolerant way.
 * - Supports JSON (`application/json`)
 * - Supports normal HTML forms (`application/x-www-form-urlencoded`, `multipart/form-data`)
 * Returns an object with { name, email } (possibly empty strings).
 */
async function getSignupPayload(request) {
  const contentType = (request.headers.get("Content-Type") || "").toLowerCase();

  // JSON request
  if (contentType.includes("application/json")) {
    try {
      const text = await request.text();
      if (!text) return { name: "", email: "" };
      const data = JSON.parse(text);
      return {
        name: data.name ?? "",
        email: data.email ?? "",
      };
    } catch {
      // If JSON is malformed, just treat as empty payload (we'll show a nice error later)
      return { name: "", email: "" };
    }
  }

  // Form-encoded or multipart (standard HTML forms)
  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    try {
      const formData = await request.formData();
      return {
        name: formData.get("name") ?? "",
        email: formData.get("email") ?? "",
      };
    } catch {
      return { name: "", email: "" };
    }
  }

  // Fallback: try JSON, then give up gracefully
  try {
    const text = await request.text();
    if (!text) return { name: "", email: "" };
    const data = JSON.parse(text);
    return {
      name: data.name ?? "",
      email: data.email ?? "",
    };
  } catch {
    return { name: "", email: "" };
  }
}

/**
 * Build CORS headers – open, but a bit smarter about requested headers.
 */
function buildCorsHeaders(request) {
  const reqHeaders =
    request.headers.get("Access-Control-Request-Headers") || "Content-Type";
  return {
    "Access-Control-Allow-Origin": "*", // no credentials, so * is fine
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": reqHeaders,
    "Access-Control-Max-Age": "86400",
  };
}

function jsonResponse(obj, status, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });
}

function isValidEmail(email) {
  // More tolerant email validation - accepts most valid formats
  // Allows: letters, numbers, dots, hyphens, underscores, plus signs
  if (!email || typeof email !== "string") return false;
  
  // Basic structure check
  const parts = email.split("@");
  if (parts.length !== 2) return false;
  
  const [local, domain] = parts;
  
  // Local part (before @) - must exist and be reasonable
  if (!local || local.length > 64) return false;
  
  // Domain part - must have at least one dot and valid structure
  if (!domain || domain.length < 3 || !domain.includes(".")) return false;
  
  // Check for obvious issues
  if (email.startsWith(".") || email.endsWith(".")) return false;
  if (email.includes("..")) return false;
  if (domain.startsWith(".") || domain.endsWith(".")) return false;
  
  // Simple regex as final check
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Fetch wrapper with timeout for extra robustness.
 */
async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } catch (err) {
    // Provide more context for timeout errors
    if (err.name === "AbortError") {
      throw new Error(`Request timeout after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}
