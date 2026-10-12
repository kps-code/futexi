import { describe, expect, it } from 'vitest'
import { buildJsonLd } from '@/lib/json-ld'

const settings = {
  tagline: 'We Build Digital Experiences That Move Businesses Forward.',
  seoDescription: 'Websites, AI assistants and automation for growing businesses in Chennai.',
  email: 'hello@example.com',
  whatsappNumber: '918883673422',
  linkedin: 'https://www.linkedin.com/in/example',
  startingPriceText: 'Projects start from ₹5,000',
  city: 'Chennai',
  region: 'Tamil Nadu',
}

describe('buildJsonLd', () => {
  it('describes a local professional service with the city and state', () => {
    const [business, site] = buildJsonLd(settings, 'https://kaposafutexi.com/')
    expect(business['@type']).toBe('ProfessionalService')
    expect(business.url).toBe('https://kaposafutexi.com')
    expect(business.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Chennai',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
    })
    expect(business.telephone).toBe('+918883673422')
    expect(business.sameAs).toEqual(['https://www.linkedin.com/in/example'])
    expect(business.image).toBe('https://kaposafutexi.com/og-default.png')
    expect(site['@type']).toBe('WebSite')
    expect(site.publisher).toEqual({ '@id': 'https://kaposafutexi.com/#business' })
  })

  it('uses an uploaded share image when present', () => {
    const [business] = buildJsonLd(
      { ...settings, ogImageUrl: '/api/media/file/share.png' },
      'https://kaposafutexi.com',
    )
    expect(business.image).toBe('https://kaposafutexi.com/api/media/file/share.png')
  })
})
