'use client';

import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ThankYouContent() {
  const searchParams = useSearchParams();
  const confirmed = searchParams.get('confirmed');
  const error = searchParams.get('error');

  // Pre-filled social share text
  const shareText = "I just joined the Morning Buddy waiting list! 🌅 Wake up to a friendly AI buddy instead of a jarring alarm. Join me: https://morningbuddy.co.uk";
  const emailSubject = "Check out Morning Buddy - AI alarm clock";
  const emailBody = "Hey! I just signed up for Morning Buddy, an AI alarm clock that wakes you up with a friendly phone call instead of a jarring alarm. Thought you might be interested too! Check it out: https://morningbuddy.co.uk";

  // Social share URLs
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://morningbuddy.co.uk")}&summary=${encodeURIComponent(shareText)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  // Handle confirmed state
  if (confirmed === 'true') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Confirmation success message */}
        <div className="space-y-4">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Email confirmed!
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            Perfect! Your email has been confirmed and you&apos;re officially on the Morning Buddy waiting list. We&apos;ll notify you as soon as we launch.
          </p>
        </div>

        {/* Success confirmation box */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-green-800">
                You&apos;re all set!
              </p>
              <p className="text-sm text-green-700">
                We&apos;ll send you updates about our launch progress
              </p>
            </div>
          </div>
        </div>

        {/* Social share section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              Spread the word! 📢
            </h2>
            <p className="text-gray-600">
              Help your friends discover a better way to wake up
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Twitter/X share button */}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>Share on X</span>
              </a>
            </Button>

            {/* LinkedIn share button */}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>Share on LinkedIn</span>
              </a>
            </Button>

            {/* Email share button */}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <a
                href={emailUrl}
                className="flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Share via Email</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Navigation back to main page */}
        <div className="pt-8">
          <Button asChild size="lg">
            <Link href="/">
              ← Back to Morning Buddy
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Handle error states
  if (error) {
    let errorTitle = "Something went wrong";
    let errorMessage = "We encountered an issue processing your request.";
    let errorEmoji = "❌";
    let showRetryButton = false;

    switch (error) {
      case 'invalid-link':
        errorTitle = "Invalid confirmation link";
        errorMessage = "The confirmation link appears to be invalid or malformed. Please try signing up again.";
        errorEmoji = "🔗";
        showRetryButton = true;
        break;
      case 'expired-link':
        errorTitle = "Confirmation link expired";
        errorMessage = "This confirmation link has expired. Please sign up again to receive a new confirmation email.";
        errorEmoji = "⏰";
        showRetryButton = true;
        break;
      case 'not-found':
        errorTitle = "Email not found";
        errorMessage = "We couldn't find this email address in our waitlist. Please sign up again.";
        errorEmoji = "🔍";
        showRetryButton = true;
        break;
      case 'server-error':
        errorTitle = "Server error";
        errorMessage = "We're experiencing technical difficulties. Please try again later or contact support.";
        errorEmoji = "🛠️";
        break;
    }

    return (
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Error message */}
        <div className="space-y-4">
          <div className="text-6xl mb-4">{errorEmoji}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            {errorTitle}
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            {errorMessage}
          </p>
        </div>

        {/* Error details box */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-red-800">
                Confirmation failed
              </p>
              <p className="text-sm text-red-700">
                {showRetryButton ? "Please try signing up again" : "Please try again later"}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {showRetryButton && (
            <Button asChild size="lg">
              <Link href="/">
                Try signing up again
              </Link>
            </Button>
          )}
          
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              ← Back to Morning Buddy
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Default state (normal signup completion)
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      {/* Success message with emoji */}
      <div className="space-y-4">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Thanks for joining!
        </h1>
        <p className="text-xl text-gray-600 max-w-lg mx-auto">
          You&apos;re now on the Morning Buddy waiting list. Check your inbox to confirm your email address and we&apos;ll notify you when we launch.
        </p>
      </div>

      {/* Email confirmation reminder */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-md mx-auto">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-amber-800">
              Check your inbox
            </p>
            <p className="text-sm text-amber-700">
              Click the confirmation link to complete your signup
            </p>
          </div>
        </div>
      </div>

      {/* Social share section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">
            Spread the word! 📢
          </h2>
          <p className="text-gray-600">
            Help your friends discover a better way to wake up
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Twitter/X share button */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>Share on X</span>
            </a>
          </Button>

          {/* LinkedIn share button */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>Share on LinkedIn</span>
            </a>
          </Button>

          {/* Email share button */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <a
              href={emailUrl}
              className="flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Share via Email</span>
            </a>
          </Button>
        </div>
      </div>

      {/* Navigation back to main page */}
      <div className="pt-8">
        <Button asChild size="lg">
          <Link href="/">
            ← Back to Morning Buddy
          </Link>
        </Button>
      </div>
    </div>
  );
}