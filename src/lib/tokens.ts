// Generate a secure confirmation token using Web Crypto API (edge-compatible)
export async function generateConfirmationToken(email: string): Promise<string> {
  // Create a random salt using Web Crypto API
  const saltArray = new Uint8Array(16)
  crypto.getRandomValues(saltArray)
  const salt = Array.from(saltArray, byte => byte.toString(16).padStart(2, '0')).join('')
  
  // Create a hash of email + salt + timestamp
  const timestamp = Date.now().toString()
  const data = `${email}:${salt}:${timestamp}`
  
  // Generate token using Web Crypto API SHA-256
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = new Uint8Array(hashBuffer)
  const token = Array.from(hashArray, byte => byte.toString(16).padStart(2, '0')).join('')
  
  // Return token with salt and timestamp for verification
  return `${token}.${salt}.${timestamp}`
}

// Verify a confirmation token
export async function verifyConfirmationToken(
  token: string, 
  email: string, 
  maxAgeMs: number = 24 * 60 * 60 * 1000 // 24 hours default
): Promise<boolean> {
  try {
    const [tokenHash, salt, timestamp] = token.split('.')
    
    if (!tokenHash || !salt || !timestamp) {
      return false
    }
    
    // Check if token has expired
    const tokenAge = Date.now() - parseInt(timestamp)
    if (tokenAge > maxAgeMs) {
      return false
    }
    
    // Recreate the expected token using Web Crypto API
    const data = `${email}:${salt}:${timestamp}`
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = new Uint8Array(hashBuffer)
    const expectedToken = Array.from(hashArray, byte => byte.toString(16).padStart(2, '0')).join('')
    
    // Compare tokens (constant-time comparison to prevent timing attacks)
    return timingSafeEqual(tokenHash, expectedToken)
  } catch {
    return false
  }
}

// Constant-time string comparison to prevent timing attacks
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  
  return result === 0
}