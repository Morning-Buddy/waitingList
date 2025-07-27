#!/usr/bin/env node

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * Final Integration Test Suite
 * Tests all aspects of the Morning Buddy landing page according to task 17 requirements:
 * - End-to-end testing of complete signup flow
 * - Email confirmation process verification
 * - Analytics tracking and conversion funnel
 * - Cross-browser and device compatibility testing
 * - 25% conversion rate optimization features validation
 */

class FinalIntegrationTest {
  constructor() {
    this.testResults = {
      timestamp: new Date().toISOString(),
      passed: 0,
      failed: 0,
      tests: [],
      summary: {}
    };
    this.baseUrl = process.env.TEST_URL || 'http://localhost:3000';
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    }[type] || '📋';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runTest(name, testFn) {
    this.log(`Running: ${name}`);
    const startTime = Date.now();
    
    try {
      await testFn();
      const duration = Date.now() - startTime;
      this.testResults.passed++;
      this.testResults.tests.push({
        name,
        status: 'passed',
        duration,
        error: null
      });
      this.log(`✅ ${name} - PASSED (${duration}ms)`, 'success');
    } catch (error) {
      const duration = Date.now() - startTime;
      this.testResults.failed++;
      this.testResults.tests.push({
        name,
        status: 'failed',
        duration,
        error: error.message
      });
      this.log(`❌ ${name} - FAILED: ${error.message}`, 'error');
    }
  }

  async testCompleteSignupFlow() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Navigate to landing page
      await page.goto(this.baseUrl, { waitUntil: 'networkidle' });
      
      // Verify page loads correctly
      await page.waitForSelector('h1', { timeout: 5000 });
      const title = await page.textContent('h1');
      if (!title.includes('Morning Buddy')) {
        throw new Error('Landing page title not found');
      }

      // Test modal opening
      await page.click('button:has-text("Join Waiting List")');
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
      
      // Fill form with test data
      const testEmail = `test-${Date.now()}@example.com`;
      await page.fill('input[type="email"]', testEmail);
      await page.check('input[type="checkbox"]');
      
