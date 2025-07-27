import type { NextConfig } from "next";

// Check if we're building for GitHub Pages
const isGithubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  
  // GitHub Pages configuration - only add basePath if building for GitHub Pages
  ...(isGithubPages && {
    basePath: '/waitingList',
    assetPrefix: '/waitingList/',
  }),
  

  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // External packages for server components
  serverExternalPackages: ['@supabase/supabase-js'],
  
  // Environment variables validation
  env: {
    SITE_URL: process.env.SITE_URL || 'http://localhost:3000',
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', 'framer-motion'],
  },
  
  // Static generation optimization
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
  
  // Compression and caching
  compress: true,
  
  // Bundle analyzer in development
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config: any) => {
      config.plugins.push(
        new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
      return config;
    },
  }),
  
  // Headers don't work with static export, but can be configured at the hosting level
};

export default nextConfig;
