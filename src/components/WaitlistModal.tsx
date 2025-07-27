"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SignupForm } from "@/components/SignupForm";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function WaitlistModal({ isOpen, onClose, onSuccess }: WaitlistModalProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleSuccess = () => {
    // Trigger mascot cheer animation
    onSuccess?.();
    
    // Close modal and redirect to thank you page
    onClose();
    router.push('/thank-you');
  };

  // Enhanced focus management with focus trapping
  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    // Get all focusable elements within the modal
    const getFocusableElements = () => {
      return modal.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
      ) as NodeListOf<HTMLElement>;
    };

    // Focus the first focusable element when modal opens
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      // Small delay to ensure modal is fully rendered
      setTimeout(() => focusableElements[0].focus(), 100);
    }

    // Trap focus within modal
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTabKey);

    return () => {
      modal.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        ref={modalRef}
        className="bubble-modal focus:outline-none"
        aria-labelledby="waitlist-modal-title"
        aria-describedby="waitlist-modal-description"
        role="dialog"
        aria-modal="true"
        onOpenAutoFocus={(e) => {
          // Prevent default auto-focus to handle it manually
          e.preventDefault();
        }}
      >
        <DialogHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img 
              src="/Logo.svg" 
              alt="Morning Buddy Logo" 
              className="w-16 h-16 mascot-float"
            />
          </div>
          <DialogTitle 
            id="waitlist-modal-title"
            className="text-2xl font-bold text-gray-900"
          >
            <span>Join the </span>
            <span className="mascot-gradient-text">Morning Buddy</span>
            <span> Waiting List</span>
          </DialogTitle>
          <DialogDescription 
            id="waitlist-modal-description"
            className="text-gray-600 leading-relaxed text-base"
          >
            Be the first to wake up with your AI buddy! We&apos;ll send you early access 
            and keep you updated on our progress.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-8">
          <SignupForm onSuccess={handleSuccess} onClose={onClose} />
        </div>

        {/* Privacy note with mascot styling */}
        <div className="mt-6 pt-6 border-t-2 border-[var(--mascot-orange)]/10">
          <p className="text-sm text-gray-500 text-center leading-relaxed">
            We respect your privacy. Your email will only be used for Morning Buddy updates 
            and you can unsubscribe at any time.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}