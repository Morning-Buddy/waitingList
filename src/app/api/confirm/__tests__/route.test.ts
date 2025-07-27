/**
 * @jest-environment @edge-runtime/jest-environment
 */

import { NextRequest } from 'next/server'
import { POST, GET, PUT, DELETE } from '../route'
import { waitlistOperations } from '@/lib/supabase'
import { verifyConfirmationToken } from '@/lib/tokens'

// Mock external dependencies
jest.mock('@/lib/supabase', () => ({
  waitlistOperations: {
    confirmEmail: jest.fn(),
  },
}))

jest.mock('@/lib/tokens', () => ({
  verifyConfirmationToken: jest.fn(),
}))

// Mock console.error to avoid noise in tests
const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

describe('/api/confirm', () => {
  const mockWaitlistEntry = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    email: 'john@example.com',
    confirmed: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    consoleSpy.mockClear()
  })

  afterAll(() => {
    consoleSpy.mockRestore()
  })

  describe('POST /api/confirm', () => {
    const createMockRequest = (body: any) => {
      return new NextRequest('http://localhost:3000/api/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
    }

    it('should successfully confirm email with valid token', async () => {
      // Arrange
      const requestBody = {
        email: 'john@example.com',
        token: 'valid-token-123'
      }

      ;(verifyConfirmationToken as jest.Mock).mockResolvedValue(true)
      ;(waitlistOperations.confirmEmail as jest.Mock).mockResolvedValue(mockWaitlistEntry)

      const request = createMockRequest(requestBody)

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.message).toBe('Email confirmed successfully')
      expect(responseData.data).toEqual(mockWaitlistEntry)

      expect(verifyConfirmationToken).toHaveBeenCalledWith('valid-token-123', 'john@example.com')
      expect(waitlistOperations.confirmEmail).toHaveBeenCalledWith('john@example.com')
    })

    it('should return 400 for invalid email format', async () => {
      // Arrange
      const requestBody = {
        email: 'invalid-email',
        token: 'valid-token-123'
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

      expect(verifyConfirmationToken).not.toHaveBeenCalled()
      expect(waitlistOperations.confirmEmail).not.toHaveBeenCalled()
    })

    it('should return 400 for missing token', async () => {
      // Arrange
      const requestBody = {
        email: 'john@example.com'
      }

      const request = createMockRequest(requestBody)

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.message).toBe('Invalid input data')
      expect(responseData.error).toContain('expected string, received undefined')
    })

    it('should return 400 for empty token', async () => {
      // Arrange
      const requestBody = {
        email: 'john@example.com',
        token: ''
      }

      const request = createMockRequest(requestBody)

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.message).toBe('Invalid input data')
      expect(responseData.error).toContain('Confirmation token is required')
    })

    it('should return 400 for invalid token', async () => {
      // Arrange
      const requestBody = {
        email: 'john@example.com',
        token: 'invalid-token'
      }

      ;(verifyConfirmationToken as jest.Mock).mockResolvedValue(false)

      const request = createMockRequest(requestBody)

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.message).toBe('Invalid or expired confirmation token')

      expect(verifyConfirmationToken).toHaveBeenCalledWith('invalid-token', 'john@example.com')
      expect(waitlistOperations.confirmEmail).not.toHaveBeenCalled()
    })

    it('should return 404 when email not found', async () => {
      // Arrange
      const requestBody = {
        email: 'notfound@example.com',
        token: 'valid-token-123'
      }

      ;(verifyConfirmationToken as jest.Mock).mockResolvedValue(true)
      ;(waitlistOperations.confirmEmail as jest.Mock).mockRejectedValue(
        new Error('Email address not found in waitlist')
      )

      const request = createMockRequest(requestBody)

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(404)
      expect(responseData.success).toBe(false)
      expect(responseData.message).toBe('Email address not found in waitlist')
    })

    it('should return 409 when email already confirmed', async () => {
      // Arrange
      const requestBody = {
        email: 'john@example.com',
        token: 'valid-token-123'
      }

      ;(verifyConfirmationToken as jest.Mock).mockResolvedValue(true)
      ;(waitlistOperations.confirmEmail as jest.Mock).mockRejectedValue(
        new Error('Email address is already confirmed')
      )

      const request = createMockRequest(requestBody)

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(409)
      expect(responseData.success).toBe(false)
      expect(responseData.message).toBe('Email address is already confirmed')
    })

    it('should handle database errors gracefully', async () => {
      // Arrange
      const requestBody = {
        email: 'john@example.com',
        token: 'valid-token-123'
      }

      ;(verifyConfirmationToken as jest.Mock).mockResolvedValue(true)
      ;(waitlistOperations.confirmEmail as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      )

      const request = createMockRequest(requestBody)

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(responseData.success).toBe(false)
      expect(responseData.message).toBe('Unable to confirm email. Please try again later.')

      expect(consoleSpy).toHaveBeenCalledWith(
        'Confirm API error:',
        expect.any(Error)
      )
    })

    it('should handle token verification errors', async () => {
      // Arrange
      const requestBody = {
        email: 'john@example.com',
        token: 'valid-token-123'
      }

      ;(verifyConfirmationToken as jest.Mock).mockRejectedValue(
        new Error('Token verification failed')
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
        'Confirm API error:',
        expect.any(Error)
      )
    })

    it('should handle malformed JSON request body', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/api/confirm', {
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
    })

    it('should normalize email to lowercase', async () => {
      // Arrange
      const requestBody = {
        email: 'JOHN@EXAMPLE.COM',
        token: 'valid-token-123'
      }

      ;(verifyConfirmationToken as jest.Mock).mockResolvedValue(true)
      ;(waitlistOperations.confirmEmail as jest.Mock).mockResolvedValue(mockWaitlistEntry)

      const request = createMockRequest(requestBody)

      // Act
      const response = await POST(request)

      // Assert
      expect(response.status).toBe(200)
      expect(verifyConfirmationToken).toHaveBeenCalledWith('valid-token-123', 'john@example.com')
      expect(waitlistOperations.confirmEmail).toHaveBeenCalledWith('john@example.com')
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
});