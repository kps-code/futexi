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

const SIZES = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
}
// DEVICES=tablet node scripts/... limits the run; tablet captures the home screen only.
const DEVICES = (process.env.DEVICES ?? Object.keys(SIZES).join(',')).split(',')

/** Per-demo capture plans: name -> steps to reach the screen. */
const bookTime = (bookPath, service) => ({
  name: 'book-time',
  path: bookPath,
  steps: [
    { click: `button:has-text("${service}")` },
    { click: '[data-testid="date-list"] button >> nth=1' },
    { waitFor: '[data-testid="slot-list"] button' },
  ],
})

const PLANS = {
  booking: [
    { name: 'home', path: '/demo/booking', steps: [] },
    { name: 'treatments', path: '/demo/booking/treatments', steps: [] },
    { name: 'membership', path: '/demo/booking/membership', steps: [] },
    { name: 'book-service', path: '/demo/booking/book', steps: [] },
    bookTime('/demo/booking/book', 'Signature Facial'),
  ],
  salon: [
    { name: 'home', path: '/demo/salon', steps: [] },
    { name: 'services', path: '/demo/salon/services', steps: [] },
    { name: 'bridal', path: '/demo/salon/bridal', steps: [] },
    bookTime('/demo/salon/book', 'Haircut & Style'),
  ],
  restaurant: [
    { name: 'home', path: '/demo/restaurant', steps: [] },
    { name: 'menu', path: '/demo/restaurant#menu', steps: [{ scrollTo: '#menu' }] },
    {
      name: 'order',
      path: '/demo/restaurant/order',
      steps: [
        { click: 'button[aria-label="Add Chettinad Pepper Chicken"]' },
        { click: 'button[aria-label="Add Mutton Kuzhambu"]' },
        { click: 'button[aria-label="Add one more Mutton Kuzhambu"]' },
        { click: 'button[aria-label="Add Nannari Sherbet"]' },
        { scrollTo: 'body' },
      ],
    },
    { name: 'private-dining', path: '/demo/restaurant/private-dining', steps: [] },
    bookTime('/demo/restaurant/reserve', 'Table for 4'),
  ],
  'ai-business': [
    { name: 'home', path: '/demo/ai-business', steps: [] },
    {
      name: 'chat',
      path: '/demo/ai-business',
      steps: [{ click: 'button:has-text("Plans and pricing")' }, { waitFor: 'text=Monthly ₹1,999' }],
    },
    { name: 'schedule', path: '/demo/ai-business/schedule', steps: [] },
    { name: 'trainers', path: '/demo/ai-business/trainers', steps: [] },
    { name: 'plans', path: '/demo/ai-business#plans', steps: [{ scrollTo: '#plans' }] },
  ],
  interior: [
    { name: 'home', path: '/demo/interior', steps: [] },
    { name: 'projects', path: '/demo/interior/projects', steps: [] },
    { name: 'project', path: '/demo/interior/projects/sea-breeze-apartment', steps: [] },
    { name: 'services', path: '/demo/interior/services', steps: [] },
    { name: 'enquire', path: '/demo/interior#enquire', steps: [{ scrollTo: '#enquire' }] },
  ],
  tuition: [
    { name: 'home', path: '/demo/tuition', steps: [] },
    { name: 'courses', path: '/demo/tuition/courses', steps: [] },
    { name: 'results', path: '/demo/tuition/results', steps: [] },
    { name: 'enquire', path: '/demo/tuition#enquire', steps: [{ scrollTo: '#enquire' }] },
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
    if (!DEVICES.includes(device)) continue
    const context = await browser.newContext({
      viewport: size,
      deviceScaleFactor: 1,
      isMobile: device === 'mobile',
      hasTouch: device === 'mobile',
      // Desktop keeps motion on so Motion v2 and the 3D hero scene appear in the shot, as a visitor
      // with a mouse sees them; phones and tablets stay on the calm CSS layer.
      reducedMotion: device === 'desktop' ? 'no-preference' : 'reduce',
      colorScheme: 'light',
    })
    const page = await context.newPage()
    for (const shot of plan) {
      if (device === 'tablet' && shot.name !== 'home') continue
      await page.goto(`${base}${shot.path}`, { waitUntil: 'load', timeout: 120_000 })
      await page.waitForTimeout(1200)
      // Motion v2 pages (desktop): the 3D hero scene loads after the page load event and fades in over
      // 1.2 s; the GSAP intro runs about 1.5 s. Wait for the scene when the page has one, then let both settle.
      // The canvas element is in the DOM on every device, but the scene mounts on desktop only.
      const hasScene = device === 'desktop' && (await page.locator('.v2-hero-canvas').count()) > 0
      if (hasScene) {
        await page
          .waitForFunction(() => document.documentElement.classList.contains('dm-v2-three'), undefined, {
            timeout: 20_000,
          })
          .catch(() => console.warn('3D scene did not report ready on', shot.path))
        await page.waitForTimeout(1800)
      } else if (await page.evaluate(() => document.documentElement.classList.contains('dm-v2'))) {
        await page.waitForTimeout(2500)
      }
      for (const step of shot.steps) {
        if (step.click) await page.locator(step.click).first().click()
        if (step.waitFor) await page.locator(step.waitFor).first().waitFor({ timeout: 15_000 })
        if (step.scrollTo) {
          await page.evaluate(
            (sel) => document.querySelector(sel)?.scrollIntoView({ block: 'start' }),
            step.scrollTo,
          )
          await page.waitForTimeout(300)
        }
      }
      // Let fonts and reveals settle.
      await page.evaluate(() => document.fonts.ready)
      await page.evaluate(() =>
        document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible')),
      )
      // The Next.js dev indicator must not appear in case-study images when capturing from the dev server.
      await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' })
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
