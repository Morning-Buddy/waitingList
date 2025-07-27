const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function performanceAudit() {
  console.log('🚀 Starting performance audit...');
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Enable performance monitoring
  await page.addInitScript(() => {
    window.performanceMetrics = {
      navigationStart: performance.timing.navigationStart,
      loadEventEnd: performance.timing.loadEventEnd,
      domContentLoaded: performance.timing.domContentLoadedEventEnd,
      firstPaint: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0
    };
    
    // Capture paint metrics
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-paint') {
          window.performanceMetrics.firstPaint = entry.startTime;
        }
        if (entry.name === 'first-contentful-paint') {
          window.performanceMetrics.firstContentfulPaint = entry.startTime;
        }
      }
    }).observe({ entryTypes: ['paint'] });
    
    // Capture LCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      window.performanceMetrics.largestContentfulPaint = lastEntry.startTime;
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // Capture CLS
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      window.performanceMetrics.cumulativeLayoutShift = clsValue;
    }).observe({ entryTypes: ['layout-shift'] });
  });
  
  try {
    // Test local development server
    const testUrl = process.env.TEST_URL || 'http://localhost:3000';
    console.log(`📊 Testing: ${testUrl}`);
    
    const startTime = Date.now();
    await page.goto(testUrl, { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    // Wait for metrics to be collected
    await page.waitForTimeout(2000);
    
    // Get performance metrics
    const metrics = await page.evaluate(() => window.performanceMetrics);
    const navigationTiming = await page.evaluate(() => ({
      domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart,
      ttfb: performance.timing.responseStart - performance.timing.navigationStart
    }));
    
    // Get resource timing
    const resources = await page.evaluate(() => {
      return performance.getEntriesByType('resource').map(resource => ({
        name: resource.name,
        duration: resource.duration,
        size: resource.transferSize || 0,
        type: resource.initiatorType
      }));
    });
    
    // Calculate bundle sizes
    const jsResources = resources.filter(r => r.name.includes('.js'));
    const cssResources = resources.filter(r => r.name.includes('.css'));
    const imageResources = resources.filter(r => r.type === 'img');
    
    const totalJSSize = jsResources.reduce((sum, r) => sum + r.size, 0);
    const totalCSSSize = cssResources.reduce((sum, r) => sum + r.size, 0);
    const totalImageSize = imageResources.reduce((sum, r) => sum + r.size, 0);
    
    // Performance report
    const report = {
      timestamp: new Date().toISOString(),
      url: testUrl,
      metrics: {
        pageLoadTime: loadTime,
        timeToFirstByte: navigationTiming.ttfb,
        domContentLoaded: navigationTiming.domContentLoaded,
        loadComplete: navigationTiming.loadComplete,
        firstPaint: metrics.firstPaint,
        firstContentfulPaint: metrics.firstContentfulPaint,
        largestContentfulPaint: metrics.largestContentfulPaint,
        cumulativeLayoutShift: metrics.cumulativeLayoutShift
      },
      resources: {
        totalResources: resources.length,
        jsFiles: jsResources.length,
        cssFiles: cssResources.length,
        images: imageResources.length,
        totalJSSize: Math.round(totalJSSize / 1024),
        totalCSSSize: Math.round(totalCSSSize / 1024),
        totalImageSize: Math.round(totalImageSize / 1024)
      },
      performance: {
        score: calculatePerformanceScore(metrics, navigationTiming),
        recommendations: generateRecommendations(metrics, navigationTiming, {
          totalJSSize,
          totalCSSSize,
          totalImageSize
        })
      }
    };
    
    // Output results
    console.log('\n📈 Performance Audit Results:');
    console.log('================================');
    console.log(`⏱️  Page Load Time: ${report.metrics.pageLoadTime}ms`);
    console.log(`🎯 Time to First Byte: ${report.metrics.timeToFirstByte}ms`);
    console.log(`🎨 First Contentful Paint: ${report.metrics.firstContentfulPaint}ms`);
    console.log(`🖼️  Largest Contentful Paint: ${report.metrics.largestContentfulPaint}ms`);
    console.log(`📐 Cumulative Layout Shift: ${report.metrics.cumulativeLayoutShift}`);
    console.log(`📦 Total JS Size: ${report.resources.totalJSSize}KB`);
    console.log(`🎨 Total CSS Size: ${report.resources.totalCSSSize}KB`);
    console.log(`🖼️  Total Image Size: ${report.resources.totalImageSize}KB`);
    console.log(`🏆 Performance Score: ${report.performance.score}/100`);
    
    if (report.performance.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      report.performance.recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`);
      });
    }
    
    // Save detailed report
    const reportPath = path.join(__dirname, '..', 'performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
    // Check if performance meets targets
    const meetsTargets = 
      report.metrics.firstContentfulPaint < 1500 &&
      report.metrics.largestContentfulPaint < 2500 &&
      report.metrics.cumulativeLayoutShift < 0.1 &&
      report.resources.totalJSSize < 500;
    
    if (meetsTargets) {
      console.log('\n✅ Performance targets met!');
      process.exit(0);
    } else {
      console.log('\n⚠️  Performance targets not met. See recommendations above.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Performance audit failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

function calculatePerformanceScore(metrics, timing) {
  let score = 100;
  
  // FCP penalty (target: < 1.5s)
  if (metrics.firstContentfulPaint > 1500) {
    score -= Math.min(30, (metrics.firstContentfulPaint - 1500) / 100);
  }
  
  // LCP penalty (target: < 2.5s)
  if (metrics.largestContentfulPaint > 2500) {
    score -= Math.min(30, (metrics.largestContentfulPaint - 2500) / 100);
  }
  
  // CLS penalty (target: < 0.1)
  if (metrics.cumulativeLayoutShift > 0.1) {
    score -= Math.min(20, metrics.cumulativeLayoutShift * 200);
  }
  
  // TTFB penalty (target: < 600ms)
  if (timing.ttfb > 600) {
    score -= Math.min(20, (timing.ttfb - 600) / 50);
  }
  
  return Math.max(0, Math.round(score));
}

function generateRecommendations(metrics, timing, resources) {
  const recommendations = [];
  
  if (metrics.firstContentfulPaint > 1500) {
    recommendations.push('Optimize First Contentful Paint: Consider reducing JavaScript bundle size or implementing code splitting');
  }
  
  if (metrics.largestContentfulPaint > 2500) {
    recommendations.push('Optimize Largest Contentful Paint: Optimize images and ensure critical resources load quickly');
  }
  
  if (metrics.cumulativeLayoutShift > 0.1) {
    recommendations.push('Reduce Cumulative Layout Shift: Add size attributes to images and reserve space for dynamic content');
  }
  
  if (timing.ttfb > 600) {
    recommendations.push('Improve Time to First Byte: Optimize server response time or use edge caching');
  }
  
  if (resources.totalJSSize > 500) {
    recommendations.push('Reduce JavaScript bundle size: Consider code splitting, tree shaking, or removing unused dependencies');
  }
  
  if (resources.totalImageSize > 1000) {
    recommendations.push('Optimize images: Use modern formats (WebP, AVIF) and implement responsive images');
  }
  
  return recommendations;
}

// Run the audit
performanceAudit().catch(console.error);