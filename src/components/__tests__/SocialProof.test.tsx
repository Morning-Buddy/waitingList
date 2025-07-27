import { render, screen, waitFor } from '@testing-library/react'
import { SocialProof } from '../SocialProof'

// Mock fetch
global.fetch = jest.fn()

describe('SocialProof Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    ;(fetch as jest.Mock).mockImplementation(() => new Promise(() => {})) // Never resolves
    
    render(<SocialProof />)
    
    expect(screen.getByText('As featured in')).toBeInTheDocument()
    // Check for loading animation
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('displays signup count when API call succeeds', async () => {
    const mockResponse = {
      success: true,
      message: 'Success',
      data: { count: 42 }
    }
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse)
    })
    
    render(<SocialProof />)
    
    await waitFor(() => {
      expect(screen.getByText(/Join the 42 early risers who have already signed up/)).toBeInTheDocument()
    })
  })

  it('displays fallback message when count is 0', async () => {
    const mockResponse = {
      success: true,
      message: 'Success',
      data: { count: 0 }
    }
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse)
    })
    
    render(<SocialProof />)
    
    await waitFor(() => {
      expect(screen.getByText(/Be the first to join our community of early risers!/)).toBeInTheDocument()
    })
  })

  it('displays error fallback when API call fails', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))
    
    render(<SocialProof />)
    
    await waitFor(() => {
      expect(screen.getByText(/Join our growing community/)).toBeInTheDocument()
    })
  })

  it('formats large numbers correctly', async () => {
    const mockResponse = {
      success: true,
      message: 'Success',
      data: { count: 1500 }
    }
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse)
    })
    
    render(<SocialProof />)
    
    await waitFor(() => {
      expect(screen.getByText(/Join the 1.5K early risers that have joined so far/)).toBeInTheDocument()
    })
  })

  it('renders placeholder publication logos', () => {
    ;(fetch as jest.Mock).mockImplementation(() => new Promise(() => {}))
    
    render(<SocialProof />)
    
    expect(screen.getByText('TechCrunch')).toBeInTheDocument()
    expect(screen.getByText('Product Hunt')).toBeInTheDocument()
    expect(screen.getByText('Hacker News')).toBeInTheDocument()
    expect(screen.getByText('Reddit')).toBeInTheDocument()
    expect(screen.getByText('* Placeholder logos - will be updated with actual features')).toBeInTheDocument()
  })
})