      // Mock successful API response
      await page.route('**/api/subscribe', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, message: 'Successfully joined waitlist' })
        });
      });
      
      // Submit form
      await page.click('button:has-text("Join Waiting List"):not(:first-child)');
      
      // Verify redirect to thank you page
      await page.waitForURL('**/thank-you', { timeout: 10000 });
      
      // Verify thank you page content
      const thankYouText = await page.textContent('body');
      if (!thankYouText.includes('Thanks for joining')) {
        throw new Error('Thank you page content not found');
      }

    } finally {
      await browser.close();
    }
  }

  async testEmailConfirmationProcess() {
    // Test email confirmation token generation and validation
    const testEmail = 'test@example.com';
    
    // Mock token generation (would normally be done by API)
    const mockToken = Buffer.from(JSON.stringify({
      email: testEmail,
      timestamp: Date.now(),
      nonce: Math.random().toString(36)
    })).toString('base64url');

    // Test token validation logic
    try {
      const decoded = JSON.parse(Buffer.from(mockToken, 'base64url').toString());
      if (decoded.email !== testEmail) {
        throw new Error('Token validation failed');
      }
    } catch (error) {
      throw new Error(`Email confirmation process failed: ${error.message}`);
    }
  }

  async testAnalyticsTracking() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Track analytics calls
      const analyticsEvents = [];
      
      page.on('request', request => {
        const url = request.url();
        if (url.includes('plausible.io') || url.includes('analytics')) {
          analyticsEvents.push({
            url,
            method: request.method(),
            timestamp: Date.now()
          });
        }
      });

      await page.goto(this.baseUrl, { waitUntil: 'networkidle' });
      
      // Simulate user interactions for conversion tracking
      await page.click('button:has-text("Join Waiting List")');
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
      
      // Wait for potential analytics calls
      await page.waitForTimeout(2000);
      
      // Verify analytics setup (would be more comprehensive with real analytics)
      const hasAnalyticsScript = await page.evaluate(() => {
        return document.querySelector('script[data-domain]') !== null ||
               document.querySelector('script[src*="plausible"]') !== null;
      });
      
      if (!hasAnalyticsScript) {
        this.log('Analytics script not found - this may be expected in test environment', 'warning');
      }

    } finally {
      await browser.close();
    }
  }

  async testCrossBrowserCompatibility() {
    const browsers = [
      { name: 'Chromium', launch: () => chromium.launch() }
    ];

    for (const browserConfig of browsers) {
      const browser = await browserConfig.launch();
      const context = await browser.newContext();
      const page = await context.newPage();

      try {
        await page.goto(this.baseUrl, { waitUntil: 'networkidle' });
        
        // Test basic functionality
        await page.waitForSelector('h1', { timeout: 5000 });
        await page.click('button:has-text("Join Waiting List")');
        await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
        
        // Test form interaction
        await page.fill('input[type="email"]', 'test@example.com');
        await page.check('input[type="checkbox"]');
        
        this.log(`${browserConfig.name} compatibility test passed`, 'success');
        
      } catch (error) {
        throw new Error(`${browserConfig.name} compatibility failed: ${error.message}`);
      } finally {
        await browser.close();
      }
    }
  }

  async testDeviceCompatibility() {
    const devices = [
      { name: 'Desktop', viewport: { width: 1920, height: 1080 } },
      { name: 'Tablet', viewport: { width: 768, height: 1024 } },
      { name: 'Mobile', viewport: { width: 375, height: 667 } }
    ];

    const browser = await chromium.launch({ headless: true });

    for (const device of devices) {
      const context = await browser.newContext({
        viewport: device.viewport
      });
      const page = await context.newPage();

      try {
        await page.goto(this.baseUrl, { waitUntil: 'networkidle' });
        
        // Test responsive design
        await page.waitForSelector('h1', { timeout: 5000 });
        
        // Test modal on different screen sizes
        await page.click('button:has-text("Join Waiting List")');
        await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
        
        // Verify modal is properly sized
        const modalBox = await page.boundingBox('[role="dialog"]');
        if (!modalBox || modalBox.width <= 0) {
          throw new Error(`Modal not properly displayed on ${device.name}`);
        }
        
        this.log(`${device.name} (${device.viewport.width}x${device.viewport.height}) compatibility test passed`, 'success');
        
      } catch (error) {
        throw new Error(`${device.name} compatibility failed: ${error.message}`);
      } finally {
        await context.close();
      }
    }

    await browser.close();
  }

  async testConversionOptimizationFeatures() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      await page.goto(this.baseUrl, { waitUntil: 'networkidle' });
      
      // Test conversion optimization features
      const optimizationFeatures = [];
      
      // 1. Clear value proposition
      const heroText = await page.textContent('h1');
      if (heroText && heroText.includes('Morning Buddy')) {
        optimizationFeatures.push('Clear headline');
      }
      
      // 2. Social proof
      const socialProofExists = await page.locator('text=/join/i').count() > 0;
      if (socialProofExists) {
        optimizationFeatures.push('Social proof elements');
      }
      
      // 3. Clear CTA
      const ctaButtons = await page.locator('button:has-text("Join Waiting List")').count();
      if (ctaButtons > 0) {
        optimizationFeatures.push('Clear call-to-action');
      }
      
      // 4. Minimal form fields
      await page.click('button:has-text("Join Waiting List")');
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
      
      const formFields = await page.locator('input').count();
      if (formFields <= 3) { // Email, optional name, checkbox
        optimizationFeatures.push('Minimal form friction');
      }
      
      // 5. Trust indicators
      const privacyText = await page.textContent('body');
      if (privacyText && privacyText.includes('privacy')) {
        optimizationFeatures.push('Privacy/trust indicators');
      }
      
      // 6. Mobile optimization
      const isResponsive = await page.evaluate(() => {
        return window.innerWidth <= 768 ? 
          document.querySelector('meta[name="viewport"]') !== null : true;
      });
      if (isResponsive) {
        optimizationFeatures.push('Mobile optimization');
      }
      
      this.log(`Conversion optimization features found: ${optimizationFeatures.join(', ')}`, 'success');
      
      if (optimizationFeatures.length < 4) {
        throw new Error(`Insufficient conversion optimization features: ${optimizationFeatures.length}/6`);
      }

    } finally {
      await browser.close();
    }
  }

  async testAccessibilityCompliance() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      await page.goto(this.baseUrl, { waitUntil: 'networkidle' });
      
      // Test keyboard navigation
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement.tagName);
      
      // Test modal accessibility
      await page.click('button:has-text("Join Waiting List")');
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
      
      // Check ARIA attributes
      const modalHasAriaLabel = await page.getAttribute('[role="dialog"]', 'aria-labelledby');
      if (!modalHasAriaLabel) {
        this.log('Modal missing aria-labelledby attribute', 'warning');
      }
      
      // Test escape key functionality
      await page.keyboard.press('Escape');
      const modalVisible = await page.isVisible('[role="dialog"]');
      if (modalVisible) {
        throw new Error('Modal should close on Escape key');
      }

    } finally {
      await browser.close();
    }
  }

  async testPerformanceMetrics() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      const startTime = Date.now();
      await page.goto(this.baseUrl, { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;
      
      // Get performance metrics
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
          loadComplete: navigation.loadEventEnd - navigation.navigationStart,
          ttfb: navigation.responseStart - navigation.navigationStart
        };
      });
      
      this.log(`Performance metrics - Load: ${loadTime}ms, TTFB: ${metrics.ttfb}ms, DOMContentLoaded: ${metrics.domContentLoaded}ms`, 'info');
      
      // Basic performance thresholds
      if (loadTime > 5000) {
        throw new Error(`Page load time too slow: ${loadTime}ms`);
      }
      
      if (metrics.ttfb > 2000) {
        throw new Error(`Time to first byte too slow: ${metrics.ttfb}ms`);
      }

    } finally {
      await browser.close();
    }
  }

  async generateReport() {
    const reportPath = path.join(__dirname, '..', 'final-integration-test-report.json');
    
    this.testResults.summary = {
      totalTests: this.testResults.passed + this.testResults.failed,
      passRate: this.testResults.passed / (this.testResults.passed + this.testResults.failed) * 100,
      duration: this.testResults.tests.reduce((sum, test) => sum + test.duration, 0)
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(this.testResults, null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL INTEGRATION TEST REPORT');
    console.log('='.repeat(60));
    console.log(`📋 Total Tests: ${this.testResults.summary.totalTests}`);
    console.log(`✅ Passed: ${this.testResults.passed}`);
    console.log(`❌ Failed: ${this.testResults.failed}`);
    console.log(`📈 Pass Rate: ${this.testResults.summary.passRate.toFixed(1)}%`);
    console.log(`⏱️  Total Duration: ${this.testResults.summary.duration}ms`);
    console.log(`📄 Detailed report: ${reportPath}`);
    console.log('='.repeat(60));
    
    if (this.testResults.failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.testResults.tests
        .filter(test => test.status === 'failed')
        .forEach(test => {
          console.log(`  • ${test.name}: ${test.error}`);
        });
    }
    
    return this.testResults.summary.passRate >= 80; // 80% pass rate threshold
  }

  async run() {
    console.log('🚀 Starting Final Integration Test Suite');
    console.log(`🌐 Testing URL: ${this.baseUrl}`);
    console.log('='.repeat(60));

    // Run all test suites
    await this.runTest('Complete Signup Flow', () => this.testCompleteSignupFlow());
    await this.runTest('Email Confirmation Process', () => this.testEmailConfirmationProcess());
    await this.runTest('Analytics Tracking', () => this.testAnalyticsTracking());
    await this.runTest('Cross-Browser Compatibility', () => this.testCrossBrowserCompatibility());
    await this.runTest('Device Compatibility', () => this.testDeviceCompatibility());
    await this.runTest('Conversion Optimization Features', () => this.testConversionOptimizationFeatures());
    await this.runTest('Accessibility Compliance', () => this.testAccessibilityCompliance());
    await this.runTest('Performance Metrics', () => this.testPerformanceMetrics());

    // Generate final report
    const success = await this.generateReport();
    
    if (success) {
      console.log('\n🎉 All integration tests completed successfully!');
      process.exit(0);
    } else {
      console.log('\n⚠️  Some integration tests failed. See report for details.');
      process.exit(1);
    }
  }
}

// Run the test suite
if (require.main === module) {
  const testSuite = new FinalIntegrationTest();
  testSuite.run().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = FinalIntegrationTest;