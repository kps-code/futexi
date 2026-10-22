'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Watches `[data-reveal]` elements and marks them visible once they enter the
 * viewport. Marks <html> as `reveal-ready` so CSS hides elements only when
 * this script is running. Re-scans on every route change.
 *
 * Besides the IntersectionObserver, a throttled sweep runs on scroll and after
 * programmatic jumps (header anchor links, hash navigation): Chrome does not
 * always deliver intersection notifications for a smooth `scrollIntoView`, so
 * without it a section reached from a link could stay hidden until the next
 * real scroll.
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

    // Anything currently in view is revealed, whatever the observer reported.
    const sweep = () => {
      const limit = window.innerHeight * 0.9
      for (const el of all()) {
        const r = el.getBoundingClientRect()
        if (r.bottom > 0 && r.top < limit) {
          el.classList.add('is-visible')
          io.unobserve(el)
        }
      }
    }
    let timer = 0
    const onScroll = () => {
      if (timer) return
      timer = window.setTimeout(() => {
        timer = 0
        sweep()
      }, 150)
    }
    const onJump = () => window.setTimeout(sweep, 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scrollend', sweep)
    window.addEventListener('hashchange', onJump)
    const first = window.setTimeout(sweep, 100)

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
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scrollend', sweep)
      window.removeEventListener('hashchange', onJump)
      window.clearTimeout(first)
      window.clearTimeout(timer)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [pathname])

  return null
}
