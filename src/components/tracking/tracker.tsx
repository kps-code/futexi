'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * First-party page view and event tracker (docs/architecture.md §4.3).
 * ~2 KB, no dependencies. Batches to /api/track with sendBeacon, never
 * blocks rendering. Cookies are issued by the proxy, so nothing is stored here.
 *
 * Mark any element with data-track="event_name" and optional
 * data-track-props='{"k":"v"}' to record a click.
 */

type Item =
  | {
      type: 'page_view'
      path: string
      title?: string
      referrer?: string
      search?: string
      viewportWidth?: number
      theme?: 'dark' | 'light'
      ts: number
    }
  | { type: 'page_leave'; path: string; durationMs: number; maxScrollPct: number; ts: number }
  | {
      type: 'event'
      name: string
      path: string
      props?: Record<string, string | number | boolean>
      ts: number
    }

const ENDPOINT = '/api/track'
const FLUSH_MS = 2000
const MAX_BATCH = 20

function saveDataOn(): boolean {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return Boolean(c?.saveData)
}

function currentTheme(): 'dark' | 'light' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function parseProps(raw: string | null): Record<string, string | number | boolean> | undefined {
  if (!raw) return undefined
  try {
    const v = JSON.parse(raw)
    return v && typeof v === 'object' && !Array.isArray(v) ? v : undefined
  } catch {
    return undefined
  }
}

export function Tracker() {
  const pathname = usePathname()
  const queue = useRef<Item[]>([])
  const timer = useRef<number | null>(null)
  const current = useRef<{ path: string; startedAt: number; maxScroll: number } | null>(null)
  const firstView = useRef(true)

  // Stable helpers kept in refs so listeners never go stale.
  const send = useRef((items: Item[]) => {
    if (!items.length) return
    const body = JSON.stringify({ items })
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain' })))
        return
    } catch {
      /* fall through */
    }
    void fetch(ENDPOINT, {
      method: 'POST',
      body,
      keepalive: true,
      headers: { 'content-type': 'text/plain' },
    }).catch(() => {})
  })

  const flush = useRef(() => {
    if (timer.current) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
    const items = queue.current.splice(0, MAX_BATCH)
    send.current(items)
    if (queue.current.length) schedule.current()
  })

  const schedule = useRef(() => {
    if (timer.current) return
    timer.current = window.setTimeout(() => flush.current(), FLUSH_MS)
  })

  const push = useRef((item: Item) => {
    queue.current.push(item)
    if (queue.current.length >= MAX_BATCH) flush.current()
    else schedule.current()
  })

  const leaveCurrent = useRef(() => {
    const c = current.current
    if (!c) return
    push.current({
      type: 'page_leave',
      path: c.path,
      durationMs: Math.max(0, Date.now() - c.startedAt),
      maxScrollPct: Math.round(Math.min(100, Math.max(0, c.maxScroll))),
      ts: Date.now(),
    })
    current.current = null
  })

  // Page view on every route change.
  useEffect(() => {
    if (saveDataOn()) return
    leaveCurrent.current()
    const path = pathname || '/'
    current.current = { path, startedAt: Date.now(), maxScroll: 0 }
    push.current({
      type: 'page_view',
      path,
      title: document.title.slice(0, 200),
      referrer: firstView.current ? document.referrer || undefined : undefined,
      search: window.location.search || undefined,
      viewportWidth: window.innerWidth,
      theme: currentTheme(),
      ts: Date.now(),
    })
    firstView.current = false
  }, [pathname])

  // Scroll depth, clicks, and leave handling.
  useEffect(() => {
    if (saveDataOn()) return

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        const c = current.current
        if (!c) return
        const doc = document.documentElement
        const max = doc.scrollHeight - window.innerHeight
        const pct = max <= 0 ? 100 : ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100
        if (pct > c.maxScroll) c.maxScroll = pct
      })
    }

    const onClick = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>('[data-track]')
      if (!target) return
      const name = target.dataset.track
      if (!name) return
      push.current({
        type: 'event',
        name,
        path: current.current?.path ?? window.location.pathname,
        props: parseProps(target.getAttribute('data-track-props')),
        ts: Date.now(),
      })
      // Outbound links leave the page: flush right away.
      if (target instanceof HTMLAnchorElement && target.target === '_blank') flush.current()
    }

    const onHide = () => {
      if (document.visibilityState === 'hidden') {
        leaveCurrent.current()
        flush.current()
        // Re-open the page for the duration count if the user comes back.
        current.current = { path: window.location.pathname, startedAt: Date.now(), maxScroll: 0 }
      }
    }
    const onPageHide = () => {
      leaveCurrent.current()
      flush.current()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('click', onClick, true)
    document.addEventListener('visibilitychange', onHide)
    window.addEventListener('pagehide', onPageHide)
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('visibilitychange', onHide)
      window.removeEventListener('pagehide', onPageHide)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  return null
}
