"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const faqData = [
  {
    id: "product-details",
    question: "What exactly is Morning Buddy?",
    answer: "Morning Buddy is an AI-powered alarm clock that wakes you up with a personalized phone call instead of a jarring alarm sound. Your AI buddy can have conversations with you, share motivational messages, or even tell jokes to help you start your day on a positive note. It's like having a friendly companion who genuinely cares about making your mornings better."
  },
  {
    id: "voice-customization", 
    question: "Can I customize my buddy's voice and personality?",
    answer: "Absolutely! You can customize your buddy's voice, personality traits, conversation style, and even base it on your favorite characters or people. Whether you want a cheerful motivational coach, a witty comedian, or a calm meditation guide, you can tailor your Morning Buddy to match your preferences and what motivates you most."
  },
  {
    id: "launch-timeline",
    question: "When will Morning Buddy be available?",
    answer: "We're currently in development and planning to launch our pre-alpha version in early 2025. By joining our waiting list, you'll be among the first to get early access and help shape the product with your feedback. We'll keep you updated on our progress and notify you as soon as spots become available."
  },
  {
    id: "pricing",
    question: "How much will Morning Buddy cost?",
    answer: "We're still finalizing our pricing structure, but we're committed to making Morning Buddy accessible and affordable. Early access users will get special pricing benefits. We're considering a subscription model that covers the AI processing and phone call costs, with different tiers based on usage. More details will be shared with our waiting list members first."
  },
  {
    id: "how-it-works",
    question: "How does the wake-up call actually work?",
    answer: "Morning Buddy calls your phone at your scheduled wake-up time using advanced AI voice technology. The call feels natural and conversational - your buddy might ask how you slept, share the weather, give you encouragement for the day ahead, or engage in whatever type of conversation you've configured. You can set different conversation styles for different days or moods."
  },
  {
    id: "privacy-security",
    question: "Is my personal information and sleep data secure?",
    answer: "Privacy and security are our top priorities. We use enterprise-grade encryption for all data transmission and storage. Your personal information, preferences, and conversation history are never shared with third parties. You have full control over your data and can delete it at any time. We follow strict data protection regulations including GDPR compliance."
  }
];

interface FaqItemProps {
  item: typeof faqData[0];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FaqItem({ item, isOpen, onToggle, index }: FaqItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300 motion-reduce:transition-none"
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-6 text-left focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 hover:bg-amber-50/50 transition-colors duration-200 motion-reduce:transition-none"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        id={`faq-question-${item.id}`}
        aria-describedby={isOpen ? undefined : `faq-hint-${item.id}`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 pr-4">
            {item.question}
          </h3>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-shrink-0 motion-reduce:transition-none"
          >
            <svg
              className="w-6 h-6 text-amber-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </div>
        {!isOpen && (
          <span id={`faq-hint-${item.id}`} className="sr-only">
            Click to expand answer
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden motion-reduce:transition-none"
          >
            <div
              id={`faq-answer-${item.id}`}
              role="region"
              aria-labelledby={`faq-question-${item.id}`}
              className="px-6 pb-6 text-gray-600 leading-relaxed"
            >
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Faq() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section 
      id="faq"
      className="py-20 bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-yellow-50/50"
      aria-labelledby="faq-heading"
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
            id="faq-heading"
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Frequently Asked{" "}
            <span className="mascot-gradient-text">
              Questions
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about Morning Buddy and how it works
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4" role="list">
          {faqData.map((item, index) => (
            <div key={item.id} role="listitem">
              <FaqItem
                item={item}
                isOpen={openItems.has(item.id)}
                onToggle={() => toggleItem(item.id)}
                index={index}
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16 motion-reduce:transition-none"
        >
          <p className="text-lg text-gray-600 mb-6">
            Still have questions? We&apos;d love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
              onClick={() => {
                // Trigger the waitlist modal
                window.dispatchEvent(new Event('openWaitlistModal'));
              }}
              aria-label="Join the Morning Buddy waiting list"
            >
              Join Waiting List
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:hello@morningbuddy.co.uk"
              className="px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium text-gray-700 hover:text-amber-600 transition-colors duration-300 flex items-center justify-center gap-2 border border-gray-300 rounded-full hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
              aria-label="Send us an email at hello@morningbuddy.co.uk"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}