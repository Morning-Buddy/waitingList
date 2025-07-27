import { z } from 'zod'

// Core data interfaces
export interface WaitlistEntry {
  id: string
  name?: string
  email: string
  confirmed: boolean
  created_at: string
  updated_at: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface SubscribeResponse extends ApiResponse<WaitlistEntry> {
  success: boolean
  message: string
  data?: WaitlistEntry
  error?: string
}

export interface CountResponse extends ApiResponse<{ count: number }> {
  success: boolean
  message: string
  data?: { count: number }
  error?: string
}

// Validation schemas using Zod
export const waitlistEntrySchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  email: z.string().email('Invalid email address'),
  confirmed: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const createWaitlistEntrySchema = z.object({
  name: z.string().trim().max(100, 'Name must be less than 100 characters').optional(),
  email: z.string().min(1, 'Email is required').email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  gdprConsent: z.boolean().refine(val => val === true, {
    message: 'GDPR consent is required'
  })
})

export const confirmEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  token: z.string().min(1, 'Confirmation token is required')
})

export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  error: z.string().optional(),
})

// Type inference from schemas
export type CreateWaitlistEntry = z.infer<typeof createWaitlistEntrySchema>
export type ConfirmEmail = z.infer<typeof confirmEmailSchema>
export type ValidatedWaitlistEntry = z.infer<typeof waitlistEntrySchema>

// Form validation schemas
export const signupFormSchema = createWaitlistEntrySchema

// Email validation helper
export const isValidEmail = (email: string): boolean => {
  try {
    z.string().email().parse(email)
    return true
  } catch {
    return false
  }
}

// Sanitization helpers
export const sanitizeInput = {
  name: (name?: string): string | undefined => {
    if (!name) return undefined
    return name.trim().slice(0, 100)
  },
  
  email: (email: string): string => {
    return email.trim().toLowerCase().slice(0, 255)
  }
}