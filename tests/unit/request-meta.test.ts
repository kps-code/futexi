import { describe, expect, it } from 'vitest'
import { hashIp, requestMetaFromHeaders } from '@/server/logging/request-meta'

describe('hashIp', () => {
  it('is stable within a day and never exposes the ip', () => {
    const a = hashIp('1.2.3.4', 'salt-salt-salt-salt')
    const b = hashIp('1.2.3.4', 'salt-salt-salt-salt')
    expect(a).toBe(b)
    expect(a).not.toContain('1.2.3.4')
    expect(a).toHaveLength(32)
    expect(hashIp(undefined, 'x')).toBeUndefined()
  })
})

describe('requestMetaFromHeaders', () => {
  it('reads id, visitor cookie, geo and client ip', () => {
    const h = new Headers({
      'x-request-id': '019245f3-0000-7000-8000-000000000000',
      cookie: 'kf_vid=abc; payload-token=zzz',
      'x-forwarded-for': '9.9.9.9, 10.0.0.1',
      'x-vercel-ip-country': 'IN',
      'x-vercel-ip-city': 'Chennai',
      'user-agent': 'Mozilla/5.0',
      referer: 'https://instagram.com/',
    })
    const m = requestMetaFromHeaders(h, 'POST', '/api/track', 'salt-salt-salt-salt')
    expect(m.requestId).toBe('019245f3-0000-7000-8000-000000000000')
    expect(m.visitorId).toBe('abc')
    expect(m.hasAdminCookie).toBe(true)
    expect(m.country).toBe('IN')
    expect(m.city).toBe('Chennai')
    expect(m.ipHash).toBe(hashIp('9.9.9.9', 'salt-salt-salt-salt'))
    expect(m.method).toBe('POST')
    expect(m.path).toBe('/api/track')
  })

  it('generates an id when missing', () => {
    const m = requestMetaFromHeaders(new Headers(), 'GET', '/', 'salt-salt-salt-salt')
    expect(m.requestId).toMatch(/^[0-9a-f-]{36}$/)
    expect(m.visitorId).toBeUndefined()
    expect(m.hasAdminCookie).toBe(false)
  })
})
