import 'server-only'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { aiScript, type AiScriptItem } from '@/content/ai-script'
import type { ContactType } from '@/content/contact'
import { demoBySlug, demos, type Demo } from '@/content/demos'
import { faq, homeFaqCount } from '@/content/faq'
import {
  finalCta,
  howWeWork,
  journey,
  journeyScreens,
  pricing,
  technology,
  whatWeBuild,
  whyUs,
  type JourneyScreen,
} from '@/content/home'
import { isIconName, type IconName } from '@/content/icon-names'
import { brandLogoFrom, themeName, type BrandLogo, type ThemeName } from '@/lib/branding'
import { privacyDefaults, termsDefaults, type LegalPageContent } from '@/content/legal'
import { services as serviceDefaults, servicesPage } from '@/content/services'
import { brand, contactDefaults, hero, whatsappDefaultMessage } from '@/content/site'
import { CACHE_TAGS } from '@/payload/hooks/revalidate'
import type { Media, TeamMember } from '@/payload-types'

/**
 * Admin-editable content, cached and tagged. Payload hooks revalidate the
 * tags on save, so an edit is live within seconds while pages stay static.
 * Empty fields fall back to the build-time defaults in src/content/*.
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
  whatsappMessage: string
  seoDescription: string
  city: string
  region: string
  serviceAreaText: string
  /** Absolute or site-relative URL of the uploaded share image, if any. */
  ogImageUrl?: string
  /** Uploaded logo for the header and footer; the text wordmark is used when absent. */
  logo?: BrandLogo
  /** Logo variant for the dark theme; the main logo is used when absent. */
  logoDark?: BrandLogo
  /** Uploaded browser-tab icon; the built-in /icon.svg is used when absent. */
  siteIcon?: { url: string; mimeType?: string }
  /** Theme first-time visitors get. The header toggle stores a visitor's own choice. */
  defaultTheme: ThemeName
}

const ONE_HOUR = 60 * 60

function text(v: unknown, fallback: string): string {
  return typeof v === 'string' && v.trim() ? v.trim() : fallback
}
function optionalText(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined
}
function textList(v: unknown, fallback: readonly string[]): string[] {
  const list = Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.trim() !== '') : []
  return list.length ? list : [...fallback]
}
function mediaUrl(v: unknown, size?: 'thumbnail' | 'card' | 'large'): string | undefined {
  if (!v || typeof v !== 'object') return undefined
  const m = v as Media
  return (size && m.sizes?.[size]?.url) || m.url || undefined
}
function siteIconFrom(v: unknown): { url: string; mimeType?: string } | undefined {
  const url = mediaUrl(v)
  if (!url) return undefined
  const mime = (v as Media).mimeType
  return { url, mimeType: typeof mime === 'string' && mime ? mime : undefined }
}
function iconName(v: unknown, fallback: IconName): IconName {
  return isIconName(v) ? v : fallback
}
function journeyScreen(v: unknown, fallback: JourneyScreen): JourneyScreen {
  return journeyScreens.some((s) => s.value === v) ? (v as JourneyScreen) : fallback
}

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    const payload = await getPayload({ config })
    const s = await payload.findGlobal({ slug: 'site-settings', depth: 1, overrideAccess: true })
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
      whatsappMessage: text(s?.whatsappMessage, whatsappDefaultMessage),
      seoDescription: text(s?.seoDescription, brand.tagline),
      city: text(s?.city, contactDefaults.city),
      region: text(s?.region, contactDefaults.region),
      serviceAreaText: text(s?.serviceAreaText, contactDefaults.serviceAreaText),
      ogImageUrl: mediaUrl(s?.ogImage),
      logo: brandLogoFrom(s?.logo, brand.name),
      logoDark: brandLogoFrom(s?.logoDark, brand.name),
      siteIcon: siteIconFrom(s?.siteIcon),
      defaultTheme: themeName(s?.defaultTheme),
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
      values: textList(a?.values, [
        'Custom, Not Cookie-Cutter',
        'AI-Ready',
        'Mobile First',
        'Direct Collaboration',
      ]),
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
      return {
        id: m.id,
        name: m.name,
        role: m.role,
        bio: m.bio,
        skills: (m.skills ?? []).filter((s): s is string => typeof s === 'string'),
        aiSkills: (m.aiSkills ?? []).filter((s): s is string => typeof s === 'string'),
        photoUrl: mediaUrl(photo, 'card'),
        photoAlt: photo?.alt,
        linkedin: optionalText(m.linkedin),
        github: optionalText(m.github),
      }
    })
  },
  ['team-members'],
  { tags: [CACHE_TAGS.teamMembers], revalidate: ONE_HOUR },
)

