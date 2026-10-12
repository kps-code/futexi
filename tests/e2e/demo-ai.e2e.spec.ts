import { expect, test } from '@playwright/test'
import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

const TEST_NAME = 'Playwright Lead Test'

test.describe('AI business demo', () => {
  test.afterAll(async () => {
    const payload = await getPayload({ config })
    await payload.delete({
      collection: 'demo-leads',
      where: { name: { equals: TEST_NAME } },
      overrideAccess: true,
    })
  })

  test('assistant answers questions and captures a trial lead into the admin', async ({ page }) => {
    await page.goto('/demo/ai-business')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Train smarter')

    // A chip question gets a knowledge-base answer.
    await page.getByRole('button', { name: 'Plans and pricing' }).click()
    await expect(page.locator('#assistant').getByText(/Monthly ₹1,999/)).toBeVisible({ timeout: 10_000 })

    // Typed question.
    await page.locator('#ai-input').fill('do you have parking?')
    await page.getByRole('button', { name: 'Send' }).click()
    await expect(page.locator('#assistant').getByText(/two-wheeler parking/)).toBeVisible({ timeout: 10_000 })

    // Lead capture: trial -> name -> phone.
    await page.getByRole('button', { name: 'Book a free trial' }).click()
    await expect(page.getByText(/What is your name/)).toBeVisible({ timeout: 10_000 })
    await page.locator('#ai-input').fill(TEST_NAME)
    await page.getByRole('button', { name: 'Send' }).click()
    await expect(page.getByText(/WhatsApp number/)).toBeVisible({ timeout: 10_000 })
    await page.locator('#ai-input').fill('98765 43210')
    await page.getByRole('button', { name: 'Send' }).click()

    const captured = page.getByTestId('lead-captured')
    await expect(captured).toBeVisible({ timeout: 20_000 })
    const text = (await captured.textContent()) ?? ''
    const reference = text.match(/PF-[A-Z2-9]{6}/)?.[0]
    expect(reference).toBeTruthy()
    await expect(captured.getByRole('link', { name: /Open WhatsApp/ })).toHaveAttribute('href', /wa\.me/)

    const payload = await getPayload({ config })
    const stored = await payload.find({
      collection: 'demo-leads',
      where: { reference: { equals: reference } },
      overrideAccess: true,
    })
    expect(stored.totalDocs).toBe(1)
    expect(stored.docs[0]).toMatchObject({
      name: TEST_NAME,
      phone: '98765 43210',
      interest: 'Free trial',
      status: 'new',
    })
    expect(Array.isArray(stored.docs[0].transcript)).toBe(true)
  })
})
