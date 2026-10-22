import type { Payload, PayloadRequest } from 'payload'
import { journey, pricing } from '../content/home'

/**
 * Fills the Journey chapters and Pricing setups when they are empty, so the admin shows
 * the same rows the website renders from its built-in defaults. Safe to run again.
 */
export async function seedHomeDefaults(payload: Payload, req?: PayloadRequest): Promise<string[]> {
  const home = await payload.findGlobal({ slug: 'home-page', depth: 0, overrideAccess: true, req })
  const data: Record<string, unknown> = {}
  if (!home?.journey?.chapters?.length) {
    data.journey = {
      heroLabel: home?.journey?.heroLabel || journey.heroLabel,
      chapters: journey.chapters.map((c) => ({ ...c })),
    }
  }
  if (!home?.pricing?.setups?.length) {
    data.pricing = {
      ...(home?.pricing ?? {}),
      setups: pricing.setups.map((s) => ({
        tag: s.tag,
        title: s.title,
        bestFor: s.bestFor,
        items: [...s.items],
      })),
    }
  }
  const done = Object.keys(data)
  if (done.length) await payload.updateGlobal({ slug: 'home-page', data, overrideAccess: true, req })
  return done
}
