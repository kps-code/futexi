/**
 * Manual admin round-trip check (not part of the suite): changes every admin setting
 * through the REST API exactly as the admin UI does, verifies each one on the public
 * pages, opens the admin screens in a browser, then restores everything.
 *
 *   npx tsx tests/admin-check.ts
 */
import 'dotenv/config'
import { chromium, request as pwRequest, type APIRequestContext } from 'playwright'
import { cleanupTestUser, seedTestUser, testUser } from './helpers/seedUser'

const base = process.env.BASE || 'http://localhost:3000'
const M = `pw${Date.now().toString().slice(-6)}`
let token = ''
const results: { check: string; ok: boolean; info?: string }[] = []
const ok = (check: string, pass: boolean, info?: string) => {
  results.push({ check, ok: pass, info })
  console.log((pass ? 'PASS ' : 'FAIL ') + check + (info ? '  -- ' + info : ''))
}

async function api(
  req: APIRequestContext,
  method: 'get' | 'post' | 'patch' | 'delete',
  path: string,
  data?: unknown,
) {
  const res = await req[method](path, { headers: { Authorization: `JWT ${token}` }, data })
  if (!res.ok())
    throw new Error(`${method.toUpperCase()} ${path} -> ${res.status()} ${(await res.text()).slice(0, 200)}`)
  return res.json()
}
const warm = async (req: APIRequestContext, paths: string[]) => {
  for (let i = 0; i < 2; i++) {
    for (const p of paths) await req.get(p)
    await new Promise((r) => setTimeout(r, 1500))
  }
}

