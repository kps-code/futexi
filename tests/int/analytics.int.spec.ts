import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import config from '@/payload.config'
import { newVisitorId, nextSession } from '@/lib/session'
import { ingestBatch } from '@/server/analytics/ingest'
import { getDashboardStats } from '@/server/analytics/stats'
import type { RequestMeta } from '@/server/logging/request-meta'

let payload: Payload
const visitorId = newVisitorId()
const session = nextSession(null)

const meta: RequestMeta = {
  requestId: '00000000-0000-7000-8000-000000000000',
  method: 'POST',
  path: '/api/track',
  visitorId,
  country: 'IN',
  city: 'Chennai',
  userAgent: 'Mozilla/5.0 (Linux; Android 14) Chrome/120 Mobile Safari/537.36',
  hasAdminCookie: false,
}

describe('analytics ingest', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  afterAll(async () => {
    for (const collection of ['page-views', 'events', 'sessions', 'visitors'] as const) {
      await payload.delete({ collection, where: { visitorId: { equals: visitorId } }, overrideAccess: true })
    }
  })

  it('writes visitor, session, page view and event, then fills duration on leave', async () => {
    const t = Date.now()
    const first = await ingestBatch(
      {
        items: [
          {
            type: 'page_view',
            path: '/demos',
            title: 'Demos',
            referrer: 'https://www.instagram.com/',
            search: '?utm_source=instagram',
            viewportWidth: 390,
            theme: 'dark',
            ts: t,
          },
          { type: 'event', name: 'demo_open', path: '/demos', props: { slug: 'salon' }, ts: t + 100 },
        ],
      },
      { visitorId, session, meta, ownHost: 'localhost', now: t + 200 },
    )
    expect(first).toMatchObject({ pageViews: 1, events: 1, leaves: 0, dropped: 0 })

    const visitor = await payload.find({
      collection: 'visitors',
      where: { visitorId: { equals: visitorId } },
      overrideAccess: true,
    })
    expect(visitor.docs[0]).toMatchObject({
      firstLandingPath: '/demos',
      firstReferrer: 'https://www.instagram.com/',
      device: 'mobile',
      os: 'Android',
      country: 'IN',
    })
    expect(visitor.docs[0].firstUtm?.source).toBe('instagram')

    const second = await ingestBatch(
      { items: [{ type: 'page_leave', path: '/demos', durationMs: 5000, maxScrollPct: 90, ts: t + 5000 }] },
      { visitorId, session, meta, ownHost: 'localhost', now: t + 5100 },
    )
    expect(second.leaves).toBe(1)

    const views = await payload.find({
      collection: 'page-views',
      where: { visitorId: { equals: visitorId } },
      overrideAccess: true,
    })
    expect(views.totalDocs).toBe(1)
    expect(views.docs[0]).toMatchObject({ path: '/demos', durationMs: 5000, maxScrollPct: 90 })

    const sessions = await payload.find({
      collection: 'sessions',
      where: { visitorId: { equals: visitorId } },
      overrideAccess: true,
    })
    expect(sessions.totalDocs).toBe(1)
    expect(sessions.docs[0]).toMatchObject({ landingPath: '/demos', pageCount: 1 })
  })

  it('drops duplicate page views fired within a second', async () => {
    const t = Date.now()
    const res = await ingestBatch(
      {
        items: [
          { type: 'page_view', path: '/about', ts: t },
          { type: 'page_view', path: '/about', ts: t + 300 },
        ],
      },
      { visitorId, session, meta, ownHost: 'localhost', now: t + 400 },
    )
    expect(res).toMatchObject({ pageViews: 1, dropped: 1 })
  })

  it('dashboard stats query runs and counts this visitor', async () => {
    const stats = await getDashboardStats(payload)
    expect(stats.periods.today.pageViews).toBeGreaterThanOrEqual(2)
    expect(stats.topPages.some((p) => p.path === '/demos')).toBe(true)
    expect(stats.live.length).toBeGreaterThan(0)
  })
})
