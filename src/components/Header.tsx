import Link from "next/link";

export function Header() {
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
                <img 
                  src="/Logo.svg" 
                  alt="Morning Buddy Logo" 
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

          {/* Mobile menu button - for future implementation */}
          <button
            className="md:hidden p-3 text-gray-600 hover:text-[var(--mascot-orange)] focus:outline-none focus:ring-2 focus:ring-[var(--mascot-orange)] focus:ring-offset-2 rounded-[var(--radius-bubble)] mascot-pop hover:bg-[var(--mascot-orange)]/5"
            aria-label="Open navigation menu"
            aria-expanded="false"
            type="button"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}