import { expect, test } from '@playwright/test'

test.describe('Home and demos', () => {
  test('home renders every section in the locked order', async ({ page }) => {
    await page.goto('/')
    const ids = ['hero', 'services', 'demos', 'ai', 'process', 'trust', 'pricing', 'faq', 'start']
    const found = await page.locator('main section[id]').evaluateAll((els) => els.map((e) => e.id))
    expect(found).toEqual(ids)
    await expect(
      page.getByRole('heading', { name: 'Six services. Pick what your business needs.' }),
    ).toBeAttached()
    await expect(page.getByRole('heading', { name: 'Live demos for businesses like yours.' })).toBeAttached()
    await expect(page.getByRole('heading', { name: 'Make Your Website Smarter With AI' })).toBeAttached()
    await expect(page.getByRole('heading', { name: 'Simple, honest pricing.' })).toBeAttached()
    await expect(page.getByRole('heading', { name: "Have an Idea? Let's Build It." })).toBeAttached()
  })

  test('scripted AI demo answers when a chip is clicked', async ({ page }) => {
    await page.goto('/#ai')
    // The chips are client-side; wait for hydration (RevealObserver marks <html> on mount).
    await page.locator('html.reveal-ready').waitFor({ timeout: 15_000 })
    await page.getByRole('button', { name: 'Salon', exact: true }).click()
    await expect(page.getByText('I run a salon. What website do I need?')).toBeVisible()
    await expect(page.getByText(/booking-focused website/)).toBeVisible({ timeout: 10_000 })
  })

  test('demos page filters and opens a case study', async ({ page }) => {
    await page.goto('/demos')
    await expect(page.getByRole('heading', { name: 'Booking Website', exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Food', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Restaurant Website', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Salon Website', exact: true })).toHaveCount(0)
    await page.getByRole('link', { name: /Restaurant Website/ }).click()
    // First visit compiles the route in dev mode; allow for it.
    await expect(page).toHaveURL(/\/demos\/restaurant$/, { timeout: 30_000 })
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Restaurant Website')
    await expect(page.getByRole('heading', { name: 'The Challenge' })).toBeAttached()
    await expect(page.getByRole('heading', { name: 'Expected Outcome' })).toBeAttached()
  })

  test('services page has anchors used by the footer', async ({ page }) => {
    await page.goto('/services#ai')
    await expect(page.locator('#ai')).toBeAttached()
    await expect(page.locator('#booking-websites')).toBeAttached()
  })

  test('unknown demo returns 404', async ({ request }) => {
    const res = await request.get('/demos/does-not-exist')
    expect(res.status()).toBe(404)
  })
})
