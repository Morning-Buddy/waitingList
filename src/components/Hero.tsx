"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedButton } from "./AnimatedButton";
import { WaitlistModal } from "./WaitlistModal";
import { TrustSignals } from "./TrustSignals";
import { SunMascot } from "./SunMascot/SunMascot";
import { type Expression } from "./SunMascot/expressions";

export function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExpression, setCurrentExpression] = useState<Expression>('idle');

  // Listen for custom event to open modal from other components
  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener('openWaitlistModal', handleOpenModal);
    return () => window.removeEventListener('openWaitlistModal', handleOpenModal);
  }, []);

  // Handle successful waitlist submission
  const handleWaitlistSuccess = () => {
    setCurrentExpression('excited');
    // Show excited expression for 3 seconds, then return to idle
    setTimeout(() => {
      setCurrentExpression('idle');
    }, 3000);
  };

  // Determine which expression to show
  const displayExpression: Expression = currentExpression;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 overflow-hidden"
      id="main-content"
      aria-labelledby="hero-heading"
      role="main"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Sun Mascot - Mobile First */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="flex justify-center lg:justify-end lg:order-2"
          >
            <SunMascot
              expression={displayExpression}
              size={300} // Smaller on mobile
              className="drop-shadow-2xl lg:w-[400px]"
            />
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left space-y-6 lg:space-y-8 motion-reduce:transition-none lg:order-1"
          >
            <div className="space-y-4">
              <motion.h1
                id="hero-heading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight"
              >
                Wake up happy with{" "}
                <span className="mascot-gradient-text">
                  Morning Buddy
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto lg:mx-0"
              >
                Ditch the jarring alarm. Let an AI buddy call you with a personal chat that motivates, entertains and eases you into the day.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0"
              >
                Morning Buddy isn&apos;t just a wake-up call—it&apos;s a morning companion. Choose the voice and personality you love, get a tailored conversation every morning, and start your day smiling instead of scrambling.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col gap-4 justify-center lg:justify-start max-w-lg mx-auto lg:mx-0"
            >
              <AnimatedButton
                size="lg"
                className="gradient-button text-lg sm:text-xl font-semibold mascot-float px-8 py-5 sm:px-10 sm:py-6 w-full shadow-xl hover:shadow-2xl transition-all duration-300 leading-relaxed"
                onClick={() => setIsModalOpen(true)}
                aria-describedby="cta-description"
              >
                Join the waiting list
              </AnimatedButton>
              <p id="cta-description" className="sr-only">
                Click to open the waiting list signup form and be notified when Morning Buddy launches
              </p>

              <button
                className="px-6 py-4 sm:px-8 sm:py-4 text-base sm:text-lg font-medium text-gray-700 hover:text-[var(--mascot-orange)] transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--mascot-orange)] focus:ring-offset-2 rounded-[var(--radius-bubble)] mascot-pop bg-white/80 hover:bg-white border-2 border-transparent hover:border-[var(--mascot-orange)]/20 w-full"
                onClick={() => {
                  const howItWorksSection = document.getElementById('how-it-works');
                  howItWorksSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                aria-label="Learn more about Morning Buddy"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Learn More
              </button>
            </motion.div>

            {/* Trust Signals */}
            <TrustSignals variant="hero" className="mt-6" />
          </motion.div>


        </div>
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleWaitlistSuccess}
      />
    </section>
  );
}