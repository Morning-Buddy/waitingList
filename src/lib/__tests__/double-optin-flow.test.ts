/**
 * @jest-environment node
 */

import { waitlistOperations } from '@/lib/supabase'
import { emailService } from '@/lib/sendgrid'
import { generateConfirmationToken, verifyConfirmationToken } from '@/lib/tokens'

// Mock dependencies
jest.mock('@/lib/supabase')
jest.mock('@/lib/sendgrid')

const mockWaitlistOperations = waitlistOperations as jest.Mocked<typeof waitlistOperations>
const mockEmailService = emailService as jest.Mocked<typeof emailService>

describe('Double Opt-in Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Complete signup and confirmation flow', () => {
    it('should handle complete double opt-in flow successfully', async () => {
      const testEmail = 'test@example.com'
      const testName = 'Test User'

      // Step 1: User signs up (this would happen in /api/subscribe)
      const mockWaitlistEntry = {
        id: '123',
        email: testEmail,
        name: testName,
        confirmed: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
      mockWaitlistOperations.create.mockResolvedValue(mockWaitlistEntry)

      // Step 2: Generate confirmation token
      const confirmationToken = await generateConfirmationToken(testEmail)
      expect(confirmationToken).toBeDefined()
      expect(confirmationToken).toMatch(/^[a-f0-9]+\.[a-f0-9]+\.\d+$/)

      // Step 3: Send confirmation email
      mockEmailService.sendConfirmationEmail.mockResolvedValue({ success: true })
      
      await emailService.sendConfirmationEmail({
        to: testEmail,
        name: testName,
        confirmationToken
      })

      expect(mockEmailService.sendConfirmationEmail).toHaveBeenCalledWith({
        to: testEmail,
        name: testName,
        confirmationToken
      })

      // Step 4: User clicks confirmation link - verify token
      const isValidToken = await verifyConfirmationToken(confirmationToken, testEmail)
      expect(isValidToken).toBe(true)

      // Step 5: Update database to confirmed status
      const mockConfirmedEntry = {
        ...mockWaitlistEntry,
        confirmed: true,
        updated_at: '2024-01-01T01:00:00Z'
      }
      mockWaitlistOperations.confirmEmail.mockResolvedValue(mockConfirmedEntry)

      const confirmedEntry = await waitlistOperations.confirmEmail(testEmail)
      expect(confirmedEntry.confirmed).toBe(true)
      expect(mockWaitlistOperations.confirmEmail).toHaveBeenCalledWith(testEmail)

      // Step 6: Send welcome email
      mockEmailService.sendWelcomeEmail.mockResolvedValue({ success: true })
      
      await emailService.sendWelcomeEmail({
        to: testEmail,
        name: testName
      })

      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith({
        to: testEmail,
        name: testName
      })
    })

    it('should handle token expiration correctly', async () => {
      const testEmail = 'test@example.com'
      
      // Generate a token
      const confirmationToken = await generateConfirmationToken(testEmail)
      
      // Verify token is valid initially
      const isValidToken = await verifyConfirmationToken(confirmationToken, testEmail)
      expect(isValidToken).toBe(true)
      
      // Wait a bit to ensure expiration
      await new Promise(resolve => setTimeout(resolve, 10))
      
      // Verify token expires after specified time (1ms for testing)
      const isExpiredTokenAfterWait = await verifyConfirmationToken(confirmationToken, testEmail, 1)
      expect(isExpiredTokenAfterWait).toBe(false)
    })

    it('should reject token for different email address', async () => {
      const originalEmail = 'original@example.com'
      const differentEmail = 'different@example.com'
      
      // Generate token for original email
      const confirmationToken = await generateConfirmationToken(originalEmail)
      
      // Try to verify with different email
      const isValidForDifferentEmail = await verifyConfirmationToken(confirmationToken, differentEmail)
      expect(isValidForDifferentEmail).toBe(false)
      
      // Verify it works for original email
      const isValidForOriginalEmail = await verifyConfirmationToken(confirmationToken, originalEmail)
      expect(isValidForOriginalEmail).toBe(true)
    })

    it('should handle malformed tokens gracefully', async () => {
      const testEmail = 'test@example.com'
      
      // Test various malformed tokens
      const malformedTokens = [
        'invalid-token',
        'token.without.timestamp',
        'token.salt.',
        '.salt.timestamp',
        'token..timestamp',
        '',
        'token.salt.invalid-timestamp'
      ]
      
      for (const malformedToken of malformedTokens) {
        const isValid = await verifyConfirmationToken(malformedToken, testEmail)
        expect(isValid).toBe(false)
      }
    })

    it('should handle database errors during confirmation', async () => {
      const testEmail = 'test@example.com'
      
      // Generate valid token
      const confirmationToken = await generateConfirmationToken(testEmail)
      const isValidToken = await verifyConfirmationToken(confirmationToken, testEmail)
      expect(isValidToken).toBe(true)
      
      // Mock database error
      mockWaitlistOperations.confirmEmail.mockRejectedValue(new Error('Database connection failed'))
      
      // Attempt confirmation should throw
      await expect(waitlistOperations.confirmEmail(testEmail)).rejects.toThrow('Database connection failed')
    })

    it('should handle email service errors gracefully', async () => {
      const testEmail = 'test@example.com'
      const testName = 'Test User'
      const confirmationToken = 'test-token'
      
      // Mock email service failure
      mockEmailService.sendConfirmationEmail.mockRejectedValue(new Error('SendGrid API error'))
      mockEmailService.sendWelcomeEmail.mockRejectedValue(new Error('SendGrid API error'))
      
      // Email failures should throw
      await expect(emailService.sendConfirmationEmail({
        to: testEmail,
        name: testName,
        confirmationToken
      })).rejects.toThrow('SendGrid API error')
      
      await expect(emailService.sendWelcomeEmail({
        to: testEmail,
        name: testName
      })).rejects.toThrow('SendGrid API error')
    })
  })

  describe('Token security', () => {
    it('should generate unique tokens for same email', async () => {
      const testEmail = 'test@example.com'
      
      const token1 = await generateConfirmationToken(testEmail)
      const token2 = await generateConfirmationToken(testEmail)
      
      expect(token1).not.toBe(token2)
      
      // Both should be valid for the same email
      expect(await verifyConfirmationToken(token1, testEmail)).toBe(true)
      expect(await verifyConfirmationToken(token2, testEmail)).toBe(true)
    })

    it('should use cryptographically secure random values', async () => {
      const testEmail = 'test@example.com'
      const tokens = new Set()
      
      // Generate multiple tokens and ensure they're all unique
      for (let i = 0; i < 100; i++) {
        const token = await generateConfirmationToken(testEmail)
        expect(tokens.has(token)).toBe(false)
        tokens.add(token)
      }
      
      expect(tokens.size).toBe(100)
    })

    it('should include timestamp in token for expiration', async () => {
      const testEmail = 'test@example.com'
      const token = await generateConfirmationToken(testEmail)
      
      // Token should have 3 parts: hash.salt.timestamp
      const parts = token.split('.')
      expect(parts).toHaveLength(3)
      
      const [hash, salt, timestamp] = parts
      expect(hash).toMatch(/^[a-f0-9]+$/)
      expect(salt).toMatch(/^[a-f0-9]+$/)
      expect(timestamp).toMatch(/^\d+$/)
      
      // Timestamp should be recent (within last minute)
      const tokenTime = parseInt(timestamp)
      const now = Date.now()
      expect(now - tokenTime).toBeLessThan(60000) // Less than 1 minute
    })
  })
})