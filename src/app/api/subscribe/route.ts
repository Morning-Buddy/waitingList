import { NextRequest, NextResponse } from 'next/server'
import { waitlistOperations } from '@/lib/supabase'
import { emailService } from '@/lib/sendgrid'
import { createWaitlistEntrySchema, type SubscribeResponse } from '@/lib/types'
import { generateConfirmationToken } from '@/lib/tokens'
import { validateRuntimeEnv } from '@/lib/env'

// Configure Node.js runtime for SendGrid compatibility
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest): Promise<NextResponse<SubscribeResponse>> {
  try {
    // Validate environment variables at runtime
    validateRuntimeEnv()
    
    // Parse request body
    const body = await request.json()
    
    // Validate input data using Zod schema
    const validationResult = createWaitlistEntrySchema.safeParse(body)
    
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      ).join(', ')
      
      return NextResponse.json<SubscribeResponse>(
        {
          success: false,
          message: 'Invalid input data',
          error: errors
        },
        { status: 400 }
      )
    }

    const { name, email, gdprConsent } = validationResult.data

    // Double-check GDPR consent (should be validated by schema but extra safety)
    if (!gdprConsent) {
      return NextResponse.json<SubscribeResponse>(
        {
          success: false,
          message: 'GDPR consent is required to join the waitlist'
        },
        { status: 400 }
      )
    }

    // Create waitlist entry in database
    const waitlistEntry = await waitlistOperations.create({
      name,
      email,
      gdprConsent
    })

    // Generate confirmation token for double opt-in
    const confirmationToken = await generateConfirmationToken(email)

    // Send confirmation email
    try {
      await emailService.sendConfirmationEmail({
        to: email,
        name,
        confirmationToken
      })
    } catch (emailError) {
      // Log email error but don't fail the request
      // The user is still added to the waitlist
      console.error('Failed to send confirmation email:', emailError)
      
      return NextResponse.json<SubscribeResponse>(
        {
          success: true,
          message: 'Successfully joined waitlist! Please check your email to confirm your subscription.',
          data: waitlistEntry
        },
        { status: 201 }
      )
    }

    // Success response
    return NextResponse.json<SubscribeResponse>(
      {
        success: true,
        message: 'Successfully joined waitlist! Please check your email to confirm your subscription.',
        data: waitlistEntry
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Subscribe API error:', error)

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Email address is already registered')) {
        return NextResponse.json<SubscribeResponse>(
          {
            success: false,
            message: 'This email address is already registered. Please check your inbox for the confirmation email.'
          },
          { status: 409 }
        )
      }

      if (error.message.includes('Failed to create waitlist entry')) {
        return NextResponse.json<SubscribeResponse>(
          {
            success: false,
            message: 'Unable to process your request. Please try again later.'
          },
          { status: 500 }
        )
      }
    }

    // Generic error response
    return NextResponse.json<SubscribeResponse>(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again later.'
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  )
}