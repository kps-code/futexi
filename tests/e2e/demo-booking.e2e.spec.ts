import { expect, test, type Page } from '@playwright/test'
import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

const TEST_NAME = 'E2E Booking Test'

type Case = { business: string; bookPath: string; service: string; serviceSlug: string; refPrefix: string }

const cases: Case[] = [
  {
    business: 'booking',
    bookPath: '/demo/booking/book',
    service: 'Deep Tissue Massage',
    serviceSlug: 'deep-tissue-massage',
    refPrefix: 'NB',
  },
  {
    business: 'salon',
    bookPath: '/demo/salon/book',
    service: 'Haircut & Style',
    serviceSlug: 'velvet-haircut',
    refPrefix: 'VS',
  },
  {
    business: 'restaurant',
    bookPath: '/demo/restaurant/reserve',
    service: 'Table for 4',
    serviceSlug: 'table-4',
    refPrefix: 'SR',
  },
]

/** Walks the five-step flow and returns the reference shown on the confirmation. */
async function book(page: Page, c: Case): Promise<string> {
  await page.goto(c.bookPath)
  await page
    .getByRole('button', { name: new RegExp(c.service.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) })
    .click()
  await expect(page.getByRole('heading', { name: 'Pick a date' })).toBeVisible()
  // Second bookable date so "today" lead times never interfere.
  await page.getByTestId('date-list').locator('button').nth(1).click()
  await expect(page.getByRole('heading', { name: 'Pick a time' })).toBeVisible()
  const slot = page.getByTestId('slot-list').locator('button:not([disabled])').first()
  await expect(slot).toBeVisible({ timeout: 15_000 })
  await slot.click()
  await expect(page.getByRole('heading', { name: 'Your details' })).toBeVisible()
  await page.locator('#dm-name').fill(TEST_NAME)
  await page.locator('#dm-phone').fill('98765 43210')
  await page.getByRole('button', { name: /^Review / }).click()
  await expect(page.getByRole('heading', { name: /^Confirm your / })).toBeVisible()
  await page.getByRole('button', { name: /^Confirm / }).click()
  await expect(page.getByText(/requested$/)).toBeVisible({ timeout: 20_000 })
  return (await page.locator('strong.font-mono').textContent()) ?? ''
}

test.describe('Bookable demos', () => {
  test.afterAll(async () => {
    const payload = await getPayload({ config })
    await payload.delete({
      collection: 'demo-bookings',
      where: { name: { equals: TEST_NAME } },
      overrideAccess: true,
    })
  })

  test('landing pages render with the demo ribbon and noindex', async ({ page }) => {
    for (const path of ['/demo/booking', '/demo/salon', '/demo/restaurant']) {
      await page.goto(path)
      await expect(page.getByText('Concept demo by KAPOSA FUTEXI')).toBeVisible()
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    }
  })

  test('slots endpoint validates business and date', async ({ request }) => {
    expect((await request.get('/api/demo/booking/slots?business=salon&date=nope')).status()).toBe(400)
    expect((await request.get('/api/demo/booking/slots?business=nothing&date=2026-10-10')).status()).toBe(400)
    expect((await request.get('/api/demo/booking/slots?date=2099-01-01')).status()).toBe(400)
  })

  for (const c of cases) {
    test(`${c.business}: books end to end, stores the row and blocks the slot`, async ({ page }) => {
      const reference = await book(page, c)
      expect(reference).toMatch(new RegExp(`^${c.refPrefix}-[A-Z2-9]{6}$`))
      await expect(page.getByRole('link', { name: /Send confirmation on WhatsApp/ })).toHaveAttribute(
        'href',
        /wa\.me/,
      )

      const payload = await getPayload({ config })
      const stored = await payload.find({
        collection: 'demo-bookings',
        where: { reference: { equals: reference } },
        overrideAccess: true,
      })
      expect(stored.totalDocs).toBe(1)
      expect(stored.docs[0]).toMatchObject({
        business: c.business,
        service: c.serviceSlug,
        name: TEST_NAME,
        status: 'requested',
      })

      const { date, time } = stored.docs[0]
      const res = await page.request.get(`/api/demo/booking/slots?business=${c.business}&date=${date}`)
      const json = (await res.json()) as { slots: { time: string; available: boolean; reason?: string }[] }
      const taken = json.slots.find((s) => s.time === time)
      expect(taken).toMatchObject({ available: false, reason: 'booked' })
    })
  }
})
