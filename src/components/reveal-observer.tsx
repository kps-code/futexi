'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Watches `[data-reveal]` elements and marks them visible once they enter the
 * viewport. Marks <html> as `reveal-ready` so CSS hides elements only when
 * this script is running. Re-scans on every route change.
 */
export function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const all = () => Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)'))

    if (reduce || !('IntersectionObserver' in window)) {
      all().forEach((el) => el.classList.add('is-visible'))
      return
    }

    root.classList.add('reveal-ready')
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )
    all().forEach((el) => io.observe(el))

    // Content rendered later (filters, client lists) gets observed too. Coalesce bursts
    // of mutations (hydration, list re-renders) into one scan per frame.
    let raf = 0
    const mo = new MutationObserver(() => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        all().forEach((el) => io.observe(el))
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [pathname])

  return null
}
