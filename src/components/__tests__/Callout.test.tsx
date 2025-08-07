import React from 'react';
import { render, screen } from '@testing-library/react';
import { Callout } from '../Callout';

describe('Callout', () => {
  it('renders "How It Works" section', () => {
    render(<Callout />);
    
    expect(screen.getByText('How It Works')).toBeInTheDocument();
  });

  it('renders all three steps', () => {
    render(<Callout />);
    
    // Check for step titles
    expect(screen.getByText('Build a Buddy')).toBeInTheDocument();
    expect(screen.getByText('Set Schedule')).toBeInTheDocument();
    expect(screen.getByText('Wake Up Happy')).toBeInTheDocument();
  });

  it('renders step descriptions', () => {
    render(<Callout />);
    
    expect(screen.getByText(/Build your buddy: Choose from a library of voices/)).toBeInTheDocument();
    expect(screen.getByText(/Set your wake-up plan: Pick the days and times/)).toBeInTheDocument();
    expect(screen.getByText(/Enjoy better mornings: At your chosen time/)).toBeInTheDocument();
  });

  it('has proper heading hierarchy', () => {
    render(<Callout />);
    
    const mainHeading = screen.getByRole('heading', { level: 2 });
    expect(mainHeading).toHaveTextContent('How It Works');
    
    const stepHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(stepHeadings).toHaveLength(3);
    expect(stepHeadings[0]).toHaveTextContent('Build a Buddy');
    expect(stepHeadings[1]).toHaveTextContent('Set Schedule');
    expect(stepHeadings[2]).toHaveTextContent('Wake Up Happy');
  });

  it('renders with proper semantic structure', () => {
    render(<Callout />);
    
    // Should have a section element
    const section = screen.getByRole('region');
    expect(section).toBeInTheDocument();
  });

  it('renders step icons', () => {
    render(<Callout />);
    
    // Check for Lucide icons (they render as SVG elements)
    const icons = screen.getAllByRole('img', { hidden: true });
    expect(icons.length).toBeGreaterThanOrEqual(3);
  });
});