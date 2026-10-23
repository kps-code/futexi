import { expect, test } from '@playwright/test'

/** Tuition demo (Vidya Academy): friendly home, course details, results pages. */
test.describe('Vidya Academy pages', () => {
  test('home uses the readable fonts and links to courses and results', async ({ page }) => {
    await page.goto('/demo/tuition')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Small batches')
    const family = await page
      .getByRole('heading', { level: 1 })
      .evaluate((el) => getComputedStyle(el).fontFamily)
    expect(family).toContain('Lexend')
    const body = await page.locator('main').evaluate((el) => getComputedStyle(el).fontSize)
    expect(body).toBe('17px')
    const nav = page.getByRole('navigation', { name: 'Vidya Academy' })
    await expect(nav.getByRole('link', { name: 'Courses' })).toHaveAttribute('href', '/demo/tuition/courses')
    await expect(nav.getByRole('link', { name: 'Results' })).toHaveAttribute('href', '/demo/tuition/results')
    await expect(page.getByRole('heading', { name: 'NEET Foundation' }).first()).toBeAttached()
  })

  test('courses page details all six courses and anchors from the home cards', async ({ page }) => {
    await page.goto('/demo/tuition/courses#vidya-neet')
    const courses = page.getByTestId('courses')
    await expect(courses.locator(':scope > article')).toHaveCount(6)
    await expect(courses.getByText('Twenty full-length mocks')).toBeVisible()
    await expect(courses.getByText('₹4,500').first()).toBeVisible()
    await expect(page.getByTestId('faq').locator('details')).toHaveCount(4)
    await courses.getByRole('link', { name: 'Book a free demo class' }).first().click()
    await expect(page).toHaveURL(/\/demo\/tuition#enquire$/, { timeout: 30_000 })
    await expect(page.getByTestId('enquiry-form')).toBeVisible()
  })

  test('results page shows three years and four toppers', async ({ page }) => {
    await page.goto('/demo/tuition/results')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Three years')
    await expect(page.getByTestId('years').locator(':scope > div')).toHaveCount(3)
    await expect(page.getByTestId('toppers').locator(':scope > li')).toHaveCount(4)
    await expect(page.getByText('Now: MBBS, Stanley Medical College')).toBeVisible()
  })
  test('Motion v2 runs on desktop only: character bounce, marker, typed board, sticky-note batches', async ({
    page,
    browser,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/demo/tuition')
    await page.locator('html.dm-v2').waitFor({ timeout: 30_000 })
    await expect(page.locator('.v2-ch').first()).toBeAttached()
    await expect(page.locator('.v2-marker')).toBeAttached()
    await expect(page.locator('.v2-board .v2-type')).toBeAttached()
    await page.waitForTimeout(2500)
    await expect(page.locator('.pin-spacer')).toHaveCount(0)
    expect(await page.locator('.v2-marquee').count()).toBe(0)
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto')

    const mobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    })
    const m = await mobile.newPage()
    await m.goto('/demo/tuition')
    await m.waitForTimeout(2500)
    expect(await m.locator('html.dm-v2').count()).toBe(0)
    expect(await m.locator('.v2-ch').count()).toBe(0)
    await expect(m.locator('.v2-board')).toContainText('Fifteen students')
    await mobile.close()
  })
})
