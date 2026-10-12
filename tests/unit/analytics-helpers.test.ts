import { describe, expect, it } from 'vitest'
import { isBotUserAgent } from '@/lib/bots'
import { parseCookies, serializeCookie } from '@/lib/cookies'
import { parseDevice } from '@/lib/device'
import { referrerHost, utmFromSearch } from '@/lib/utm'
import { trackBatch } from '@/server/analytics/schema'
import { istDayStart } from '@/server/analytics/stats'
import { createLimiter } from '@/server/rate-limit'

describe('isBotUserAgent', () => {
  it('flags crawlers and empty agents', () => {
    expect(isBotUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1)')).toBe(true)
    expect(isBotUserAgent('curl/8.0')).toBe(true)
    expect(isBotUserAgent('')).toBe(true)
    expect(isBotUserAgent(null)).toBe(true)
  })
  it('passes real browsers', () => {
    expect(isBotUserAgent('Mozilla/5.0 (Linux; Android 14) Chrome/120 Mobile Safari/537.36')).toBe(false)
  })
})

describe('parseDevice', () => {
  it('classifies android phone', () => {
    const d = parseDevice(
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36',
    )
    expect(d).toEqual({ device: 'mobile', browser: 'Chrome', os: 'Android' })
  })
  it('classifies ipad and windows desktop', () => {
    expect(parseDevice('Mozilla/5.0 (iPad; CPU OS 17_0) Version/17.0 Safari/605.1').device).toBe('tablet')
    const w = parseDevice('Mozilla/5.0 (Windows NT 10.0; Win64) Chrome/120 Safari/537.36 Edg/120')
    expect(w).toEqual({ device: 'desktop', browser: 'Edge', os: 'Windows' })
  })
})

describe('utm and referrer', () => {
  it('extracts utm params from search or url', () => {
    expect(utmFromSearch('?utm_source=instagram&utm_medium=bio&utm_campaign=salon')).toEqual({
      source: 'instagram',
      medium: 'bio',
      campaign: 'salon',
    })
    expect(utmFromSearch('https://x.com/?utm_source=ig').source).toBe('ig')
    expect(utmFromSearch('')).toEqual({})
  })
  it('returns external referrer host only', () => {
    expect(referrerHost('https://www.instagram.com/p/abc', 'kaposafutexi.com')).toBe('instagram.com')
    expect(referrerHost('https://kaposafutexi.com/demos', 'kaposafutexi.com')).toBeUndefined()
    expect(referrerHost('garbage', 'x')).toBeUndefined()
  })
})

describe('cookies', () => {
  it('parses and serialises', () => {
    expect(parseCookies('a=1; kf_vid=abc%20d; b')).toEqual({ a: '1', kf_vid: 'abc d' })
    expect(serializeCookie('kf_sid', 'x.1', { maxAge: 1800, secure: true })).toBe(
      'kf_sid=x.1; Max-Age=1800; Path=/; SameSite=Lax; HttpOnly; Secure',
    )
  })
})

describe('track schema', () => {
  it('accepts a valid batch and rejects unknown events', () => {
    const ok = trackBatch.safeParse({
      items: [
        { type: 'page_view', path: '/', ts: 1 },
        { type: 'page_leave', path: '/', durationMs: 1200, maxScrollPct: 80, ts: 2 },
        { type: 'event', name: 'cta_click', path: '/', props: { cta: 'hero' }, ts: 3 },
      ],
    })
    expect(ok.success).toBe(true)
    const bad = trackBatch.safeParse({ items: [{ type: 'event', name: 'rm_rf', path: '/', ts: 1 }] })
    expect(bad.success).toBe(false)
    expect(trackBatch.safeParse({ items: [] }).success).toBe(false)
  })
})

describe('rate limiter', () => {
  it('allows up to max then blocks', () => {
    const l = createLimiter(3, 60_000)
    expect(l.check('k').ok).toBe(true)
    expect(l.check('k').ok).toBe(true)
    expect(l.check('k').ok).toBe(true)
    expect(l.check('k').ok).toBe(false)
    expect(l.check('other').ok).toBe(true)
  })
})

describe('istDayStart', () => {
  it('returns midnight IST as a UTC instant', () => {
    // 2026-10-07T11:00:00Z = 16:30 IST -> day start 00:00 IST = 2026-10-06T18:30:00Z
    const d = istDayStart(Date.parse('2026-10-07T11:00:00Z'))
    expect(d.toISOString()).toBe('2026-10-06T18:30:00.000Z')
  })
})
