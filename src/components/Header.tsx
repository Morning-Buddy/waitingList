"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header 
      className="w-full border-b-4 border-[var(--mascot-orange)]/20 bg-white/90 backdrop-blur-sm"
      role="banner"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-[var(--mascot-orange)] focus:ring-offset-2 rounded-[var(--radius-bubble)] p-2 mascot-pop"
            aria-label="Morning Buddy - Go to homepage"
          >
            <div className="flex items-center space-x-3">
              {/* Morning Buddy Logo */}
              <div className="w-10 h-10 rounded-[var(--radius-bubble)] bg-white shadow-lg mascot-float flex items-center justify-center">
                <Image 
                  src="/Logo.svg" 
                  alt="Morning Buddy Logo" 
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-gray-900">
                  Morning
                </h1>
                <h1 className="text-xl font-bold mascot-gradient-text">
                  Buddy
                </h1>
              </div>
            </div>
          </Link>
          
          {/* Navigation */}
          <nav 
            className="hidden md:flex items-center space-x-6"
            role="navigation"
            aria-label="Main navigation"
          >
            <Link 
              href="#how-it-works" 
              className="text-gray-600 hover:text-[var(--mascot-orange)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--mascot-orange)] focus:ring-offset-2 rounded-[var(--radius-bubble)] px-4 py-2 font-medium mascot-pop hover:bg-[var(--mascot-orange)]/5"
              aria-label="Learn how Morning Buddy works"
            >
              How it works
            </Link>
            <Link 
              href="#faq" 
              className="text-gray-600 hover:text-[var(--mascot-orange)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--mascot-orange)] focus:ring-offset-2 rounded-[var(--radius-bubble)] px-4 py-2 font-medium mascot-pop hover:bg-[var(--mascot-orange)]/5"
              aria-label="Frequently asked questions"
            >
              FAQ
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-3 text-gray-600 hover:text-[var(--mascot-orange)] focus:outline-none focus:ring-2 focus:ring-[var(--mascot-orange)] focus:ring-offset-2 rounded-[var(--radius-bubble)] mascot-pop hover:bg-[var(--mascot-orange)]/5"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--mascot-orange)]/20 bg-white/95 backdrop-blur-sm">
            <nav className="px-4 py-4 space-y-2" role="navigation" aria-label="Mobile navigation">
              <Link 
                href="#how-it-works" 
                className="block px-4 py-3 text-gray-600 hover:text-[var(--mascot-orange)] hover:bg-[var(--mascot-orange)]/5 rounded-[var(--radius-bubble)] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--mascot-orange)] focus:ring-offset-2"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Learn how Morning Buddy works"
              >
                How it works
              </Link>
              <Link 
                href="#faq" 
                className="block px-4 py-3 text-gray-600 hover:text-[var(--mascot-orange)] hover:bg-[var(--mascot-orange)]/5 rounded-[var(--radius-bubble)] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--mascot-orange)] focus:ring-offset-2"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Frequently asked questions"
              >
                FAQ
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}