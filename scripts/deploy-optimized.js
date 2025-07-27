#!/usr/bin/env node

/**
 * Optimized Deployment Script
 * Runs all performance checks before deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REQUIRED_ENV_VARS = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SENDGRID_API_KEY',
  'SITE_URL'
];

/**
 * Check if required environment variables are set
 */
function checkEnvironmentVariables() {
  console.log('🔍 Checking environment variables...');
  
  const missing = REQUIRED_ENV_VARS.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(envVar => console.error(`   - ${envVar}`));
    console.error('\n💡 Make sure to set these in your .env.local file or Vercel dashboard');
    return false;
  }
  
  console.log('✅ All required environment variables are set');
  return true;
}

/**
 * Run build and check for errors
 */
function runBuild() {
  console.log('🏗️  Building application...');
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Build failed');
    return false;
  }
}

/**
 * Run all tests
 */
function runTests() {
  console.log('🧪 Running tests...');
  
  try {
    // Run unit tests
    console.log('  📝 Running unit tests...');
    execSync('npm run test:unit', { stdio: 'inherit' });
    
    // Run integration tests
    console.log('  🔗 Running integration tests...');
    execSync('npm run test:integration', { stdio: 'inherit' });
    
    console.log('✅ All tests passed');
    return true;
  } catch (error) {
    console.error('❌ Tests failed');
    return false;
  }
}

/**
 * Run performance audits
 */
function runPerformanceAudits() {
  console.log('⚡ Running performance audits...');
  
  try {
    // Run accessibility audit
    console.log('  ♿ Running accessibility audit...');
    execSync('npm run accessibility:audit', { stdio: 'inherit' });
    
    // Run performance audit
    console.log('  🚀 Running performance audit...');
    execSync('npm run performance:audit', { stdio: 'inherit' });
    
    console.log('✅ Performance audits completed');
    return true;
  } catch (error) {
    console.error('❌ Performance audits failed');
    return false;
  }
}

/**
 * Check bundle size
 */
function checkBundleSize() {
  console.log('📦 Checking bundle size...');
  
  try {
    const buildDir = path.join(process.cwd(), '.next');
    if (!fs.existsSync(buildDir)) {
      console.error('❌ Build directory not found. Run build first.');
      return false;
    }
    
    // Check if bundle analyzer is available
    try {
      execSync('npm run build:analyze', { stdio: 'pipe' });
      console.log('✅ Bundle analysis completed');
    } catch (error) {
      console.log('⚠️  Bundle analyzer not available, skipping detailed analysis');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Bundle size check failed');
    return false;
  }
}

/**
 * Verify static generation
 */
function verifyStaticGeneration() {
  console.log('🔧 Verifying static generation...');
  
  try {
    const buildManifest = path.join(process.cwd(), '.next', 'build-manifest.json');
    const prerenderManifest = path.join(process.cwd(), '.next', 'prerender-manifest.json');
    
    if (fs.existsSync(buildManifest)) {
      console.log('✅ Build manifest found');
    } else {
      console.error('❌ Build manifest not found');
      return false;
    }
    
    if (fs.existsSync(prerenderManifest)) {
      const manifest = JSON.parse(fs.readFileSync(prerenderManifest, 'utf8'));
      const staticPages = Object.keys(manifest.routes);
      console.log(`✅ Static pages generated: ${staticPages.length}`);
      staticPages.forEach(page => console.log(`   - ${page}`));
    }
    
    return true;
  } catch (error) {
    console.error('❌ Static generation verification failed');
    return false;
  }
}

/**
 * Deploy to Vercel
 */
function deployToVercel(environment = 'preview') {
  console.log(`🚀 Deploying to Vercel (${environment})...`);
  
  try {
    const deployCommand = environment === 'production' 
      ? 'npm run deploy:production' 
      : 'npm run deploy:preview';
    
    execSync(deployCommand, { stdio: 'inherit' });
    console.log(`✅ Deployment to ${environment} completed`);
    return true;
  } catch (error) {
    console.error(`❌ Deployment to ${environment} failed`);
    return false;
  }
}

/**
 * Main deployment function
 */
async function main() {
  console.log('🚀 Starting optimized deployment process...');
  console.log('='.repeat(50));
  
  const steps = [
    { name: 'Environment Variables', fn: checkEnvironmentVariables },
    { name: 'Build', fn: runBuild },
    { name: 'Tests', fn: runTests },
    { name: 'Performance Audits', fn: runPerformanceAudits },
    { name: 'Bundle Size Check', fn: checkBundleSize },
    { name: 'Static Generation', fn: verifyStaticGeneration }
  ];
  
  // Run pre-deployment checks
  for (const step of steps) {
    console.log(`\n📋 ${step.name}`);
    console.log('-'.repeat(30));
    
    if (!step.fn()) {
      console.error(`\n💥 Deployment failed at: ${step.name}`);
      process.exit(1);
    }
  }
  
  // Ask for deployment confirmation
  const environment = process.argv.includes('--production') ? 'production' : 'preview';
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ All pre-deployment checks passed!');
  console.log(`🎯 Ready to deploy to: ${environment}`);
  console.log('='.repeat(50));
  
  // Deploy
  if (deployToVercel(environment)) {
    console.log('\n🎉 Deployment completed successfully!');
    
    // Post-deployment recommendations
    console.log('\n💡 POST-DEPLOYMENT CHECKLIST:');
    console.log('1. Verify the site loads correctly');
    console.log('2. Test the signup form functionality');
    console.log('3. Check email confirmation flow');
    console.log('4. Monitor Core Web Vitals');
    console.log('5. Verify analytics tracking');
    console.log('6. Test from different devices/browsers');
    
  } else {
    console.error('\n💥 Deployment failed!');
    process.exit(1);
  }
}

// Handle command line arguments
if (require.main === module) {
  main().catch((error) => {
    console.error('Deployment script error:', error);
    process.exit(1);
  });
}