export type DemoSettings = { hidden: string[]; featured: string[] }

const DEFAULT_FEATURED = ['booking', 'salon', 'restaurant', 'ai-business']

/** Admin-controlled demo visibility (Settings > Demos). */
export const getDemoSettings = unstable_cache(
  async (): Promise<DemoSettings> => {
    const payload = await getPayload({ config })
    const s = await payload.findGlobal({ slug: 'demo-settings', depth: 0, overrideAccess: true })
    const list = (v: unknown): string[] =>
      Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []
    const featured = list(s?.featured)
    return { hidden: list(s?.hidden), featured: featured.length ? featured : DEFAULT_FEATURED }
  },
  ['demo-settings'],
  { tags: [CACHE_TAGS.demoSettings], revalidate: ONE_HOUR },
)

/** Demos that may appear on the public site, in catalogue order. */
export async function getVisibleDemos(): Promise<Demo[]> {
  const { hidden } = await getDemoSettings()
  return demos.filter((d) => !hidden.includes(d.slug))
}

/** Up to four demos for the home page, in the admin's chosen order, skipping hidden ones. */
export async function getFeaturedDemos(): Promise<Demo[]> {
  const { hidden, featured } = await getDemoSettings()
  return featured
    .map(demoBySlug)
    .filter((d): d is Demo => Boolean(d) && !hidden.includes(d!.slug))
    .slice(0, 4)
}

export async function isDemoHidden(slug: string): Promise<boolean> {
  const { hidden } = await getDemoSettings()
  return hidden.includes(slug)
}

/* ------------------------------------------------------------------------ */
/* Home page texts (Content > Home Page)                                    */
/* ------------------------------------------------------------------------ */

export type HeroContent = {
  eyebrow: string
  headingLine1: string
  headingLine2: string
  sub: string
  primaryLabel: string
  secondaryLabel: string
  trustLine: string[]
}
export type FinalCtaContent = {
  heading: string
  headingAccent: string
  sub: string
  primaryLabel: string
  whatsappLabel: string
}
export type TechnologyContent = { heading: string; line: string; items: string[] }
export type WhyUsContent = { heading: string; cards: { title: string; line: string }[] }
export type HowWeWorkContent = { heading: string; steps: { title: string; line: string; icon: IconName }[] }
export type JourneyChapter = {
  label: string
  eyebrow: string
  headingLine1: string
  headingLine2: string
  line: string
  tagline: string
  screen: JourneyScreen
}
export type JourneyContent = { heroLabel: string; chapters: JourneyChapter[] }
export type PricingSetup = { tag: string; title: string; bestFor: string; items: string[] }
export type PricingContent = {
  heading: string
  /** Contains {price}, replaced with the starting price text when rendered. */
  line: string
  note: { tag: string; title: string; body: string }
  setups: PricingSetup[]
  whatsappLabel: string
  secondaryLabel: string
}
export type HomePageContent = {
  hero: HeroContent
  journey: JourneyContent
  pricing: PricingContent
  finalCta: FinalCtaContent
  technology: TechnologyContent
  whyUs: WhyUsContent
  howWeWork: HowWeWorkContent
}

