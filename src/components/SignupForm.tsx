"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input"; // Using custom bubble-input
// import { LoadingSpinner } from "@/components/LoadingSpinner"; // Using custom mascot-spinner
import { signupFormSchema, type CreateWaitlistEntry, type SubscribeResponse } from "@/lib/types";
import { sanitizeInput } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SignupFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  gdprConsent?: string;
  general?: string;
}

export function SignupForm({ onSuccess, onClose }: SignupFormProps) {
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

      // For GitHub Pages deployment, we'll use a form submission service
      // You can replace this with Netlify Forms, Formspree, or similar service
      
      // Option 1: Use Formspree (recommended for GitHub Pages)
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: sanitizedData.email,
          name: sanitizedData.name || 'Anonymous',
          gdprConsent: sanitizedData.gdprConsent,
          source: 'Morning Buddy Waitlist',
        }),
      });

      if (response.ok) {
        toast.success("Successfully joined the waitlist!", {
          description: "We'll notify you when Morning Buddy is ready!",
          duration: 5000,
        });
        onSuccess();
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
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Name field (optional) */}
      <div className="space-y-3">
        <label 
          htmlFor="name" 
          className="text-sm font-semibold text-gray-800"
        >
          Name (optional)
        </label>
        <input
          id="name"
          type="text"
          placeholder="What should we call you?"
          value={formData.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          disabled={isSubmitting}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : "name-description"}
          className={cn(
            "bubble-input",
            errors.name && "bubble-error"
          )}
        />
        <p id="name-description" className="sr-only">
          Optional field for your name
        </p>
        {errors.name && (
          <p id="name-error" className="text-sm text-red-600 font-medium" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email field (required) */}
      <div className="space-y-3">
        <label 
          htmlFor="email" 
          className="text-sm font-semibold text-gray-800"
        >
          Email address <span className="text-red-500" aria-label="required">*</span>
        </label>
        <input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          disabled={isSubmitting}
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : "email-description"}
          className={cn(
            "bubble-input",
            errors.email && "bubble-error"
          )}
        />
        <p id="email-description" className="sr-only">
          Required field for your email address to receive Morning Buddy updates
        </p>
        {errors.email && (
          <p id="email-error" className="text-sm text-red-600 font-medium" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* GDPR Consent checkbox */}
      <div className="space-y-3">
        <div className="flex items-start space-x-4">
          <input
            id="gdpr-consent"
            type="checkbox"
            checked={formData.gdprConsent}
            onChange={(e) => handleInputChange("gdprConsent", e.target.checked)}
            disabled={isSubmitting}
            required
            aria-required="true"
            aria-invalid={!!errors.gdprConsent}
            aria-describedby={errors.gdprConsent ? "gdpr-error" : "gdpr-description"}
            className={cn(
              "bubble-checkbox",
              errors.gdprConsent && "border-red-500"
            )}
          />
          <div className="flex-1">
            <label 
              htmlFor="gdpr-consent" 
              className="text-sm text-gray-700 leading-6 cursor-pointer font-medium"
            >
              I agree to receive early-access emails about Morning Buddy{" "}
              <span className="text-red-500" aria-label="required">*</span>
            </label>
            <p id="gdpr-description" className="text-xs text-gray-500 mt-2 leading-relaxed">
              We&apos;ll only send you updates about Morning Buddy. You can unsubscribe at any time.
            </p>
          </div>
        </div>
        {errors.gdprConsent && (
          <p id="gdpr-error" className="text-sm text-red-600 font-medium ml-9" role="alert">
            {errors.gdprConsent}
          </p>
        )}
      </div>

      {/* General error message */}
      {errors.general && (
        <div className="bubble-card bubble-error p-4">
          <p className="text-sm font-medium" role="alert">
            {errors.general}
          </p>
        </div>
      )}

      {/* Form actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3 rounded-[var(--radius-bubble)] border-2 border-gray-300 hover:border-gray-400 transition-colors mascot-pop"
          aria-label="Cancel and close modal"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto min-w-[140px] bubble-button"
          aria-label={isSubmitting ? "Submitting form" : "Submit form to join waiting list"}
        >
          {isSubmitting ? (
            <>
              <div className="mascot-spinner mr-2" />
              <span aria-live="polite">Joining...</span>
            </>
          ) : (
            "Join Waiting List"
          )}
        </Button>
      </div>
    </form>
  );
}