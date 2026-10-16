import { expect, test } from '@playwright/test'

test.describe('Frontend', () => {
  test('home renders the hero and primary navigation', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/KAPOSA FUTEXI/)
    await expect(page.locator('h1').first()).toContainText('Your Ideas. Our Technology.')

    const nav = page.getByRole('navigation', { name: 'Primary' })
    for (const label of ['Home', 'Services', 'Demos', 'About', 'Contact']) {
      await expect(nav.getByRole('link', { name: label })).toBeVisible()
    }
  })

  test('footer and structured data carry the business location', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('footer')).toContainText('Chennai, Tamil Nadu')
    const ld = await page.locator('script[type="application/ld+json"]').first().textContent()
    const data = JSON.parse(ld ?? '[]') as Array<Record<string, unknown>>
    const business = data.find((d) => d['@type'] === 'ProfessionalService')
    expect(business).toBeTruthy()
    expect((business?.address as Record<string, string>).addressLocality).toBe('Chennai')
  })

  test('phone: the menu button opens the navigation', async ({ browser }) => {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    })
    const page = await ctx.newPage()
    await page.goto('/')
    await page.locator('html.reveal-ready').waitFor({ timeout: 15_000 })
    const nav = page.getByRole('navigation', { name: 'Mobile' })
    await expect(nav).toBeHidden()
    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(nav).toBeVisible()
    const box = await nav.boundingBox()
    expect(box?.height ?? 0).toBeGreaterThan(200)
    for (const label of ['Home', 'Services', 'Demos', 'About', 'Contact']) {
      await expect(nav.getByRole('link', { name: label })).toBeVisible()
    }
    await nav.getByRole('link', { name: 'Services' }).click()
    await expect(page).toHaveURL(/\/services$/)
    await expect(nav).toBeHidden()
    await ctx.close()
  })

  test('theme toggle switches the html class', async ({ page }) => {
    // Light is the default (Site Settings > Branding); the toggle flips to dark and back.
    await page.goto('/')
    const html = page.locator('html')
    await expect(html).toContainClass('light')
    await page.getByRole('button', { name: /switch to dark theme/i }).click()
    await expect(html).toContainClass('dark')
    await page.getByRole('button', { name: /switch to light theme/i }).click()
    await expect(html).not.toContainClass('dark')
  })

  test('health endpoint responds and echoes a request id', async ({ request }) => {
    const res = await request.get('/api/health')
    expect(res.ok()).toBe(true)
    expect(res.headers()['x-request-id']).toMatch(/^[0-9a-f-]{36}$/)
    const body = await res.json()
    expect(body.ok).toBe(true)
  })
})
