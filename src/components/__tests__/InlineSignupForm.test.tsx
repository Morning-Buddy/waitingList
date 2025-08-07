import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InlineSignupForm } from '../InlineSignupForm';
import { toast } from 'sonner';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { beforeEach } from 'node:test';
import { describe } from 'node:test';

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe('InlineSignupForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  it('renders the inline signup form', () => {
    render(<InlineSignupForm />);
    
    expect(screen.getByText('Ready to transform your mornings?')).toBeInTheDocument();
    expect(screen.getByLabelText(/name \(optional\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/i agree to receive early-access emails/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit form to join waiting list/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<InlineSignupForm />);
    
    const submitButton = screen.getByRole('button', { name: /submit form to join waiting list/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('GDPR consent is required')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<InlineSignupForm />);
    
    const nameInput = screen.getByLabelText(/name \(optional\)/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const consentCheckbox = screen.getByLabelText(/i agree to receive early-access emails/i);
    const submitButton = screen.getByRole('button', { name: /submit form to join waiting list/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.click(consentCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('https://formspree.io/f/myzpjgnk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'john@example.com',
          name: 'John Doe',
          gdprConsent: true,
          source: 'Morning Buddy Waitlist - Inline Form',
        }),
      });
    });

    expect(toast.success).toHaveBeenCalledWith(
      'Successfully joined the waitlist!',
      expect.objectContaining({
        description: "We'll notify you when Morning Buddy is ready!",
      })
    );
  });

  it('handles form submission errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Server error' }),
    });

    render(<InlineSignupForm />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const consentCheckbox = screen.getByLabelText(/i agree to receive early-access emails/i);
    const submitButton = screen.getByRole('button', { name: /submit form to join waiting list/i });

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.click(consentCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Signup failed',
        expect.objectContaining({
          description: 'Server error',
        })
      );
    });
  });

  it('provides alternative modal option', () => {
    // Mock window.dispatchEvent
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');
    
    render(<InlineSignupForm />);
    
    const modalLink = screen.getByText('Use our quick modal form');
    fireEvent.click(modalLink);

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'openWaitlistModal',
      })
    );

    dispatchEventSpy.mockRestore();
  });

  it('validates email format', async () => {
    render(<InlineSignupForm />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const consentCheckbox = screen.getByLabelText(/i agree to receive early-access emails/i);
    const submitButton = screen.getByRole('button', { name: /submit form to join waiting list/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(consentCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  it('clears field errors when user starts typing', async () => {
    render(<InlineSignupForm />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /submit form to join waiting list/i });

    // Trigger validation error
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    // Start typing to clear error
    fireEvent.change(emailInput, { target: { value: 'j' } });

    await waitFor(() => {
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    });
  });
});