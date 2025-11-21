# Morning Buddy - Landing Page

A fast, lightweight landing page for Morning Buddy, an AI-powered wake-up companion app.

## Quick Start

The site is a static HTML page that can be served directly. All assets are in the `public` folder.

### Local Development

You can use any static server. For example:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

## Deployment

Simply upload the following files to your web host:
- `index.html`
- `public/` folder (contains all images)

The site works on any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- AWS S3
- Any traditional web host

## Features

- ✨ Pure HTML/CSS/JavaScript - no build step required
- 🚀 Loads instantly - optimized for performance
- 📱 Fully responsive design
- 🖼️ WebP images with PNG fallbacks
- ♿ Accessible navigation and interactions
- 🎨 Smooth animations and transitions
- 📧 Form integration with Tally
- 📄 Legal modals (Privacy, Terms, Cookies)

## Structure

```
/
├── index.html          # Main page
└── public/             # All assets
    ├── App_Icon.webp/png
    ├── App_Alarm.webp/png
    ├── App_Call.webp/png
    ├── App_Buddies.webp/png
    ├── Aurora_*.webp/png
    ├── Ray_*.webp/png
    ├── Sunny_*.webp/png
    ├── Logo.webp/png
    └── Text_Black.webp/png
```

**Important:** All images are referenced as `public/image.webp` in the HTML. Keep the `public/` folder structure intact when deploying.

## Customization

All styles are embedded in `index.html` for maximum performance. To customize:

1. Edit the CSS variables in the `:root` section
2. Modify colors, fonts, or spacing
3. Update content directly in the HTML
4. Replace images in the `public` folder

## Performance

- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Lighthouse Score: 95+
- Total page size: < 500KB

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contact

For questions about Morning Buddy, email hello@morningbuddy.co.uk
