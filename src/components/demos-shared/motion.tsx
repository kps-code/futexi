'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Motion layer for the demo sites, about 4 KB and no dependencies.
 *
 * - Scroll reveals: `[data-reveal]` elements get `is-visible` while in view
 *   and lose it when they leave, so sections animate out and back in.
 *   `[data-reveal-once]` keeps the first state.
 * - Counters: `[data-count="1234"]` counts up from 0 when it enters the view.
 *   `data-count-prefix` / `data-count-suffix` wrap the number (₹, %, +).
 * - Pointer effects (fine pointers only): magnetic `[data-magnetic]` buttons and `[data-tilt]`
 *   cards that lean toward the pointer with a glare.
 *
 * Everything animates transform and opacity only, and all of it is skipped
 * under prefers-reduced-motion (content simply shows).
 */
export function DemoMotion() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    const cleanups: Array<() => void> = []

    // --- Scroll reveals -------------------------------------------------------
    const revealEls = () => Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (reduce || !('IntersectionObserver' in window)) {
      revealEls().forEach((el) => el.classList.add('is-visible'))
    } else {
      root.classList.add('reveal-ready')
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const el = e.target as HTMLElement
            if (e.isIntersecting) {
              el.classList.add('is-visible')
              if (el.hasAttribute('data-reveal-once')) io.unobserve(el)
            } else {
              // Out of view again (either edge): reset so it plays again on the way back.
              el.classList.remove('is-visible')
            }
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
      )
      revealEls().forEach((el) => io.observe(el))
      let raf = 0
      const mo = new MutationObserver(() => {
        if (raf) return
        raf = window.requestAnimationFrame(() => {
          raf = 0
          revealEls().forEach((el) => io.observe(el))
        })
      })
      mo.observe(document.body, { childList: true, subtree: true })
      cleanups.push(() => {
        io.disconnect()
        mo.disconnect()
        if (raf) window.cancelAnimationFrame(raf)
      })
    }

    // --- Counters -------------------------------------------------------------
    const counters = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'))
    const format = (el: HTMLElement, n: number) => {
      const decimals = Number(el.dataset.countDecimals ?? 0)
      const text = n.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
      el.textContent = `${el.dataset.countPrefix ?? ''}${text}${el.dataset.countSuffix ?? ''}`
    }
    if (reduce || !('IntersectionObserver' in window)) {
      counters.forEach((el) => format(el, Number(el.dataset.count)))
    } else {
      counters.forEach((el) => format(el, 0))
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue
            const el = e.target as HTMLElement
            io.unobserve(el)
            const target = Number(el.dataset.count)
            const duration = Number(el.dataset.countDuration ?? 1200)
            const start = performance.now()
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration)
              const eased = 1 - Math.pow(1 - t, 3)
              format(el, target * eased)
              if (t < 1) window.requestAnimationFrame(tick)
            }
            window.requestAnimationFrame(tick)
          }
        },
        { threshold: 0.4 },
      )
      counters.forEach((el) => io.observe(el))
      cleanups.push(() => io.disconnect())
    }

    // --- Pointer effects (desktop only) ---------------------------------------
    if (!reduce && fine) {
      // Magnetic buttons: drift a few pixels toward the pointer while it hovers.
      const magnetic = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'))
      for (const el of magnetic) {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          const dx = e.clientX - (r.left + r.width / 2)
          const dy = e.clientY - (r.top + r.height / 2)
          el.style.transform = `translate(${(dx * 0.22).toFixed(1)}px, ${(dy * 0.22).toFixed(1)}px)`
        }
        const leave = () => {
          el.style.transform = ''
        }
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        cleanups.push(() => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
          el.style.transform = ''
        })
      }

      // Tilt cards: lean toward the pointer and move a glare highlight with it.
      const tilts = Array.from(document.querySelectorAll<HTMLElement>('[data-tilt]'))
      for (const el of tilts) {
        const max = Number(el.dataset.tilt || 6)
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          const x = (e.clientX - r.left) / r.width
          const y = (e.clientY - r.top) / r.height
          el.style.setProperty('--tilt-x', `${((0.5 - y) * max).toFixed(2)}deg`)
          el.style.setProperty('--tilt-y', `${((x - 0.5) * max).toFixed(2)}deg`)
          el.style.setProperty('--glare-x', `${(x * 100).toFixed(1)}%`)
          el.style.setProperty('--glare-y', `${(y * 100).toFixed(1)}%`)
          el.classList.add('is-tilting')
        }
        const leave = () => {
          el.classList.remove('is-tilting')
          el.style.removeProperty('--tilt-x')
          el.style.removeProperty('--tilt-y')
        }
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        cleanups.push(() => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
          leave()
        })
      }
    }

    return () => cleanups.forEach((fn) => fn())
  }, [pathname])

  return null
}
