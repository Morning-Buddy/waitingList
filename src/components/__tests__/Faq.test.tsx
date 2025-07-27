import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Faq } from '../Faq';

describe('Faq', () => {
  it('renders FAQ section with heading', () => {
    render(<Faq />);
    
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
  });

  it('renders all FAQ items', () => {
    render(<Faq />);
    
    // Check for question buttons (collapsed by default)
    expect(screen.getByText(/What is Morning Buddy/)).toBeInTheDocument();
    expect(screen.getByText(/When will Morning Buddy launch/)).toBeInTheDocument();
    expect(screen.getByText(/How much will Morning Buddy cost/)).toBeInTheDocument();
    expect(screen.getByText(/Can I customize the voice/)).toBeInTheDocument();
  });

  it('expands and collapses FAQ items when clicked', () => {
    render(<Faq />);
    
    const firstQuestion = screen.getByText(/What is Morning Buddy/);
    
    // Initially, the answer should not be visible
    expect(screen.queryByText(/Morning Buddy is an AI-powered alarm clock/)).not.toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(firstQuestion);
    
    // Now the answer should be visible
    expect(screen.getByText(/Morning Buddy is an AI-powered alarm clock/)).toBeInTheDocument();
    
    // Click again to collapse
    fireEvent.click(firstQuestion);
    
    // Answer should be hidden again
    expect(screen.queryByText(/Morning Buddy is an AI-powered alarm clock/)).not.toBeInTheDocument();
  });

  it('has proper ARIA attributes for accessibility', () => {
    render(<Faq />);
    
    const buttons = screen.getAllByRole('button');
    
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-expanded');
      expect(button).toHaveAttribute('aria-controls');
    });
  });

  it('allows multiple items to be expanded simultaneously', () => {
    render(<Faq />);
    
    const firstQuestion = screen.getByText(/What is Morning Buddy/);
    const secondQuestion = screen.getByText(/When will Morning Buddy launch/);
    
    // Expand first item
    fireEvent.click(firstQuestion);
    expect(screen.getByText(/Morning Buddy is an AI-powered alarm clock/)).toBeInTheDocument();
    
    // Expand second item
    fireEvent.click(secondQuestion);
    expect(screen.getByText(/We're planning to launch/)).toBeInTheDocument();
    
    // Both should still be expanded
    expect(screen.getByText(/Morning Buddy is an AI-powered alarm clock/)).toBeInTheDocument();
    expect(screen.getByText(/We're planning to launch/)).toBeInTheDocument();
  });

  it('has proper heading hierarchy', () => {
    render(<Faq />);
    
    const mainHeading = screen.getByRole('heading', { level: 2 });
    expect(mainHeading).toHaveTextContent('Frequently Asked Questions');
  });

  it('renders with proper semantic structure', () => {
    render(<Faq />);
    
    // Should have a section element
    const section = screen.getByRole('region');
    expect(section).toBeInTheDocument();
  });
});