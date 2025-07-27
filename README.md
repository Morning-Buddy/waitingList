# Morning Buddy - Waiting List

A public waiting list site to get feedback and test users for Alpha and Betas of the Morning Buddy app.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## About Morning Buddy

Morning Buddy is an AI-powered alarm clock that wakes you up with a personalized phone call instead of a jarring alarm sound. Your AI buddy can have conversations with you, share motivational messages, or even tell jokes to help you start your day on a positive note.

## Features

- 🎨 Professional, accessible design with no emojis
- 📱 Responsive design optimized for all devices
- ♿ WCAG compliant accessibility features
- 🎭 Interactive sun mascot with eye tracking
- 📧 Email waitlist with double opt-in confirmation
- 🗄️ Supabase database integration
- 📨 SendGrid email system
- 🧪 Comprehensive test suite (Jest + Playwright)
- 🚀 Optimized for performance and SEO

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=hello@morningbuddy.co.uk

# Site
SITE_URL=https://morningbuddy.co.uk
```

## Testing

Run the test suite:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# All tests
npm run test:all
```

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
