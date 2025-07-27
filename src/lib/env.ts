import { z } from 'zod'

// Environment variable schema
const envSchema = z.object({
  // Supabase
  SUPABASE_URL: z.string().url('Invalid Supabase URL').optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required').optional(),
  
  // SendGrid
  SENDGRID_API_KEY: z.string().min(1, 'SendGrid API key is required').optional(),
  
  // Analytics
  PLAUSIBLE_DOMAIN: z.string().min(1, 'Plausible domain is required').optional(),
  
  // Site
  SITE_URL: z.string().url('Invalid site URL').optional(),
  
  // Optional environment variables
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Runtime environment schema (stricter validation for runtime)
const runtimeEnvSchema = z.object({
  SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required'),
  SENDGRID_API_KEY: z.string().min(1, 'SendGrid API key is required'),
  PLAUSIBLE_DOMAIN: z.string().min(1, 'Plausible domain is required'),
  SITE_URL: z.string().url('Invalid site URL'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Validate environment variables
function validateEnv() {
  // During build time, use relaxed validation
  if (process.env.NODE_ENV === undefined || process.env.NEXT_PHASE === 'phase-production-build') {
    return envSchema.parse(process.env)
  }
  
  // During runtime, use strict validation
  try {
    return runtimeEnvSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join('\n')
      throw new Error(`Environment validation failed:\n${missingVars}`)
    }
    throw error
  }
}

// Validate runtime environment (for use in API routes)
export function validateRuntimeEnv() {
  try {
    return runtimeEnvSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join('\n')
      throw new Error(`Environment validation failed:\n${missingVars}`)
    }
    throw error
  }
}

// Export validated environment variables
export const env = validateEnv()

// Type definitions for environment variables
export type Environment = z.infer<typeof envSchema>

// Helper function to check if we're in development
export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'

// Export individual environment variables for convenience
export const {
  SUPABASE_URL = process.env.SUPABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '',
  PLAUSIBLE_DOMAIN = process.env.PLAUSIBLE_DOMAIN || '',
  SITE_URL = process.env.SITE_URL || 'http://localhost:3000',
  NODE_ENV = process.env.NODE_ENV || 'development'
} = env