import { expect, test } from '@playwright/test'

/** Booking demo (Nova Studio): resort-style home, booking bar, treatments and memberships. */
test.describe('Nova Studio pages', () => {
  test('booking bar opens the flow with treatment and date preselected', async ({ page }) => {
    await page.goto('/demo/booking')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Your hour of calm')
    const bar = page.getByTestId('booking-bar')
    await bar.getByLabel('Treatment').selectOption('hair-spa')
    const dates = bar.getByRole('button', { pressed: false })
    await dates.nth(1).click()
    const link = bar.getByRole('link', { name: /Check availability/ })
    const href = (await link.getAttribute('href')) ?? ''
    expect(href).toMatch(/\/demo\/booking\/book\?service=hair-spa&date=\d{4}-\d{2}-\d{2}$/)
    await link.click()
    await expect(page).toHaveURL(/\/demo\/booking\/book\?service=hair-spa&date=/, { timeout: 30_000 })
    // With both preselected the flow starts at the time step.
    await expect(page.getByTestId('slot-list')).toBeVisible({ timeout: 30_000 })
  })

  test('treatments page lists the four rooms with prices and a reserve link each', async ({ page }) => {
    await page.goto('/demo/booking/treatments')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Four rooms')
    const list = page.getByTestId('treatments')
    await expect(list.locator(':scope > article')).toHaveCount(4)
    await expect(list.getByText('₹1,499')).toBeVisible()
    await expect(list.getByRole('link', { name: 'Reserve this room' }).first()).toHaveAttribute(
      'href',
      '/demo/booking/book?service=signature-facial',
    )
    await expect(page.getByTestId('faq').locator('details')).toHaveCount(4)
  })

  test('memberships page shows three plans with WhatsApp links', async ({ page }) => {
    await page.goto('/demo/booking/membership')
    const plans = page.getByTestId('plans')
    await expect(plans.locator(':scope > li')).toHaveCount(3)
    await expect(plans.getByText('₹2,999')).toBeVisible()
    const links = plans.getByRole('link', { name: 'Start on WhatsApp' })
    await expect(links).toHaveCount(3)
    expect(decodeURIComponent((await links.first().getAttribute('href')) ?? '')).toContain('Monthly plan')
  })

  test('uses its own fonts and nav, and never adds a custom cursor', async ({ page, browser }) => {
    await page.goto('/demo/booking')
    const nav = page.getByRole('navigation', { name: 'Nova Studio' })
    await expect(nav.getByRole('link', { name: 'Treatments' })).toHaveAttribute(
      'href',
      '/demo/booking/treatments',
    )
    const family = await page
      .getByRole('heading', { level: 1 })
      .evaluate((el) => getComputedStyle(el).fontFamily)
    expect(family).toContain('Cormorant')
    const mobile = await browser.newContext({
      viewport: { width: 375, height: 812 },
      hasTouch: true,
      isMobile: true,
    })
    const m = await mobile.newPage()
    await m.goto('/demo/booking')
    await m.waitForTimeout(1000)
    expect(await m.locator('.dm-cursor-ring').count()).toBe(0)
    expect(await page.locator('.dm-cursor-ring').count()).toBe(0)
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).cursor)).toBe('auto')
    await mobile.close()
  })
})
