import { expect, test, type APIRequestContext } from '@playwright/test'
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'

/**
 * Content added in the admin (FAQ, Testimonials) appears on the public pages.
 * Records are written through the server's REST API, exactly as the admin UI
 * does, so the server-side caches revalidate.
 */
const marker = `pw-${Date.now()}`
const created: { collection: string; id: number }[] = []
let token = ''

async function api(request: APIRequestContext, method: 'post' | 'delete', path: string, data?: unknown) {
  const res = await request[method](path, { headers: { Authorization: `JWT ${token}` }, data })
  expect(res.ok(), `${method.toUpperCase()} ${path} -> ${res.status()}`).toBe(true)
  return res
}

async function warm(request: APIRequestContext) {
  // REST saves revalidate with stale-while-refresh semantics: touch the pages twice.
  for (let i = 0; i < 2; i++) {
    for (const path of ['/', '/contact']) await request.get(path)
    await new Promise((r) => setTimeout(r, 1500))
  }
}

test.describe('Admin content on the public site', () => {
  test.beforeAll(async ({ request }) => {
    await seedTestUser()
    const login = await request.post('/api/users/login', {
      data: { email: testUser.email, password: testUser.password },
    })
    expect(login.ok()).toBe(true)
    token = ((await login.json()) as { token: string }).token

    const t = await api(request, 'post', '/api/testimonials', {
      name: `Client ${marker}`,
      business: 'Playwright Salon, Chennai',
      quote: 'Bookings doubled in the first month. The WhatsApp button alone paid for the website.',
      rating: 5,
      visible: true,
      order: 999,
    })
    created.push({ collection: 'testimonials', id: ((await t.json()) as { doc: { id: number } }).doc.id })

    const f = await api(request, 'post', '/api/faqs', {
      question: `Is this a ${marker} question?`,
      answer: 'Yes. It was created by the end-to-end test and costs {price}.',
      placement: 'contact',
      order: 999,
    })
    created.push({ collection: 'faqs', id: ((await f.json()) as { doc: { id: number } }).doc.id })

    const hidden = await api(request, 'post', '/api/faqs', {
      question: `Is this a hidden ${marker} question?`,
      answer: 'It must not appear anywhere.',
      placement: 'hidden',
      order: 999,
    })
    created.push({ collection: 'faqs', id: ((await hidden.json()) as { doc: { id: number } }).doc.id })

    const svc = await api(request, 'post', '/api/services', {
      title: `Playwright Service ${marker}`,
      slug: `pw-service-${marker}`,
      icon: 'rocket',
      contactType: 'website',
      outcome: 'A service created by the end-to-end test.',
      homeLine: 'Shown on the home page card.',
      included: ['One', 'Two'],
      goodFor: 'Tests.',
      order: 999,
      visible: true,
    })
    created.push({ collection: 'services', id: ((await svc.json()) as { doc: { id: number } }).doc.id })
    await warm(request)
    for (const path of ['/services']) await request.get(path)
  })

  test.afterAll(async ({ request }) => {
    for (const c of created) await api(request, 'delete', `/api/${c.collection}/${c.id}`)
    await warm(request)
    await cleanupTestUser()
  })

  test('a visible testimonial shows the "What clients say" block on home', async ({ page }) => {
    await page.goto('/')
    const section = page.locator('#trust')
    await expect(section).toBeAttached()
    await expect(section.getByRole('heading', { name: 'What clients say' })).toBeAttached()
    await expect(section.getByText(`Client ${marker}`)).toBeAttached()
    await expect(section.getByText('Playwright Salon, Chennai')).toBeAttached()
  })

  test('a new FAQ appears on the Contact page with the price filled in', async ({ page }) => {
    await page.goto('/contact')
    const item = page.locator('details', { hasText: `Is this a ${marker} question?` })
    await expect(item).toBeAttached()
    await expect(item).toContainText('Projects start from')
    await expect(item).not.toContainText('{price}')
  })

  test('a "Contact only" FAQ stays off the home page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#faq')).toBeAttached()
    await expect(page.getByText(`Is this a ${marker} question?`)).toHaveCount(0)
  })

  test('a new service shows on the Services page, the home cards and the footer', async ({ page }) => {
    await page.goto('/services')
    await expect(page.locator(`#pw-service-${marker}`)).toBeAttached()
    await expect(page.getByRole('heading', { name: `Playwright Service ${marker}` })).toBeAttached()
    await expect(
      page.locator('footer').getByRole('link', { name: `Playwright Service ${marker}` }),
    ).toHaveAttribute('href', `/services#pw-service-${marker}`)
    await page.goto('/')
    await expect(page.locator('#services').getByText(`Playwright Service ${marker}`)).toBeAttached()
    await expect(
      page
        .getByRole('navigation', { name: 'Primary' })
        .getByRole('link', { name: new RegExp(`Playwright Service ${marker}`) }),
    ).toBeAttached()
  })

  test('a "Hidden" FAQ appears on neither page', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.locator('details').first()).toBeAttached()
    await expect(page.getByText(`Is this a hidden ${marker} question?`)).toHaveCount(0)
    await page.goto('/')
    await expect(page.locator('#faq')).toBeAttached()
    await expect(page.getByText(`Is this a hidden ${marker} question?`)).toHaveCount(0)
  })
})
