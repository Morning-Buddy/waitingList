import { NextRequest, NextResponse } from 'next/server'
import { waitlistOperations } from '@/lib/supabase'
import { emailService } from '@/lib/sendgrid'
import { verifyConfirmationToken } from '@/lib/tokens'
import { confirmEmailSchema } from '@/lib/types'
import { validateRuntimeEnv } from '@/lib/env'

// Configure Node.js runtime for SendGrid compatibility
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Validate environment variables at runtime
    validateRuntimeEnv()
    
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const token = searchParams.get('token')

    // Validate input parameters
    const validationResult = confirmEmailSchema.safeParse({ email, token })
    
    if (!validationResult.success) {
      return NextResponse.redirect(
        new URL('/thank-you?error=invalid-link', request.url),
        { status: 302 }
      )
    }

    const { email: validatedEmail, token: validatedToken } = validationResult.data

    // Verify the confirmation token
    if (!(await verifyConfirmationToken(validatedToken, validatedEmail))) {
      return NextResponse.redirect(
        new URL('/thank-you?error=expired-link', request.url),
        { status: 302 }
      )
    }

    // Update the waitlist entry to confirmed
    try {
      const confirmedEntry = await waitlistOperations.confirmEmail(validatedEmail)
      
      // Send welcome email after successful confirmation
      try {
        await emailService.sendWelcomeEmail({
          to: confirmedEntry.email,
          name: confirmedEntry.name
        })
      } catch (emailError) {
        // Log email error but don't fail the confirmation
        console.error('Failed to send welcome email:', emailError)
      }

      // Redirect to thank-you page with success
      return NextResponse.redirect(
        new URL('/thank-you?confirmed=true', request.url),
        { status: 302 }
      )
    } catch (dbError) {
      console.error('Database error during confirmation:', dbError)
      
      if (dbError instanceof Error && dbError.message.includes('not found')) {
        return NextResponse.redirect(
          new URL('/thank-you?error=not-found', request.url),
          { status: 302 }
        )
      }

      return NextResponse.redirect(
        new URL('/thank-you?error=server-error', request.url),
        { status: 302 }
      )
    }

  } catch (error) {
    console.error('Confirm API error:', error)
    
    return NextResponse.redirect(
      new URL('/thank-you?error=server-error', request.url),
      { status: 302 }
    )
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  )
}