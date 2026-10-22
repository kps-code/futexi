import { expect, test, type APIRequestContext } from '@playwright/test'
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'

/**
 * The showroom home: the pinned scroll story on desktop, the stacked layout on
 * phones, and the journey chapters edited in Content > Home Page.
 */

/** Scrolls to the given point of the pinned story (0 = first chapter, 1 = last). */
async function scrollStory(page: import('@playwright/test').Page, t: number) {
  await page.evaluate((t) => {
    const sec = document.querySelector<HTMLElement>('#hero')!
    const stage = sec.querySelector<HTMLElement>('.sr-stage')!
    const sticky = parseFloat(getComputedStyle(stage).top) || 0
    const top = window.scrollY + sec.getBoundingClientRect().top - sticky
    window.scrollTo({ top: top + (sec.offsetHeight - stage.offsetHeight) * t })
  }, t)
}

test.describe('Showroom home', () => {
  test('desktop: scrolling the story changes the chapter, the rail and the call to action', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.locator('html.reveal-ready').waitFor({ timeout: 15_000 })
    const hero = page.locator('#hero')
    await expect(page.locator('.sr-rail')).toBeVisible()
    await expect(hero).toHaveAttribute('data-chapter', '0')
    await expect(page.locator('h1')).toContainText('Your Ideas. Our Technology.')
    await expect(page.locator('.sr-rail-num')).toContainText('01')

    await scrollStory(page, 0.34)
    await expect(hero).toHaveAttribute('data-chapter', '1')
    await expect(page.locator('.sr-ch-on')).toContainText('It answers')

    await scrollStory(page, 1)
    await expect(hero).toHaveAttribute('data-chapter', '3')
    await expect(page.locator('.sr-rail-num')).toContainText('04')
    await expect(page.locator('.sr-ch-on')).toContainText("Let's build")
    await expect(page.locator('.sr-ch-on').getByRole('link', { name: 'WhatsApp us' })).toHaveAttribute(
      'href',
      /wa\.me/,
    )
    // Hidden chapters are inert so their links are not reachable.
    await expect(page.locator('.sr-ch[inert]')).toHaveCount(3)
  })

  test('phone: the story stacks, with the flat phone and short chapter cards', async ({ browser }) => {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    })
    const page = await ctx.newPage()
    await page.goto('/')
    await page.locator('html.reveal-ready').waitFor({ timeout: 15_000 })
    await expect(page.locator('.sr-rail')).toBeHidden()
    await expect(page.locator('.sr-mini-item').first()).toBeVisible()
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('#hero canvas')).toHaveCount(0)
    await expect(page.locator('.sr-p2d img').first()).toHaveAttribute('src', /site[.]webp/)
    await expect(page.locator('.sr-mini-item')).toHaveCount(4)
    await expect(page.locator('.sr-mini-item').first()).toContainText('It answers at 2 a.m.')
    await ctx.close()
  })

  test.describe('journey chapters from the admin', () => {
    let token = ''
    let original: Record<string, unknown> | null = null
    const marker = `pw-${Date.now()}`

    const headers = () => ({ Authorization: `JWT ${token}` })
    async function warm(request: APIRequestContext) {
      for (let i = 0; i < 2; i++) {
        await request.get('/')
        await new Promise((r) => setTimeout(r, 1500))
      }
    }

    test.beforeAll(async ({ request }) => {
      await seedTestUser()
      const login = await request.post('/api/users/login', {
        data: { email: testUser.email, password: testUser.password },
      })
      expect(login.ok()).toBe(true)
      token = ((await login.json()) as { token: string }).token
      const current = await request.get('/api/globals/home-page?depth=0', { headers: headers() })
      expect(current.ok()).toBe(true)
      original = (await current.json()) as Record<string, unknown>
      const journey =
        (original.journey as { heroLabel?: string; chapters?: Record<string, unknown>[] } | undefined) ?? {}
      const chapters = journey.chapters?.length
        ? journey.chapters
        : [
            {
              label: 'AI assistant',
              screen: 'chat',
              headingLine1: 'It answers',
              headingLine2: 'at 2 a.m.',
              line: 'x',
              tagline: 'y',
            },
          ]
      const edited = chapters.map((c, i) =>
        i === 0 ? { ...c, label: `Chapter ${marker}`, headingLine1: `Edited ${marker}` } : c,
      )
      const res = await request.post('/api/globals/home-page', {
        headers: headers(),
        data: { journey: { heroLabel: `Hero ${marker}`, chapters: edited } },
      })
      expect(res.ok(), `POST home-page -> ${res.status()}`).toBe(true)
      await warm(request)
    })

    test.afterAll(async ({ request }) => {
      if (original) {
        const journey = original.journey as Record<string, unknown> | undefined
        await request.post('/api/globals/home-page', {
          headers: headers(),
          data: { journey: journey ?? { heroLabel: 'Your website', chapters: [] } },
        })
        await warm(request)
      }
      await cleanupTestUser()
    })

    test('an edited chapter and hero label show on the home page', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto('/')
      await expect(page.locator('.sr-ch').nth(1)).toContainText(`Edited ${marker}`)
      await expect(page.locator('.sr-chip')).toContainText(`Hero ${marker}`)
    })
  })
})
