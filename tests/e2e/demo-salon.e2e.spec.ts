import { expect, test } from '@playwright/test'

/** Salon demo (Velvet Salon): editorial home, price list and bridal pages. */
test.describe('Velvet Salon pages', () => {
  test('home uses the editorial fonts and links to the price list and bridal pages', async ({ page }) => {
    await page.goto('/demo/salon')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('More than')
    const family = await page
      .getByRole('heading', { level: 1 })
      .evaluate((el) => getComputedStyle(el).fontFamily)
    expect(family).toContain('DM Serif')
    const nav = page.getByRole('navigation', { name: 'Velvet Salon' })
    await expect(nav.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/demo/salon/services')
    await expect(nav.getByRole('link', { name: 'Bridal' })).toHaveAttribute('href', '/demo/salon/bridal')
    await expect(page.getByRole('heading', { name: 'Meera Nair' })).toBeAttached()
    await expect(page.getByRole('heading', { name: 'Faisal Rahman' })).toBeAttached()
  })

  test('price list shows four categories and books a service with it preselected', async ({ page }) => {
    await page.goto('/demo/salon/services')
    const list = page.getByTestId('price-list')
    await expect(list.locator(':scope > div > article')).toHaveCount(4)
    await expect(list.getByText('₹4,999')).toBeVisible()
    await list.getByRole('link', { name: 'Book' }).first().click()
    await expect(page).toHaveURL(/\/demo\/salon\/book\?service=velvet-haircut$/, { timeout: 30_000 })
    await expect(page.getByTestId('date-list')).toBeVisible({ timeout: 30_000 })
  })

  test('bridal page lists three packages with WhatsApp enquiries and a trial booking', async ({ page }) => {
    await page.goto('/demo/salon/bridal')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('The morning')
    const packages = page.getByTestId('packages')
    await expect(packages.locator(':scope > li')).toHaveCount(3)
    await expect(packages.getByText('₹18,000')).toBeVisible()
    const links = packages.getByRole('link', { name: 'Enquire on WhatsApp' })
    await expect(links).toHaveCount(3)
    expect(decodeURIComponent((await links.nth(1).getAttribute('href')) ?? '')).toContain('Muhurtham')
    await expect(page.getByRole('link', { name: 'Book a trial' })).toHaveAttribute(
      'href',
      '/demo/salon/book?service=velvet-bridal',
    )
    await expect(page.getByTestId('faq').locator('details')).toHaveCount(4)
  })
  test('Motion v2 runs on desktop only: skewed words, type band, sticky bridal image', async ({
    page,
    browser,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/demo/salon')
    await page.locator('html.dm-v2').waitFor({ timeout: 30_000 })
    await page.locator('.pin-spacer').waitFor({ timeout: 30_000 })
    await expect(page.locator('.v2-band-row')).toHaveCount(2)
    expect(await page.locator('.v2-ch').count()).toBe(0)
    expect(await page.locator('.v2-marquee').count()).toBe(0)
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto')

    const mobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    })
    const m = await mobile.newPage()
    await m.goto('/demo/salon')
    await m.waitForTimeout(2500)
    expect(await m.locator('html.dm-v2').count()).toBe(0)
    await expect(m.locator('.v2-band')).toBeAttached()
    await mobile.close()
  })
})
