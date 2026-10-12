/**
 * Seeds admin-editable content from docs/content-lock.md. Idempotent:
 * existing team members (matched by name) and filled settings are left alone.
 *
 *   npm run seed
 */
import { getPayload, type Payload } from 'payload'
import config from '../src/payload.config'
import { contactDefaults, brand } from '../src/content/site'

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
      },
    })
    payload.logger.info('site settings: seeded')
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
}

/** Ask a running dev server to drop its cached copies, then warm the pages. */
async function refreshDevServer(payload: Payload) {
  if (process.env.NODE_ENV === 'production') return
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  try {
    const res = await fetch(`${base}/api/dev/revalidate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ tags: ['team-members', 'site-settings', 'about-page', 'demo-settings'] }),
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
