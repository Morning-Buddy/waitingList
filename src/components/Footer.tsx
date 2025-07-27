import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="w-full border-t border-gray-200 bg-gray-50"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  role="img"
                >
                  <title>Morning Buddy Logo</title>
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
              </div>
              <span className="font-semibold text-gray-900">Morning Buddy</span>
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              Wake up to a friendly AI buddy instead of a jarring alarm. 
              Start your day with a smile.
            </p>
          </div>

          {/* Legal links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Legal</h3>
            <nav 
              className="flex flex-col space-y-2"
              role="navigation"
              aria-label="Legal information"
            >
              <Link 
                href="/privacy" 
                className="text-sm text-gray-600 hover:text-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-md px-1 py-1"
                aria-label="Read our privacy policy"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-sm text-gray-600 hover:text-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-md px-1 py-1"
                aria-label="Read our terms of service"
              >
                Terms of Service
              </Link>
              <Link 
                href="/cookies" 
                className="text-sm text-gray-600 hover:text-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-md px-1 py-1"
                aria-label="Read our cookie policy"
              >
                Cookie Policy
              </Link>
            </nav>
          </div>

          {/* Contact information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Contact</h3>
            <div className="space-y-2">
              <a 
                href="mailto:info@morningbuddy.co.uk"
                className="text-sm text-gray-600 hover:text-amber-600 transition-colors block focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-md px-1 py-1"
                aria-label="Send us an email at info@morningbuddy.co.uk"
              >
                info@morningbuddy.co.uk
              </a>
              <p className="text-sm text-gray-600">
                Questions? We&apos;d love to hear from you.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              © {currentYear} Morning Buddy. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Made with ☕ in the UK</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}