import { createWaitlistEntrySchema, confirmEmailSchema } from '@/lib/types'
import { generateConfirmationToken, verifyConfirmationToken } from '@/lib/tokens'

describe('API Logic Tests', () => {
  describe('Subscribe endpoint validation', () => {
    it('should validate correct subscription data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        gdprConsent: true
      }

      const result = createWaitlistEntrySchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should reject invalid email format', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        gdprConsent: true
      }

      const result = createWaitlistEntrySchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid email address')
      }
    })

    it('should reject missing GDPR consent', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        gdprConsent: false
      }

      const result = createWaitlistEntrySchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('GDPR consent is required')
      }
    })

    it('should accept optional name field', () => {
      const validData = {
        email: 'john@example.com',
        gdprConsent: true
      }

      const result = createWaitlistEntrySchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject name that is too long', () => {
      const invalidData = {
        name: 'a'.repeat(101), // Exceeds 100 character limit
        email: 'john@example.com',
        gdprConsent: true
      }

      const result = createWaitlistEntrySchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Name must be less than 100 characters')
      }
    })

    it('should reject email that is too long', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'a'.repeat(250) + '@example.com', // Exceeds 255 character limit
        gdprConsent: true
      }

      const result = createWaitlistEntrySchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Email must be less than 255 characters')
      }
    })
  })

  describe('Confirm endpoint validation', () => {
    it('should validate correct confirmation data', () => {
      const validData = {
        email: 'john@example.com',
        token: 'valid-token-123'
      }

      const result = confirmEmailSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        token: 'valid-token-123'
      }

      const result = confirmEmailSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid email address')
      }
    })

    it('should reject empty token', () => {
      const invalidData = {
        email: 'john@example.com',
        token: ''
      }

      const result = confirmEmailSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Confirmation token is required')
      }
    })

    it('should reject missing email', () => {
      const invalidData = {
        token: 'valid-token-123'
      }

      const result = confirmEmailSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject missing token', () => {
      const invalidData = {
        email: 'john@example.com'
      }

      const result = confirmEmailSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Token generation and verification', () => {
    it('should generate and verify valid tokens', async () => {
      const email = 'john@example.com'
      const token = await generateConfirmationToken(email)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
      
      // Token should be verifiable immediately
      const isValid = await verifyConfirmationToken(token, email)
      expect(isValid).toBe(true)
    })

    it('should reject tokens for different emails', async () => {
      const email1 = 'john@example.com'
      const email2 = 'jane@example.com'
      const token = await generateConfirmationToken(email1)
      
      // Token should not be valid for different email
      const isValid = await verifyConfirmationToken(token, email2)
      expect(isValid).toBe(false)
    })

    it('should reject malformed tokens', async () => {
      const email = 'john@example.com'
      const invalidToken = 'invalid-token'
      
      const isValid = await verifyConfirmationToken(invalidToken, email)
      expect(isValid).toBe(false)
    })

    it('should reject expired tokens', async () => {
      const email = 'john@example.com'
      const token = await generateConfirmationToken(email)
      
      // Wait a bit to ensure expiration
      await new Promise(resolve => setTimeout(resolve, 10))
      
      // Verify with very short max age (1ms) to simulate expiration
      const isExpired = await verifyConfirmationToken(token, email, 1)
      expect(isExpired).toBe(false)
    }, 10000)

    it('should handle empty token parts', async () => {
      const email = 'john@example.com'
      const malformedToken = 'part1..part3' // Missing middle part
      
      const isValid = await verifyConfirmationToken(malformedToken, email)
      expect(isValid).toBe(false)
    })
  })

  describe('Error handling scenarios', () => {
    it('should handle validation errors gracefully', () => {
      const invalidInputs = [
        null,
        undefined,
        {},
        { email: null },
        { gdprConsent: null },
        { name: null, email: 'test@example.com', gdprConsent: true }
      ]

      invalidInputs.forEach(input => {
        const result = createWaitlistEntrySchema.safeParse(input)
        expect(result.success).toBe(false)
      })
    })

    it('should provide meaningful error messages', () => {
      const testCases = [
        {
          input: { email: 'invalid', gdprConsent: true },
          expectedError: 'Invalid email address'
        },
        {
          input: { email: 'test@example.com', gdprConsent: false },
          expectedError: 'GDPR consent is required'
        },
        {
          input: { name: 'a'.repeat(101), email: 'test@example.com', gdprConsent: true },
          expectedError: 'Name must be less than 100 characters'
        }
      ]

      testCases.forEach(({ input, expectedError }) => {
        const result = createWaitlistEntrySchema.safeParse(input)
        expect(result.success).toBe(false)
        if (!result.success) {
          const errorMessage = result.error.issues[0].message
          expect(errorMessage).toContain(expectedError)
        }
      })
    })
  })
})