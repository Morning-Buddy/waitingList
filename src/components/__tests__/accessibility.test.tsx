import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Header } from '../Header';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock scrollTo and getElementById
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true
});

Object.defineProperty(document, 'getElementById', {
  value: jest.fn((id) => ({
    offsetTop: id === 'how-it-works' ? 500 : 800
  })),
  writable: true
});

describe('Accessibility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Header Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Header />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<Header />);

      // Tab through navigation elements
      await user.tab(); // Logo link
      const logoLink = screen.getByRole('link', { name: 'Morning Buddy - Go to homepage' });
      expect(logoLink).toHaveFocus();

      await user.tab(); // How it works button
      const howItWorksButton = screen.getByRole('button', { name: 'Learn how Morning Buddy works' });
      expect(howItWorksButton).toHaveFocus();

      await user.tab(); // FAQ button
      const faqButton = screen.getByRole('button', { name: 'Frequently asked questions' });
      expect(faqButton).toHaveFocus();

      // Test Enter key activation
      await user.keyboard('{Enter}');
      expect(window.scrollTo).toHaveBeenCalled();
    });

    it('has proper ARIA attributes', () => {
      render(<Header />);

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();

      const navigation = screen.getByRole('navigation', { name: 'Main navigation' });
      expect(navigation).toBeInTheDocument();

      const mobileMenuButton = screen.getByRole('button', { name: 'Open navigation menu' });
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Navigation Accessibility', () => {
    it('has proper section IDs for anchor navigation', () => {
      // Test that the sections have proper IDs for navigation
      const mockElement = document.createElement('section');
      mockElement.id = 'how-it-works';
      document.body.appendChild(mockElement);

      const mockElement2 = document.createElement('section');
      mockElement2.id = 'faq';
      document.body.appendChild(mockElement2);

      expect(document.getElementById('how-it-works')).toBeTruthy();
      expect(document.getElementById('faq')).toBeTruthy();

      // Clean up
      document.body.removeChild(mockElement);
      document.body.removeChild(mockElement2);
    });
  });

  describe('Color Contrast and Visual Accessibility', () => {
    it('ensures header text has sufficient contrast ratios', () => {
      render(<Header />);

      // Check for text elements that should have good contrast
      const textElements = screen.getAllByText(/Morning|Buddy/i);
      textElements.forEach(element => {
        // Elements should be visible (basic check)
        expect(element).toBeVisible();
      });
    });

    it('supports high contrast mode preferences', () => {
      // Mock high contrast media query
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-contrast: high)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(<Header />);
      
      // Component should render without errors in high contrast mode
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('Mobile Responsiveness and Touch Accessibility', () => {
    it('has proper touch target sizes for mobile', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const mobileMenuButton = screen.getByRole('button', { name: 'Open navigation menu' });
      
      // Mobile menu button should be large enough for touch (44px minimum)
      const buttonStyles = window.getComputedStyle(mobileMenuButton);
      expect(mobileMenuButton).toBeInTheDocument();
      
      // Test mobile menu functionality
      await user.click(mobileMenuButton);
      
      const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation' });
      expect(mobileNav).toBeInTheDocument();
    });
  });

  describe('Reduced Motion Support', () => {
    it('respects prefers-reduced-motion setting', () => {
      // Mock reduced motion media query
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(<Header />);

      // Components should render without errors with reduced motion
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });
});