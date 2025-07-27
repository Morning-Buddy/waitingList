/**
 * @jest-environment @edge-runtime/jest-environment
 */

import { GET } from '../route'
import { waitlistOperations } from '@/lib/supabase'

// Mock external dependencies
jest.mock('@/lib/supabase', () => ({
  waitlistOperations: {
    getCount: jest.fn(),
  },
}))

// Mock console.error to avoid noise in tests
const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

describe('/api/count', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    consoleSpy.mockClear()
  })

  afterAll(() => {
    consoleSpy.mockRestore()
  })

  describe('GET /api/count', () => {
    it('should return signup count successfully', async () => {
      // Arrange
      const mockCount = 1234
      ;(waitlistOperations.getCount as jest.Mock).mockResolvedValue(mockCount)

      // Act
      const response = await GET()
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.data.count).toBe(mockCount)
      expect(responseData.message).toBe('Signup count retrieved successfully')

      expect(waitlistOperations.getCount).toHaveBeenCalledTimes(1)
    })

    it('should handle database errors gracefully', async () => {
      // Arrange
      ;(waitlistOperations.getCount as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      )

      // Act
      const response = await GET()
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(responseData.success).toBe(false)
      expect(responseData.message).toBe('Unable to retrieve signup count')
      expect(responseData.data.count).toBe(0)

      expect(consoleSpy).toHaveBeenCalledWith(
        'Count API error:',
        expect.any(Error)
      )
    })

    it('should return zero count when database returns null', async () => {
      // Arrange
      ;(waitlistOperations.getCount as jest.Mock).mockResolvedValue(null)

      // Act
      const response = await GET()
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.data.count).toBe(0)
    })

    it('should return zero count when database returns undefined', async () => {
      // Arrange
      ;(waitlistOperations.getCount as jest.Mock).mockResolvedValue(undefined)

      // Act
      const response = await GET()
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.data.count).toBe(0)
    })

    it('should handle negative count values', async () => {
      // Arrange
      ;(waitlistOperations.getCount as jest.Mock).mockResolvedValue(-5)

      // Act
      const response = await GET()
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.data.count).toBe(0) // Should normalize to 0
    })

    it('should handle very large count values', async () => {
      // Arrange
      const largeCount = 999999999
      ;(waitlistOperations.getCount as jest.Mock).mockResolvedValue(largeCount)

      // Act
      const response = await GET()
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.data.count).toBe(largeCount)
    })

    it('should handle non-numeric count values', async () => {
      // Arrange
      ;(waitlistOperations.getCount as jest.Mock).mockResolvedValue('invalid')

      // Act
      const response = await GET()
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.data.count).toBe(0) // Should normalize to 0
    })

    it('should include proper response headers', async () => {
      // Arrange
      ;(waitlistOperations.getCount as jest.Mock).mockResolvedValue(100)

      // Act
      const response = await GET()

      // Assert
      expect(response.headers.get('content-type')).toBe('application/json')
    })

    it('should handle timeout errors', async () => {
      // Arrange
      ;(waitlistOperations.getCount as jest.Mock).mockRejectedValue(
        new Error('Request timeout')
      )

      // Act
      const response = await GET()
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(responseData.success).toBe(false)
      expect(responseData.message).toBe('Unable to retrieve signup count')
      expect(responseData.data.count).toBe(0)
    })
  })
});