# Deployment Guide

This site is a static HTML page that can be deployed anywhere. Here are the most common options:

## GitHub Pages (Recommended)

The site is already configured for GitHub Pages deployment.

1. Push your code to GitHub
2. Go to Settings > Pages
3. Under "Build and deployment", select "GitHub Actions"
4. The site will automatically deploy on every push to main/master

Your site will be available at: `https://[username].github.io/[repository-name]/`

## Netlify

1. Sign up at [netlify.com](https://netlify.com)
2. Click "Add new site" > "Import an existing project"
3. Connect your GitHub repository
4. Build settings:
   - Build command: (leave empty)
   - Publish directory: `.`
5. Click "Deploy site"

## Vercel

1. Sign up at [vercel.com](https://vercel.com)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Framework Preset: "Other"
5. Build settings:
   - Build Command: (leave empty)
   - Output Directory: `.`
6. Click "Deploy"

## Cloudflare Pages

1. Sign up at [pages.cloudflare.com](https://pages.cloudflare.com)
2. Click "Create a project"
3. Connect your GitHub repository
4. Build settings:
   - Build command: (leave empty)
   - Build output directory: `/`
5. Click "Save and Deploy"

## Traditional Web Hosting

Upload these files via FTP/SFTP:
- `index.html`
- `public/` folder

Make sure the `public` folder is in the same directory as `index.html`.

## Custom Domain

After deploying, you can add a custom domain:

1. Add a CNAME file with your domain name (for GitHub Pages)
2. Configure DNS records:
   - For apex domain: A record pointing to hosting provider
   - For www subdomain: CNAME record pointing to your site

## Performance Tips

The site is already optimized, but you can further improve it:

1. Enable CDN on your hosting provider
2. Enable HTTP/2 or HTTP/3
3. Enable Brotli compression
4. Set proper cache headers for images (1 year)
5. Enable HTTPS (most providers do this automatically)

## Testing Locally

Before deploying, test locally:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then visit http://localhost:8000
