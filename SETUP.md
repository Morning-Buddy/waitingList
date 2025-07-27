# Morning Buddy Landing Page Setup Guide

This guide covers setting up the external service integrations for the Morning Buddy landing page.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Accounts for Supabase, SendGrid, and Plausible

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

### Required Environment Variables

#### Supabase Configuration
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### SendGrid Configuration
```
SENDGRID_API_KEY=SG.your-sendgrid-api-key
```

#### Analytics Configuration
```
PLAUSIBLE_DOMAIN=morningbuddy.co.uk
```

#### Site Configuration
```
SITE_URL=https://morningbuddy.co.uk
```

## Service Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and service role key
3. Run the database schema setup:
   ```bash
   # Copy the contents of database/schema.sql
   # Paste and run in Supabase SQL Editor
   ```
4. The schema creates:
   - `waiting_list` table with proper indexes
   - Row Level Security policies
   - Automatic timestamp updates
   - Analytics view for signup statistics

### 2. SendGrid Setup

1. Create account at [sendgrid.com](https://sendgrid.com)
2. Go to Settings > API Keys
3. Create a new API key with "Mail Send" permissions
4. Verify your sender domain/email:
   - Go to Settings > Sender Authentication
   - Verify your domain or single sender email
   - Use `hello@morningbuddy.co.uk` as the from address

### 3. Plausible Analytics Setup

1. Create account at [plausible.io](https://plausible.io)
2. Add your domain (`morningbuddy.co.uk`)
3. The analytics script will automatically load in production
4. Custom events are tracked for:
   - Modal interactions
   - Form submissions
   - CTA clicks
   - FAQ interactions
   - Social sharing
   - Email confirmations

## Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## File Structure

The external service integrations are organized as follows:

```
src/lib/
├── env.ts          # Environment variable validation
├── supabase.ts     # Database client and operations
├── sendgrid.ts     # Email service configuration
├── analytics.ts    # Plausible analytics setup
├── tokens.ts       # Email confirmation token utilities
└── utils.ts        # Form validation and utilities

src/components/
└── PlausibleScript.tsx  # Analytics script component

database/
└── schema.sql      # Database schema for Supabase
```

## Key Features

### Database Operations
- Create waitlist entries
- Email confirmation tracking
- Signup count analytics
- Automatic timestamp updates

### Email Service
- Double opt-in confirmation emails
- Welcome emails after confirmation
- HTML and text email templates
- Error handling and retry logic

### Analytics Tracking
- Privacy-focused (no cookies)
- Custom event tracking
- Conversion funnel analysis
- Production-only tracking

### Security
- Environment variable validation
- Secure token generation
- Row-level security in database
- Input sanitization and validation

## Testing

The integrations include proper error handling and can be tested:

1. **Database**: Test with invalid credentials to verify error handling
2. **Email**: Use SendGrid's test mode for development
3. **Analytics**: Events only track in production environment

## Deployment

When deploying to Vercel:

1. Add all environment variables in Vercel dashboard
2. Ensure Supabase allows connections from Vercel IPs
3. Verify SendGrid sender authentication
4. Test email confirmation flow end-to-end

## Troubleshooting

### Common Issues

1. **Environment Variables**: Use the validation in `env.ts` to check for missing vars
2. **Database Connection**: Check Supabase project status and API keys
3. **Email Delivery**: Verify SendGrid sender authentication
4. **Analytics**: Plausible only loads in production builds

### Error Handling

All services include comprehensive error handling:
- Database operations return descriptive error messages
- Email service handles SendGrid API failures gracefully
- Analytics fails silently if script doesn't load
- Environment validation provides clear error messages