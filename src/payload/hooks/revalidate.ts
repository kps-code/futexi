import { revalidateTag, updateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

export const CACHE_TAGS = {
  siteSettings: 'site-settings',
  aboutPage: 'about-page',
  teamMembers: 'team-members',
  demoSettings: 'demo-settings',
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

export const revalidateSiteSettings: GlobalAfterChangeHook = ({ doc }) => {
  revalidate(CACHE_TAGS.siteSettings)
  return doc
}

export const revalidateAboutPage: GlobalAfterChangeHook = ({ doc }) => {
  revalidate(CACHE_TAGS.aboutPage)
  return doc
}

export const revalidateDemoSettings: GlobalAfterChangeHook = ({ doc }) => {
  revalidate(CACHE_TAGS.demoSettings)
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
