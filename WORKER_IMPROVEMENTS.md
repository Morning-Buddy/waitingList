# Cloudflare Worker Improvements

## Issues Fixed

The improved worker code addresses several reliability issues:

### 1. **Better Duplicate Handling**
- Previously only caught 400 errors with "already exist" text
- Now also checks for "duplicate" and "contact already" variations
- Extracted into dedicated `isDuplicateContactError()` function

### 2. **Retry Logic for Transient Failures**
- Added automatic retry (1 attempt) for 5xx server errors
- Added retry for network timeouts and connection failures
- Includes 1-second delay between retries to avoid hammering the API
- Doesn't retry 4xx client errors (except duplicates)

### 3. **Increased Timeout**
- Contact creation timeout increased from 10s to 15s
- Helps with slower network conditions
- Better error messages for timeout scenarios

### 4. **More Tolerant Email Validation**
- Improved validation logic to accept more valid email formats
- Checks for structural issues without being overly strict
- Prevents false rejections of legitimate emails

### 5. **Better Error Handling**
- Explicit handling of AbortError (timeouts)
- More detailed error logging (without exposing PII)
- Clearer error messages in console for debugging

### 6. **Improved Error Messages**
- Better context in logs (attempt numbers, error types)
- Timeout errors now explicitly mention duration
- Network errors are caught and logged properly

## Deployment Steps

1. **Copy the improved code** from `worker.js`

2. **Update your Cloudflare Worker:**
   ```bash
   # Option 1: Via Cloudflare Dashboard
   # - Go to Workers & Pages
   # - Select your worker: morningbuddysignup
   # - Click "Quick edit"
   # - Replace the code with worker.js content
   # - Click "Save and Deploy"
   
   # Option 2: Via Wrangler CLI
   wrangler deploy worker.js
   ```

3. **Verify environment variables are set:**
   - `BREVO_API_KEY` - Your Brevo API key
   - `WAITLIST_LIST_ID` - Your Brevo list ID (numeric)
   - `WELCOME_TEMPLATE_ID` - (Optional) Welcome email template ID

4. **Test the deployment:**
   ```bash
   curl -X POST https://morningbuddysignup.jameslapslie.workers.dev/ \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com"}'
   ```

## What Changed

### Key Improvements:
- ✅ Retry logic for network failures
- ✅ Better duplicate contact detection
- ✅ Longer timeout (15s vs 10s)
- ✅ More tolerant email validation
- ✅ Better error logging
- ✅ Explicit timeout error handling

### Backward Compatible:
- ✅ Same API interface
- ✅ Same environment variables
- ✅ Same response format
- ✅ No changes needed to frontend

## Testing Checklist

After deployment, test these scenarios:

- [ ] New user signup (should succeed)
- [ ] Duplicate email signup (should succeed with "already exists" message)
- [ ] Invalid email (should show validation error)
- [ ] Empty email (should show validation error)
- [ ] Name with special characters (should work)
- [ ] Very long name (should work)
- [ ] International email addresses (should work)

## Monitoring

Watch your Cloudflare Worker logs for:
- Retry attempts (indicates transient issues)
- Timeout errors (may need to increase timeout further)
- Duplicate contact messages (normal, not an error)
- Configuration errors (check environment variables)
