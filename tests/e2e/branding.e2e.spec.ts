import { expect, test, type APIRequestContext } from '@playwright/test'
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'

/**
 * Site Settings > Branding: an uploaded logo replaces the text wordmark in the
 * header and footer, and first-time visitors get the chosen default theme.
 * Settings are written through the REST API, as the admin UI does, so the
 * server-side cache revalidates. Everything is reset afterwards.
 */
const SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="40" viewBox="0 0 160 40">' +
  '<rect width="160" height="40" rx="8" fill="#6366f1"/>' +
  '<text x="12" y="27" font-family="Arial" font-size="18" fill="#fff">PW LOGO</text></svg>'
const ALT = 'Playwright logo'
const ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">' +
  '<rect width="64" height="64" rx="14" fill="#6366f1"/></svg>'

let token = ''
let mediaId: number | undefined
let iconId: number | undefined
const auth = () => ({ Authorization: `JWT ${token}` })

async function saveSettings(request: APIRequestContext, data: Record<string, unknown>) {
  const res = await request.post('/api/globals/site-settings', { headers: auth(), data })
  expect(res.ok(), `site-settings update -> ${res.status()}`).toBe(true)
}

async function warm(request: APIRequestContext) {
  // REST saves revalidate with stale-while-refresh semantics: touch the page twice.
  for (let i = 0; i < 2; i++) {
    await request.get('/')
    await new Promise((r) => setTimeout(r, 1500))
  }
}

test.describe('Branding settings', () => {
  test.beforeAll(async ({ request }) => {
    await seedTestUser()
    const login = await request.post('/api/users/login', {
      data: { email: testUser.email, password: testUser.password },
    })
    expect(login.ok()).toBe(true)
    token = ((await login.json()) as { token: string }).token

    const upload = await request.post('/api/media', {
      headers: auth(),
      multipart: {
        file: { name: 'pw-logo.svg', mimeType: 'image/svg+xml', buffer: Buffer.from(SVG) },
        _payload: JSON.stringify({ alt: ALT }),
      },
    })
    expect(upload.ok(), `media upload -> ${upload.status()}`).toBe(true)
    mediaId = ((await upload.json()) as { doc: { id: number } }).doc.id

    const iconUpload = await request.post('/api/media', {
      headers: auth(),
      multipart: {
        file: { name: 'pw-icon.svg', mimeType: 'image/svg+xml', buffer: Buffer.from(ICON) },
        _payload: JSON.stringify({ alt: 'Playwright icon' }),
      },
    })
    expect(iconUpload.ok(), `icon upload -> ${iconUpload.status()}`).toBe(true)
    iconId = ((await iconUpload.json()) as { doc: { id: number } }).doc.id

    await saveSettings(request, { logo: mediaId, siteIcon: iconId, defaultTheme: 'dark' })
    await warm(request)
  })

  test.afterAll(async ({ request }) => {
    await saveSettings(request, { logo: null, logoDark: null, siteIcon: null, defaultTheme: 'light' })
    for (const id of [mediaId, iconId]) {
      if (id) await request.delete(`/api/media/${id}`, { headers: auth() })
    }
    await warm(request)
    await cleanupTestUser()
  })

  test('the uploaded logo replaces the text wordmark in the header and footer', async ({ page }) => {
    await page.goto('/')
    const logos = page.getByRole('img', { name: ALT })
    await expect(logos).toHaveCount(2)
    await expect(logos.first()).toBeVisible()
    const home = page.getByRole('banner').getByRole('link', { name: 'KAPOSA FUTEXI home' })
    await expect(home.getByRole('img', { name: ALT })).toBeVisible()
    await expect(page.locator('header').getByText('FUTEXI')).toHaveCount(0)
  })

  test('the uploaded site icon becomes the browser tab icon', async ({ page, request }) => {
    await page.goto('/')
    const href = await page.locator('link[rel="icon"]').first().getAttribute('href')
    expect(href).toContain('pw-icon')
    const icon = await request.get(href as string)
    expect(icon.ok()).toBe(true)
    expect(icon.headers()['content-type']).toContain('image/svg+xml')
  })

  test('first-time visitors get the default theme chosen in the admin', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveClass(/\bdark\b/)
    await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible()
  })
})
