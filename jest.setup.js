import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Mock environment variables for testing
process.env.SUPABASE_URL = 'https://test.supabase.co'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.SENDGRID_API_KEY = 'test-sendgrid-key'
process.env.PLAUSIBLE_DOMAIN = 'test.com'
process.env.SITE_URL = 'https://test.com'
process.env.NODE_ENV = 'test'

// Polyfill for Web Crypto API and TextEncoder/TextDecoder
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock Web Crypto API
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256)
      }
      return arr
    },
    subtle: {
      digest: async (algorithm, data) => {
        // Simple mock hash for testing
        const str = new TextDecoder().decode(data)
        let hash = 0
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i)
          hash = ((hash << 5) - hash) + char
          hash = hash & hash // Convert to 32bit integer
        }
        // Convert to ArrayBuffer
        const buffer = new ArrayBuffer(32) // SHA-256 produces 32 bytes
        const view = new Uint8Array(buffer)
        for (let i = 0; i < 32; i++) {
          view[i] = Math.abs(hash + i) % 256
        }
        return buffer
      }
    }
  }
})