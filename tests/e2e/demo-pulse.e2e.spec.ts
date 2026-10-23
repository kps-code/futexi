import { expect, test } from '@playwright/test'

/** AI demo (Pulse Fitness): schedule with filters, coaches page, sporty fonts. */
test.describe('Pulse Fitness pages', () => {
  test('schedule filters sessions by class and preselects from the query string', async ({ page }) => {
    await page.goto('/demo/ai-business/schedule')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('96 classes')
    const count = page.getByTestId('slot-count')
    await expect(count).toHaveText(/\d+ sessions this week/)
    const all = Number(((await count.textContent()) ?? '0').split(' ')[0])
    expect(all).toBeGreaterThan(80)
    await page.getByRole('button', { name: /^Boxing/ }).click()
    await expect(count).toHaveText('3 sessions this week')
    await expect(page.getByTestId('timetable').getByText('Rest day')).toHaveCount(4)

    await page.goto('/demo/ai-business/schedule?class=yoga')
    await expect(page.getByRole('button', { name: /^Yoga/ })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByTestId('slot-count')).toHaveText('13 sessions this week')
  })

  test('coaches page lists four coaches and three transformations', async ({ page }) => {
    await page.goto('/demo/ai-business/trainers')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Coached')
    await expect(page.getByTestId('coaches').locator(':scope > li')).toHaveCount(4)
    await expect(page.getByText('ACE CPT')).toBeVisible()
    await expect(page.getByTestId('transformations').locator(':scope > li')).toHaveCount(3)
    await expect(page.getByText('→ 81 kg')).toBeVisible()
  })

  test('home uses the sporty fonts and links to the new pages', async ({ page }) => {
    await page.goto('/demo/ai-business')
    const family = await page
      .getByRole('heading', { level: 1 })
      .evaluate((el) => getComputedStyle(el).fontFamily)
    expect(family).toContain('Bebas')
    const nav = page.getByRole('navigation', { name: 'Pulse Fitness' })
    await expect(nav.getByRole('link', { name: 'Schedule' })).toHaveAttribute(
      'href',
      '/demo/ai-business/schedule',
    )
    await expect(nav.getByRole('link', { name: 'Coaches' })).toHaveAttribute(
      'href',
      '/demo/ai-business/trainers',
    )
    await expect(page.locator('#assistant')).toBeVisible()
  })
  test('Motion v2 runs on desktop only: character slam, manifesto words, pinned strip', async ({
    page,
    browser,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/demo/ai-business')
    await page.locator('html.dm-v2').waitFor({ timeout: 30_000 })
    await expect(page.locator('.v2-ch').first()).toBeAttached()
    await page.waitForFunction(() => document.querySelectorAll('.v2-w').length > 10, undefined, {
      timeout: 30_000,
    })
    await expect(page.locator('.pin-spacer')).toHaveCount(1)
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto')

    const mobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    })
    const m = await mobile.newPage()
    await m.goto('/demo/ai-business')
    await m.waitForTimeout(2500)
    expect(await m.locator('html.dm-v2').count()).toBe(0)
    expect(await m.locator('.v2-ch').count()).toBe(0)
    await expect(m.locator('.v2-marquee')).toBeAttached()
    await mobile.close()
  })
})
