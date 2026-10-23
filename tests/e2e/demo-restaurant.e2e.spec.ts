import { expect, test } from '@playwright/test'

/** Restaurant demo: online ordering handed to WhatsApp, and the private dining page. */
test.describe('Restaurant demo pages', () => {
  test('order page builds a WhatsApp order with delivery rules', async ({ page }) => {
    await page.goto('/demo/restaurant/order')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Dinner at home')
    const summary = page.getByTestId('order-summary')
    const whatsapp = page.getByTestId('order-whatsapp')
    await expect(whatsapp).toHaveAttribute('aria-disabled', 'true')

    await page.getByRole('button', { name: 'Add Paniyaram Trio' }).click()
    // ₹179 is under the ₹300 delivery minimum: WhatsApp stays disabled with a hint.
    await expect(summary.getByText(/Minimum ₹300 for delivery/)).toBeVisible()
    await expect(whatsapp).toHaveAttribute('aria-disabled', 'true')

    await page.getByRole('button', { name: 'Add Mutton Kuzhambu' }).click()
    await page.getByRole('button', { name: 'Add one more Mutton Kuzhambu' }).click()
    // 179 + 2 × 549 = 1,277, above the free-delivery threshold.
    await expect(page.getByTestId('order-total')).toHaveText('₹1,277')
    await expect(summary.getByText('Free', { exact: true })).toBeVisible()
    await expect(whatsapp).toHaveAttribute('aria-disabled', 'false')
    const href = (await whatsapp.getAttribute('href')) ?? ''
    expect(href).toContain('wa.me/')
    const text = decodeURIComponent(href.split('text=')[1] ?? '')
    expect(text).toContain('2 x Mutton Kuzhambu')
    expect(text).toContain('Total ₹1,277 (delivery)')

    await page.getByRole('button', { name: /pickup/i }).click()
    await expect(summary.getByText('Pickup', { exact: true })).toBeVisible()
    await expect(page.getByTestId('order-call')).toHaveAttribute('href', /^tel:\+\d+$/)
  })

  test('private dining lists three packages with WhatsApp enquiry links', async ({ page }) => {
    await page.goto('/demo/restaurant/private-dining')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Dinner, made an occasion')
    const packages = page.getByTestId('packages')
    await expect(packages.locator(':scope > li')).toHaveCount(3)
    await expect(packages.getByText('₹2,999')).toBeVisible()
    const links = packages.getByRole('link', { name: 'Enquire on WhatsApp' })
    await expect(links).toHaveCount(3)
    expect(decodeURIComponent((await links.first().getAttribute('href')) ?? '')).toContain(
      'Candle-light dinner for two',
    )
    await expect(page.getByTestId('faq').locator('details')).toHaveCount(4)
  })

  test('home links to order and private dining and shows photos', async ({ page }) => {
    await page.goto('/demo/restaurant')
    const nav = page.getByRole('navigation', { name: 'Saffron Kitchen' })
    await expect(nav.getByRole('link', { name: 'Order' })).toHaveAttribute('href', '/demo/restaurant/order')
    await expect(nav.getByRole('link', { name: 'Private dining' })).toHaveAttribute(
      'href',
      '/demo/restaurant/private-dining',
    )
    await expect(page.getByRole('img', { name: /Tandoori chicken/ })).toBeVisible()
  })

  test('Motion v2 runs on desktop only: blurred characters, dish ring, editorial rows', async ({
    page,
    browser,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/demo/restaurant')
    await page.locator('html.dm-v2').waitFor({ timeout: 30_000 })
    await expect(page.locator('.v2-ch').first()).toBeAttached()
    await page.locator('.pin-spacer').waitFor({ timeout: 30_000 })
    await expect(page.locator('.rs-dish')).toHaveCount(6)
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto')

    const mobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    })
    const m = await mobile.newPage()
    await m.goto('/demo/restaurant')
    await m.waitForTimeout(2500)
    expect(await m.locator('html.dm-v2').count()).toBe(0)
    expect(await m.locator('.v2-ch').count()).toBe(0)
    await expect(m.locator('.rs-dish')).toHaveCount(6)
    await mobile.close()
  })
})
