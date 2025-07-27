import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

describe('Header', () => {
  it('renders header with Morning Buddy branding', () => {
    render(<Header />);
    
    expect(screen.getByText('Morning Buddy')).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(<Header />);
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('renders logo/brand as a heading', () => {
    render(<Header />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Morning Buddy');
  });

  it('has proper styling classes', () => {
    render(<Header />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('border-b');
  });
});