import type { MetadataRoute } from 'next'
import { clientEnv } from '@/server/env'

export default function robots(): MetadataRoute.Robots {
  const base = clientEnv.NEXT_PUBLIC_SITE_URL
  return {
    // Demo mini-sites are concept projects, not real businesses: keep them out of search.
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/demo/', '/feedback/'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
