import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WaitlistModal } from '../WaitlistModal';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();

describe('WaitlistModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, message: 'Success!' }),
    });
  });

  it('renders modal when open', () => {
    render(<WaitlistModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Join the Morning Buddy Waiting List')).toBeInTheDocument();
  });

  it('does not render modal when closed', () => {
    render(<WaitlistModal isOpen={false} onClose={mockOnClose} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has proper ARIA attributes', () => {
    render(<WaitlistModal isOpen={true} onClose={mockOnClose} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');
  });

  it('contains signup form with required fields', () => {
    render(<WaitlistModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByLabelText(/name \(optional\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/i agree to receive early-access emails/i)).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<WaitlistModal isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles escape key to close modal', () => {
    render(<WaitlistModal isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();
  });
});