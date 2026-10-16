import { expect, test } from '@playwright/test'

/** Interior Designer demo: projects gallery with filters, and the services page. */
test.describe('Interior demo pages', () => {
  test('projects gallery filters by type and links to project pages', async ({ page }) => {
    await page.goto('/demo/interior/projects')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Spaces that feel lived in')
    const list = page.getByTestId('project-list')
    await expect(list.locator(':scope > li')).toHaveCount(6)
    await expect(page.getByTestId('project-count')).toHaveText(/06 projects/)

    await page.getByRole('button', { name: /Cafes/ }).click()
    await expect(list.locator(':scope > li')).toHaveCount(1)
    await expect(list.getByRole('heading', { name: 'Heritage Cafe' })).toBeVisible()
    await expect(page.getByTestId('project-count')).toHaveText(/01 project$/)

    await page.getByRole('button', { name: /Homes/ }).click()
    await expect(list.locator(':scope > li')).toHaveCount(4)

    await list.getByRole('link', { name: 'View project' }).first().click()
    await expect(page).toHaveURL(/\/demo\/interior\/projects\/sea-breeze-apartment$/, { timeout: 30_000 })
    await expect(page.getByRole('img', { name: /Ivory living room/ })).toBeVisible()
  })

  test('services page shows packages, the process and the FAQ', async ({ page }) => {
    await page.goto('/demo/interior/services')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Design, build and hand over')
    const packages = page.getByTestId('packages')
    await expect(packages.locator(':scope > li')).toHaveCount(3)
    await expect(packages.getByText('₹1,650')).toBeVisible()
    await expect(packages.getByRole('link', { name: /Enquire about full home/ })).toHaveAttribute(
      'href',
      '/demo/interior#enquire',
    )
    await expect(page.getByText('Site visit and brief')).toBeVisible()

    const faq = page.getByTestId('faq')
    await expect(faq.locator('details')).toHaveCount(6)
    await faq.getByText('What is the payment schedule?').click()
    await expect(faq.getByText(/10% to start design/)).toBeVisible()
  })

  test('home links to the gallery and services pages and uses the serif heading', async ({ page }) => {
    await page.goto('/demo/interior')
    const nav = page.getByRole('navigation', { name: 'Atelier Nila' })
    await expect(nav.getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'href',
      '/demo/interior/projects',
    )
    await expect(nav.getByRole('link', { name: 'Services' })).toHaveAttribute(
      'href',
      '/demo/interior/services',
    )
    const family = await page
      .getByRole('heading', { level: 1 })
      .evaluate((el) => getComputedStyle(el).fontFamily)
    expect(family.toLowerCase()).toContain('playfair')
  })
})
