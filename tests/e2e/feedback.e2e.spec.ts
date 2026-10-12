import { expect, test, type APIRequestContext } from '@playwright/test'
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'

/**
 * Private feedback link: the admin creates a testimonial with name and
 * business, sends the link, the client submits rating and quote. The record
 * stays hidden until reviewed, and the link works only once.
 */
let token = ''
let jwt = ''
let id = 0

async function auth(request: APIRequestContext) {
  const login = await request.post('/api/users/login', {
    data: { email: testUser.email, password: testUser.password },
  })
  expect(login.ok()).toBe(true)
  jwt = ((await login.json()) as { token: string }).token
}

test.describe('Client feedback link', () => {
  test.beforeAll(async ({ request }) => {
    await seedTestUser()
    await auth(request)
    const res = await request.post('/api/testimonials', {
      headers: { Authorization: `JWT ${jwt}` },
      data: { name: 'Priya Test', business: 'Velvet Salon', order: 999 },
    })
    expect(res.ok()).toBe(true)
    const { doc } = (await res.json()) as { doc: { id: number; token: string; feedbackLink: string } }
    id = doc.id
    token = doc.token
    expect(token).toMatch(/^[A-Za-z0-9_-]{8,}$/)
    expect(doc.feedbackLink).toContain(`/feedback/${token}`)
  })

  test.afterAll(async ({ request }) => {
    if (id) await request.delete(`/api/testimonials/${id}`, { headers: { Authorization: `JWT ${jwt}` } })
    await cleanupTestUser()
  })

  test('the token is not exposed to the public API', async ({ request }) => {
    const res = await request.get(`/api/testimonials/${id}`)
    expect(res.ok()).toBe(true)
    const doc = (await res.json()) as Record<string, unknown>
    expect(doc.token).toBeUndefined()
    expect(doc.feedbackLink).toBeUndefined()
  })

  test('an unknown link returns 404', async ({ request }) => {
    expect((await request.get('/feedback/not-a-real-token')).status()).toBe(404)
  })

  test('the client submits once; the record is received but hidden', async ({ page, request }) => {
    await page.goto(`/feedback/${token}`)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Hi Priya')
    await expect(page.locator('#name')).toHaveValue('Priya Test')
    await expect(page.locator('#business')).toHaveValue('Velvet Salon')

    await page.getByRole('radio', { name: '4 stars' }).click()
    await page.fill(
      '#quote',
      'Bookings doubled in the first month. The WhatsApp button alone paid for the site.',
    )
    await page.check('#consent')
    await page.getByRole('button', { name: 'Send Feedback' }).click()
    // After the action the page re-renders from the server as "received".
    await expect(page.getByRole('heading', { name: /Thank you, Priya/ })).toBeVisible({ timeout: 20_000 })
    await expect(page.locator('#quote')).toHaveCount(0)

    const saved = (await (
      await request.get(`/api/testimonials/${id}`, { headers: { Authorization: `JWT ${jwt}` } })
    ).json()) as { quote: string; rating: number; visible: boolean; submittedAt: string | null }
    expect(saved.quote).toContain('Bookings doubled')
    expect(saved.rating).toBe(4)
    expect(saved.visible).toBe(false)
    expect(saved.submittedAt).toBeTruthy()

    // Second visit: already received, no form.
    await page.goto(`/feedback/${token}`)
    await expect(page.getByText('We have your feedback.')).toBeVisible()
    await expect(page.locator('#quote')).toHaveCount(0)
  })
})
