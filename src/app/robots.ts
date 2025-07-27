import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.SITE_URL || 'https://morningbuddy.co.uk'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/thank-you'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}