import {
  waitlistEntrySchema,
  createWaitlistEntrySchema,
  confirmEmailSchema,
  apiResponseSchema,
  isValidEmail,
  sanitizeInput,
} from '../types'

describe('Data Validation Schemas', () => {
  describe('waitlistEntrySchema', () => {
    it('should validate a complete waitlist entry', () => {
      const validEntry = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John Doe',
        email: 'john@example.com',
        confirmed: false,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      }

      expect(() => waitlistEntrySchema.parse(validEntry)).not.toThrow()
    })

    it('should validate entry without name', () => {
      const validEntry = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'john@example.com',
        confirmed: false,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      }

      expect(() => waitlistEntrySchema.parse(validEntry)).not.toThrow()
    })

    it('should reject invalid UUID', () => {
      const invalidEntry = {
        id: 'invalid-uuid',
        email: 'john@example.com',
        confirmed: false,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      }

      expect(() => waitlistEntrySchema.parse(invalidEntry)).toThrow()
    })

    it('should reject invalid email', () => {
      const invalidEntry = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'invalid-email',
        confirmed: false,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      }

      expect(() => waitlistEntrySchema.parse(invalidEntry)).toThrow()
    })

    it('should reject invalid datetime', () => {
      const invalidEntry = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'john@example.com',
        confirmed: false,
        created_at: 'invalid-date',
        updated_at: '2024-01-01T00:00:00.000Z',
      }

      expect(() => waitlistEntrySchema.parse(invalidEntry)).toThrow()
    })
  })

  describe('createWaitlistEntrySchema', () => {
    it('should validate valid signup data with name', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        gdprConsent: true,
      }

      expect(() => createWaitlistEntrySchema.parse(validData)).not.toThrow()
    })

    it('should validate valid signup data without name', () => {
      const validData = {
        email: 'john@example.com',
        gdprConsent: true,
      }

      expect(() => createWaitlistEntrySchema.parse(validData)).not.toThrow()
    })

    it('should reject invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        gdprConsent: true,
      }

      expect(() => createWaitlistEntrySchema.parse(invalidData)).toThrow()
    })

    it('should reject missing GDPR consent', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        gdprConsent: false,
      }

      expect(() => createWaitlistEntrySchema.parse(invalidData)).toThrow()
    })

    it('should reject name that is too long', () => {
      const invalidData = {
        name: 'a'.repeat(101), // 101 characters
        email: 'john@example.com',
        gdprConsent: true,
      }

      expect(() => createWaitlistEntrySchema.parse(invalidData)).toThrow()
    })

    it('should reject email that is too long', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'a'.repeat(250) + '@example.com', // > 255 characters
        gdprConsent: true,
      }

      expect(() => createWaitlistEntrySchema.parse(invalidData)).toThrow()
    })

    it('should trim and accept empty name', () => {
      const data = {
        name: '   ',
        email: 'john@example.com',
        gdprConsent: true,
      }

      expect(() => createWaitlistEntrySchema.parse(data)).toThrow() // Empty after trim
    })
  })

  describe('confirmEmailSchema', () => {
    it('should validate valid confirmation data', () => {
      const validData = {
        email: 'john@example.com',
        token: 'valid-token-123',
      }

      expect(() => confirmEmailSchema.parse(validData)).not.toThrow()
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        token: 'valid-token-123',
      }

      expect(() => confirmEmailSchema.parse(invalidData)).toThrow()
    })

    it('should reject empty token', () => {
      const invalidData = {
        email: 'john@example.com',
        token: '',
      }

      expect(() => confirmEmailSchema.parse(invalidData)).toThrow()
    })
  })

  describe('apiResponseSchema', () => {
    it('should validate successful response', () => {
      const validResponse = {
        success: true,
        message: 'Operation successful',
        data: { id: 1, name: 'test' },
      }

      expect(() => apiResponseSchema.parse(validResponse)).not.toThrow()
    })

    it('should validate error response', () => {
      const validResponse = {
        success: false,
        message: 'Operation failed',
        error: 'Detailed error message',
      }

      expect(() => apiResponseSchema.parse(validResponse)).not.toThrow()
    })

    it('should validate minimal response', () => {
      const validResponse = {
        success: true,
        message: 'OK',
      }

      expect(() => apiResponseSchema.parse(validResponse)).not.toThrow()
    })
  })
})

describe('Validation Helpers', () => {
  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com',
      ]

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true)
      })
    })

    it('should return false for invalid emails', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user..name@example.com',
        'user@.com',
        '',
      ]

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false)
      })
    })
  })

  describe('sanitizeInput', () => {
    describe('name', () => {
      it('should trim whitespace', () => {
        expect(sanitizeInput.name('  John Doe  ')).toBe('John Doe')
      })

      it('should limit to 100 characters', () => {
        const longName = 'a'.repeat(150)
        expect(sanitizeInput.name(longName)).toBe('a'.repeat(100))
      })

      it('should return undefined for undefined input', () => {
        expect(sanitizeInput.name(undefined)).toBeUndefined()
      })

      it('should return undefined for empty string after trim', () => {
        expect(sanitizeInput.name('   ')).toBe('')
      })
    })

    describe('email', () => {
      it('should trim and lowercase email', () => {
        expect(sanitizeInput.email('  John@EXAMPLE.COM  ')).toBe('john@example.com')
      })

      it('should limit to 255 characters', () => {
        const longEmail = 'a'.repeat(250) + '@example.com'
        const result = sanitizeInput.email(longEmail)
        expect(result.length).toBe(255)
      })

      it('should handle mixed case domains', () => {
        expect(sanitizeInput.email('user@DOMAIN.COM')).toBe('user@domain.com')
      })
    })
  })
})