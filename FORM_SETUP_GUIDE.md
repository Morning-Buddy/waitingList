# Morning Buddy Waitlist Form Setup Guide

## 🚨 Current Issue
The form shows "Form not found" because it's configured for Formspree but using a placeholder form ID.

## 📋 Setup Options

### Option 1: Quick Fix - Formspree (GitHub Pages Compatible)

**Pros:**
- ✅ Works with GitHub Pages (static hosting)
- ✅ Quick setup (5 minutes)
- ✅ Basic email notifications
- ✅ Form spam protection

**Cons:**
- ❌ No custom email templates
- ❌ No database storage
- ❌ Limited automation
- ❌ No double opt-in flow

**Setup Steps:**
1. Go to [formspree.io](https://formspree.io/)
2. Sign up with your email
3. Create new form
4. Set notification email to `hello@morningbuddy.co.uk`
5. Copy form ID (e.g., `xdkogkgv`)
6. Replace `YOUR_FORM_ID` in `SignupForm.tsx` with your actual form ID
7. Configure email templates in Formspree dashboard

**Cost:** Free for 50 submissions/month, $10/month for more

---

### Option 2: Full Solution - Original Setup (Requires Platform Change)

**Pros:**
- ✅ Custom email templates with Morning Buddy branding
- ✅ Supabase database storage
- ✅ Double opt-in email confirmation
- ✅ Welcome email automation
- ✅ Full control over data and emails

**Cons:**
- ❌ Requires moving from GitHub Pages to Vercel/Netlify
- ❌ More complex setup
- ❌ Need to configure multiple services

**Required Services:**
1. **Vercel/Netlify** - For API routes (free tier available)
2. **Supabase** - Database (free tier: 50MB, 2 projects)
3. **SendGrid** - Email service (free tier: 100 emails/day)

**Setup Steps:**

#### A. Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your repo
vercel

# Set environment variables in Vercel dashboard
```

#### B. Configure Supabase
1. Go to [supabase.com](https://supabase.com/)
2. Create new project
3. Run the SQL from `database/schema.sql`
4. Get your project URL and anon key

#### C. Configure SendGrid
1. Go to [sendgrid.com](https://sendgrid.com/)
2. Create account and verify sender identity for `hello@morningbuddy.co.uk`
3. Create API key
4. Set up domain authentication (optional but recommended)

#### D. Environment Variables
Add these to your deployment platform:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=hello@morningbuddy.co.uk

# Site
SITE_URL=https://your-domain.com
```

#### E. Restore API Routes
The API routes were removed for GitHub Pages. You'll need to restore:
- `/api/subscribe` - Handle form submission
- `/api/confirm` - Handle email confirmation
- `/api/count` - Show signup count

---

### Option 3: Hybrid Solution - Netlify Forms

**Pros:**
- ✅ Works with static hosting
- ✅ Better than Formspree integration
- ✅ Custom success pages
- ✅ Spam protection

**Cons:**
- ❌ Requires moving to Netlify
- ❌ Limited email customization

**Setup:**
1. Deploy to Netlify
2. Add `netlify` attribute to form
3. Configure form notifications

---

## 🎯 Recommendation

**For immediate fix:** Use Option 1 (Formspree)
**For full functionality:** Use Option 2 (Vercel + Supabase + SendGrid)

## 📧 Email Flow Design

### Current Broken Flow:
User submits form → ❌ Error

### Formspree Flow:
User submits form → Formspree → Email to hello@morningbuddy.co.uk

### Full Flow (Original Design):
1. User submits form
2. Data saved to Supabase (unconfirmed)
3. Confirmation email sent via SendGrid
4. User clicks confirmation link
5. Email marked as confirmed in database
6. Welcome email sent
7. User added to mailing list

## 🔧 Quick Fix Implementation

Replace the form ID in `SignupForm.tsx`:

```typescript
const response = await fetch('https://formspree.io/f/YOUR_ACTUAL_FORM_ID', {
```

Then test the form - it should work immediately!