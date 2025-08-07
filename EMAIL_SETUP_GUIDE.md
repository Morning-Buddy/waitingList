# Email Setup Guide for Morning Buddy

## Current Issue
Your forms use Formspree which collects submissions but doesn't send emails from your custom domain (`hello@morningbuddy.co.uk`).

## Recommended Solution: Resend

### Why Resend?
- ✅ Send from your custom domain
- ✅ Developer-friendly API
- ✅ Great deliverability
- ✅ Free tier: 3,000 emails/month
- ✅ Simple setup

### Setup Steps

#### 1. Sign up for Resend
1. Go to [resend.com](https://resend.com)
2. Sign up with your email
3. Verify your account

#### 2. Add Your Domain
1. In Resend dashboard, go to "Domains"
2. Click "Add Domain"
3. Enter `morningbuddy.co.uk`
4. Add the DNS records they provide to your domain registrar:
   ```
   Type: TXT
   Name: @
   Value: [Resend will provide this]
   
   Type: CNAME
   Name: resend._domainkey
   Value: [Resend will provide this]
   ```

#### 3. Get API Key
1. Go to "API Keys" in Resend dashboard
2. Create new API key
3. Copy the key (starts with `re_`)

#### 4. Update Your Code

Replace the Formspree implementation with Resend:

```typescript
// In your form components, replace the fetch call:
const response = await fetch('/api/subscribe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: sanitizedData.email,
    name: sanitizedData.name || 'Anonymous',
    gdprConsent: sanitizedData.gdprConsent,
  }),
});
```

#### 5. Create API Route

Create `src/app/api/subscribe/route.ts`:

```typescript
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, name, gdprConsent } = await request.json();

    // Send confirmation email to user
    await resend.emails.send({
      from: 'hello@morningbuddy.co.uk',
      to: email,
      subject: 'Welcome to Morning Buddy Waitlist! 🌅',
      html: `
        <h1>Welcome to Morning Buddy, ${name || 'friend'}!</h1>
        <p>Thanks for joining our waitlist. We'll notify you when Morning Buddy is ready!</p>
        <p>Best regards,<br>The Morning Buddy Team</p>
      `,
    });

    // Send notification to you
    await resend.emails.send({
      from: 'hello@morningbuddy.co.uk',
      to: 'your-email@example.com', // Your email
      subject: 'New Waitlist Signup',
      html: `
        <h2>New waitlist signup!</h2>
        <p><strong>Name:</strong> ${name || 'Not provided'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>GDPR Consent:</strong> ${gdprConsent ? 'Yes' : 'No'}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
```

#### 6. Add Environment Variable

Add to your `.env.local`:
```
RESEND_API_KEY=re_your_api_key_here
```

#### 7. Install Resend Package

```bash
npm install resend
```

## Alternative: Quick Formspree Fix

If you want to stick with Formspree for now:

1. **Upgrade to Formspree Gold** ($10/month)
2. **Set up email notifications** in your Formspree dashboard
3. **Configure autoresponder** to send from your domain

## DNS Requirements

For any custom email solution, you'll need these DNS records:

```
Type: MX
Name: @
Value: [Your email provider's MX record]
Priority: 10

Type: TXT
Name: @
Value: "v=spf1 include:[provider-spf] ~all"

Type: TXT
Name: _dmarc
Value: "v=DMARC1; p=none; rua=mailto:hello@morningbuddy.co.uk"
```

## Next Steps

1. Choose your preferred solution (Resend recommended)
2. Set up the service
3. Update your DNS records
4. Update your code
5. Test the email functionality

Would you like me to implement the Resend solution for you?