#!/usr/bin/env node

/**
 * Accessibility Audit Script
 * 
 * This script runs automated accessibility checks using axe-core
 * to ensure WCAG AA compliance for the Morning Buddy landing page.
 */

const { chromium } = require('playwright');
const { injectAxe, getViolations } = require('axe-playwright');
const fs = require('fs').promises;
const path = require('path');

async function runAccessibilityAudit() {
  console.log('🔍 Starting accessibility audit...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = {
    timestamp: new Date().toISOString(),
    pages: [],
    summary: {
      totalViolations: 0,
      criticalViolations: 0,
      seriousViolations: 0,
      moderateViolations: 0,
      minorViolations: 0
    }
  };

  try {
    // Test pages
    const pagesToTest = [
      { url: 'http://localhost:3000', name: 'Landing Page' },
      { url: 'http://localhost:3000/thank-you', name: 'Thank You Page' }
    ];

    for (const pageInfo of pagesToTest) {
      console.log(`📄 Testing ${pageInfo.name}...`);
      
      await page.goto(pageInfo.url, { waitUntil: 'networkidle' });
      await injectAxe(page);
      
      const violations = await getViolations(page, null, {
        tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
        rules: {
          'color-contrast': { enabled: true },
          'keyboard-navigation': { enabled: true },
          'focus-order-semantics': { enabled: true },
          'aria-roles': { enabled: true },
          'aria-properties': { enabled: true },
          'landmark-roles': { enabled: true }
        }
      });
      
      const pageResult = {
        name: pageInfo.name,
        url: pageInfo.url,
        violations: violations.map(v => ({
          id: v.id,
          description: v.description,
          impact: v.impact,
          help: v.help,
          helpUrl: v.helpUrl,
          nodes: v.nodes.length,
          tags: v.tags
        })),
        violationCount: violations.length
      };
      
      results.pages.push(pageResult);
      results.summary.totalViolations += violations.length;
      
      // Count violations by impact
      violations.forEach(v => {
        switch (v.impact) {
          case 'critical':
            results.summary.criticalViolations++;
            break;
          case 'serious':
            results.summary.seriousViolations++;
            break;
          case 'moderate':
            results.summary.moderateViolations++;
            break;
          case 'minor':
            results.summary.minorViolations++;
            break;
        }
      });
      
      if (violations.length === 0) {
        console.log(`✅ ${pageInfo.name}: No accessibility violations found!`);
      } else {
        console.log(`❌ ${pageInfo.name}: Found ${violations.length} accessibility violations:`);
        violations.forEach((violation, index) => {
          console.log(`\n${index + 1}. ${violation.id} (${violation.impact})`);
          console.log(`   Description: ${violation.description}`);
          console.log(`   Help: ${violation.helpUrl}`);
          console.log(`   Elements affected: ${violation.nodes.length}`);
        });
      }
    }
    
    // Test modal accessibility on landing page
    console.log('\n🧪 Testing modal accessibility...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await injectAxe(page);
    
    // Open modal
    await page.click('button:has-text("Join Waiting List")');
    await page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 5000 });
    
    const modalViolations = await getViolations(page, null, {
      tags: ['wcag2a', 'wcag2aa', 'wcag21aa']
    });
    
    const modalResult = {
      name: 'Waitlist Modal',
      url: 'http://localhost:3000 (modal)',
      violations: modalViolations.map(v => ({
        id: v.id,
        description: v.description,
        impact: v.impact,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.length,
        tags: v.tags
      })),
      violationCount: modalViolations.length
    };
    
    results.pages.push(modalResult);
    results.summary.totalViolations += modalViolations.length;
    
    modalViolations.forEach(v => {
      switch (v.impact) {
        case 'critical':
          results.summary.criticalViolations++;
          break;
        case 'serious':
          results.summary.seriousViolations++;
          break;
        case 'moderate':
          results.summary.moderateViolations++;
          break;
        case 'minor':
          results.summary.minorViolations++;
          break;
      }
    });
    
    if (modalViolations.length === 0) {
      console.log('✅ Modal: No accessibility violations found!');
    } else {
      console.log(`❌ Modal: Found ${modalViolations.length} accessibility violations:`);
      modalViolations.forEach((violation, index) => {
        console.log(`\n${index + 1}. ${violation.id} (${violation.impact})`);
        console.log(`   Description: ${violation.description}`);
        console.log(`   Help: ${violation.helpUrl}`);
      });
    }
    
    // Test keyboard navigation
    console.log('\n🧪 Testing keyboard navigation...');
    
    // Close modal first
    await page.keyboard.press('Escape');
    await page.waitForSelector('[role="dialog"]', { state: 'hidden' });
    
    // Test tab navigation through interactive elements
    const interactiveElements = await page.locator('button, a, input, [tabindex]:not([tabindex="-1"])').count();
    console.log(`📊 Found ${interactiveElements} interactive elements`);
    
    // Test focus indicators
    let focusIssues = 0;
    for (let i = 0; i < Math.min(interactiveElements, 10); i++) {
      await page.keyboard.press('Tab');
      const focusedElementCount = await page.locator(':focus').count();
      
      if (focusedElementCount === 0) {
        focusIssues++;
        console.log(`⚠️  Focus issue: Element ${i + 1} not properly focused`);
      }
    }
    
    if (focusIssues === 0) {
      console.log('✅ Keyboard navigation: All elements properly focusable');
    } else {
      console.log(`❌ Keyboard navigation: ${focusIssues} focus issues found`);
    }
    
    // Save results to file
    const resultsDir = path.join(process.cwd(), 'accessibility-results');
    await fs.mkdir(resultsDir, { recursive: true });
    
    const resultsFile = path.join(resultsDir, `accessibility-audit-${Date.now()}.json`);
    await fs.writeFile(resultsFile, JSON.stringify(results, null, 2));
    
    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('ACCESSIBILITY AUDIT SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total violations: ${results.summary.totalViolations}`);
    console.log(`Critical: ${results.summary.criticalViolations}`);
    console.log(`Serious: ${results.summary.seriousViolations}`);
    console.log(`Moderate: ${results.summary.moderateViolations}`);
    console.log(`Minor: ${results.summary.minorViolations}`);
    console.log(`\nResults saved to: ${resultsFile}`);
    
    // Exit with error code if critical or serious violations found
    if (results.summary.criticalViolations > 0 || results.summary.seriousViolations > 0) {
      console.log('\n❌ Accessibility audit failed due to critical or serious violations.');
      process.exit(1);
    } else {
      console.log('\n✅ Accessibility audit passed!');
    }
    
  } catch (error) {
    console.error('❌ Error during accessibility audit:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Check if we're running in a development environment
if (require.main === module) {
  runAccessibilityAudit().catch(console.error);
}

module.exports = { runAccessibilityAudit };