import { createClient } from '@supabase/supabase-js'
import { validateRuntimeEnv } from './env'
import { 
  WaitlistEntry, 
  CreateWaitlistEntry, 
  waitlistEntrySchema,
  sanitizeInput 
} from './types'

// Lazy-loaded Supabase client to avoid initialization during build
let supabaseClient: ReturnType<typeof createClient> | null = null

function getSupabaseClient() {
  if (!supabaseClient) {
    const env = validateRuntimeEnv()
    supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  return supabaseClient
}

// Database operations with validation and error handling
export const waitlistOperations = {
  // Insert new waitlist entry
  async create(data: CreateWaitlistEntry): Promise<WaitlistEntry> {
    try {
      const supabase = getSupabaseClient()
      
      // Sanitize input data
      const sanitizedData = {
        name: sanitizeInput.name(data.name),
        email: sanitizeInput.email(data.email),
      }

      const { data: entry, error } = await supabase
        .from('waiting_list')
        .insert({
          name: sanitizedData.name,
          email: sanitizedData.email,
          confirmed: false
        })
        .select()
        .single()

      if (error) {
        // Handle specific database errors
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('Email address is already registered')
        }
        throw new Error(`Failed to create waitlist entry: ${error.message}`)
      }

      // Validate the returned data
      const validatedEntry = waitlistEntrySchema.parse(entry)
      return validatedEntry
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred while creating waitlist entry')
    }
  },

  // Update confirmation status
  async confirmEmail(email: string): Promise<WaitlistEntry> {
    try {
      const supabase = getSupabaseClient()
      const sanitizedEmail = sanitizeInput.email(email)
      
      const { data, error } = await supabase
        .from('waiting_list')
        .update({ 
          confirmed: true, 
          updated_at: new Date().toISOString() 
        })
        .eq('email', sanitizedEmail)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          throw new Error('Email address not found in waitlist')
        }
        throw new Error(`Failed to confirm email: ${error.message}`)
      }

      // Validate the returned data
      const validatedEntry = waitlistEntrySchema.parse(data)
      return validatedEntry
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred while confirming email')
    }
  },

  // Get total signup count
  async getSignupCount(): Promise<number> {
    try {
      const supabase = getSupabaseClient()
      const { count, error } = await supabase
        .from('waiting_list')
        .select('*', { count: 'exact', head: true })

      if (error) {
        throw new Error(`Failed to get signup count: ${error.message}`)
      }

      return count || 0
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred while getting signup count')
    }
  },

  // Find entry by email (for testing and admin purposes)
  async findByEmail(email: string): Promise<WaitlistEntry | null> {
    try {
      const supabase = getSupabaseClient()
      const sanitizedEmail = sanitizeInput.email(email)
      
      const { data, error } = await supabase
        .from('waiting_list')
        .select('*')
        .eq('email', sanitizedEmail)
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          return null
        }
        throw new Error(`Failed to find entry: ${error.message}`)
      }

      // Validate the returned data
      const validatedEntry = waitlistEntrySchema.parse(data)
      return validatedEntry
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred while finding entry')
    }
  }
}