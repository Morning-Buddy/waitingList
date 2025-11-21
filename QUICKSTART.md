# Quick Start Guide

## View the Site Locally

First, verify all images are present:
```bash
./test-images.sh
```

Then run any of these commands in the project directory:

```bash
# Python (usually pre-installed on Mac/Linux)
python3 -m http.server 8000

# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Then open http://localhost:8000 in your browser.

**Note:** All images are in the `public/` folder and referenced as `public/image.webp` in the HTML.

## Deploy to GitHub Pages

1. Push this code to GitHub:
```bash
git add .
git commit -m "Deploy Morning Buddy website"
git push origin main
```

2. Go to your repository on GitHub
3. Click Settings > Pages
4. Under "Build and deployment", select "GitHub Actions"
5. Your site will deploy automatically!

## Make Changes

Edit `index.html` to customize:
- Colors: Search for CSS variables in `:root`
- Text: Find and replace content directly
- Images: Replace files in `public/` folder
- Styles: Edit the `<style>` section

## That's It!

No build process, no dependencies, no complexity. Just edit and deploy.

For more details, see:
- README.md - Full documentation
- DEPLOYMENT.md - All deployment options
- MIGRATION_SUMMARY.md - What changed
