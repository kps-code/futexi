/**
 * Seeds admin-editable content from docs/content-lock.md. Idempotent:
 * existing team members (matched by name), FAQ entries and filled settings
 * are left alone.
 *
 *   npm run seed
 */
import { getPayload, type Payload } from 'payload'
import config from '../src/payload.config'
import { aiScript } from '../src/content/ai-script'
import { faq, homeFaqCount } from '../src/content/faq'
import { finalCta, technology, whatWeBuild } from '../src/content/home'
import { services } from '../src/content/services'
import { contactDefaults, brand, hero, whatsappDefaultMessage } from '../src/content/site'

const team = [
  {
    name: 'Kannan A',
    role: 'Senior Software Engineer',
    bio: 'Leads architecture and backend. Builds scalable systems across web, mobile and cloud.',
    skills: [
      'React',
      'Angular',
      'React Native',
      'Next.js',
      'Python',
      'Django',
      'Flask',
      'Go',
      'ASP.NET',
      'PostgreSQL',
      'MS SQL Server',
      'MongoDB',
      'AWS',
    ],
    aiSkills: ['AI Agents', 'LLMs', 'RAG'],
    order: 1,
  },
  {
    name: 'Sankaralingam K',
    role: 'Software Engineer',
    bio: 'Builds the frontend and product experience. Turns ideas into clean, fast interfaces.',
    skills: ['React', 'Angular', 'React Native', 'Next.js', 'Python', 'Django', 'Flask', 'PostgreSQL'],
    aiSkills: ['Prompt Engineering', 'AI Agents', 'LLMs', 'RAG'],
    linkedin: contactDefaults.linkedin,
    order: 2,
  },
  {
    name: 'Nanthakumar G',
    role: 'Software Engineer',
    bio: 'Builds full-stack features and integrations. Keeps every delivery clean and tested.',
    skills: ['React', 'Angular', 'React Native', 'Next.js', 'Python', 'Django', 'Flask', 'PostgreSQL'],
    aiSkills: ['Prompt Engineering', 'AI Agents', 'LLMs', 'RAG'],
    order: 3,
  },
]

