import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignupForm } from '../SignupForm';

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();

describe('SignupForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, message: 'Success!' }),
    });
  });

  it('renders all form fields', () => {
    render(<SignupForm onSuccess={mockOnSuccess} onClose={mockOnClose} />);
    
    expect(screen.getByLabelText(/name \(optional\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/i agree to receive early-access emails/i)).toBeInTheDocument();
  });

  it('validates required email field', async () => {
    render(<SignupForm onSuccess={mockOnSuccess} onClose={mockOnClose} />);
    
    const submitButton = screen.getByText('Join Waiting List');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('validates GDPR consent checkbox', async () => {
    render(<SignupForm onSuccess={mockOnSuccess} onClose={mockOnClose} />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByText('Join Waiting List');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/gdpr consent is required/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<SignupForm onSuccess={mockOnSuccess} onClose={mockOnClose} />);
    
    const nameInput = screen.getByLabelText(/name \(optional\)/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const gdprCheckbox = screen.getByLabelText(/i agree to receive early-access emails/i);
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.click(gdprCheckbox);
    
    const submitButton = screen.getByText('Join Waiting List');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          gdprConsent: true,
        }),
      });
    });
  });

  it('shows loading state during submission', async () => {
    // Mock a delayed response
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Success!' }),
      }), 100))
    );

    render(<SignupForm onSuccess={mockOnSuccess} onClose={mockOnClose} />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const gdprCheckbox = screen.getByLabelText(/i agree to receive early-access emails/i);
    
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.click(gdprCheckbox);
    
    const submitButton = screen.getByText('Join Waiting List');
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Joining...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});