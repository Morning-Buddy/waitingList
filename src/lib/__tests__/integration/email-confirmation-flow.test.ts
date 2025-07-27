/**
 * Integration test for the complete email confirmation flow
 */

import { generateConfirmationToken, verifyConfirmationToken } from '@/lib/tokens'
import { createWaitlistEntrySchema, confirmEmailSchema } from '@/lib/types'

describe('Email Confirmation Flow Integration', () => {
  const testEmail = 'integration-test@example.com'
  const testName = 'Integration Test User'

  describe('Complete signup and confirmation flow', () => {
    it('should handle the complete flow from signup to confirmation', async () => {
      // Step 1: Validate signup data
      const signupData = {
        name: testName,
        email: testEmail,
        gdprConsent: true
      }

      const signupValidation = createWaitlistEntrySchema.safeParse(signupData)
      expect(signupValidation.success).toBe(true)

      if (!signupValidation.success) return

      // Step 2: Generate confirmation token
      const confirmationToken = await generateConfirmationToken(testEmail)
      expect(confirmationToken).toBeDefined()
      expect(typeof confirmationToken).toBe('string')
      expect(confirmationToken.split('.').length).toBe(3) // hash.salt.timestamp

      // Step 3: Validate confirmation data
      const confirmationData = {
        email: testEmail,
        token: confirmationToken
      }

      const confirmationValidation = confirmEmailSchema.safeParse(confirmationData)
      expect(confirmationValidation.success).toBe(true)

      // Step 4: Verify token
      const isTokenValid = await verifyConfirmationToken(confirmationToken, testEmail)
      expect(isTokenValid).toBe(true)

      // Step 5: Test token expiration
      const expiredTokenValid = await verifyConfirmationToken(confirmationToken, testEmail, 1)
      await new Promise(resolve => setTimeout(resolve, 10))
      const expiredTokenInvalid = await verifyConfirmationToken(confirmationToken, testEmail, 1)
      expect(expiredTokenInvalid).toBe(false)
    })

    it('should reject tokens for different emails', async () => {
      const email1 = 'user1@example.com'
      const email2 = 'user2@example.com'

      const token = await generateConfirmationToken(email1)
      
      const validForOriginal = await verifyConfirmationToken(token, email1)
      expect(validForOriginal).toBe(true)

      const invalidForDifferent = await verifyConfirmationToken(token, email2)
      expect(invalidForDifferent).toBe(false)
    })

    it('should handle malformed tokens gracefully', async () => {
      const malformedTokens = [
        'invalid-token',
        'part1.part2', // Missing timestamp
        'part1..part3', // Empty salt
        '.part2.part3', // Empty hash
        'part1.part2.', // Empty timestamp
        'part1.part2.invalid-timestamp',
        ''
      ]

      for (const token of malformedTokens) {
        const isValid = await verifyConfirmationToken(token, testEmail)
        expect(isValid).toBe(false)
      }
    })

    it('should validate email formats correctly', async () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com'
      ]

      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
        'user..name@example.com',
        'user@example.',
        ''
      ]

      for (const email of validEmails) {
        const result = createWaitlistEntrySchema.safeParse({
          email,
          gdprConsent: true
        })
        expect(result.success).toBe(true)
      }

      for (const email of invalidEmails) {
        const result = createWaitlistEntrySchema.safeParse({
          email,
          gdprConsent: true
        })
        expect(result.success).toBe(false)
      }
    })

    it('should handle edge cases in token generation', async () => {
      const edgeCaseEmails = [
        'a@b.co', // Very short
        'very-long-email-address-that-might-cause-issues@very-long-domain-name-example.com',
        'user+multiple+tags@example.com',
        'user.with.dots@example.com'
      ]

      for (const email of edgeCaseEmails) {
        const token = await generateConfirmationToken(email)
        expect(token).toBeDefined()
        expect(typeof token).toBe('string')

        const isValid = await verifyConfirmationToken(token, email)
        expect(isValid).toBe(true)
      }
    })

    it('should maintain token security properties', async () => {
      const email = 'security-test@example.com'
      
      // Generate multiple tokens for the same email
      const token1 = await generateConfirmationToken(email)
      const token2 = await generateConfirmationToken(email)
      
      // Tokens should be different (due to random salt and timestamp)
      expect(token1).not.toBe(token2)
      
      // Both should be valid for the same email
      expect(await verifyConfirmationToken(token1, email)).toBe(true)
      expect(await verifyConfirmationToken(token2, email)).toBe(true)
      
      // Tokens should have proper structure
      expect(token1.split('.').length).toBe(3)
      expect(token2.split('.').length).toBe(3)
      
      // Hash parts should be different
      const [hash1] = token1.split('.')
      const [hash2] = token2.split('.')
      expect(hash1).not.toBe(hash2)
    })

    it('should handle concurrent token operations', async () => {
      const email = 'concurrent-test@example.com'
      
      // Generate multiple tokens concurrently
      const tokenPromises = Array.from({ length: 5 }, () => 
        generateConfirmationToken(email)
      )
      
      const tokens = await Promise.all(tokenPromises)
      
      // All tokens should be unique
      const uniqueTokens = new Set(tokens)
      expect(uniqueTokens.size).toBe(tokens.length)
      
      // All tokens should be valid
      const verificationPromises = tokens.map(token => 
        verifyConfirmationToken(token, email)
      )
      
      const verificationResults = await Promise.all(verificationPromises)
      expect(verificationResults.every(result => result === true)).toBe(true)
    })
  })

  describe('Error handling and edge cases', () => {
    it('should handle validation errors consistently', async () => {
      const invalidInputs = [
        { email: '', gdprConsent: true },
        { email: 'invalid', gdprConsent: true },
        { email: 'test@example.com', gdprConsent: false },
        { email: 'test@example.com' }, // Missing gdprConsent
        { gdprConsent: true }, // Missing email
        {}, // Empty object
        null,
        undefined
      ]

      for (const input of invalidInputs) {
        const result = createWaitlistEntrySchema.safeParse(input)
        expect(result.success).toBe(false)
        
        if (!result.success) {
          expect(result.error.issues.length).toBeGreaterThan(0)
          expect(result.error.issues[0].message).toBeDefined()
        }
      }
    })

    it('should handle confirmation validation errors', async () => {
      const invalidInputs = [
        { email: '', token: 'valid-token' },
        { email: 'invalid-email', token: 'valid-token' },
        { email: 'test@example.com', token: '' },
        { email: 'test@example.com' }, // Missing token
        { token: 'valid-token' }, // Missing email
        {},
        null,
        undefined
      ]

      for (const input of invalidInputs) {
        const result = confirmEmailSchema.safeParse(input)
        expect(result.success).toBe(false)
      }
    })

    it('should provide meaningful error messages', async () => {
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

      for (const { input, expectedError } of testCases) {
        const result = createWaitlistEntrySchema.safeParse(input)
        expect(result.success).toBe(false)
        
        if (!result.success) {
          const errorMessage = result.error.issues[0].message
          expect(errorMessage).toContain(expectedError)
        }
      }
    })
  })
});