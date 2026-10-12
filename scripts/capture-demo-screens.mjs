/**
 * Captures real screenshots of a live demo site for its case study.
 *
 *   node scripts/capture-demo-screens.mjs booking [baseUrl]
 *
 * Writes WebP files to public/demos/<slug>/ at the sizes declared in
 * src/content/demos.ts (screenSizes). Requires the dev or prod server running.
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from '@playwright/test'
import sharp from 'sharp'

const slug = process.argv[2]
const base = process.argv[3] ?? 'http://localhost:3000'
if (!slug) {
  console.error('Usage: node scripts/capture-demo-screens.mjs <slug> [baseUrl]')
  process.exit(1)
}

const SIZES = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } }

/** Per-demo capture plans: name -> steps to reach the screen. */
const PLANS = {
  booking: [
    { name: 'home', path: '/demo/booking', steps: [] },
    { name: 'book-service', path: '/demo/booking/book', steps: [] },
    {
      name: 'book-time',
      path: '/demo/booking/book',
      steps: [
        { click: 'button:has-text("Signature Facial")' },
        { click: 'ul[class*="overflow-x-auto"] button >> nth=1' },
        { waitFor: 'button:has-text("AM"), button:has-text("PM")' },
      ],
    },
  ],
}

const plan = PLANS[slug]
if (!plan) {
  console.error(`No capture plan for "${slug}". Add one to scripts/capture-demo-screens.mjs.`)
  process.exit(1)
}

const outDir = path.join('public', 'demos', slug)
await mkdir(outDir, { recursive: true })

const browser = await chromium.launch()
try {
  for (const [device, size] of Object.entries(SIZES)) {
    const context = await browser.newContext({
      viewport: size,
      deviceScaleFactor: 1,
      isMobile: device === 'mobile',
      hasTouch: device === 'mobile',
      reducedMotion: 'reduce',
      colorScheme: 'light',
    })
    const page = await context.newPage()
    for (const shot of plan) {
      await page.goto(`${base}${shot.path}`, { waitUntil: 'networkidle' })
      for (const step of shot.steps) {
        if (step.click) await page.locator(step.click).first().click()
        if (step.waitFor) await page.locator(step.waitFor).first().waitFor({ timeout: 15_000 })
      }
      // Let fonts and reveals settle.
      await page.evaluate(() => document.fonts.ready)
      await page.evaluate(() =>
        document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible')),
      )
      await page.waitForTimeout(400)
      const png = await page.screenshot({ type: 'png', fullPage: false })
      const file = path.join(outDir, `${device}-${shot.name}.webp`)
      await sharp(png).webp({ quality: 82 }).toFile(file)
      console.log('wrote', file)
    }
    await context.close()
  }
} finally {
  await browser.close()
}
