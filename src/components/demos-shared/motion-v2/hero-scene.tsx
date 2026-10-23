'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { MOTION_V2_QUERY } from './motion'

/** One lazy module per demo; each exports `mountScene(canvas, onReady) => dispose`. */
const SCENES = {
  gym: () => import('./gym-hero-three'),
  nova: () => import('./nova-hero-three'),
  velvet: () => import('./velvet-hero-three'),
  saffron: () => import('./saffron-hero-three'),
  nila: () => import('./nila-hero-three'),
  vidya: () => import('./vidya-hero-three'),
} as const

type Props = {
  scene: keyof typeof SCENES
  /** Paint above the hero photo (DOM order) instead of behind `-z-10` layers. */
  over?: boolean
}

/**
 * Canvas for a demo hero's 3D scene. Desktop only: the Three.js module is
 * fetched after the page has loaded and the browser is idle, then the photo
 * behind the headline fades back and the scene fades in. Phones, touch
 * devices, reduced motion and machines without WebGL never load it.
 */
export function HeroScene({ scene, over }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !window.matchMedia(MOTION_V2_QUERY).matches) return
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
    if (nav.connection?.saveData || (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4)) return
    try {
      if (!document.createElement('canvas').getContext('webgl2')) return
    } catch {
      return
    }
    const root = document.documentElement
    let cancelled = false
    let dispose: (() => void) | undefined
    let timer = 0
    const load = () => {
      timer = window.setTimeout(async () => {
        const { mountScene } = await SCENES[scene]()
        if (cancelled) return
        dispose = mountScene(canvas, () => root.classList.add('dm-v2-three'))
      }, 600)
    }
    if (document.readyState === 'complete') load()
    else window.addEventListener('load', load, { once: true })
    return () => {
      cancelled = true
      window.removeEventListener('load', load)
      window.clearTimeout(timer)
      dispose?.()
      root.classList.remove('dm-v2-three')
    }
  }, [scene])

  return (
    <div className={cn('v2-hero-canvas', over && 'v2-hero-canvas-over')} aria-hidden>
      <canvas ref={ref} />
    </div>
  )
}
