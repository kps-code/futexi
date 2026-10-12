'use client'

import { useEffect, type ReactNode } from 'react'

/**
 * Adds a show/hide toggle to every password input in the admin
 * (create first user, login, account, user edit). Payload has no built-in
 * reveal control, so this watches the DOM and enhances inputs as they appear.
 */

const ENHANCED = 'data-kf-reveal'

const EYE =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>'
const EYE_OFF =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'

function enhance(input: HTMLInputElement) {
  if (input.hasAttribute(ENHANCED)) return
  input.setAttribute(ENHANCED, '1')

  const wrap = input.parentElement
  if (!wrap) return
  wrap.classList.add('kf-reveal')

  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'kf-reveal__btn'
  btn.setAttribute('aria-label', 'Show password')
  btn.setAttribute('title', 'Show password')
  btn.tabIndex = -1
  btn.innerHTML = EYE
  btn.addEventListener('click', () => {
    const show = input.type === 'password'
    input.type = show ? 'text' : 'password'
    btn.innerHTML = show ? EYE_OFF : EYE
    const label = show ? 'Hide password' : 'Show password'
    btn.setAttribute('aria-label', label)
    btn.setAttribute('title', label)
    input.focus({ preventScroll: true })
  })
  wrap.appendChild(btn)
}

function scan(root: ParentNode) {
  root.querySelectorAll<HTMLInputElement>('input[type="password"]').forEach(enhance)
}

export function PasswordRevealProvider({ children }: { children?: ReactNode }) {
  useEffect(() => {
    scan(document)
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) scan(node)
        })
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return <>{children}</>
}
