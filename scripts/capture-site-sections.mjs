/**
 * Viewport screenshots of each home section and the inner-page intros, in both
 * themes, for before/after comparison of visual work. Needs the dev server.
 *
 *   node scripts/capture-site-sections.mjs <outDir> [baseUrl]
 */
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright'

const out = process.argv[2] ?? '.screens'
const base = process.argv[3] ?? 'http://localhost:3000'
mkdirSync(out, { recursive: true })

const homeSections = [
  'top',
  'what-we-build',
  'demos',
  'ai',
  'before-after',
  'every-screen',
  'process',
  'why-us',
  'pricing',
  'team',
  'technology',
  'faq',
  'start',
]
const pages = ['/demos', '/services', '/about', '/contact']
const shots = [
  { theme: 'dark', device: 'desktop', vp: { width: 1440, height: 900 }, sections: homeSections, pages },
  {
    theme: 'light',
    device: 'desktop',
    vp: { width: 1440, height: 900 },
    sections: ['top', 'what-we-build', 'demos', 'process', 'pricing', 'start'],
    pages: ['/demos', '/about'],
  },
  {
    theme: 'dark',
    device: 'mobile',
    vp: { width: 390, height: 844 },
    sections: ['top', 'what-we-build', 'demos', 'ai', 'process', 'pricing', 'start'],
    pages: ['/demos', '/about'],
  },
]

const browser = await chromium.launch()
for (const s of shots) {
  const ctx = await browser.newContext({ viewport: s.vp, deviceScaleFactor: 1, reducedMotion: 'reduce' })
  await ctx.addInitScript((t) => localStorage.setItem('kf-theme', t), s.theme)
  const page = await ctx.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  for (const id of s.sections) {
    if (id === 'top') await page.evaluate(() => window.scrollTo(0, 0))
    else await page.locator(`#${id}`).evaluate((el) => el.scrollIntoView({ block: 'start' }))
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${out}/home-${id}-${s.theme}-${s.device}.png` })
  }
  for (const p of s.pages) {
    await page.goto(base + p, { waitUntil: 'networkidle' })
    await page.waitForTimeout(400)
    await page.screenshot({ path: `${out}/${p.slice(1)}-${s.theme}-${s.device}.png` })
  }
  await ctx.close()
  console.log(`${s.theme}/${s.device}: ${s.sections.length + s.pages.length} shots`)
}
await browser.close()
