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
})