export const getHomePage = unstable_cache(
  async (): Promise<HomePageContent> => {
    const payload = await getPayload({ config })
    const h = await payload.findGlobal({ slug: 'home-page', depth: 0, overrideAccess: true })
    const cards = (h?.whyUs?.cards ?? [])
      .map((c) => ({ title: text(c.title, ''), line: text(c.line, '') }))
      .filter((c) => c.title)
    const steps = (h?.howWeWork?.steps ?? [])
      .map((s) => ({ title: text(s.title, ''), line: text(s.line, ''), icon: iconName(s.icon, 'check') }))
      .filter((s) => s.title)
    const setups: PricingSetup[] = (h?.pricing?.setups ?? [])
      .map((s) => ({
        tag: text(s.tag, ''),
        title: text(s.title, ''),
        bestFor: text(s.bestFor, ''),
        items: textList(s.items, []),
      }))
      .filter((s) => s.title)
    const chapters: JourneyChapter[] = (h?.journey?.chapters ?? [])
      .map((c) => ({
        label: text(c.label, ''),
        eyebrow: text(c.eyebrow, ''),
        headingLine1: text(c.headingLine1, ''),
        headingLine2: text(c.headingLine2, ''),
        line: text(c.line, ''),
        tagline: text(c.tagline, ''),
        screen: journeyScreen(c.screen, 'chat'),
      }))
      .filter((c) => c.label && c.headingLine1 && c.line)
    return {
      hero: {
        eyebrow: hero.eyebrow,
        headingLine1: text(h?.hero?.headingLine1, hero.headingLine1),
        headingLine2: text(h?.hero?.headingLine2, hero.headingLine2),
        sub: text(h?.hero?.sub, hero.sub),
        primaryLabel: text(h?.hero?.primaryLabel, hero.primary.label),
        secondaryLabel: text(h?.hero?.secondaryLabel, hero.secondary.label),
        trustLine: textList(h?.hero?.trustLine, hero.trustLine),
      },
      journey: {
        heroLabel: text(h?.journey?.heroLabel, journey.heroLabel),
        chapters: chapters.length ? chapters : journey.chapters.map((c) => ({ ...c })),
      },
      pricing: {
        heading: text(h?.pricing?.heading, pricing.heading),
        line: text(h?.pricing?.line, pricing.line),
        note: {
          tag: text(h?.pricing?.note?.tag, pricing.note.tag),
          title: text(h?.pricing?.note?.title, pricing.note.title),
          body: text(h?.pricing?.note?.body, pricing.note.body),
        },
        setups: setups.length
          ? setups
          : pricing.setups.map((s) => ({
              tag: s.tag,
              title: s.title,
              bestFor: s.bestFor,
              items: [...s.items],
            })),
        whatsappLabel: text(h?.pricing?.whatsappLabel, pricing.cta.label),
        secondaryLabel: text(h?.pricing?.secondaryLabel, pricing.secondary.label),
      },
      finalCta: {
        heading: text(h?.finalCta?.heading, finalCta.heading),
        headingAccent: text(h?.finalCta?.headingAccent, finalCta.headingAccent),
        sub: text(h?.finalCta?.sub, finalCta.sub),
        primaryLabel: text(h?.finalCta?.primaryLabel, finalCta.primary.label),
        whatsappLabel: text(h?.finalCta?.whatsappLabel, finalCta.whatsapp),
      },
      technology: {
        heading: text(h?.technology?.heading, technology.heading),
        line: text(h?.technology?.line, technology.line),
        items: textList(h?.technology?.items, technology.items),
      },
      whyUs: {
        heading: text(h?.whyUs?.heading, whyUs.heading),
        cards: cards.length ? cards : whyUs.cards.map((c) => ({ title: c.title, line: c.line })),
      },
      howWeWork: {
        heading: text(h?.howWeWork?.heading, howWeWork.heading),
        steps: steps.length
          ? steps
          : howWeWork.steps.map((s) => ({ title: s.title, line: s.line, icon: iconName(s.icon, 'check') })),
      },
    }
  },
  ['home-page'],
  { tags: [CACHE_TAGS.homePage], revalidate: ONE_HOUR },
)

/* ------------------------------------------------------------------------ */
/* Services (Content > Services, Content > Services Page)                   */
/* ------------------------------------------------------------------------ */

export type ServiceView = {
  id: string
  slug: string
  icon: IconName
  title: string
  outcome: string
  homeLine?: string
  included: string[]
  goodFor?: string
  contactType: ContactType
}

function defaultServices(): ServiceView[] {
  return serviceDefaults.map((s) => ({
    id: `default-${s.id}`,
    slug: s.id,
    icon: iconName(s.icon, 'globe'),
    title: s.title,
    outcome: s.outcome,
    homeLine: whatWeBuild.cards.find((c) => c.id === s.id)?.what,
    included: [...s.included],
    goodFor: s.goodFor,
    contactType: s.contactType,
  }))
}

/** Visible services in order. Falls back to the code catalogue while the collection is empty. */
export const getServices = unstable_cache(
  async (): Promise<ServiceView[]> => {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'services',
      where: { visible: { equals: true } },
      sort: 'order',
      limit: 30,
      depth: 0,
      overrideAccess: true,
    })
    const total = await payload.count({ collection: 'services', overrideAccess: true })
    if (total.totalDocs === 0) return defaultServices()
    return res.docs.map((d) => ({
      id: String(d.id),
      slug: d.slug,
      icon: iconName(d.icon, 'globe'),
      title: d.title,
      outcome: d.outcome,
      homeLine: optionalText(d.homeLine),
      included: textList(d.included, []),
      goodFor: optionalText(d.goodFor),
      contactType: (d.contactType ?? 'website') as ContactType,
    }))
  },
  ['services'],
  { tags: [CACHE_TAGS.services], revalidate: ONE_HOUR },
)

export type ServicesPageContent = { heading: string; sub: string }

