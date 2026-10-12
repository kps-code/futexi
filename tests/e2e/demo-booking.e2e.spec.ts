import { expect, test } from '@playwright/test'
import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

const TEST_NAME = 'E2E Booking Test'

test.describe('Booking demo', () => {
  test.afterAll(async () => {
    const payload = await getPayload({ config })
    await payload.delete({
      collection: 'demo-bookings',
      where: { name: { equals: TEST_NAME } },
      overrideAccess: true,
    })
  })

  test('landing page renders Nova Studio with the demo ribbon', async ({ page }) => {
    await page.goto('/demo/booking')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Book your appointment/)
    await expect(page.getByText('Concept demo by KAPOSA FUTEXI')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Signature Facial' })).toBeVisible()
    // Demo sites are kept out of search.
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  })

  test('slots endpoint validates dates', async ({ request }) => {
    expect((await request.get('/api/demo/booking/slots?date=nope')).status()).toBe(400)
    expect((await request.get('/api/demo/booking/slots?date=2099-01-01')).status()).toBe(400)
  })

  test('books an appointment end to end and stores it', async ({ page }) => {
    await page.goto('/demo/booking/book')

    // 1 service
    await page.getByRole('button', { name: /Deep Tissue Massage/ }).click()
    // 2 date: pick the second bookable date so "today" lead times never interfere
    await expect(page.getByRole('heading', { name: 'Pick a date' })).toBeVisible()
    await page.locator('ul.overflow-x-auto button').nth(1).click()
    // 3 time: first available slot
    await expect(page.getByRole('heading', { name: 'Pick a time' })).toBeVisible()
    const slot = page.locator('ul.grid button:not([disabled])').first()
    await expect(slot).toBeVisible({ timeout: 15_000 })
    const slotLabel = (await slot.textContent())?.trim()
    await slot.click()
    // 4 details
    await expect(page.getByRole('heading', { name: 'Your details' })).toBeVisible()
    await page.locator('#nv-name').fill(TEST_NAME)
    await page.locator('#nv-phone').fill('98765 43210')
    await page.locator('#nv-notes').fill('Created by the Playwright suite.')
    await page.getByRole('button', { name: 'Review booking' }).click()
    // 5 confirm
    await expect(page.getByRole('heading', { name: 'Confirm your booking' })).toBeVisible()
    await expect(page.locator('dl').getByText(slotLabel ?? '', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Confirm booking' }).click()

    await expect(page.getByText('Booking requested')).toBeVisible({ timeout: 20_000 })
    const reference = await page.locator('strong.font-mono').textContent()
    expect(reference).toMatch(/^NV-[A-Z2-9]{6}$/)
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
      service: 'deep-tissue-massage',
      name: TEST_NAME,
      status: 'requested',
    })

    // The slot is now unavailable to the next visitor.
    const date = stored.docs[0].date
    const res = await page.request.get(`/api/demo/booking/slots?date=${date}`)
    const json = (await res.json()) as { slots: { time: string; available: boolean; reason?: string }[] }
    const taken = json.slots.find((s) => s.time === stored.docs[0].time)
    expect(taken?.available).toBe(false)
    expect(taken?.reason).toBe('booked')
  })
})
