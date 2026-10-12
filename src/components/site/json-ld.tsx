import { brand } from '@/content/site'
import type { SiteSettings } from '@/server/site-data'

/** Organization and WebSite structured data for search engines. */
export function JsonLd({ settings, siteUrl }: { settings: SiteSettings; siteUrl: string }) {
  const sameAs = [settings.instagram, settings.linkedin, settings.github].filter(Boolean)
  const data = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: brand.name,
      url: siteUrl,
      description: settings.tagline,
      email: settings.email,
      telephone: `+${settings.whatsappNumber}`,
      sameAs,
      areaServed: 'IN',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'sales',
          telephone: `+${settings.whatsappNumber}`,
          email: settings.email,
          availableLanguage: ['en', 'ta'],
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: brand.name,
      url: siteUrl,
    },
  ]
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inline; escape closing tags defensively.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
