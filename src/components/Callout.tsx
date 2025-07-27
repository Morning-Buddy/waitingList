"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Build a Buddy",
    description: "Customise the buddies voice and personality to match the people/characters you love",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    number: "02", 
    title: "Set Schedule",
    description: "Set a time you want to be woken up and how, with a funny conversation or maybe something more motivational",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    number: "03",
    title: "Wake Up Happy", 
    description: "A better way to wake up, start your day with a boost from a buddy",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

export function Callout() {
  return (
    <section 
      id="how-it-works"
      className="py-20 bg-white"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 motion-reduce:transition-none"
        >
          <h2 
            id="how-it-works-heading"
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            How It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
              Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to transform your mornings with your AI buddy
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12" role="list">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative text-center group motion-reduce:transition-none"
              role="listitem"
            >
              {/* Step number background */}
              <div 
                className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity duration-300 motion-reduce:transition-none"
                aria-hidden="true"
              />
              
              {/* Step number */}
              <div className="relative mb-6">
                <span 
                  className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 opacity-20"
                  aria-hidden="true"
                >
                  {step.number}
                </span>
              </div>

              {/* Icon container */}
              <div
                className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300 motion-reduce:transition-none"
                role="img"
                aria-label={`Step ${step.number} icon`}
              >
                {step.icon}
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300 motion-reduce:transition-none">
                  <span className="sr-only">Step {step.number}: </span>
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>


            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16 motion-reduce:transition-none"
        >
          <p className="text-lg text-gray-600 mb-6">
            Ready to revolutionize your mornings?
          </p>
          <button
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg professional-button gradient-button focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            onClick={() => {
              // Scroll to top and trigger the main CTA
              window.scrollTo({ top: 0, behavior: 'smooth' });
              // Dispatch a custom event to open the modal
              window.dispatchEvent(new CustomEvent('openWaitlistModal'));
            }}
            aria-label="Get started with Morning Buddy - join the waiting list"
          >
            Get Started
          </button>
        </motion.div>
      </div>
    </section>
  );
}