import { expect, test, type APIRequestContext } from '@playwright/test'
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'

/**
 * Hiding a demo in Settings > Demos removes it from the Demos page, Home,
 * its case study and the sitemap. The setting is saved through the server's
 * REST API, exactly as the admin UI does, so the server-side cache revalidates.
 */
async function saveDemoSettings(request: APIRequestContext, hidden: string[]) {
  const login = await request.post('/api/users/login', {
    data: { email: testUser.email, password: testUser.password },
  })
  expect(login.ok()).toBe(true)
  const { token } = (await login.json()) as { token: string }
  const res = await request.post('/api/globals/demo-settings', {
    headers: { Authorization: `JWT ${token}` },
    data: { hidden },
  })
  expect(res.ok()).toBe(true)
  // A REST save revalidates with stale-while-refresh semantics (the admin UI's
  // server-action save is immediate). Touch the pages once so the refresh runs.
  for (const path of ['/demos', '/demos/tuition', '/sitemap.xml', '/']) await request.get(path)
  await new Promise((r) => setTimeout(r, 1500))
  for (const path of ['/demos', '/demos/tuition', '/sitemap.xml', '/']) await request.get(path)
}

test.describe('Demo visibility settings', () => {
  test.beforeAll(async ({ request }) => {
    await seedTestUser()
    await saveDemoSettings(request, ['tuition'])
  })
  test.afterAll(async ({ request }) => {
    await saveDemoSettings(request, [])
    await cleanupTestUser()
  })

  test('hidden demo disappears from lists and its case study returns 404', async ({ page, request }) => {
    await page.goto('/demos')
    await expect(page.getByRole('heading', { name: 'Booking Website', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Tuition Centre Website', exact: true })).toHaveCount(0)

    expect((await request.get('/demos/tuition')).status()).toBe(404)
    expect((await request.get('/demos/booking')).status()).toBe(200)

    const sitemap = await (await request.get('/sitemap.xml')).text()
    expect(sitemap).toContain('/demos/booking')
    expect(sitemap).not.toContain('/demos/tuition')
  })
})
