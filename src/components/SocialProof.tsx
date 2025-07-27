'use client'

import { useState, useEffect } from 'react'
import { CountResponse } from '@/lib/types'

interface SocialProofProps {
  className?: string
}

export function SocialProof({ className = '' }: SocialProofProps) {
  const [signupCount, setSignupCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
          ) : error ? (
            <div className="text-amber-700" role="alert">
              <p id="social-proof-heading" className="text-2xl font-semibold mb-2">Join our growing community</p>
              <p className="text-amber-600">of people excited for a better way to wake up</p>
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


      </div>
    </section>
  )
}