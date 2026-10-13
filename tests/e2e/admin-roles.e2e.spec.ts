import { expect, test, type APIRequestContext } from '@playwright/test'
import { login } from '../helpers/login'
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'

/**
 * Roles decide what a user sees. An admin creates a "FAQ only" role and a
 * user with it; that user sees only the FAQ entry, cannot reach leads, and
 * the Dashboard link is gone.
 */
const stamp = Date.now()
const limited = { email: `faq-only-${stamp}@example.com`, password: 'test-pass-123', name: 'FAQ Only' }
let adminJwt = ''
let roleId = 0
let userId = 0

async function adminApi(request: APIRequestContext, method: 'post' | 'delete', path: string, data?: unknown) {
  const res = await request[method](path, { headers: { Authorization: `JWT ${adminJwt}` }, data })
  expect(res.ok(), `${method} ${path} -> ${res.status()}`).toBe(true)
  return res
}

test.describe('Roles and permissions', () => {
  test.beforeAll(async ({ request }) => {
    await seedTestUser()
    const login = await request.post('/api/users/login', {
      data: { email: testUser.email, password: testUser.password },
    })
    adminJwt = ((await login.json()) as { token: string }).token

    const role = await adminApi(request, 'post', '/api/roles', {
      name: `FAQ only ${stamp}`,
      isAdmin: false,
      areas: { faqs: 'edit' },
    })
    roleId = ((await role.json()) as { doc: { id: number } }).doc.id

    const user = await adminApi(request, 'post', '/api/users', { ...limited, assignedRole: roleId })
    userId = ((await user.json()) as { doc: { id: number } }).doc.id
  })

  test.afterAll(async ({ request }) => {
    if (userId) await adminApi(request, 'delete', `/api/users/${userId}`)
    if (roleId) await adminApi(request, 'delete', `/api/roles/${roleId}`)
    await cleanupTestUser()
  })

  test('the limited user sees only FAQ and cannot reach other data', async ({ page, request }) => {
    await login({ page, user: limited })
    await page.locator('html[data-kf-nav-accordion="on"]').waitFor({ timeout: 30_000 })
    const nav = page.locator('aside.nav')
    if (!(await nav.evaluate((el) => el.classList.contains('nav--nav-open')))) {
      await page.locator('.nav-toggler').first().click()
      await expect(nav).toHaveClass(/nav--nav-open/)
    }
    await expect(nav.locator('a[href="/admin/collections/faqs"]')).toBeAttached()
    for (const href of [
      '/admin/collections/leads',
      '/admin/collections/users',
      '/admin/collections/roles',
      '/admin/collections/api-logs',
      '/admin/globals/site-settings',
    ]) {
      await expect(nav.locator(`a[href="${href}"]`)).toHaveCount(0)
    }
    await expect(nav.locator('a[href="/admin/analytics"]')).toHaveCount(0)

    // REST with the limited user's token: FAQ allowed, leads refused.
    const res = await request.post('/api/users/login', {
      data: { email: limited.email, password: limited.password },
    })
    const jwt = ((await res.json()) as { token: string }).token
    expect(
      (await request.get('/api/faqs?limit=1', { headers: { Authorization: `JWT ${jwt}` } })).status(),
    ).toBe(200)
    expect(
      (await request.get('/api/leads?limit=1', { headers: { Authorization: `JWT ${jwt}` } })).status(),
    ).toBe(403)
    expect(
      (await request.get('/api/api-logs?limit=1', { headers: { Authorization: `JWT ${jwt}` } })).status(),
    ).toBe(403)
    // Can read only their own user record.
    const users = (await (
      await request.get('/api/users', { headers: { Authorization: `JWT ${jwt}` } })
    ).json()) as {
      totalDocs: number
    }
    expect(users.totalDocs).toBe(1)
  })

  test('an admin sees everything', async ({ page }) => {
    await login({ page, user: testUser })
    await page.locator('html[data-kf-nav-accordion="on"]').waitFor({ timeout: 30_000 })
    const nav = page.locator('aside.nav')
    for (const href of [
      '/admin/collections/roles',
      '/admin/collections/users',
      '/admin/collections/leads',
      '/admin/analytics',
    ]) {
      await expect(nav.locator(`a[href="${href}"]`)).toBeAttached()
    }
  })
})
