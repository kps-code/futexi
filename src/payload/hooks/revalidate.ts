import { revalidateTag, updateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

export const CACHE_TAGS = {
  siteSettings: 'site-settings',
  aboutPage: 'about-page',
  teamMembers: 'team-members',
  demoSettings: 'demo-settings',
  homePage: 'home-page',
  aiDemo: 'ai-demo',
  faqs: 'faqs',
  testimonials: 'testimonials',
  services: 'services',
  servicesPage: 'services-page',
  legalPages: 'legal-pages',
} as const

function revalidate(tag: string) {
  // Admin saves run inside a Server Action, where updateTag expires the tag
  // immediately (read-your-own-writes). REST/route-handler saves fall back to
  // revalidateTag, which serves the old value once more while refreshing.
  try {
    updateTag(tag)
    return
  } catch {
    /* not in a server action */
  }
  try {
    revalidateTag(tag, 'max')
  } catch {
    // Outside a request scope (seed scripts, tests): nothing to revalidate.
  }
}

const globalHook =
  (tag: string): GlobalAfterChangeHook =>
  ({ doc }) => {
    revalidate(tag)
    return doc
  }
const changeHook =
  (tag: string): CollectionAfterChangeHook =>
  ({ doc }) => {
    revalidate(tag)
    return doc
  }
const deleteHook =
  (tag: string): CollectionAfterDeleteHook =>
  ({ doc }) => {
    revalidate(tag)
    return doc
  }

export const revalidateSiteSettings = globalHook(CACHE_TAGS.siteSettings)
export const revalidateAboutPage = globalHook(CACHE_TAGS.aboutPage)
export const revalidateDemoSettings = globalHook(CACHE_TAGS.demoSettings)
export const revalidateHomePage = globalHook(CACHE_TAGS.homePage)
export const revalidateAiDemo = globalHook(CACHE_TAGS.aiDemo)

export const revalidateTeamMembers = changeHook(CACHE_TAGS.teamMembers)
export const revalidateTeamMembersOnDelete = deleteHook(CACHE_TAGS.teamMembers)
export const revalidateFaqs = changeHook(CACHE_TAGS.faqs)
export const revalidateFaqsOnDelete = deleteHook(CACHE_TAGS.faqs)
export const revalidateTestimonials = changeHook(CACHE_TAGS.testimonials)
export const revalidateTestimonialsOnDelete = deleteHook(CACHE_TAGS.testimonials)
export const revalidateServices = changeHook(CACHE_TAGS.services)
export const revalidateServicesOnDelete = deleteHook(CACHE_TAGS.services)
export const revalidateServicesPage = globalHook(CACHE_TAGS.servicesPage)
export const revalidateLegalPages = globalHook(CACHE_TAGS.legalPages)
