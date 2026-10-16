import { brand } from '@/content/site'

export type JsonLdSettings = {
  tagline: string
  seoDescription: string
  email: string
  whatsappNumber: string
  instagram?: string
  linkedin?: string
  github?: string
  startingPriceText: string
  city: string
  region: string
  ogImageUrl?: string
  logo?: { url: string } | null
}

/**
 * Structured data for search engines: a local professional service (so
 * "website developer Chennai" style searches can match) plus the website.
 */
export function buildJsonLd(settings: JsonLdSettings, siteUrl: string) {
  const base = siteUrl.replace(/\/+$/, '')
  const sameAs = [settings.instagram, settings.linkedin, settings.github].filter((x): x is string =>
    Boolean(x),
  )
  const absolute = (url: string) => (url.startsWith('http') ? url : `${base}${url}`)
  const image = settings.ogImageUrl ? absolute(settings.ogImageUrl) : `${base}/og-default.png`
  const logo = settings.logo?.url ? absolute(settings.logo.url) : undefined

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': `${base}/#business`,
      name: brand.name,
      url: base,
      image,
      logo,
      description: settings.seoDescription,
      slogan: settings.tagline,
      email: settings.email,
      telephone: `+${settings.whatsappNumber}`,
      priceRange: settings.startingPriceText,
      address: {
        '@type': 'PostalAddress',
        addressLocality: settings.city,
        addressRegion: settings.region,
        addressCountry: 'IN',
      },
      areaServed: [
        { '@type': 'City', name: settings.city },
        { '@type': 'Country', name: 'India' },
      ],
      knowsAbout: [
        'Business websites',
        'Landing pages',
        'Booking websites',
        'AI chat assistants',
        'Workflow automation',
        'Custom software',
      ],
      sameAs,
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
      url: base,
      publisher: { '@id': `${base}/#business` },
    },
  ]
}
