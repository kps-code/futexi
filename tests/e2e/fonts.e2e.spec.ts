import { expect, test } from '@playwright/test'

/**
 * Font budget regression: only the two preloaded Latin subsets (Inter, Sora) may load.
 * The rupee sign is served by the local "KF Rupee" face, never by Inter Latin-Extended.
 */
test('contact page loads exactly two web font files', async ({ page }) => {
  const fonts = new Set<string>()
  page.on('response', (res) => {
    if (res.url().endsWith('.woff2')) fonts.add(res.url())
  })
  await page.goto('/contact')
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
  expect([...fonts]).toHaveLength(2)

  const rupeeFromLocal = await page.evaluate(() => {
    const loaded = [...document.fonts].filter((f) => f.status === 'loaded')
    return !loaded.some((f) => f.family.includes('Inter') && f.unicodeRange.startsWith('U+100-2BA'))
  })
  expect(rupeeFromLocal).toBe(true)
})
