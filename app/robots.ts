import { siteConfig } from '@/lib/site'
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteConfig.alternates.canonical}/sitemap.xml`,
  }
}
