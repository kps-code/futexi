import { expect, test } from '@playwright/test'
import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

const isTrack = (r: { url(): string; method(): string }) =>
  r.url().endsWith('/api/track') && r.method() === 'POST'

test.describe('Tracking', () => {
  test('issues visitor and session cookies on the first page', async ({ page, context }) => {
    await page.goto('/')
    const cookies = await context.cookies()
    const names = cookies.map((c) => c.name)
    expect(names).toContain('kf_vid')
    expect(names).toContain('kf_sid')
    const vid = cookies.find((c) => c.name === 'kf_vid')
    expect(vid?.httpOnly).toBe(true)
  })

  test('records a page view and a cta click for the visitor in the database', async ({ page, context }) => {
    // Beacon bodies are not exposed to Playwright, so assert on what the server stored.
    const first = page.waitForRequest(isTrack)
    await page.goto('/')
    await first
    const vid = (await context.cookies()).find((c) => c.name === 'kf_vid')?.value
    expect(vid).toBeTruthy()

    const second = page.waitForRequest(isTrack)
    await page.getByRole('link', { name: 'Explore Our Work' }).click()
    await second

    const payload = await getPayload({ config })
    try {
      await expect
        .poll(
          async () => {
            const res = await payload.find({
              collection: 'page-views',
              where: { visitorId: { equals: vid } },
              overrideAccess: true,
            })
            return res.docs.map((d) => d.path)
          },
          { timeout: 15_000 },
        )
        .toContain('/')

      await expect
        .poll(
          async () => {
            const res = await payload.find({
              collection: 'events',
              where: { and: [{ visitorId: { equals: vid } }, { name: { equals: 'cta_click' } }] },
              overrideAccess: true,
            })
            return res.totalDocs
          },
          { timeout: 15_000 },
        )
        .toBeGreaterThan(0)
    } finally {
      for (const collection of ['page-views', 'events', 'sessions', 'visitors'] as const) {
        await payload.delete({ collection, where: { visitorId: { equals: vid } }, overrideAccess: true })
      }
    }
  })
})
