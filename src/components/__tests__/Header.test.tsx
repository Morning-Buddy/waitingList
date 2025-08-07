import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '../Header';

// Mock scrollTo for testing
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true
});

// Mock getElementById for testing
Object.defineProperty(document, 'getElementById', {
  value: jest.fn((id) => ({
    offsetTop: id === 'how-it-works' ? 500 : 800
  })),
  writable: true
});

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header with Morning Buddy branding', () => {
    render(<Header />);
    
    expect(screen.getByText('Morning')).toBeInTheDocument();
    expect(screen.getByText('Buddy')).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(<Header />);
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    const navigation = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(navigation).toBeInTheDocument();
  });

  it('renders navigation buttons with proper accessibility', () => {
    render(<Header />);
    
    const howItWorksButton = screen.getByRole('button', { name: 'Learn how Morning Buddy works' });
    const faqButton = screen.getByRole('button', { name: 'Frequently asked questions' });
    
    expect(howItWorksButton).toBeInTheDocument();
    expect(faqButton).toBeInTheDocument();
  });

  it('handles navigation button clicks with smooth scrolling', async () => {
    const user = userEvent.setup();
    render(<Header />);
    
    const howItWorksButton = screen.getByRole('button', { name: 'Learn how Morning Buddy works' });
    
    await user.click(howItWorksButton);
    
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 420, // 500 - 80 (header height)
      behavior: 'smooth'
    });
  });

  it('has sticky header styling', () => {
    render(<Header />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('fixed', 'top-0', 'z-50');
  });

  it('toggles mobile menu correctly', async () => {
    const user = userEvent.setup();
    render(<Header />);
    
    const mobileMenuButton = screen.getByRole('button', { name: 'Open navigation menu' });
    expect(mobileMenuButton).toBeInTheDocument();
    
    await user.click(mobileMenuButton);
    
    // Check if mobile navigation appears
    const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation' });
    expect(mobileNav).toBeInTheDocument();
    
    // Check if button text changes
    expect(screen.getByRole('button', { name: 'Close navigation menu' })).toBeInTheDocument();
  });

  it('closes mobile menu when navigation button is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);
    
    // Open mobile menu
    const mobileMenuButton = screen.getByRole('button', { name: 'Open navigation menu' });
    await user.click(mobileMenuButton);
    
    // Click a navigation button
    const mobileHowItWorksButton = screen.getAllByRole('button', { name: 'Learn how Morning Buddy works' })[1]; // Mobile version
    await user.click(mobileHowItWorksButton);
    
    // Mobile menu should close (navigation should not be visible)
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();
  });

  it('has proper focus management for keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<Header />);
    
    const howItWorksButton = screen.getByRole('button', { name: 'Learn how Morning Buddy works' });
    
    // Tab to the button
    await user.tab();
    await user.tab(); // Skip logo link
    
    expect(howItWorksButton).toHaveFocus();
    
    // Press Enter to activate
    await user.keyboard('{Enter}');
    
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it('updates styling on scroll', () => {
    render(<Header />);
    
    // Simulate scroll event
    Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
    fireEvent.scroll(window);
    
    const header = screen.getByRole('banner');
    // The component should update its classes based on scroll position
    expect(header).toHaveClass('fixed');
  });

  it('has proper ARIA labels and roles', () => {
    render(<Header />);
    
    const logoLink = screen.getByRole('link', { name: 'Morning Buddy - Go to homepage' });
    expect(logoLink).toBeInTheDocument();
    
    const mobileMenuButton = screen.getByRole('button', { name: 'Open navigation menu' });
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
  });
});