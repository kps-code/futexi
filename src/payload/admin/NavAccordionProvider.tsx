'use client'

import { usePathname } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

/**
 * One sidebar group open at a time. Payload opens every group by default and
 * only remembers manual toggles; with six groups that is a wall of links.
 *
 * - On load and on every route change, only the group holding the current
 *   page's link stays open.
 * - Opening a group, or clicking a link inside it, closes the other groups.
 *
 * Toggles are driven by clicking Payload's own group buttons, so its
 * preference store stays in sync.
 */

const GROUP = '.nav-group'
const COLLAPSED = 'nav-group--collapsed'
const TOGGLE = '.nav-group__toggle'

let programmatic = false

function groups(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(`aside.nav ${GROUP}`))
}

function toggle(group: HTMLElement) {
  const btn = group.querySelector<HTMLButtonElement>(TOGGLE)
  if (!btn) return
  programmatic = true
  btn.click()
  programmatic = false
}

function isOpen(group: HTMLElement) {
  return !group.classList.contains(COLLAPSED)
}

/** Open `keep` (if given) and collapse every other open group. */
function showOnly(keep: HTMLElement | null) {
  for (const g of groups()) {
    if (g === keep) {
      if (!isOpen(g)) toggle(g)
    } else if (isOpen(g)) {
      toggle(g)
    }
  }
}

/**
 * The group holding the current page's entry. Payload renders that entry
 * with an `active` class and an indicator bar (and without an href), so look
 * for those first; fall back to the longest link path that prefixes the URL.
 */
function activeGroup(): HTMLElement | null {
  const marked = document.querySelector<HTMLElement>(
    `aside.nav ${GROUP} .nav__link.active, aside.nav ${GROUP} .nav__link-indicator, aside.nav ${GROUP} [aria-current="page"]`,
  )
  if (marked) return marked.closest<HTMLElement>(GROUP)

  const here = window.location.pathname.replace(/\/+$/, '')
  let best: { link: HTMLAnchorElement; len: number } | null = null
  for (const link of document.querySelectorAll<HTMLAnchorElement>(`aside.nav ${GROUP} a[href]`)) {
    const path = link.getAttribute('href')?.replace(/\/+$/, '') ?? ''
    if (!path || !(here === path || here.startsWith(`${path}/`))) continue
    if (!best || path.length > best.len) best = { link, len: path.length }
  }
  return best?.link.closest<HTMLElement>(GROUP) ?? null
}

export function NavAccordionProvider({ children }: { children?: ReactNode }) {
  const pathname = usePathname()

  // On load and on route change: keep only the current page's group open.
  // The sidebar is server-rendered before React hydrates it, and a click on an
  // unhydrated button does nothing, so apply, verify, and retry (every 200 ms,
  // up to 10 s) until the groups are in the wanted state.
  useEffect(() => {
    document.documentElement.dataset.kfNavAccordion = 'on'
    let tries = 0
    const id = window.setInterval(() => {
      tries += 1
      const active = activeGroup()
      // No matching link (dashboard, account): leave the user's layout alone.
      if (!active) {
        if (tries >= 200) window.clearInterval(id)
        return
      }
      const settled = groups().every((g) => isOpen(g) === (g === active))
      if (settled || tries >= 200) {
        window.clearInterval(id)
        return
      }
      if (tries % 4 === 1) showOnly(active)
    }, 50)
    return () => window.clearInterval(id)
  }, [pathname])

  // User interaction: accordion behaviour.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (programmatic) return
      const target = e.target as HTMLElement | null
      const group = target?.closest<HTMLElement>(`aside.nav ${GROUP}`)
      if (!group) return
      const onToggle = Boolean(target?.closest(TOGGLE))
      const onLink = Boolean(target?.closest('a'))
      if (onToggle) {
        // Collapsed now means it is about to open; close the others after Payload's handler runs.
        if (group.classList.contains(COLLAPSED)) {
          window.setTimeout(() => showOnly(group), 0)
        }
      } else if (onLink) {
        window.setTimeout(() => showOnly(group), 0)
      }
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return <>{children}</>
}
