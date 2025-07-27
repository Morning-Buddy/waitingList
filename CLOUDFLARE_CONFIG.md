# Cloudflare Configuration Guide

This document provides the complete Cloudflare configuration for optimal performance and security.

## DNS Configuration

### DNS Records
```
Type    Name    Content                     TTL     Proxy Status
A       @       76.76.19.61                Auto    Proxied
A       www     76.76.19.61                Auto    Proxied
CNAME   *       cname.vercel-dns.com       Auto    DNS Only
TXT     @       v=spf1 include:sendgrid.net ~all    Auto    DNS Only
```

### Email Records (for SendGrid)
```
Type    Name                    Content                                 TTL
CNAME   em123.morningbuddy.co.uk    u123456.wl.sendgrid.net           Auto
CNAME   s1._domainkey.morningbuddy.co.uk    s1.domainkey.u123456.wl.sendgrid.net    Auto
CNAME   s2._domainkey.morningbuddy.co.uk    s2.domainkey.u123456.wl.sendgrid.net    Auto
```

## SSL/TLS Configuration

### SSL/TLS Settings
- **SSL/TLS encryption mode**: Full (strict)
- **Always Use HTTPS**: On
- **HTTP Strict Transport Security (HSTS)**: On
  - Max Age Header: 6 months
  - Include subdomains: On
  - Preload: On
- **Minimum TLS Version**: 1.2
- **TLS 1.3**: On
- **Automatic HTTPS Rewrites**: On

### Edge Certificates
- **Universal SSL**: Active
- **Always Use HTTPS**: On
- **Certificate Transparency Monitoring**: On

## Performance Optimization

### Speed Settings
- **Auto Minify**: 
  - HTML: On
  - CSS: On
  - JavaScript: On
- **Brotli**: On
- **Early Hints**: On
- **HTTP/2 to Origin**: On
- **HTTP/3 (with QUIC)**: On
- **0-RTT Connection Resumption**: On

### Caching Configuration
- **Caching Level**: Standard
- **Browser Cache TTL**: 4 hours
- **Always Online**: On
- **Development Mode**: Off (for production)

### Page Rules
```
URL Pattern: morningbuddy.co.uk/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
- Browser Cache TTL: 4 hours

URL Pattern: morningbuddy.co.uk/api/*
Settings:
- Cache Level: Bypass
- Disable Apps
- Disable Performance
```

## Security Configuration

### Security Settings
- **Security Level**: Medium
- **Challenge Passage**: 30 minutes
- **Browser Integrity Check**: On
- **Privacy Pass**: On

### Firewall Rules
```
Rule 1: Block known bad bots
Expression: (cf.client.bot) and not (cf.verified_bot_category in {"Search Engine" "Social Media" "Monitoring"})
Action: Block

Rule 2: Rate limit API endpoints
Expression: (http.request.uri.path contains "/api/")
Action: Rate Limit (10 requests per minute per IP)

Rule 3: Block suspicious countries (optional)
Expression: (ip.geoip.country in {"CN" "RU" "KP"}) and (http.request.uri.path contains "/api/")
Action: Challenge
```

### Bot Fight Mode
- **Bot Fight Mode**: On
- **Super Bot Fight Mode**: On (if available)

## Network Configuration

### Network Settings
- **HTTP/2**: On
- **HTTP/3 (with QUIC)**: On
- **0-RTT Connection Resumption**: On
- **IPv6 Compatibility**: On
- **IP Geolocation**: On
- **Maximum Upload Size**: 100 MB

### Transform Rules
```
Rule 1: Add security headers
When: Hostname equals morningbuddy.co.uk
Then: Set static response header
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
```

## Analytics & Monitoring

### Analytics
- **Web Analytics**: On
- **Core Web Vitals**: Monitor
- **Bot Analytics**: On

### Alerts
- **Health Check Notifications**: On
- **SSL Certificate Expiration**: On
- **Origin Error Rate**: On (threshold: 5%)

## Advanced Configuration

### Workers (Optional)
For additional performance optimization, you can deploy a Cloudflare Worker:

```javascript
// worker.js - Optional performance worker
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Add security headers
  const response = await fetch(request)
  const newResponse = new Response(response.body, response)
  
  // Add performance headers
  newResponse.headers.set('X-Powered-By', 'Cloudflare Workers')
  newResponse.headers.set('X-Response-Time', Date.now())
  
  return newResponse
}
```

### Page Speed Optimization
- **Mirage**: On (for mobile optimization)
- **Polish**: Lossless (image optimization)
- **WebP**: On
- **Rocket Loader**: Off (can interfere with React hydration)

## Verification Steps

### 1. DNS Propagation
```bash
# Check DNS propagation
dig morningbuddy.co.uk
dig www.morningbuddy.co.uk
```

### 2. SSL Certificate
```bash
# Check SSL certificate
openssl s_client -connect morningbuddy.co.uk:443 -servername morningbuddy.co.uk
```

### 3. Performance Testing
```bash
# Test from multiple locations
curl -I https://morningbuddy.co.uk
curl -I https://www.morningbuddy.co.uk
```

### 4. Security Headers
Use [securityheaders.com](https://securityheaders.com) to verify security headers are properly configured.

### 5. Performance Metrics
Use [GTmetrix](https://gtmetrix.com) or [PageSpeed Insights](https://pagespeed.web.dev) to verify performance improvements.

## Troubleshooting

### Common Issues

1. **SSL Certificate Issues**
   - Ensure DNS is properly configured
   - Wait for certificate provisioning (up to 24 hours)
   - Check for mixed content warnings

2. **Caching Issues**
   - Use Development Mode for testing
   - Purge cache after changes
   - Check Page Rules configuration

3. **Performance Issues**
   - Verify Brotli compression is enabled
   - Check for blocking resources
   - Monitor Core Web Vitals

### Support Resources
- [Cloudflare Documentation](https://developers.cloudflare.com/)
- [SSL/TLS Configuration Guide](https://developers.cloudflare.com/ssl/)
- [Performance Optimization](https://developers.cloudflare.com/fundamentals/speed/)