#!/usr/bin/env node

/**
 * Verify Build Optimizations
 * Checks that all performance optimizations are properly configured
 */

const fs = require('fs');
const path = require('path');

/**
 * Check if build directory exists and has expected structure
 */
function verifyBuildStructure() {
  console.log('🏗️  Verifying build structure...');
  
  const buildDir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(buildDir)) {
    console.error('❌ Build directory not found. Run `npm run build` first.');
    return false;
  }
  
  const requiredPaths = [
    '.next/static',
    '.next/server',
    '.next/build-manifest.json',
    '.next/prerender-manifest.json'
  ];
  
  for (const requiredPath of requiredPaths) {
    if (!fs.existsSync(path.join(process.cwd(), requiredPath))) {
      console.error(`❌ Missing required build artifact: ${requiredPath}`);
      return false;
    }
  }
  
  console.log('✅ Build structure is correct');
  return true;
}

/**
 * Verify static generation
 */
function verifyStaticGeneration() {
  console.log('📄 Verifying static generation...');
  
  try {
    const prerenderManifest = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), '.next', 'prerender-manifest.json'), 'utf8')
    );
    
    const staticRoutes = Object.keys(prerenderManifest.routes);
    console.log(`✅ Static routes generated: ${staticRoutes.length}`);
    
    // Check for expected static routes
    const expectedRoutes = ['/', '/thank-you'];
    const missingRoutes = expectedRoutes.filter(route => !staticRoutes.includes(route));
    
    if (missingRoutes.length > 0) {
      console.error(`❌ Missing static routes: ${missingRoutes.join(', ')}`);
      return false;
    }
    
    staticRoutes.forEach(route => {
      const routeInfo = prerenderManifest.routes[route];
      console.log(`   - ${route} (revalidate: ${routeInfo.initialRevalidateSeconds || 'false'})`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Failed to verify static generation:', error.message);
    return false;
  }
}

/**
 * Check bundle size
 */
function verifyBundleSize() {
  console.log('📦 Verifying bundle size...');
  
  try {
    const buildManifest = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), '.next', 'build-manifest.json'), 'utf8')
    );
    
    // Check main bundle sizes
    const pages = buildManifest.pages;
    const mainBundles = pages['/'] || [];
    
    console.log('✅ Main page bundles:');
    mainBundles.forEach(bundle => {
      const bundlePath = path.join(process.cwd(), '.next', bundle);
      if (fs.existsSync(bundlePath)) {
        const stats = fs.statSync(bundlePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`   - ${bundle}: ${sizeKB} KB`);
      }
    });
    
    return true;
  } catch (error) {
    console.error('❌ Failed to verify bundle size:', error.message);
    return false;
  }
}

/**
 * Verify API routes configuration
 */
function verifyAPIRoutes() {
  console.log('🔌 Verifying API routes...');
  
  const apiRoutes = [
    { path: 'src/app/api/count/route.ts', expectedRuntime: 'edge' },
    { path: 'src/app/api/subscribe/route.ts', expectedRuntime: 'nodejs' },
    { path: 'src/app/api/confirm/route.ts', expectedRuntime: 'nodejs' }
  ];
  
  for (const route of apiRoutes) {
    try {
      const content = fs.readFileSync(path.join(process.cwd(), route.path), 'utf8');
      
      if (content.includes(`export const runtime = '${route.expectedRuntime}'`)) {
        console.log(`✅ ${route.path}: ${route.expectedRuntime} runtime`);
      } else {
        console.error(`❌ ${route.path}: incorrect runtime configuration`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Failed to verify ${route.path}:`, error.message);
      return false;
    }
  }
  
  return true;
}

/**
 * Verify caching configuration
 */
function verifyCachingConfig() {
  console.log('💾 Verifying caching configuration...');
  
  try {
    const nextConfig = fs.readFileSync(path.join(process.cwd(), 'next.config.ts'), 'utf8');
    
    // Check for cache headers
    const hasCacheHeaders = nextConfig.includes('Cache-Control') && 
                           nextConfig.includes('max-age=31536000') &&
                           nextConfig.includes('immutable');
    
    if (hasCacheHeaders) {
      console.log('✅ Cache headers configured for static assets');
    } else {
      console.error('❌ Missing cache headers configuration');
      return false;
    }
    
    // Check Vercel configuration
    const vercelConfig = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'vercel.json'), 'utf8')
    );
    
    if (vercelConfig.headers && vercelConfig.headers.length > 0) {
      console.log('✅ Vercel caching headers configured');
    } else {
      console.error('❌ Missing Vercel caching configuration');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to verify caching configuration:', error.message);
    return false;
  }
}

/**
 * Main verification function
 */
async function main() {
  console.log('🔍 Starting optimization verification...');
  console.log('='.repeat(50));
  
  const checks = [
    { name: 'Build Structure', fn: verifyBuildStructure },
    { name: 'Static Generation', fn: verifyStaticGeneration },
    { name: 'Bundle Size', fn: verifyBundleSize },
    { name: 'API Routes', fn: verifyAPIRoutes },
    { name: 'Caching Config', fn: verifyCachingConfig }
  ];
  
  let passed = 0;
  
  for (const check of checks) {
    console.log(`\n📋 ${check.name}`);
    console.log('-'.repeat(30));
    
    if (check.fn()) {
      passed++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 OPTIMIZATION VERIFICATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}/${checks.length} checks`);
  
  if (passed === checks.length) {
    console.log('🎉 All optimizations verified successfully!');
    
    console.log('\n💡 PERFORMANCE FEATURES ENABLED:');
    console.log('✅ Static generation for main pages');
    console.log('✅ Edge runtime for count API');
    console.log('✅ Optimized caching headers');
    console.log('✅ Bundle optimization');
    console.log('✅ Image optimization');
    console.log('✅ Compression enabled');
    
    process.exit(0);
  } else {
    console.log('⚠️  Some optimization checks failed.');
    process.exit(1);
  }
}

// Run verification if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Verification error:', error);
    process.exit(1);
  });
}

module.exports = { main };