export async function seed(payload: Payload) {
  let created = 0
  for (const member of team) {
    const existing = await payload.find({
      collection: 'team-members',
      where: { name: { equals: member.name } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.totalDocs > 0) continue
    await payload.create({
      collection: 'team-members',
      data: { ...member, visible: true },
      overrideAccess: true,
    })
    created++
  }
  payload.logger.info(`team members: ${created} created, ${team.length - created} already present`)

  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
  if (!settings?.phone) {
    await payload.updateGlobal({
      slug: 'site-settings',
      overrideAccess: true,
      data: {
        phone: contactDefaults.phoneDisplay,
        whatsappNumber: contactDefaults.whatsappNumber,
        email: contactDefaults.email,
        replyTimeText: contactDefaults.replyTimeText,
        linkedin: contactDefaults.linkedin,
        tagline: brand.tagline,
        startingPriceText: contactDefaults.startingPriceText,
        whatsappMessage: whatsappDefaultMessage,
        seoDescription: brand.tagline,
        city: contactDefaults.city,
        region: contactDefaults.region,
        serviceAreaText: contactDefaults.serviceAreaText,
      },
    })
    payload.logger.info('site settings: seeded')
  } else if (!settings.whatsappMessage || !settings.seoDescription || !settings.city) {
    await payload.updateGlobal({
      slug: 'site-settings',
      overrideAccess: true,
      data: {
        whatsappMessage: settings.whatsappMessage || whatsappDefaultMessage,
        seoDescription: settings.seoDescription || brand.tagline,
        city: settings.city || contactDefaults.city,
        region: settings.region || contactDefaults.region,
        serviceAreaText: settings.serviceAreaText || contactDefaults.serviceAreaText,
      },
    })
    payload.logger.info('site settings: WhatsApp message, SEO description and location filled')
  } else {
    payload.logger.info('site settings: already filled, skipped')
  }

  const about = await payload.findGlobal({ slug: 'about-page', overrideAccess: true })
  if (!about?.heading) {
    await payload.updateGlobal({
      slug: 'about-page',
      overrideAccess: true,
      data: {
        heading: 'Three Builders. One Vision.',
        intro:
          'We are a small technology team focused on building modern websites, AI-powered experiences, automation solutions and digital products. We work directly with every client, from the first call to launch and beyond.',
        values: ['Custom, Not Cookie-Cutter', 'AI-Ready', 'Mobile First', 'Direct Collaboration'],
      },
    })
    payload.logger.info('about page: seeded')
  } else {
    payload.logger.info('about page: already filled, skipped')
  }

  const home = await payload.findGlobal({ slug: 'home-page', overrideAccess: true })
  if (!home?.hero?.headingLine1) {
    await payload.updateGlobal({
      slug: 'home-page',
      overrideAccess: true,
      data: {
        hero: {
          headingLine1: hero.headingLine1,
          headingLine2: hero.headingLine2,
          sub: hero.sub,
          primaryLabel: hero.primary.label,
          secondaryLabel: hero.secondary.label,
          trustLine: [...hero.trustLine],
        },
        finalCta: {
          heading: finalCta.heading,
          headingAccent: finalCta.headingAccent,
          sub: finalCta.sub,
          primaryLabel: finalCta.primary.label,
          whatsappLabel: finalCta.whatsapp,
        },
        technology: { heading: technology.heading, line: technology.line, items: [...technology.items] },
      },
    })
    payload.logger.info('home page texts: seeded')
  } else {
    payload.logger.info('home page texts: already filled, skipped')
  }

  const ai = await payload.findGlobal({ slug: 'ai-demo', overrideAccess: true })
  if (!ai?.conversations?.length) {
    await payload.updateGlobal({
      slug: 'ai-demo',
      overrideAccess: true,
      data: {
        conversations: aiScript.map((s) => ({ chip: s.chip, question: s.question, answer: s.answer })),
      },
    })
    payload.logger.info('AI assistant demo: seeded')
  } else {
    payload.logger.info('AI assistant demo: already filled, skipped')
  }

  const faqs = await payload.count({ collection: 'faqs', overrideAccess: true })
  if (faqs.totalDocs === 0) {
    for (const [i, f] of faq.entries()) {
      await payload.create({
        collection: 'faqs',
        data: { question: f.q, answer: f.a, placement: i < homeFaqCount ? 'home' : 'contact', order: i + 1 },
        overrideAccess: true,
      })
    }
    payload.logger.info(`faq: ${faq.length} entries seeded`)
  } else {
    payload.logger.info(`faq: ${faqs.totalDocs} entries already present, skipped`)
  }

  const existingServices = await payload.count({ collection: 'services', overrideAccess: true })
  if (existingServices.totalDocs === 0) {
    for (const [i, s] of services.entries()) {
      await payload.create({
        collection: 'services',
        data: {
          title: s.title,
          slug: s.id,
          icon: s.icon,
          contactType: s.contactType,
          outcome: s.outcome,
          homeLine: whatWeBuild.cards.find((c) => c.id === s.id)?.what,
          included: [...s.included],
          goodFor: s.goodFor,
          order: i + 1,
          visible: true,
        },
        overrideAccess: true,
      })
    }
    payload.logger.info(`services: ${services.length} seeded`)
  } else {
    payload.logger.info(`services: ${existingServices.totalDocs} already present, skipped`)
  }
}

/** Ask a running dev server to drop its cached copies, then warm the pages. */
async function refreshDevServer(payload: Payload) {
  if (process.env.NODE_ENV === 'production') return
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  try {
    const res = await fetch(`${base}/api/dev/revalidate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        tags: [
          'team-members',
          'site-settings',
          'about-page',
          'demo-settings',
          'home-page',
          'ai-demo',
          'faqs',
          'testimonials',
          'services',
          'services-page',
          'legal-pages',
        ],
      }),
    })
    if (!res.ok) throw new Error(String(res.status))
    for (let i = 0; i < 2; i++) {
      await Promise.all(['/', '/about', '/contact'].map((p) => fetch(`${base}${p}`).catch(() => undefined)))
      await new Promise((r) => setTimeout(r, 800))
    }
    payload.logger.info('dev server caches refreshed')
  } catch {
    payload.logger.info('dev server not reachable; pages refresh within an hour or on restart')
  }
}

const payload = await getPayload({ config })
await seed(payload)
await refreshDevServer(payload)
process.exit(0)
