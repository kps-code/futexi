'use client'

import { useEffect, useRef, useState } from 'react'
import type { JourneyScreen } from '@/content/home'
import { cn } from '@/lib/utils'

/** Bump after re-running scripts/render-phone-screens.mjs so browsers fetch the new files. */
const SCREENS_VERSION = 1
export const screenImage = (kind: JourneyScreen) => `/home/screens/${kind}.webp?v=${SCREENS_VERSION}`

/**
 * Flat phone: a CSS frame around the current chapter's screen image. Used on
 * phones, tablets, without WebGL, for reduced motion, and on desktop while the
 * 3D phone is still loading. Two images cross-fade so a change never flickers.
 * The images are rendered ahead of time (scripts/render-phone-screens.mjs), so
 * showing one costs no main-thread work.
 */
export function Phone2D({
  kinds,
  index,
  className,
  float = false,
}: {
  kinds: readonly JourneyScreen[]
  index: number
  className?: string
  /** Gentle idle float; desktop only, it costs nothing on a composited layer. */
  float?: boolean
}) {
  const kind = kinds[Math.min(index, kinds.length - 1)] ?? 'site'
  // Two layers: `a` and `b` hold the previous and current screen; `front` says which is on top.
  const [layers, setLayers] = useState<{ a: JourneyScreen; b: JourneyScreen; front: 'a' | 'b' }>({
    a: kind,
    b: kind,
    front: 'a',
  })
  const shown = useRef(kind)

  useEffect(() => {
    if (shown.current === kind) return
    shown.current = kind
    setLayers((l) => (l.front === 'a' ? { ...l, b: kind, front: 'b' } : { ...l, a: kind, front: 'a' }))
  }, [kind])

  const imgClass = 'absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out'
  return (
    <div
      className={cn('sr-p2d', float && 'sr-p2d-float', className)}
      role="img"
      aria-label="A customer website on a phone, with the AI assistant and WhatsApp flow"
    >
      <div className="sr-p2d-screen">
        {/* Plain <img>: the files are already small WebPs sized for the phone. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={screenImage(layers.a)}
          alt=""
          width={360}
          height={740}
          decoding="async"
          className={cn(imgClass, layers.front === 'a' ? 'opacity-100' : 'opacity-0')}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={screenImage(layers.b)}
          alt=""
          width={360}
          height={740}
          decoding="async"
          loading="lazy"
          className={cn(imgClass, layers.front === 'b' ? 'opacity-100' : 'opacity-0')}
        />
      </div>
    </div>
  )
}
