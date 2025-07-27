import { CreateWaitlistEntry } from '../types'

// Mock environment variables first
jest.mock('../env', () => ({
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'test-key'
}))

// Create mock functions
const mockSingle = jest.fn()
const mockSelect = jest.fn(() => ({ single: mockSingle }))
const mockEq = jest.fn(() => ({ select: mockSelect, single: mockSingle }))
const mockInsert = jest.fn(() => ({ select: mockSelect }))
const mockUpdate = jest.fn(() => ({ eq: mockEq }))
const mockFrom = jest.fn()

// Mock the entire supabase module
const mockSupabaseClient = {
  from: mockFrom
}

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient)
}))

// Import after mocking
import { waitlistOperations } from '../supabase'

describe('Waitlist Operations', () => {
  const mockSupabaseResponse = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    email: 'john@example.com',
    confirmed: false,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup the mock chain for database operations
    mockFrom.mockReturnValue({
      insert: mockInsert,
      update: mockUpdate,
      select: jest.fn().mockImplementation((query, options) => {
        if (options && options.count) {
          return Promise.resolve({ count: null, error: null })
        }
        return { eq: mockEq }
      })
    })
  })

  describe('create', () => {
    it('should create a new waitlist entry successfully', async () => {
      mockSingle.mockResolvedValue({
        data: mockSupabaseResponse,
        error: null
      })

      const createData: CreateWaitlistEntry = {
        name: 'John Doe',
        email: 'john@example.com',
        gdprConsent: true
      }

      const result = await waitlistOperations.create(createData)

      expect(result).toEqual(mockSupabaseResponse)
      expect(mockFrom).toHaveBeenCalledWith('waiting_list')
      expect(mockInsert).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        confirmed: false
      })
    })

    it('should handle duplicate email error', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { code: '23505', message: 'duplicate key value violates unique constraint' }
      })

      const createData: CreateWaitlistEntry = {
        email: 'john@example.com',
        gdprConsent: true
      }

      await expect(waitlistOperations.create(createData)).rejects.toThrow('Email address is already registered')
    })

    it('should handle general database errors', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { code: 'OTHER', message: 'Database connection failed' }
      })

      const createData: CreateWaitlistEntry = {
        email: 'john@example.com',
        gdprConsent: true
      }

      await expect(waitlistOperations.create(createData)).rejects.toThrow('Failed to create waitlist entry: Database connection failed')
    })

    it('should sanitize input data', async () => {
      mockSingle.mockResolvedValue({
        data: {
          ...mockSupabaseResponse,
          name: 'John Doe',
          email: 'john@example.com'
        },
        error: null
      })

      const createData: CreateWaitlistEntry = {
        name: '  John Doe  ',
        email: '  JOHN@EXAMPLE.COM  ',
        gdprConsent: true
      }

      await waitlistOperations.create(createData)

      expect(mockInsert).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        confirmed: false
      })
    })
  })

  describe('confirmEmail', () => {
    it('should confirm email successfully', async () => {
      const confirmedResponse = { ...mockSupabaseResponse, confirmed: true }
      
      mockSingle.mockResolvedValue({
        data: confirmedResponse,
        error: null
      })

      const result = await waitlistOperations.confirmEmail('john@example.com')

      expect(result).toEqual(confirmedResponse)
      expect(mockUpdate).toHaveBeenCalledWith({
        confirmed: true,
        updated_at: expect.any(String)
      })
      expect(mockEq).toHaveBeenCalledWith('email', 'john@example.com')
    })

    it('should handle email not found error', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'No rows found' }
      })

      await expect(waitlistOperations.confirmEmail('nonexistent@example.com'))
        .rejects.toThrow('Email address not found in waitlist')
    })

    it('should sanitize email input', async () => {
      mockSingle.mockResolvedValue({
        data: { ...mockSupabaseResponse, confirmed: true },
        error: null
      })

      await waitlistOperations.confirmEmail('  JOHN@EXAMPLE.COM  ')

      expect(mockEq).toHaveBeenCalledWith('email', 'john@example.com')
    })
  })

  describe('getSignupCount', () => {
    it('should return signup count successfully', async () => {
      // Mock the select method to return count directly
      mockFrom.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          count: 42,
          error: null
        })
      })

      const result = await waitlistOperations.getSignupCount()

      expect(result).toBe(42)
    })

    it('should return 0 when count is null', async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          count: null,
          error: null
        })
      })

      const result = await waitlistOperations.getSignupCount()

      expect(result).toBe(0)
    })

    it('should handle database errors', async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          count: null,
          error: { message: 'Database connection failed' }
        })
      })

      await expect(waitlistOperations.getSignupCount())
        .rejects.toThrow('Failed to get signup count: Database connection failed')
    })
  })

  describe('findByEmail', () => {
    it('should find entry by email successfully', async () => {
      mockSingle.mockResolvedValue({
        data: mockSupabaseResponse,
        error: null
      })

      const result = await waitlistOperations.findByEmail('john@example.com')

      expect(result).toEqual(mockSupabaseResponse)
      expect(mockEq).toHaveBeenCalledWith('email', 'john@example.com')
    })

    it('should return null when entry not found', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'No rows found' }
      })

      const result = await waitlistOperations.findByEmail('nonexistent@example.com')

      expect(result).toBeNull()
    })

    it('should handle database errors', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { code: 'OTHER', message: 'Database connection failed' }
      })

      await expect(waitlistOperations.findByEmail('john@example.com'))
        .rejects.toThrow('Failed to find entry: Database connection failed')
    })

    it('should sanitize email input', async () => {
      mockSingle.mockResolvedValue({
        data: mockSupabaseResponse,
        error: null
      })

      await waitlistOperations.findByEmail('  JOHN@EXAMPLE.COM  ')

      expect(mockEq).toHaveBeenCalledWith('email', 'john@example.com')
    })
  })
})