export const getServicesPage = unstable_cache(
  async (): Promise<ServicesPageContent> => {
    const payload = await getPayload({ config })
    const p = await payload.findGlobal({ slug: 'services-page', depth: 0, overrideAccess: true })
    return { heading: text(p?.heading, servicesPage.heading), sub: text(p?.sub, servicesPage.sub) }
  },
  ['services-page'],
  { tags: [CACHE_TAGS.servicesPage], revalidate: ONE_HOUR },
)

/* ------------------------------------------------------------------------ */
/* Legal pages (Content > Legal Pages)                                      */
/* ------------------------------------------------------------------------ */

export type LegalPageView = LegalPageContent

export const getLegalPage = unstable_cache(
  async (kind: 'privacy' | 'terms'): Promise<LegalPageView> => {
    const payload = await getPayload({ config })
    const g = await payload.findGlobal({ slug: 'legal-pages', depth: 0, overrideAccess: true })
    const defaults = kind === 'privacy' ? privacyDefaults : termsDefaults
    const page = g?.[kind]
    const sections = (page?.sections ?? [])
      .map((s) => ({ title: text(s.title, ''), body: text(s.body, '') }))
      .filter((s) => s.title && s.body)
    return {
      title: text(page?.title, defaults.title),
      intro: text(page?.intro, defaults.intro),
      updatedOn: text(page?.updatedOn, defaults.updatedOn),
      sections: sections.length ? sections : defaults.sections,
    }
  },
  ['legal-pages'],
  { tags: [CACHE_TAGS.legalPages], revalidate: ONE_HOUR },
)

/* ------------------------------------------------------------------------ */
/* Scripted AI conversation (Content > AI Assistant Demo)                   */
/* ------------------------------------------------------------------------ */

export const getAiScript = unstable_cache(
  async (): Promise<AiScriptItem[]> => {
    const payload = await getPayload({ config })
    const g = await payload.findGlobal({ slug: 'ai-demo', depth: 0, overrideAccess: true })
    const rows = (g?.conversations ?? [])
      .map((c) => ({ chip: text(c.chip, ''), question: text(c.question, ''), answer: text(c.answer, '') }))
      .filter((c) => c.chip && c.question && c.answer)
    return rows.length ? rows : [...aiScript]
  },
  ['ai-demo'],
  { tags: [CACHE_TAGS.aiDemo], revalidate: ONE_HOUR },
)

/* ------------------------------------------------------------------------ */
/* FAQ (Content > FAQ)                                                      */
/* ------------------------------------------------------------------------ */

export type FaqItem = { id: string; question: string; answer: string; showOnHome: boolean }

export const getFaqs = unstable_cache(
  async (): Promise<FaqItem[]> => {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'faqs',
      where: { placement: { not_equals: 'hidden' } },
      sort: 'order',
      limit: 50,
      depth: 0,
      overrideAccess: true,
    })
    if (res.docs.length === 0) {
      return faq.map((f, i) => ({
        id: `default-${i}`,
        question: f.q,
        answer: f.a,
        showOnHome: i < homeFaqCount,
      }))
    }
    return res.docs.map((d) => ({
      id: String(d.id),
      question: d.question,
      answer: d.answer,
      showOnHome: d.placement === 'home',
    }))
  },
  ['faqs'],
  { tags: [CACHE_TAGS.faqs], revalidate: ONE_HOUR },
)

/* ------------------------------------------------------------------------ */
/* Testimonials (Content > Testimonials)                                    */
/* ------------------------------------------------------------------------ */

export type TestimonialView = {
  id: number
  name: string
  business?: string
  quote: string
  rating?: number
  photoUrl?: string
  photoAlt?: string
}

export const getTestimonials = unstable_cache(
  async (): Promise<TestimonialView[]> => {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'testimonials',
      where: { and: [{ visible: { equals: true } }, { quote: { exists: true } }] },
      sort: 'order',
      limit: 12,
      depth: 1,
      overrideAccess: true,
    })
    return res.docs
      .filter((t) => typeof t.quote === 'string' && t.quote.trim() !== '')
      .map((t) => {
        const photo = t.photo && typeof t.photo === 'object' ? (t.photo as Media) : undefined
        return {
          id: t.id,
          name: t.name,
          business: optionalText(t.business),
          quote: (t.quote as string).trim(),
          rating: typeof t.rating === 'number' ? Math.min(5, Math.max(1, Math.round(t.rating))) : undefined,
          photoUrl: mediaUrl(photo, 'thumbnail'),
          photoAlt: photo?.alt,
        }
      })
  },
  ['testimonials'],
  { tags: [CACHE_TAGS.testimonials], revalidate: ONE_HOUR },
)
