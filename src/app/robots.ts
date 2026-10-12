import type { MetadataRoute } from 'next'
import { clientEnv } from '@/server/env'

export default function robots(): MetadataRoute.Robots {
  const base = clientEnv.NEXT_PUBLIC_SITE_URL
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
