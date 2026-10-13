import { expect, test } from '@playwright/test'
import { login } from '../helpers/login'
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'

test.describe('Admin extras', () => {
  test.beforeAll(async () => {
    await seedTestUser()
  })
  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('login page password field has a show/hide toggle', async ({ page }) => {
    await page.goto('/admin/login')
    const input = page.locator('#field-password')
    await expect(input).toHaveAttribute('type', 'password')
    const toggle = page.locator('.kf-reveal__btn').first()
    await expect(toggle).toBeVisible()
    await toggle.click()
    await expect(input).toHaveAttribute('type', 'text')
    await toggle.click()
    await expect(input).toHaveAttribute('type', 'password')
  })

  test('Dashboard is the first sidebar link and opens the analytics view', async ({ page }) => {
    await login({ page, user: testUser })
    await page.locator('html[data-kf-nav-accordion="on"]').waitFor({ timeout: 30_000 })
    const nav = page.locator('aside.nav')
    // The sidebar starts collapsed (inert) in a fresh browser; open it like a user would.
    if (!(await nav.evaluate((el) => el.classList.contains('nav--nav-open')))) {
      await page.locator('.nav-toggler').first().click()
      await expect(nav).toHaveClass(/nav--nav-open/)
    }
    const firstLink = nav.locator('a.nav__link').first()
    await expect(firstLink).toHaveText(/Dashboard/)
    await firstLink.click()
    await expect(page).toHaveURL(/\/admin\/analytics$/)
    await expect(page.locator('.kf-analytics__header h1')).toHaveText('Analytics')
    // Logout control exists in the sidebar.
    await expect(page.locator('a[href="/admin/logout"]').first()).toBeAttached()
  })

  test('sidebar shows one group at a time', async ({ page }) => {
    await login({ page, user: testUser })
    await page.goto('/admin/collections/faqs')
    // Wait for hydration (the accordion provider marks <html> from an effect);
    // a click on the un-hydrated toggler would be replayed by React later.
    await page.locator('html[data-kf-nav-accordion="on"]').waitFor({ timeout: 30_000 })
    const nav = page.locator('aside.nav')
    if (!(await nav.evaluate((el) => el.classList.contains('nav--nav-open')))) {
      await page.locator('.nav-toggler').first().click()
      await expect(nav).toHaveClass(/nav--nav-open/)
    }
    const content = nav.locator('.nav-group', { hasText: 'Content' }).first()
    const settings = nav.locator('.nav-group', { hasText: 'Settings' }).first()
    // On load only the current page's group (Content) is open.
    await expect(content).not.toHaveClass(/nav-group--collapsed/)
    await expect(settings).toHaveClass(/nav-group--collapsed/)
    // Opening Settings closes Content.
    await settings.locator('.nav-group__toggle').click()
    await expect(settings).not.toHaveClass(/nav-group--collapsed/)
    await expect(content).toHaveClass(/nav-group--collapsed/)
    // On the dashboard (no group link active) every group is collapsed.
    await page.goto('/admin/analytics')
    await page.locator('html[data-kf-nav-accordion="on"]').waitFor({ timeout: 30_000 })
    await expect(page.locator('aside.nav .nav-group').first()).toBeAttached()
    await expect(page.locator('aside.nav .nav-group:not(.nav-group--collapsed)')).toHaveCount(0)
  })
})
