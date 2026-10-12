import 'server-only'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { brand, contactDefaults } from '@/content/site'
import { CACHE_TAGS } from '@/payload/hooks/revalidate'
import type { Media, TeamMember } from '@/payload-types'

/**
 * Admin-editable content, cached and tagged. Payload hooks revalidate the
 * tags on save, so an edit is live within seconds while pages stay static.
 * Empty fields fall back to the build-time defaults in content/site.ts.
 */

export type SiteSettings = {
  phone: string
  whatsappNumber: string
  email: string
  replyTimeText: string
  instagram?: string
  linkedin?: string
  github?: string
  tagline: string
  startingPriceText: string
}

const ONE_HOUR = 60 * 60

function text(v: unknown, fallback: string): string {
  return typeof v === 'string' && v.trim() ? v.trim() : fallback
}
function optionalText(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined
}

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    const payload = await getPayload({ config })
    const s = await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true })
    return {
      phone: text(s?.phone, contactDefaults.phoneDisplay),
      whatsappNumber: text(s?.whatsappNumber, contactDefaults.whatsappNumber),
      email: text(s?.email, contactDefaults.email),
      replyTimeText: text(s?.replyTimeText, contactDefaults.replyTimeText),
      instagram: optionalText(s?.instagram) ?? optionalText(contactDefaults.instagram),
      linkedin: optionalText(s?.linkedin) ?? optionalText(contactDefaults.linkedin),
      github: optionalText(s?.github) ?? optionalText(contactDefaults.github),
      tagline: text(s?.tagline, brand.tagline),
      startingPriceText: text(s?.startingPriceText, contactDefaults.startingPriceText),
    }
  },
  ['site-settings'],
  { tags: [CACHE_TAGS.siteSettings], revalidate: ONE_HOUR },
)

export type AboutContent = { heading: string; intro: string; values: string[] }

export const getAboutPage = unstable_cache(
  async (): Promise<AboutContent> => {
    const payload = await getPayload({ config })
    const a = await payload.findGlobal({ slug: 'about-page', depth: 0, overrideAccess: true })
    return {
      heading: text(a?.heading, 'Three Builders. One Vision.'),
      intro: text(
        a?.intro,
        'We are a small technology team focused on building modern websites, AI-powered experiences, automation solutions and digital products. We work directly with every client, from the first call to launch and beyond.',
      ),
      values:
        Array.isArray(a?.values) && a.values.length
          ? a.values.filter((v): v is string => typeof v === 'string')
          : ['Custom, Not Cookie-Cutter', 'AI-Ready', 'Mobile First', 'Direct Collaboration'],
    }
  },
  ['about-page'],
  { tags: [CACHE_TAGS.aboutPage], revalidate: ONE_HOUR },
)

export type TeamMemberView = {
  id: number
  name: string
  role: string
  bio: string
  skills: string[]
  aiSkills: string[]
  photoUrl?: string
  photoAlt?: string
  linkedin?: string
  github?: string
}

export const getTeamMembers = unstable_cache(
  async (): Promise<TeamMemberView[]> => {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'team-members',
      where: { visible: { equals: true } },
      sort: 'order',
      limit: 20,
      depth: 1,
      overrideAccess: true,
    })
    return res.docs.map((m: TeamMember) => {
      const photo = m.photo && typeof m.photo === 'object' ? (m.photo as Media) : undefined
      const card = photo?.sizes?.card?.url ?? photo?.url ?? undefined
      return {
        id: m.id,
        name: m.name,
        role: m.role,
        bio: m.bio,
        skills: (m.skills ?? []).filter((s): s is string => typeof s === 'string'),
        aiSkills: (m.aiSkills ?? []).filter((s): s is string => typeof s === 'string'),
        photoUrl: card ?? undefined,
        photoAlt: photo?.alt,
        linkedin: optionalText(m.linkedin),
        github: optionalText(m.github),
      }
    })
  },
  ['team-members'],
  { tags: [CACHE_TAGS.teamMembers], revalidate: ONE_HOUR },
)
