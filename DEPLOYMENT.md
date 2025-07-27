# Deployment Guide

This document outlines the deployment process for the Morning Buddy landing page.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Domain**: Register `morningbuddy.co.uk` (or your chosen domain)
3. **Cloudflare Account**: For DNS and SSL management
4. **Environment Variables**: All required environment variables configured

## Environment Variables

### Required for Production

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# SendGrid Configuration
SENDGRID_API_KEY=SG.your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@morningbuddy.co.uk
SENDGRID_FROM_NAME=Morning Buddy

# Site Configuration
SITE_URL=https://morningbuddy.co.uk
NEXT_PUBLIC_SITE_URL=https://morningbuddy.co.uk

# Analytics
PLAUSIBLE_DOMAIN=morningbuddy.co.uk

# Production
NODE_ENV=production
```

## Deployment Steps

### 1. Initial Vercel Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
npm run deploy:preview

# Deploy to production
npm run deploy:production
```

### 2. Configure Custom Domain

1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains" section
3. Add your custom domain: `morningbuddy.co.uk`
4. Add www redirect: `www.morningbuddy.co.uk` → `morningbuddy.co.uk`

### 3. Cloudflare DNS Configuration

#### DNS Records
```
Type    Name    Content                     TTL
A       @       76.76.19.61                Auto
A       www     76.76.19.61                Auto
CNAME   *       cname.vercel-dns.com       Auto
```

#### SSL/TLS Settings
- SSL/TLS encryption mode: **Full (strict)**
- Always Use HTTPS: **On**
- Minimum TLS Version: **1.2**
- TLS 1.3: **On**

#### Performance Settings
- Auto Minify: **HTML, CSS, JS all enabled**
- Brotli: **On**
- Early Hints: **On**
- HTTP/2 to Origin: **On**

### 4. Environment Variables in Vercel

1. Go to Project Settings → Environment Variables
2. Add all required environment variables
3. Set appropriate environments (Production, Preview, Development)

### 5. Build & Deployment Settings

#### Build Configuration
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm ci`
- **Development Command**: `npm run dev`

#### Function Configuration
- **Node.js Version**: 18.x
- **Regions**: All (for global edge deployment)

## Performance Optimization

### 1. Static Generation
- Landing page is statically generated with 1-hour revalidation
- Thank you page is fully static for instant loading
- Robots.txt and sitemap.xml are statically generated
- API routes use appropriate runtime (edge/nodejs) based on requirements

### 2. Caching Strategy
- Static assets: 1 year cache with immutable headers
- JavaScript/CSS bundles: Long-term caching with versioning
- API responses: No cache for dynamic data, optimized cache for count API
- Pages: Static generation with ISR (Incremental Static Regeneration)
- CDN-level caching with stale-while-revalidate

### 3. Edge Runtime Optimization
- `/api/count` uses edge runtime for global performance and caching
- `/api/subscribe` and `/api/confirm` use Node.js runtime for SendGrid compatibility
- Optimized memory allocation per function type

### 4. Bundle Optimization
- Package imports optimized for tree-shaking
- Compression enabled at build time
- Image optimization with WebP/AVIF support
- Font loading optimization with display swap

## Monitoring & Analytics

### 1. Vercel Analytics
- Real-time performance metrics
- Core Web Vitals monitoring
- Function execution metrics

### 2. Plausible Analytics
- Privacy-focused analytics
- Conversion tracking
- No cookies required

### 3. Performance Monitoring
```bash
# Run performance audit
npm run performance:audit

# Run accessibility audit
npm run accessibility:audit

# Run Lighthouse CI
npm run lighthouse

# Test edge runtime performance (requires running server)
npm run performance:edge

# Verify build optimizations
npm run verify:optimizations

# Run optimized deployment with all checks
npm run deploy:optimized

# Deploy to production with optimization checks
npm run deploy:optimized:prod
```

## Continuous Integration

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      - run: npm run test:all
      - run: npm run lighthouse
      
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Rollback Strategy

### Quick Rollback
```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote [deployment-url] --scope=your-team
```

### Database Rollback
- Supabase provides point-in-time recovery
- Always test migrations in staging first

## Security Checklist

- [ ] Environment variables are properly configured
- [ ] HTTPS is enforced (Cloudflare + Vercel)
- [ ] Security headers are configured (see `next.config.ts`)
- [ ] API routes have proper validation and rate limiting
- [ ] Database has Row Level Security enabled
- [ ] SendGrid API key has minimal required permissions

## Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to First Byte**: < 600ms
- **JavaScript Bundle**: < 500KB
- **Lighthouse Score**: > 90

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables are set
   - Verify all dependencies are installed
   - Check TypeScript errors

2. **API Route Errors**
   - Verify Supabase connection
   - Check SendGrid API key permissions
   - Review function logs in Vercel dashboard

3. **Performance Issues**
   - Run bundle analyzer: `npm run build:analyze`
   - Check Core Web Vitals in Vercel Analytics
   - Review Lighthouse recommendations

### Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Cloudflare DNS Documentation](https://developers.cloudflare.com/dns/)