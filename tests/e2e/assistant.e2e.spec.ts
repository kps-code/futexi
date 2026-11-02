import { expect, test } from '@playwright/test'
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'

/**
 * Ask-us chat on the main site. The dev server runs with AI_ENABLED=true and AI_MOCK=true
 * (see .github/workflows/ci.yml), so answers are canned and no model is called.
 */
test.describe('Ask-us assistant', () => {
  test.afterAll(async ({ request }) => {
    // Remove the lead the form test created.
    await seedTestUser()
    const login = await request.post('/api/users/login', {
      data: { email: testUser.email, password: testUser.password },
    })
    if (login.ok()) {
      const { token } = (await login.json()) as { token: string }
      await request.delete('/api/leads?where[name][equals]=Chat%20Tester', {
        headers: { Authorization: `JWT ${token}` },
      })
    }
    await cleanupTestUser()
  })

  test('opens from the bubble, streams a mock answer and keeps the chat across pages', async ({ page }) => {
    await page.goto('/')
    const bubble = page.getByRole('button', { name: /Open chat/ })
    await expect(bubble).toBeVisible()
    await bubble.click()

    const dialog = page.getByRole('dialog', { name: /Chat with/ })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText('AI assistant, not a person')).toBeVisible()

    // Suggested chips come from the admin defaults.
    await dialog.getByRole('button', { name: 'What do you build?' }).click()
    await expect(dialog.getByText('What do you build?').last()).toBeVisible()
    await expect(dialog.getByText(/Mock reply to "What do you build\?"/)).toBeVisible({ timeout: 15_000 })
    // Site paths in the answer become links.
    await expect(dialog.getByRole('link', { name: '/services' })).toBeVisible()

    // The conversation survives navigation.
    await page.goto('/services')
    await page.getByRole('button', { name: /Open chat/ }).click()
    await expect(page.getByRole('dialog').getByText(/Mock reply to "What do you build\?"/)).toBeVisible()
  })

  test('shows the lead form only on a clear quote request and sends it', async ({ page }) => {
    await page.goto('/contact')
    await page.getByRole('button', { name: /Open chat/ }).click()
    const dialog = page.getByRole('dialog', { name: /Chat with/ })
    const box = dialog.getByRole('textbox', { name: 'Your message' })

    await box.fill('How much does a website cost?')
    await box.press('Enter')
    await expect(dialog.getByText(/Mock reply to "How much/)).toBeVisible({ timeout: 15_000 })
    await expect(dialog.getByRole('form', { name: 'Share your details' })).toHaveCount(0)

    await box.fill('Please send me a quote')
    await box.press('Enter')
    const form = dialog.getByRole('form', { name: 'Share your details' })
    await expect(form).toBeVisible({ timeout: 15_000 })
    await expect(dialog.getByText('[OPEN_QUOTE_FORM]')).toHaveCount(0)

    await form.getByRole('textbox', { name: 'Your name' }).fill('Chat Tester')
    await form.getByRole('textbox', { name: 'WhatsApp number' }).fill('9876543210')
    await form.getByRole('button', { name: 'Send my details' }).click()
    await expect(dialog.getByText('Thanks, Chat Tester.')).toBeVisible({ timeout: 15_000 })
    await expect(dialog.getByRole('link', { name: 'Faster on WhatsApp' })).toHaveAttribute('href', /wa\.me/)
  })

  test('is not shown inside the demos', async ({ page }) => {
    await page.goto('/demo/booking')
    await expect(page.getByRole('button', { name: /Open chat/ })).toHaveCount(0)
  })

  test('rejects bad input at the API', async ({ request }) => {
    const bad = await request.post('/api/assistant', { data: { chatId: 'x', messages: [] } })
    expect(bad.status()).toBe(400)
    const wrongLast = await request.post('/api/assistant', {
      data: { chatId: 'abcdefgh12345678', messages: [{ role: 'assistant', content: 'hi' }] },
    })
    expect(wrongLast.status()).toBe(400)
  })
})
