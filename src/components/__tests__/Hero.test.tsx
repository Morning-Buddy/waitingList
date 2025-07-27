import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Hero } from '../Hero';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

describe('Hero', () => {
  const mockOnJoinWaitlist = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders hero section with correct content', () => {
    render(<Hero onJoinWaitlist={mockOnJoinWaitlist} />);
    
    expect(screen.getByText('Morning Buddy')).toBeInTheDocument();
    expect(screen.getByText(/Get a morning call from an AI buddy instead of a jarring alarm/)).toBeInTheDocument();
    expect(screen.getByText('Join Waiting List')).toBeInTheDocument();
  });

  it('calls onJoinWaitlist when button is clicked', () => {
    render(<Hero onJoinWaitlist={mockOnJoinWaitlist} />);
    
    const joinButton = screen.getByText('Join Waiting List');
    fireEvent.click(joinButton);
    
    expect(mockOnJoinWaitlist).toHaveBeenCalledTimes(1);
  });

  it('has proper heading hierarchy', () => {
    render(<Hero onJoinWaitlist={mockOnJoinWaitlist} />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Morning Buddy');
  });

  it('has accessible button', () => {
    render(<Hero onJoinWaitlist={mockOnJoinWaitlist} />);
    
    const button = screen.getByRole('button', { name: /join waiting list/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('renders sunrise illustration', () => {
    render(<Hero onJoinWaitlist={mockOnJoinWaitlist} />);
    
    // Check for SVG element (sunrise illustration)
    const svg = screen.getByRole('img', { hidden: true });
    expect(svg).toBeInTheDocument();
  });
});