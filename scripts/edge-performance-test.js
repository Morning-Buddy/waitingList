#!/usr/bin/env node

/**
 * Edge Runtime Performance Test
 * Tests API route performance and edge runtime optimization
 */

const https = require('https');
const { performance } = require('perf_hooks');

const BASE_URL = process.env.SITE_URL || 'http://localhost:3000';

// Test configuration
const TESTS = [
  {
    name: 'Count API (Edge Runtime)',
    path: '/api/count',
    expectedRuntime: 'edge',
    maxResponseTime: 500, // ms
  },
  {
    name: 'Subscribe API (Node.js Runtime)',
    path: '/api/subscribe',
    method: 'POST',
    body: JSON.stringify({
      email: 'test@example.com',
      name: 'Test User',
      gdprConsent: true
    }),
    expectedRuntime: 'nodejs',
    maxResponseTime: 2000, // ms
  },
  {
    name: 'Confirm API (Node.js Runtime)',
    path: '/api/confirm?email=test@example.com&token=test-token',
    expectedRuntime: 'nodejs',
    maxResponseTime: 2000, // ms
  }
];

/**
 * Make HTTP request and measure performance
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Edge-Performance-Test/1.0',
        ...options.headers
      }
    };

    const protocol = url.startsWith('https:') ? https : require('http');
    
    const req = protocol.request(url, requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          responseTime: responseTime,
          serverTiming: res.headers['server-timing'],
          runtime: res.headers['x-vercel-runtime'] || 'unknown'
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

/**
 * Test API endpoint performance
 */
async function testEndpoint(test) {
  console.log(`\n🧪 Testing: ${test.name}`);
  console.log(`📍 Path: ${test.path}`);
  
  try {
    const url = `${BASE_URL}${test.path}`;
    const options = {
      method: test.method,
      body: test.body,
      headers: test.headers
    };
    
    const result = await makeRequest(url, options);
    
    // Performance analysis
    const isPerformant = result.responseTime <= test.maxResponseTime;
    const runtimeMatch = !test.expectedRuntime || result.runtime === test.expectedRuntime;
    
    console.log(`⏱️  Response Time: ${result.responseTime.toFixed(2)}ms`);
    console.log(`🏃 Runtime: ${result.runtime}`);
    console.log(`📊 Status Code: ${result.statusCode}`);
    
    if (result.serverTiming) {
      console.log(`⚡ Server Timing: ${result.serverTiming}`);
    }
    
    // Cache headers analysis
    const cacheControl = result.headers['cache-control'];
    if (cacheControl) {
      console.log(`💾 Cache Control: ${cacheControl}`);
    }
    
    // Performance verdict
    if (isPerformant && runtimeMatch) {
      console.log(`✅ PASS - Performance within limits`);
      return { passed: true, responseTime: result.responseTime };
    } else {
      const issues = [];
      if (!isPerformant) {
        issues.push(`Response time ${result.responseTime.toFixed(2)}ms exceeds limit ${test.maxResponseTime}ms`);
      }
      if (!runtimeMatch) {
        issues.push(`Runtime ${result.runtime} doesn't match expected ${test.expectedRuntime}`);
      }
      console.log(`❌ FAIL - ${issues.join(', ')}`);
      return { passed: false, responseTime: result.responseTime, issues };
    }
    
  } catch (error) {
    console.log(`💥 ERROR - ${error.message}`);
    return { passed: false, error: error.message };
  }
}

/**
 * Run multiple performance tests
 */
async function runPerformanceTests() {
  console.log('🚀 Starting Edge Runtime Performance Tests');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log('=' .repeat(50));
  
  const results = [];
  
  for (const test of TESTS) {
    const result = await testEndpoint(test);
    results.push({ test: test.name, ...result });
    
    // Wait between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📋 PERFORMANCE TEST SUMMARY');
  console.log('='.repeat(50));
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    const time = result.responseTime ? `(${result.responseTime.toFixed(2)}ms)` : '';
    console.log(`${status} ${result.test} ${time}`);
    
    if (result.issues) {
      result.issues.forEach(issue => console.log(`    ⚠️  ${issue}`));
    }
    if (result.error) {
      console.log(`    💥 ${result.error}`);
    }
  });
  
  console.log(`\n📊 Overall: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All performance tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some performance tests failed. Review the results above.');
    process.exit(1);
  }
}

/**
 * Performance recommendations
 */
function printRecommendations() {
  console.log('\n💡 PERFORMANCE OPTIMIZATION RECOMMENDATIONS');
  console.log('='.repeat(50));
  console.log('1. Use Edge Runtime for simple, fast operations (like count API)');
  console.log('2. Use Node.js Runtime for complex operations (like email sending)');
  console.log('3. Implement proper caching headers for static content');
  console.log('4. Monitor Core Web Vitals in production');
  console.log('5. Use CDN caching for frequently accessed endpoints');
  console.log('6. Optimize bundle size and reduce JavaScript payload');
  console.log('7. Implement service worker for offline functionality');
  console.log('8. Use image optimization and WebP format');
}

// Run tests if called directly
if (require.main === module) {
  runPerformanceTests()
    .then(() => {
      printRecommendations();
    })
    .catch((error) => {
      console.error('Test runner error:', error);
      process.exit(1);
    });
}

module.exports = {
  runPerformanceTests,
  testEndpoint,
  makeRequest
};