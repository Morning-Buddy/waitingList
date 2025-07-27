import sgMail from '@sendgrid/mail'
import { SENDGRID_API_KEY, SITE_URL } from './env'

// Initialize SendGrid
sgMail.setApiKey(SENDGRID_API_KEY)

export interface EmailData {
  to: string
  name?: string
  confirmationToken: string
}

export const emailService = {
  // Send double opt-in confirmation email
  async sendConfirmationEmail(data: EmailData) {
    const confirmationUrl = `${SITE_URL}/api/confirm?token=${data.confirmationToken}&email=${encodeURIComponent(data.to)}`
    
    const msg = {
      to: data.to,
      from: {
        email: 'hello@morningbuddy.co.uk',
        name: 'Morning Buddy'
      },
      subject: 'Confirm your Morning Buddy waitlist signup',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirm your Morning Buddy signup</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f59e0b; margin: 0; font-size: 28px;">🌅 Morning Buddy</h1>
          </div>
          
          <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #92400e; margin-top: 0;">Welcome${data.name ? `, ${data.name}` : ''}! 👋</h2>
            <p style="margin-bottom: 0; color: #92400e;">Thanks for joining our waitlist! We're excited to help you wake up happier.</p>
          </div>
          
          <p>To complete your signup and receive updates about Morning Buddy's launch, please confirm your email address:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" 
               style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Confirm Email Address
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${confirmationUrl}" style="color: #f59e0b; word-break: break-all;">${confirmationUrl}</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #666; text-align: center;">
            You're receiving this email because you signed up for the Morning Buddy waitlist.<br>
            If you didn't sign up, you can safely ignore this email.
          </p>
        </body>
        </html>
      `,
      text: `
Welcome${data.name ? `, ${data.name}` : ''}!

Thanks for joining the Morning Buddy waitlist! We're excited to help you wake up happier.

To complete your signup and receive updates about Morning Buddy's launch, please confirm your email address by clicking this link:

${confirmationUrl}

If you didn't sign up for this, you can safely ignore this email.

Best regards,
The Morning Buddy Team
      `.trim()
    }

    try {
      await sgMail.send(msg)
      return { success: true }
    } catch (error) {
      console.error('SendGrid error:', error)
      throw new Error('Failed to send confirmation email')
    }
  },

  // Send welcome email after confirmation
  async sendWelcomeEmail(data: { to: string; name?: string }) {
    const msg = {
      to: data.to,
      from: {
        email: 'hello@morningbuddy.co.uk',
        name: 'Morning Buddy'
      },
      subject: 'Welcome to Morning Buddy! 🌅',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Morning Buddy</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f59e0b; margin: 0; font-size: 28px;">🌅 Morning Buddy</h1>
          </div>
          
          <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #92400e; margin-top: 0;">You're all set${data.name ? `, ${data.name}` : ''}! ✅</h2>
            <p style="margin-bottom: 0; color: #92400e;">Your email has been confirmed and you're now on our waitlist.</p>
          </div>
          
          <p>We'll keep you updated on our progress and let you know as soon as Morning Buddy is ready for early access.</p>
          
          <p>In the meantime, feel free to share Morning Buddy with friends who might also want a better way to wake up!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${SITE_URL}" 
               style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Visit Morning Buddy
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #666; text-align: center;">
            Thanks for being an early supporter!<br>
            The Morning Buddy Team
          </p>
        </body>
        </html>
      `,
      text: `
You're all set${data.name ? `, ${data.name}` : ''}!

Your email has been confirmed and you're now on our waitlist.

We'll keep you updated on our progress and let you know as soon as Morning Buddy is ready for early access.

In the meantime, feel free to share Morning Buddy with friends who might also want a better way to wake up!

Visit us at: ${SITE_URL}

Thanks for being an early supporter!
The Morning Buddy Team
      `.trim()
    }

    try {
      await sgMail.send(msg)
      return { success: true }
    } catch (error) {
      console.error('SendGrid error:', error)
      throw new Error('Failed to send welcome email')
    }
  }
}

export default emailService