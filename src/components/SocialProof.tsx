'use client'

import { useState, useEffect } from 'react'
// import { CountResponse } from '@/lib/types' // Not needed for static version

interface SocialProofProps {
  className?: string
}

export function SocialProof({ className = '' }: SocialProofProps) {
  const [signupCount, setSignupCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // For GitHub Pages, we'll show a static count or hide the counter
    // You can update this manually or integrate with a third-party service
    const staticCount = 0; // Update this number manually as needed
    
    setTimeout(() => {
      setSignupCount(staticCount);
      setIsLoading(false);
    }, 500); // Simulate loading for better UX
  }, [])

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
    }
    return num.toLocaleString()
  }

  const getCounterText = (count: number): string => {
    if (count === 0) {
      return "Be the first to join our community of early risers!"
    }
    if (count < 10) {
      return `Join ${count} other${count === 1 ? '' : 's'} who are excited for a better way to wake up`
    }
    if (count < 100) {
      return `Join the ${count} early risers who have already signed up`
    }
    return `Join the ${formatNumber(count)} early risers that have joined so far`
  }

  return (
    <section 
      className={`py-16 bg-gradient-to-b from-amber-50 to-white ${className}`}
      aria-labelledby="social-proof-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Counter Display */}
        <div className="mb-12">
          {isLoading ? (
            <div className="animate-pulse motion-reduce:animate-none" role="status" aria-label="Loading signup count">
              <div className="h-8 bg-amber-200 rounded-lg w-96 mx-auto mb-4"></div>
              <div className="h-4 bg-amber-100 rounded w-64 mx-auto"></div>
              <span className="sr-only">Loading signup count...</span>
            </div>
          ) : (
            <div className="text-amber-800">
              <p 
                id="social-proof-heading"
                className="text-2xl sm:text-3xl font-semibold mb-2 leading-tight"
                aria-live="polite"
                aria-atomic="true"
              >
                {signupCount !== null ? getCounterText(signupCount) : 'Loading...'}
              </p>
              {signupCount !== null && signupCount > 0 && (
                <p className="text-amber-600 text-lg">
                  Don&apos;t miss out on early access to Morning Buddy
                </p>
              )}
              {/* Screen reader announcement for count */}
              <div className="sr-only" aria-live="polite">
                {signupCount !== null && `${signupCount} people have joined the waiting list`}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Community Messaging */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-6">
              <svg 
                className="w-8 h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
              Join Our Community
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Join our community of early risers and get tips on sleep, productivity and routines plus sneak-peeks at upcoming features.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-amber-700">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 font-medium">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Sleep Tips
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 font-medium">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Productivity Hacks
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 font-medium">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Morning Routines
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 font-medium text-orange-700">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Feature Previews
              </span>
            </div>
          </div>
        </div>


      </div>
    </section>
  )
}