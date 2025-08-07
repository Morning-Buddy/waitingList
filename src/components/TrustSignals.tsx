"use client";

import { motion } from "framer-motion";

interface TrustSignalsProps {
  variant?: 'hero' | 'footer' | 'form';
  className?: string;
}

export function TrustSignals({ variant = 'hero', className = '' }: TrustSignalsProps) {
  const baseClasses = "flex items-center justify-center gap-4 text-sm text-gray-600";
  
  if (variant === 'hero') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className={`${baseClasses} flex-wrap ${className}`}
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 1L13 7l6 .75-4.12 4.62L16 19l-6-3-6 3 1.12-6.63L1 7.75 7 7l3-6z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">UK Data Protection Compliant</span>
        </div>
        
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">End-to-End Encrypted</span>
        </div>
        
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-purple-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">No Spam Guarantee</span>
        </div>
      </motion.div>
    );
  }

  if (variant === 'form') {
    return (
      <div className={`${baseClasses} bg-gray-50 rounded-lg p-3 border ${className}`}>
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-green-600 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs">
            Your data is protected with enterprise-grade security and UK data protection compliance
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`${baseClasses} text-xs ${className}`}>
        <div className="flex items-center gap-1">
          <svg
            className="w-3 h-3 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 1L13 7l6 .75-4.12 4.62L16 19l-6-3-6 3 1.12-6.63L1 7.75 7 7l3-6z"
              clipRule="evenodd"
            />
          </svg>
          <span>GDPR Compliant</span>
        </div>
        
        <div className="flex items-center gap-1">
          <svg
            className="w-3 h-3 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Secure</span>
        </div>
        
        <div className="flex items-center gap-1">
          <svg
            className="w-3 h-3 text-purple-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>No Spam</span>
        </div>
      </div>
    );
  }

  return null;
}