import { buildJsonLd } from '@/lib/json-ld'
import type { SiteSettings } from '@/server/site-data'

/** Local business and website structured data for search engines. */
export function JsonLd({ settings, siteUrl }: { settings: SiteSettings; siteUrl: string }) {
  const data = buildJsonLd(settings, siteUrl)
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inline; escape closing tags defensively.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
