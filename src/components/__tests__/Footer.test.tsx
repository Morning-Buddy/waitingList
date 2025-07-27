import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';

describe('Footer', () => {
  it('renders footer with copyright information', () => {
    render(<Footer />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear} Morning Buddy`))).toBeInTheDocument();
  });

  it('renders legal links', () => {
    render(<Footer />);
    
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('renders contact information', () => {
    render(<Footer />);
    
    // Check for contact email or other contact info
    const contactLink = screen.getByText(/info@morningbuddy/);
    expect(contactLink).toBeInTheDocument();
  });

  it('has proper link attributes', () => {
    render(<Footer />);
    
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });
});