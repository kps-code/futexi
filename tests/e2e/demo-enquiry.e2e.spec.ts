import { expect, test } from '@playwright/test'
import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

const TEST_NAME = 'Playwright Enquiry Test'

test.describe('Enquiry demos', () => {
  test.afterAll(async () => {
    const payload = await getPayload({ config })
    await payload.delete({
      collection: 'demo-leads',
      where: { name: { equals: TEST_NAME } },
      overrideAccess: true,
    })
  })

  test('interior: project pages render and the enquiry stores a lead', async ({ page }) => {
    await page.goto('/demo/interior')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Interiors')
    await page
      .getByRole('link', { name: /Sea Breeze Apartment/ })
      .first()
      .click()
    await expect(page).toHaveURL(/\/demo\/interior\/projects\/sea-breeze-apartment$/, { timeout: 30_000 })
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sea Breeze Apartment')
    await expect(page.getByText('Open kitchen with 3.2 m island')).toBeVisible()

    await page.goto('/demo/interior#enquire')
    const form = page.getByTestId('enquiry-form')
    await form.locator('#name').fill(TEST_NAME)
    await form.locator('#phone').fill('98765 43210')
    await form.locator('#interest').selectOption('Modular Kitchens')
    await form.locator('#details').fill('Two-bedroom apartment, kitchen first.')
    await form.getByRole('button', { name: /Start the conversation/ }).click()
    const ok = page.getByTestId('enquiry-success')
    await expect(ok).toBeVisible({ timeout: 20_000 })
    const reference = ((await ok.textContent()) ?? '').match(/AN-[A-Z2-9]{6}/)?.[0]
    expect(reference).toBeTruthy()

    const payload = await getPayload({ config })
    const stored = await payload.find({
      collection: 'demo-leads',
      where: { reference: { equals: reference } },
      overrideAccess: true,
    })
    expect(stored.totalDocs).toBe(1)
    expect(stored.docs[0]).toMatchObject({
      business: 'interior',
      name: TEST_NAME,
      interest: 'Modular Kitchens',
      status: 'new',
    })
  })

  test('tuition: courses, batches and the admission enquiry', async ({ page }) => {
    await page.goto('/demo/tuition')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Small batches')
    await expect(page.getByRole('heading', { name: 'NEET Foundation' }).first()).toBeVisible()
    await expect(page.locator('#batches')).toBeAttached()
    await expect(page.locator('#results')).toBeAttached()

    const form = page.getByTestId('enquiry-form')
    await form.locator('#name').fill(TEST_NAME)
    await form.locator('#phone').fill('98765 43210')
    await form.locator('#interest').selectOption('NEET Foundation')
    await form.locator('#studentClass').selectOption('Class 11')
    await form.getByRole('button', { name: /Request a callback/ }).click()
    const ok = page.getByTestId('enquiry-success')
    await expect(ok).toBeVisible({ timeout: 20_000 })
    expect((await ok.textContent()) ?? '').toMatch(/VA-[A-Z2-9]{6}/)

    const payload = await getPayload({ config })
    const stored = await payload.find({
      collection: 'demo-leads',
      where: { and: [{ name: { equals: TEST_NAME } }, { business: { equals: 'tuition' } }] },
      overrideAccess: true,
    })
    expect(stored.totalDocs).toBe(1)
    expect(stored.docs[0].interest).toBe('NEET Foundation')
    expect(stored.docs[0].details ?? '').toMatch(/Class 11/)
  })

  test('enquiry validation rejects a bad phone number', async ({ page }) => {
    await page.goto('/demo/tuition#enquire')
    const form = page.getByTestId('enquiry-form')
    await form.locator('#name').fill(TEST_NAME)
    await form.locator('#phone').fill('123')
    await form.locator('#interest').selectOption('Spoken English')
    await form.getByRole('button', { name: /Request a callback/ }).click()
    await expect(form.getByText(/valid WhatsApp number/)).toBeVisible({ timeout: 15_000 })
  })
})
