# Next Steps - GitHub Pages Setup

## ✅ Code Pushed Successfully!

Your code has been pushed to GitHub. Now you need to enable GitHub Pages to deploy the site.

## Enable GitHub Pages

1. Go to your repository on GitHub:
   https://github.com/Morning-Buddy/waitingList

2. Click **Settings** (top right)

3. In the left sidebar, click **Pages**

4. Under "Build and deployment":
   - Source: Select **GitHub Actions**
   
5. Click **Save**

6. The site will automatically deploy!

## Check Deployment Status

1. Go to the **Actions** tab in your repository
2. You should see a "Deploy to GitHub Pages" workflow running
3. Wait for it to complete (usually takes 30-60 seconds)
4. Once complete, your site will be live!

## Your Site URL

After deployment, your site will be available at:
```
https://morning-buddy.github.io/waitingList/
```

## Troubleshooting

If the deployment fails:

1. Check the Actions tab for error messages
2. Make sure GitHub Pages is enabled in Settings > Pages
3. Ensure the workflow file exists: `.github/workflows/deploy.yml`

## Custom Domain (Optional)

To use a custom domain like `morningbuddy.co.uk`:

1. Go to Settings > Pages
2. Under "Custom domain", enter your domain
3. Add DNS records at your domain provider:
   - For apex domain (morningbuddy.co.uk):
     ```
     A record: 185.199.108.153
     A record: 185.199.109.153
     A record: 185.199.110.153
     A record: 185.199.111.153
     ```
   - For www subdomain:
     ```
     CNAME: morning-buddy.github.io
     ```

## Testing Locally

Before each push, test locally:
```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

## Making Changes

1. Edit `index.html` for content/design changes
2. Replace images in `public/` folder
3. Test locally
4. Commit and push:
   ```bash
   git add .
   git commit -m "Your change description"
   git push origin main
   ```
5. Site auto-deploys in ~1 minute!

## Support

- Check QUICKSTART.md for quick commands
- Check DEPLOYMENT.md for detailed deployment options
- Check IMAGE_FIX.md if images aren't loading
