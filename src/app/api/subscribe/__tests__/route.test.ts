/**
 * @jest-environment @edge-runtime/jest-environment
 */

import { NextRequest } from 'next/server'
import { POST, GET, PUT, DELETE } from '../route'
import { waitlistOperations } from '@/lib/supabase'
import { emailService } from '@/lib/sendgrid'
import { generateConfirmationToken } from '@/lib/tokens'

// Mock external dependencies
jest.mock('@/lib/supabase', () => ({
  waitlistOperations: {
    create: jest.fn(),
  },
}))

jest.mock('@/lib/sendgrid', () => ({
  emailService: {
    sendConfirmationEmail: jest.fn(),
  },
}))

jest.mock('@/lib/tokens', () => ({
  generateConfirmationToken: jest.fn(),
}))

// Mock console.error to avoid noise in tests
const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

describe('/api/subscribe', () => {
  const mockWaitlistEntry = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    email: 'john@example.com',
    confirmed: false,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  }

  const mockToken = 'abc123.def456.1640995200000'

  beforeEach(() => {
    jest.clearAllMocks()
    consoleSpy.mockClear()
  })

  afterAll(() => {
    consoleSpy.mockRestore()
  })

  describe('POST /api/subscribe', () => {
    const createMockRequest = (body: any) => {
      return new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
    }

    it('should successfully create waitlist entry with valid data', async () => {
      // Arrange
      const requestBody = {
        name: 'John Doe',
        email: 'john@example.com',
        gdprConsent: true,
      }

      ;(waitlistOperations.create as jest.Mock).mockResolvedValue(mockWaitlistEntry)
      ;(generateConfirmationToken as jest.Mock).mockResolvedValue(mockToken)
      ;(emailService.sendConfirmationEmail as jest.Mock).mockResolvedValue({ success: true })

      const request = createMockRequest(requestBody)

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(201)
      expect(responseData.success).toBe(true)
      expect(responseData.message).toContain('Successfully joined waitlist')
      expect(responseData.data).toEqual(mockWaitlistEntry)

      expect(waitlistOperations.create).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        gdprConsent: true,
      })
      expect(generateConfirmationToken).toHaveBeenCalledWith('john@example.com')
      expect(emailService.sendConfirmationEmail).toHaveBeenCalledWith({
        to: 'john@example.com',
        name: 'John Doe',
        confirmationToken: mockToken,
      })
    })

    it('should successfully create waitlist entry without name', async () => {
      // Arrange
      const requestBody = {
        email: 'jane@example.com',
        gdprConsent: true,
      }

      const mockEntryWithoutName = { ...mockWaitlistEntry, name: undefined, email: 'jane@example.com' }
      ;(waitlistOperations.create as jest.Mock).mockResolvedValue(mockEntryWithoutName)
      ;(generateConfirmationToken as jest.Mock).mockResolvedValue(mockToken)
      ;(emailService.sendConfirmationEmail as jest.Mock).mockResolvedValue({ success: true })

      const request = createMockRequest(requestBody)

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(201)
      expect(responseData.success).toBe(true)
      expect(responseData.data).toEqual(mockEntryWithoutName)

      expect(emailService.sendConfirmationEmail).toHaveBeenCalledWith({
        to: 'jane@example.com',
        name: undefined,
        confirmationToken: mockToken,
      })
    })

    it('should return 400 for invalid email format', async () => {
      // Arrange
      const requestBody = {
        name: 'John Doe',
        email: 'invalid-email',
        gdprConsent: true,
      }

      const request = createMockRequest(requestBody)

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.message).toBe('Invalid input data')
      expect(responseData.error).toContain('Invalid email address')

      expect(waitlistOperations.create).not.toHaveBeenCalled()
      expect(emailService.sendConfirmationEmail).not.toHaveBeenCalled()
    })

    it('should return 400 when GDPR consent is false', async () => {
      // Arrange
      const requestBody = {
        name: 'John Doe',
        email: 'john@example.com',
        gdprConsent: false,
      }

      const request = createMockRequest(requestBody)

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toContain('GDPR consent is required')

      expect(waitlistOperations.create).not.toHaveBeenCalled()
    })

    it('should return 400 when GDPR consent is missing', async () => {
      // Arrange
      const requestBody = {
        name: 'John Doe',
        email: 'john@example.com',
      }

      const request = createMockRequest(requestBody)

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toContain('expected boolean, received undefined')
    })

    it('should return 400 for name that is too long', async () => {
      // Arrange
      const requestBody = {
        name: 'a'.repeat(101), // Exceeds 100 character limit
        email: 'john@example.com',
        gdprConsent: true,
      }

      const request = createMockRequest(requestBody)

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.message).toBe('Invalid input data')
    })

    it('should return 409 when email is already registered', async () => {
      // Arrange
      const requestBody = {
        name: 'John Doe',
        email: 'john@example.com',
        gdprConsent: true,
      }

      ;(waitlistOperations.create as jest.Mock).mockRejectedValue(
        new Error('Email address is already registered')
      )

      const request = createMockRequest(requestBody)

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(409)
      expect(responseData.success).toBe(false)
      expect(responseData.message).toContain('already registered')

      expect(emailService.sendConfirmationEmail).not.toHaveBeenCalled()
    })

    it('should handle database creation errors gracefully', async () => {
      // Arrange
      const requestBody = {
        name: 'John Doe',
        email: 'john@example.com',
        gdprConsent: true,
      }

      ;(waitlistOperations.create as jest.Mock).mockRejectedValue(
        new Error('Failed to create waitlist entry: Database connection failed')
      )

      const request = createMockRequest(requestBody)

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(responseData.success).toBe(false)
      expect(responseData.message).toBe('Unable to process your request. Please try again later.')

      expect(emailService.sendConfirmationEmail).not.toHaveBeenCalled()
    })

    it('should continue processing when email sending fails', async () => {
      // Arrange
      const requestBody = {
        name: 'John Doe',
        email: 'john@example.com',
        gdprConsent: true,
      }

      ;(waitlistOperations.create as jest.Mock).mockResolvedValue(mockWaitlistEntry)
      ;(generateConfirmationToken as jest.Mock).mockResolvedValue(mockToken)
      ;(emailService.sendConfirmationEmail as jest.Mock).mockRejectedValue(
        new Error('SendGrid API error')
      )

      const request = createMockRequest(requestBody)

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(201)
      expect(responseData.success).toBe(true)
      expect(responseData.message).toContain('Successfully joined waitlist')
      expect(responseData.data).toEqual(mockWaitlistEntry)

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to send confirmation email:',
        expect.any(Error)
      )
    })

    it('should handle token generation errors', async () => {
      // Arrange
      const requestBody = {
        name: 'John Doe',
        email: 'john@example.com',
        gdprConsent: true,
      }

      ;(waitlistOperations.create as jest.Mock).mockResolvedValue(mockWaitlistEntry)
      ;(generateConfirmationToken as jest.Mock).mockRejectedValue(
        new Error('Token generation failed')
      )

      const request = createMockRequest(requestBody)

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(responseData.success).toBe(false)
      expect(responseData.message).toBe('An unexpected error occurred. Please try again later.')

      expect(consoleSpy).toHaveBeenCalledWith(
        'Subscribe API error:',
        expect.any(Error)
      )
    })

    it('should handle malformed JSON request body', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json',
      })

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(responseData.success).toBe(false)
      expect(responseData.message).toBe('An unexpected error occurred. Please try again later.')
    })

    it('should handle empty request body', async () => {
      // Arrange
      const request = createMockRequest({})

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.message).toBe('Invalid input data')
      expect(responseData.error).toContain('expected string, received undefined')
    })

    it('should validate email input properly', async () => {
      // Arrange
      const requestBody = {
        name: 'John Doe',
        email: 'john@example.com',
        gdprConsent: true,
      }

      ;(waitlistOperations.create as jest.Mock).mockResolvedValue(mockWaitlistEntry)
      ;(generateConfirmationToken as jest.Mock).mockResolvedValue(mockToken)
      ;(emailService.sendConfirmationEmail as jest.Mock).mockResolvedValue({ success: true })

      const request = createMockRequest(requestBody)

      // Act
      const response = await POST(request)

      // Assert
      expect(response.status).toBe(201)
      expect(waitlistOperations.create).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        gdprConsent: true,
      })
    })
  })

  describe('Unsupported HTTP methods', () => {
    it('should return 405 for GET requests', async () => {
      // Act
      const response = await GET()
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(405)
      expect(responseData.success).toBe(false)
      expect(responseData.message).toBe('Method not allowed')
    })

    it('should return 405 for PUT requests', async () => {
      // Act
      const response = await PUT()
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(405)
      expect(responseData.success).toBe(false)
      expect(responseData.message).toBe('Method not allowed')
    })

    it('should return 405 for DELETE requests', async () => {
      // Act
      const response = await DELETE()
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(405)
      expect(responseData.success).toBe(false)
      expect(responseData.message).toBe('Method not allowed')
    })
  })
})