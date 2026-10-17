import { expect, test } from '@playwright/test'

/** Salon demo (Velvet Salon): editorial home, price list and bridal pages. */
test.describe('Velvet Salon pages', () => {
  test('home uses the editorial fonts and links to the price list and bridal pages', async ({ page }) => {
    await page.goto('/demo/salon')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Beauty')
    const family = await page
      .getByRole('heading', { level: 1 })
      .evaluate((el) => getComputedStyle(el).fontFamily)
    expect(family).toContain('Bodoni')
    const nav = page.getByRole('navigation', { name: 'Velvet Salon' })
    await expect(nav.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/demo/salon/services')
    await expect(nav.getByRole('link', { name: 'Bridal' })).toHaveAttribute('href', '/demo/salon/bridal')
    await expect(page.getByRole('heading', { name: 'Meera Nair' })).toBeAttached()
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
})
