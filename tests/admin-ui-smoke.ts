/**
 * Admin UI smoke (manual, not part of the suite): logs in through the admin screens,
 * opens every global and collection, checks for runtime errors, and screenshots the
 * Home Page > Journey tab.
 *
 *   npx tsx tests/admin-ui-smoke.ts
 */
import 'dotenv/config'
import { chromium } from 'playwright'
import { cleanupTestUser, seedTestUser, testUser } from './helpers/seedUser'

const base = process.env.BASE || 'http://localhost:3000'
/** Home Page tab to open and screenshot (ONLY_JOURNEY=1 TAB=Pricing). */
const TAB = process.env.TAB || 'Journey'
const out = 'C:/Users/Admin/AppData/Local/Temp/kf-shots/admin'
const screens = [
  '/admin',
  '/admin/globals/site-settings',
  '/admin/globals/home-page',
  '/admin/globals/about-page',
  '/admin/globals/services-page',
  '/admin/globals/demo-settings',
  '/admin/globals/ai-demo',
  '/admin/globals/legal-pages',
  '/admin/collections/services',
  '/admin/collections/testimonials',
  '/admin/collections/team-members',
  '/admin/collections/faqs',
  '/admin/collections/leads',
  '/admin/collections/demo-bookings',
  '/admin/collections/demo-leads',
  '/admin/collections/users',
  '/admin/collections/roles',
  '/admin/collections/media',
]

const t0 = Date.now()
const step = (m: string) => console.log(`[${Date.now() - t0} ms] ${m}`)
const watchdog = setTimeout(() => {
  console.log('STUCK after 240 s')
  process.exit(2)
}, 240_000)

async function main() {
  step('seeding')
  await seedTestUser()
  step('seeded')
  const browser = await chromium.launch({ channel: 'chrome' })
  step('browser launched')
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errs: string[] = []
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)))
  page.on('console', (m) => {
    if (m.type() === 'error' && !/favicon|hydrat/i.test(m.text()))
      errs.push('console: ' + m.text().slice(0, 160))
  })
  try {
    await page.goto(base + '/admin/login', { waitUntil: 'domcontentloaded', timeout: 120000 })
    await page.locator('form').waitFor({ timeout: 120000 })
    step('login form ready')
    await page.locator('input[name="email"]').fill(testUser.email)
    await page.locator('input[name="password"]').fill(testUser.password)
    await Promise.all([
      page.waitForURL((u) => !u.pathname.endsWith('/admin/login'), { timeout: 120000 }),
      page.locator('form button[type="submit"]').click(),
    ])
    console.log('PASS login via admin UI ->', page.url())
    for (const s of process.env.ONLY_JOURNEY ? [] : screens) {
      await page.goto(base + s, { waitUntil: 'domcontentloaded', timeout: 120000 })
      await page
        .locator('form, table, .collection-list, .list-controls, .dashboard, .global-edit, h1')
        .first()
        .waitFor({ timeout: 120000 })
      await page.waitForTimeout(600)
      const body = await page.evaluate(() => document.body.innerText)
      const broken =
        /Something went wrong|Application error|Unhandled Runtime|is not defined|Internal Server Error/.test(
          body,
        )
      console.log((broken ? 'FAIL ' : 'PASS ') + 'screen ' + s)
    }
    await page.goto(base + '/admin/globals/home-page', { waitUntil: 'domcontentloaded', timeout: 120000 })
    await page.locator('form').waitFor({ timeout: 120000 })
    await page.locator('.tabs-field__tab-button', { hasText: TAB }).first().click()
    await page.waitForTimeout(1200)
    const body = await page.evaluate(() => document.body.innerText)
    console.log(
      (/Rail label|Chapters|Chapter 01 label|How quotes work card|Typical setups/.test(body)
        ? 'PASS '
        : 'FAIL ') +
        TAB +
        ' tab fields visible',
    )
    const { mkdirSync } = await import('node:fs')
    mkdirSync(out, { recursive: true })
    await page.screenshot({ path: out + '/' + TAB.toLowerCase() + '-tab.png', fullPage: true })
    await page.goto(base + '/admin/globals/site-settings', { waitUntil: 'domcontentloaded', timeout: 120000 })
    await page.locator('form').waitFor({ timeout: 120000 })
    await page.waitForTimeout(800)
    await page.screenshot({ path: out + '/site-settings.png' })
    console.log(
      errs.length ? 'FAIL runtime errors: ' + errs.join(' | ') : 'PASS no runtime errors on admin screens',
    )
  } finally {
    step('closing')
    await browser.close()
    await cleanupTestUser()
    clearTimeout(watchdog)
  }
}

main()
  .then(() => process.exit(0)) // Payload keeps a DB pool open; exit explicitly.
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
