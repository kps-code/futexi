import { describe, expect, it } from 'vitest'
import { formatIndianPhone, normalizeWhatsappNumber, whatsappLink } from '@/lib/whatsapp'

describe('whatsapp helpers', () => {
  it('normalises Indian numbers', () => {
    expect(normalizeWhatsappNumber('8883673422')).toBe('918883673422')
    expect(normalizeWhatsappNumber('+91 88836 73422')).toBe('918883673422')
  })
  it('builds wa.me links with encoded text', () => {
    expect(whatsappLink('8883673422')).toBe('https://wa.me/918883673422')
    expect(whatsappLink('918883673422', 'Hi, I am interested')).toBe(
      'https://wa.me/918883673422?text=Hi%2C%20I%20am%20interested',
    )
  })
  it('formats for display', () => {
    expect(formatIndianPhone('918883673422')).toBe('+91 88836 73422')
  })
})
