'use client'

import { useEffect } from 'react'
import type { Recipe } from './recipes/shared'

/** Desktop with a mouse and no reduced-motion preference; everything else keeps the CSS layer. */
export const MOTION_V2_QUERY =
  '(min-width: 64rem) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

/** One lazy module per demo brand; see recipes/shared.ts for the contract. */
const RECIPES = {
  gym: () => import('./recipes/gym'),
  nova: () => import('./recipes/nova'),
  velvet: () => import('./recipes/velvet'),
  saffron: () => import('./recipes/saffron'),
  nila: () => import('./recipes/nila'),
  vidya: () => import('./recipes/vidya'),
} satisfies Record<string, () => Promise<{ recipe: Recipe }>>

type Props = { recipe: keyof typeof RECIPES }

/**
 * Motion v2 for a demo home (desktop only). Loads GSAP + SplitText and the
 * brand's recipe as soon as possible and plays the hero intro; after the page
 * has loaded it adds ScrollTrigger + Lenis smooth scroll, the progress bar and
 * the recipe's scroll effects. Below 1024 px, on touch devices and under
 * reduced motion nothing here runs: the CSS motion layer in demo.css stays in
 * charge.
 *
 * The CSS hero intro is held back by 1.4 s on desktop (motion-v2.css) so the
 * recipe's intro can replace it; if this script never arrives, the CSS intro
 * still plays.
 */
export function MotionV2({ recipe }: Props) {
  useEffect(() => {
    if (!window.matchMedia(MOTION_V2_QUERY).matches) return
    const root = document.documentElement
    let cancelled = false
    const cleanups: Array<() => void> = []
    const add = (fn: () => void) => cleanups.push(fn)
    let timer = 0

    const start = async () => {
      const [{ gsap }, { SplitText }, { recipe: r }] = await Promise.all([
        import('gsap'),
        import('gsap/SplitText'),
        RECIPES[recipe](),
      ])
      if (cancelled) return
      gsap.registerPlugin(SplitText)
      root.classList.add('dm-v2')
      await document.fonts.ready
      if (cancelled) return
      await r.intro?.({ gsap, SplitText, add })

      const later = async () => {
        const [{ ScrollTrigger }, { default: Lenis }] = await Promise.all([
          import('gsap/ScrollTrigger'),
          import('lenis'),
        ])
        if (cancelled) return
        gsap.registerPlugin(ScrollTrigger)

        // Smooth scroll driving ScrollTrigger. Nested scroll areas (chat, lists) keep native wheel.
        document
          .querySelectorAll<HTMLElement>('.overflow-y-auto, .overflow-auto')
          .forEach((el) => el.setAttribute('data-lenis-prevent', ''))
        const lenis = new Lenis({ lerp: 0.1 })
        lenis.on('scroll', ScrollTrigger.update)
        const tick = (t: number) => lenis.raf(t * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)
        const onAnchor = (e: Event) => {
          const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
          if (!a) return
          const target = document.querySelector<HTMLElement>(a.getAttribute('href') || '')
          if (!target) return
          e.preventDefault()
          lenis.scrollTo(target, { offset: -72, duration: 1.2 })
        }
        document.addEventListener('click', onAnchor)
        add(() => {
          document.removeEventListener('click', onAnchor)
          gsap.ticker.remove(tick)
          lenis.destroy()
        })

        // Progress bar.
        gsap.to('.dm-progress', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
        })

        await r.scroll?.({ gsap, SplitText, ScrollTrigger, add })
        if (cancelled) return
        ScrollTrigger.refresh()
        // Late images and fonts can still move things; measure once more when they have settled.
        const again = window.setTimeout(() => ScrollTrigger.refresh(), 1500)
        add(() => {
          window.clearTimeout(again)
          ScrollTrigger.getAll().forEach((s) => s.kill())
        })
      }

      const schedule = () => {
        timer = window.setTimeout(() => void later(), 300)
      }
      if (document.readyState === 'complete') schedule()
      else window.addEventListener('load', schedule, { once: true })
      add(() => {
        window.removeEventListener('load', schedule)
        window.clearTimeout(timer)
      })
    }

    void start()
    return () => {
      cancelled = true
      cleanups.forEach((fn) => fn())
      root.classList.remove('dm-v2')
    }
  }, [recipe])

  return null
}
