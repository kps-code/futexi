import type { gsap as GsapType } from 'gsap'
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger'
import type { SplitText as SplitTextType } from 'gsap/SplitText'

export type Gsap = typeof GsapType
export type Add = (cleanup: () => void) => void
export type IntroCtx = { gsap: Gsap; SplitText: typeof SplitTextType; add: Add }
export type ScrollCtx = IntroCtx & { ScrollTrigger: typeof ScrollTriggerType }

/**
 * One motion recipe per demo brand. `intro` runs once fonts are ready (hero),
 * `scroll` runs after the page has loaded with ScrollTrigger registered.
 * Both register cleanups through `add`.
 */
export type Recipe = {
  intro?: (ctx: IntroCtx) => void | Promise<void>
  scroll?: (ctx: ScrollCtx) => void | Promise<void>
}

export const q = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T[] =>
  Array.from(root.querySelectorAll<T>(selector))

/** Takes scroll-reveal elements away from the CSS layer so GSAP owns their opacity and transform. */
export function claim<T extends Element>(els: T[]): T[] {
  els.forEach((el) => {
    el.closest('.reveal')?.classList.add('is-visible', 'v2-gs')
    el.classList.add('v2-gs')
  })
  return els
}
