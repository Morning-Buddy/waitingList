import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
import { z } from 'zod'

// Form validation schemas
export const waitlistFormSchema = z.object({
  name: z.string().optional(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email is too long'),
  gdprConsent: z
    .boolean()
    .refine(val => val === true, 'You must agree to receive early-access emails')
})

export type WaitlistFormData = z.infer<typeof waitlistFormSchema>

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  error?: string
}

// Format number with commas (for signup counter)
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

// Generate a random number for initial counter display
export function getInitialSignupCount(): number {
  // Return a believable initial count between 100-500
  return Math.floor(Math.random() * 400) + 100
}

// Email validation helper
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Sanitize user input
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}