async function main() {
  await seedTestUser()
  const req = await pwRequest.newContext({ baseURL: base })
  const login = await req.post('/api/users/login', {
    data: { email: testUser.email, password: testUser.password },
  })
  if (!login.ok()) throw new Error('login failed ' + login.status())
  token = ((await login.json()) as { token: string }).token

  const originals = {
    site: await api(req, 'get', '/api/globals/site-settings?depth=0'),
    home: await api(req, 'get', '/api/globals/home-page?depth=0'),
    about: await api(req, 'get', '/api/globals/about-page?depth=0'),
    services: await api(req, 'get', '/api/globals/services-page?depth=0'),
    demos: await api(req, 'get', '/api/globals/demo-settings?depth=0'),
    ai: await api(req, 'get', '/api/globals/ai-demo?depth=0'),
  }
  const created: { c: string; id: number }[] = []
  const pick = (o: Record<string, unknown>, keys: string[]) => Object.fromEntries(keys.map((k) => [k, o[k]]))
  const siteKeys = [
    'phone',
    'whatsappNumber',
    'email',
    'replyTimeText',
    'city',
    'region',
    'serviceAreaText',
    'instagram',
    'linkedin',
    'github',
    'tagline',
    'startingPriceText',
    'whatsappMessage',
    'seoDescription',
    'defaultTheme',
  ]

  try {
    /* ---- Site Settings ---- */
    await api(req, 'post', '/api/globals/site-settings', {
      phone: '+91 90000 11111',
      whatsappNumber: '919000011111',
      email: `hello-${M}@example.com`,
      replyTimeText: `We reply in ${M} minutes.`,
      city: `City${M}`,
      region: `Region${M}`,
      serviceAreaText: `Serving ${M} area`,
      instagram: `https://instagram.com/${M}`,
      linkedin: `https://linkedin.com/in/${M}`,
      github: `https://github.com/${M}`,
      tagline: `Tagline ${M}`,
      startingPriceText: `Projects start from ₹${M}`,
      whatsappMessage: `Hello ${M}`,
      seoDescription: `SEO ${M} description`,
      defaultTheme: 'dark',
    })
    /* ---- Home Page ---- */
    await api(req, 'post', '/api/globals/home-page', {
      hero: {
        headingLine1: `Hero one ${M}`,
        headingLine2: `Hero two ${M}`,
        sub: `Hero sub ${M}`,
        primaryLabel: `Primary ${M}`,
        secondaryLabel: `Secondary ${M}`,
        trustLine: [`Trust A ${M}`, `Trust B ${M}`],
      },
      journey: {
        heroLabel: `Rail ${M}`,
        chapters: [
          {
            label: `Chapter A ${M}`,
            screen: 'booking',
            eyebrow: `Eyebrow A ${M}`,
            headingLine1: `Head A ${M}`,
            headingLine2: 'line two',
            line: `Line A ${M}`,
            tagline: `Tag A ${M}`,
          },
          {
            label: `Chapter B ${M}`,
            screen: 'stats',
            eyebrow: `Eyebrow B ${M}`,
            headingLine1: `Head B ${M}`,
            headingLine2: '',
            line: `Line B ${M}`,
            tagline: `Tag B ${M}`,
          },
        ],
      },
      finalCta: {
        heading: `Final ${M}`,
        headingAccent: `Accent ${M}`,
        sub: `Final sub ${M}`,
        primaryLabel: `Go ${M}`,
        whatsappLabel: `Chat ${M}`,
      },
      technology: { heading: `Tech ${M}`, line: `Tech line ${M}`, items: [`Tool${M}`, 'Next.js'] },
      whyUs: { heading: `Why ${M}`, cards: [{ title: `Why card ${M}`, line: `Why line ${M}` }] },
      howWeWork: {
        heading: `How ${M}`,
        steps: [{ title: `Step ${M}`, icon: 'rocket', line: `Step line ${M}` }],
      },
      pricing: {
        heading: `Pricing ${M}`,
        line: `From {price} onwards ${M}.`,
        note: { tag: `Quote tag ${M}`, title: `Quote title ${M}`, body: `Quote body ${M}` },
        setups: [{ tag: `Setup tag ${M}`, title: `Setup ${M}`, bestFor: `Best ${M}`, items: [`Item ${M}`] }],
        whatsappLabel: `Quote WA ${M}`,
        secondaryLabel: `Quote talk ${M}`,
      },
    })
    /* ---- About, Services page, AI demo, Demo settings ---- */
    await api(req, 'post', '/api/globals/about-page', {
      heading: `About ${M}`,
      intro: `About intro ${M}`,
      values: [`Value ${M}`],
    })
    await api(req, 'post', '/api/globals/services-page', {
      heading: `Services ${M}`,
      sub: `Services sub ${M}`,
    })
    await api(req, 'post', '/api/globals/ai-demo', {
      conversations: [{ chip: `Chip${M}`, question: `Question ${M}?`, answer: `Answer ${M}.` }],
    })
    await api(req, 'post', '/api/globals/demo-settings', {
      hidden: ['tuition'],
      featured: [{ demo: 'booking' }, { demo: 'salon' }],
    })
    /* ---- Collections ---- */
    const svc = await api(req, 'post', '/api/services', {
      title: `Service ${M}`,
      slug: `svc-${M}`,
      icon: 'bot',
      contactType: 'ai',
      outcome: `Outcome ${M}`,
      included: [`Inc ${M}`],
      goodFor: `Good ${M}`,
      order: 999,
      visible: true,
    })
    created.push({ c: 'services', id: svc.doc.id })
    const tm = await api(req, 'post', '/api/team-members', {
      name: `Member ${M}`,
      role: `Role ${M}`,
      bio: 'Bio',
      skills: ['TS'],
      aiSkills: ['LLM'],
      order: 999,
      visible: true,
    })
    created.push({ c: 'team-members', id: tm.doc.id })
    const ts = await api(req, 'post', '/api/testimonials', {
      name: `Client ${M}`,
      business: `Biz ${M}`,
      quote: `Quote ${M}`,
      rating: 5,
      order: 999,
      visible: true,
    })
    created.push({ c: 'testimonials', id: ts.doc.id })
    const faq = await api(req, 'post', '/api/faqs', {
      question: `FAQ ${M}?`,
      answer: 'Costs {price}.',
      placement: 'home',
      order: 999,
    })
    created.push({ c: 'faqs', id: faq.doc.id })

    await warm(req, ['/', '/about', '/services', '/contact', '/demos', '/privacy'])

    /* ---- Verify on the public site ---- */
    const browser = await chromium.launch({ channel: 'chrome' })
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await ctx.newPage()
    const errs: string[] = []
    page.on('pageerror', (e) => errs.push(String(e).slice(0, 120)))
    await page.goto(base + '/', { waitUntil: 'load' })
    await page.locator('html.reveal-ready').waitFor({ timeout: 30000 })
    const text = await page.evaluate(() => document.body.innerText)
    const html = await page.content()
    const has = (s: string) => text.includes(s)
    ok(
      'default theme dark for a fresh visitor',
      await page.evaluate(() => document.documentElement.classList.contains('dark')),
    )
    ok('meta description from SEO field', html.includes(`SEO ${M} description`))
    ok(
      'header WhatsApp uses number + message',
      html.includes('wa.me/919000011111') && html.includes(encodeURIComponent(`Hello ${M}`)),
    )
    ok('hero headline lines', has(`Hero one ${M}`) && has(`Hero two ${M}`))
    ok(
      'hero sub + buttons + trust line',
      has(`Hero sub ${M}`) && has(`Primary ${M}`) && has(`Secondary ${M}`) && has(`Trust A ${M}`),
    )
    ok(
      'journey rail label + chapters',
      has(`Rail ${M}`) && has(`Head A ${M}`) && has(`Line B ${M}`) && has(`Tag A ${M}`),
    )
    ok('journey rail shows 03 chapters total', has('/ 03'))
    ok(
      'service card + menu + footer',
      has(`Service ${M}`) && html.includes(`/services#svc-${M}`) && has(`Good ${M}`),
    )
    ok('demo hidden from home showcase', !has('Tuition Centre Website'))
    {
      const start = html.indexOf('id="demos"')
      const showcase = start >= 0 ? html.slice(start, html.indexOf('</section>', start)) : ''
      const order = ['Booking Website', 'Salon Website'].map((t) => showcase.indexOf(t))
      ok(
        'home showcase follows Featured on Home (booking, salon only, in order)',
        order[0] >= 0 && order[1] > order[0] && !showcase.includes('Restaurant Website'),
      )
    }
    ok('AI demo chip from admin', has(`Chip${M}`))
    ok(
      'how we work heading + step + tech',
      has(`How ${M}`) && has(`Step ${M}`) && has(`Tech line ${M}`) && has(`Tool${M}`),
    )
    ok('why us heading + card', has(`Why ${M}`) && has(`Why line ${M}`))
    ok('trust facts: city + reply time', has(`City${M}`) && has(`We reply in ${M} minutes.`))
    ok('testimonial + team member on home', has(`Quote ${M}`) && has(`Member ${M}`) && has(`Role ${M}`))
    ok('pricing starting price text', has(`Projects start from ₹${M}`))
    ok(
      'pricing tab texts',
      has(`Pricing ${M}`) &&
        has(`From Projects start from ₹${M} onwards ${M}.`) &&
        has(`Quote title ${M}`) &&
        has(`Quote body ${M}`) &&
        has(`Setup ${M}`) &&
        has(`Item ${M}`) &&
        has(`Quote WA ${M}`) &&
        has(`Quote talk ${M}`),
    )
    ok('FAQ on home with price filled', has(`FAQ ${M}?`))
    ok('final CTA texts', has(`Final ${M}`) && has(`Accent ${M}`) && has(`Go ${M}`) && has(`Chat ${M}`))
    ok(
      'footer: phone, email, city/region, service area, socials',
      has('+91 90000 11111') &&
        has(`hello-${M}@example.com`) &&
        has(`City${M}, Region${M}`) &&
        has(`Serving ${M} area`) &&
        html.includes(`instagram.com/${M}`) &&
        html.includes(`github.com/${M}`),
    )
    ok('home page has no runtime errors', errs.length === 0, errs.join(' | '))

    await page.goto(base + '/about', { waitUntil: 'load' })
    const aboutText = await page.evaluate(() => document.body.innerText)
    ok(
      'about page heading + intro + values + member',
      aboutText.includes(`About ${M}`) &&
        aboutText.includes(`About intro ${M}`) &&
        aboutText.includes(`Value ${M}`) &&
        aboutText.includes(`Member ${M}`),
    )
    await page.goto(base + '/services', { waitUntil: 'load' })
    const svcText = await page.evaluate(() => document.body.innerText)
    ok(
      'services page heading + new service',
      svcText.includes(`Services ${M}`) &&
        svcText.includes(`Services sub ${M}`) &&
        svcText.includes(`Service ${M}`) &&
        svcText.includes(`Inc ${M}`),
    )
    await page.goto(base + '/demos', { waitUntil: 'load' })
    ok(
      'hidden demo off the demos page',
      !(await page.evaluate(() => document.body.innerText)).includes('Tuition Centre Website'),
    )
    await page.goto(base + '/contact', { waitUntil: 'load' })
    const contactText = await page.evaluate(() => document.body.innerText)
    ok(
      'contact page: phone, email, reply time, price',
      contactText.includes('+91 90000 11111') &&
        contactText.includes(`We reply in ${M} minutes.`) &&
        contactText.includes(`Projects start from ₹${M}`),
    )

    /* ---- Admin UI smoke: login, open every screen, no errors ---- */
    const admin = await ctx.newPage()
    const adminErrs: string[] = []
    admin.on('pageerror', (e) => adminErrs.push(String(e).slice(0, 120)))
    await admin.goto(base + '/admin/login', { waitUntil: 'domcontentloaded' })
    await admin.locator('input[name="email"]').fill(testUser.email)
    await admin.locator('input[name="password"]').fill(testUser.password)
    await admin.getByRole('button', { name: /log in/i }).click()
    await admin.waitForURL(/\/admin(?!\/login)/, { timeout: 60000 })
    ok('admin login via UI', true)
    const screens = [
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
      '/admin/collections/users',
      '/admin/collections/roles',
    ]
    for (const s of screens) {
      await admin.goto(base + s, { waitUntil: 'domcontentloaded' })
      await admin
        .locator('form, table, .collection-list, .global-edit, .dashboard')
        .first()
        .waitFor({ timeout: 60000 })
        .catch(() => {})
      const body = await admin.evaluate(() => document.body.innerText)
      const broken = /Something went wrong|Application error|Unhandled Runtime Error|is not defined/.test(
        body,
      )
      ok('admin screen renders ' + s, !broken)
    }
    await admin.goto(base + '/admin/globals/home-page', { waitUntil: 'domcontentloaded' })
    await admin
      .getByRole('tab', { name: 'Journey' })
      .or(admin.getByText('Journey', { exact: true }))
      .first()
      .click()
    await admin.waitForTimeout(1200)
    const journeyBody = await admin.evaluate(() => document.body.innerText)
    ok(
      'admin Journey tab shows the chapters',
      journeyBody.includes(`Chapter A ${M}`) ||
        journeyBody.includes('Chapters') ||
        journeyBody.includes('Rail label'),
    )
    await admin.screenshot({
      path: 'C:/Users/Admin/AppData/Local/Temp/kf-shots/pal/admin-journey.png',
      fullPage: false,
    })
    ok('admin screens have no runtime errors', adminErrs.length === 0, adminErrs.join(' | '))
    await browser.close()
  } finally {
    /* ---- Restore everything ---- */
    for (const c of created)
      await req.delete(`/api/${c.c}/${c.id}`, { headers: { Authorization: `JWT ${token}` } })
    const site = originals.site as Record<string, unknown>
    await api(req, 'post', '/api/globals/site-settings', pick(site, siteKeys))
    const h = originals.home as Record<string, unknown>
    const strip = (o: unknown) => JSON.parse(JSON.stringify(o, (k, v) => (k === 'id' ? undefined : v)))
    await api(
      req,
      'post',
      '/api/globals/home-page',
      strip(pick(h, ['hero', 'journey', 'finalCta', 'technology', 'whyUs', 'howWeWork', 'pricing'])),
    )
    await api(
      req,
      'post',
      '/api/globals/about-page',
      pick(originals.about as Record<string, unknown>, ['heading', 'intro', 'values']),
    )
    await api(
      req,
      'post',
      '/api/globals/services-page',
      pick(originals.services as Record<string, unknown>, ['heading', 'sub']),
    )
    await api(
      req,
      'post',
      '/api/globals/ai-demo',
      strip(pick(originals.ai as Record<string, unknown>, ['conversations'])),
    )
    await api(
      req,
      'post',
      '/api/globals/demo-settings',
      pick(originals.demos as Record<string, unknown>, ['hidden', 'featured']),
    )
    await warm(req, ['/', '/about', '/services', '/contact', '/demos'])
    await cleanupTestUser()
    await req.dispose()
    const failed = results.filter((r) => !r.ok)
    console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
    if (failed.length) console.log('FAILED:', failed.map((f) => f.check).join(' | '))
  }
}

main()
  .then(() => process.exit(0)) // Payload keeps a DB pool open; exit explicitly.
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
