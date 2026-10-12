'use client'

import Image from 'next/image'
import { Monitor, Smartphone, Tablet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { screenSizes } from '@/content/demos'
import { everyScreen } from '@/content/home'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading } from './section'

/** A different live demo on each device, so the section shows range as well as responsiveness. */
const devices = [
  {
    key: 'desktop',
    label: 'Desktop',
    icon: Monitor,
    width: '100%',
    project: 'Nova Studio',
    src: '/demos/booking/desktop-home.webp',
    alt: 'Nova Studio booking website on a desktop screen',
    size: screenSizes.desktop,
    sizes: '(min-width: 1024px) 896px, 100vw',
  },
  {
    key: 'tablet',
    label: 'Tablet',
    icon: Tablet,
    width: '62%',
    project: 'Velvet Salon',
    src: '/demos/salon/tablet-home.webp',
    alt: 'Velvet Salon website on a tablet',
    size: screenSizes.tablet,
    sizes: '(min-width: 1024px) 560px, 62vw',
  },
  {
    key: 'mobile',
    label: 'Mobile',
    icon: Smartphone,
    width: '34%',
    project: 'Saffron Kitchen',
    src: '/demos/restaurant/mobile-home.webp',
    alt: 'Saffron Kitchen restaurant website on a phone',
    size: screenSizes.mobile,
    sizes: '(min-width: 1024px) 310px, 34vw',
  },
] as const

const STEP_MS = 2800

/** One frame that resizes laptop → tablet → phone, each showing a real demo screenshot. */
export function EveryScreen() {
  const reduce = usePrefersReducedMotion()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reduce || paused) return
    const id = window.setInterval(() => setI((v) => (v + 1) % devices.length), STEP_MS)
    return () => window.clearInterval(id)
  }, [reduce, paused])

  const device = devices[i]

  return (
    <Section id="every-screen" className="cv-auto">
      <SectionHeading eyebrow="Responsive and fast" title={everyScreen.heading} sub={everyScreen.sub} />

      <Reveal>
        <div
          className="mx-auto max-w-4xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="flex h-[22rem] items-start justify-center sm:h-[26rem]">
            <div
              className="relative h-full overflow-hidden rounded-2xl frame-glass transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
              style={{ width: device.width }}
            >
              <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-muted/40" />
                <span className="h-2 w-2 rounded-full bg-muted/40" />
                <span className="h-2 w-2 rounded-full bg-muted/40" />
              </div>
              <div className="relative h-[calc(100%-1.75rem)]">
                {devices.map((d, idx) => (
                  <Image
                    key={d.key}
                    src={d.src}
                    alt={d.alt}
                    width={d.size.width}
                    height={d.size.height}
                    sizes={d.sizes}
                    loading="lazy"
                    aria-hidden={idx !== i}
                    className={cn(
                      'absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500',
                      idx === i ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          <ol className="mt-6 flex items-center justify-center gap-6 sm:gap-10">
            {devices.map((d, idx) => {
              const Icon = d.icon
              const active = idx === i
              return (
                <li key={d.key}>
                  <button
                    type="button"
                    onClick={() => {
                      setI(idx)
                      setPaused(true)
                    }}
                    aria-pressed={active}
                    className={cn(
                      'flex flex-col items-center gap-1 text-sm font-medium transition-colors sm:flex-row sm:gap-2',
                      active ? 'text-foreground' : 'text-muted hover:text-foreground',
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className={cn('h-4 w-4', active && 'text-accent')} />
                      {d.label}
                    </span>
                    <span className={cn('text-xs', active ? 'text-muted' : 'text-muted/60')}>
                      {d.project}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </Reveal>

      <ul className="mt-12 flex flex-wrap justify-center gap-2">
        {everyScreen.chips.map((c, idx) => (
          <Reveal key={c} as="li" index={idx}>
            <span className="inline-block rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium">
              {c}
            </span>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
