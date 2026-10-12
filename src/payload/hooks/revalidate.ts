import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

export const CACHE_TAGS = {
  siteSettings: 'site-settings',
  aboutPage: 'about-page',
  teamMembers: 'team-members',
} as const

function revalidate(tag: string) {
  try {
    // Next 16: second argument is the cache profile. 'max' = serve stale while refreshing.
    revalidateTag(tag, 'max')
  } catch {
    // Outside a request scope (seed scripts, tests): nothing to revalidate.
  }
}

export const revalidateSiteSettings: GlobalAfterChangeHook = ({ doc }) => {
  revalidate(CACHE_TAGS.siteSettings)
  return doc
}

export const revalidateAboutPage: GlobalAfterChangeHook = ({ doc }) => {
  revalidate(CACHE_TAGS.aboutPage)
  return doc
}

export const revalidateTeamMembers: CollectionAfterChangeHook = ({ doc }) => {
  revalidate(CACHE_TAGS.teamMembers)
  return doc
}

export const revalidateTeamMembersOnDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidate(CACHE_TAGS.teamMembers)
  return doc
}
