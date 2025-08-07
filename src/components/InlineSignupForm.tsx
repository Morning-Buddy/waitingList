"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TrustSignals } from "./TrustSignals";
import { signupFormSchema, type CreateWaitlistEntry } from "@/lib/types";
import { sanitizeInput } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface FormErrors {
  name?: string;
  email?: string;
  gdprConsent?: string;
  general?: string;
}

export function InlineSignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateWaitlistEntry>({
    name: "",
    email: "",
    gdprConsent: false,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Prepare data for validation - convert empty name to undefined
    const dataToValidate = {
      ...formData,
      name: formData.name?.trim() === '' ? undefined : formData.name
    };
    
    // Validate using Zod schema
    const result = signupFormSchema.safeParse(dataToValidate);
    
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormErrors;
        // Only set the first error for each field
        if (!newErrors[field]) {
          newErrors[field] = issue.message;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CreateWaitlistEntry, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateForm();
    
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Sanitize input data
      const sanitizedData: CreateWaitlistEntry = {
        name: formData.name?.trim() === '' ? undefined : sanitizeInput.name(formData.name),
        email: sanitizeInput.email(formData.email),
        gdprConsent: formData.gdprConsent,
      };

      // Use Formspree for form submission
      const response = await fetch('https://formspree.io/f/myzpjgnk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: sanitizedData.email,
          name: sanitizedData.name || 'Anonymous',
          gdprConsent: sanitizedData.gdprConsent,
          source: 'Morning Buddy Waitlist - Inline Form',
        }),
      });

      if (response.ok) {
        toast.success("Successfully joined the waitlist!", {
          description: "We'll get in touch when Morning Buddy is ready!",
          duration: 5000,
        });
        
        // Redirect to thank you page
        router.push('/thank-you');
      } else {
        // Handle error cases
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || "Failed to join waitlist. Please try again.";
        
        setErrors({ general: errorMessage });
        toast.error("Signup failed", {
          description: errorMessage,
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = "Unable to connect to our servers. Please check your internet connection and try again.";
      
      setErrors({ general: errorMessage });
      toast.error("Connection error", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to transform your mornings?
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Join thousands of early risers who are excited about waking up with Morning Buddy. 
              Get early access and exclusive perks when we launch.
            </p>
          </div>

          {/* Form */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[var(--radius-bubble)] p-8 border-2 border-[var(--mascot-orange)]/10 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Name field (optional) */}
              <div className="space-y-3">
                <label 
                  htmlFor="inline-name" 
                  className="text-sm font-semibold text-gray-800"
                >
                  Name (optional)
                </label>
                <input
                  id="inline-name"
                  type="text"
                  placeholder="What should we call you?"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "inline-name-error" : "inline-name-description"}
                  className={cn(
                    "bubble-input",
                    errors.name && "bubble-error"
                  )}
                />
                <p id="inline-name-description" className="sr-only">
                  Optional field for your name
                </p>
                {errors.name && (
                  <p id="inline-name-error" className="text-sm text-red-600 font-medium" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email field (required) */}
              <div className="space-y-3">
                <label 
                  htmlFor="inline-email" 
                  className="text-sm font-semibold text-gray-800"
                >
                  Email address <span className="text-red-500" aria-label="required">*</span>
                </label>
                <input
                  id="inline-email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={isSubmitting}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "inline-email-error" : "inline-email-description"}
                  className={cn(
                    "bubble-input",
                    errors.email && "bubble-error"
                  )}
                />
                <p id="inline-email-description" className="sr-only">
                  Required field for your email address so we can contact you about Morning Buddy
                </p>
                {errors.email && (
                  <p id="inline-email-error" className="text-sm text-red-600 font-medium" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* GDPR Consent checkbox */}
              <div className="space-y-3">
                <div className="flex items-start space-x-4">
                  <input
                    id="inline-gdpr-consent"
                    type="checkbox"
                    checked={formData.gdprConsent}
                    onChange={(e) => handleInputChange("gdprConsent", e.target.checked)}
                    disabled={isSubmitting}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.gdprConsent}
                    aria-describedby={errors.gdprConsent ? "inline-gdpr-error" : "inline-gdpr-description"}
                    className={cn(
                      "bubble-checkbox",
                      errors.gdprConsent && "border-red-500"
                    )}
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor="inline-gdpr-consent" 
                      className="text-sm text-gray-700 leading-6 cursor-pointer font-medium"
                    >
                      I agree to be contacted about Morning Buddy{" "}
                      <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <p id="inline-gdpr-description" className="text-xs text-gray-500 mt-2 leading-relaxed">
                      We&apos;ll only contact you about Morning Buddy updates.
                    </p>
                  </div>
                </div>
                {errors.gdprConsent && (
                  <p id="inline-gdpr-error" className="text-sm text-red-600 font-medium ml-9" role="alert">
                    {errors.gdprConsent}
                  </p>
                )}
              </div>

              {/* Trust Signals */}
              <TrustSignals variant="form" />

              {/* General error message */}
              {errors.general && (
                <div className="bubble-card bubble-error p-4">
                  <p className="text-sm font-medium" role="alert">
                    {errors.general}
                  </p>
                </div>
              )}

              {/* Submit button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bubble-button text-lg py-4"
                  aria-label={isSubmitting ? "Submitting form" : "Submit form to join waiting list"}
                >
                  {isSubmitting ? (
                    <>
                      <div className="mascot-spinner mr-2" />
                      <span aria-live="polite">Joining...</span>
                    </>
                  ) : (
                    "Join the Waitlist - Get Early Access"
                  )}
                </Button>
              </div>
            </form>

            {/* Privacy note */}
            <div className="mt-6 pt-6 border-t-2 border-[var(--mascot-orange)]/10">
              <p className="text-sm text-gray-500 text-center leading-relaxed">
                We respect your privacy. Your email will only be used to contact you about Morning Buddy updates.
              </p>
            </div>
          </div>

          {/* Alternative option */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Prefer a quick signup?{" "}
              <button
                onClick={() => {
                  // Dispatch custom event to open modal
                  window.dispatchEvent(new CustomEvent('openWaitlistModal'));
                }}
                className="text-[var(--mascot-orange)] hover:text-[var(--mascot-orange)]/80 font-medium underline focus:outline-none focus:ring-2 focus:ring-[var(--mascot-orange)] focus:ring-offset-2 rounded"
              >
                Use our quick modal form
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}