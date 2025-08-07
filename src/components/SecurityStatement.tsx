"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function SecurityStatement() {
  return (
    <section className="py-12 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Privacy & Security Matter
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
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
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">UK GDPR Compliant</h3>
              <p className="text-sm text-gray-600">
                We follow strict UK data protection regulations and are registered with the ICO
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
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
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">End-to-End Encryption</h3>
              <p className="text-sm text-gray-600">
                All calls and personal data are protected with enterprise-grade encryption
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Transparent Data Use</h3>
              <p className="text-sm text-gray-600">
                We only collect what we need and never sell your personal information
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-700 mb-4">
              <strong>Data Protection Promise:</strong> We store only the scheduling data necessary to make your calls. 
              Your conversations are encrypted, and you maintain full control over your personal information. 
              We comply with UK data protection regulations and you can request deletion of your data at any time.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link 
                href="/privacy" 
                className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                href="/cookies" 
                className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}