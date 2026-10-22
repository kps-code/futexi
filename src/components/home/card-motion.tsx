'use client'

import { useEffect } from 'react'

/**
 * Card interaction for every `.sr-card` on the page: a spotlight that follows
 * the cursor (CSS vars --mx/--my read by .sr-card::before), a small 3D tilt and
 * a lift. One component, one set of delegated listeners, mounted once in the
 * site layout, so the cards themselves stay server-rendered and cost nothing
 * to hydrate. Pointer devices only; on touch the cards are plain.
 */
export function CardMotion() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    let active: HTMLElement | null = null

    const reset = () => {
      if (!active) return
      active.classList.remove('is-on')
      active.style.transform = ''
      active = null
    }
    const onMove = (e: PointerEvent) => {
      if (!active) return
      const r = active.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      const max = Number(active.dataset.tiltMax || 8)
      active.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
      active.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
      active.style.transform = `perspective(1000px) rotateX(${(-(py - 0.5) * max).toFixed(2)}deg) rotateY(${((px - 0.5) * max).toFixed(2)}deg) translateY(-8px)`
    }
    const onOver = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest<HTMLElement>('.sr-card')
      if (!card || card === active) return
      reset()
      active = card
      card.classList.add('is-on')
      onMove(e)
    }
    const onOut = (e: PointerEvent) => {
      if (!active) return
      const to = e.relatedTarget as Element | null
      if (to && active.contains(to)) return
      reset()
    }

    document.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerout', onOut, { passive: true })
    return () => {
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerout', onOut)
      reset()
    }
  }, [])

  return null
}
