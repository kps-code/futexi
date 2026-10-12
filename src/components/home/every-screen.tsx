'use client'

import { Monitor, Smartphone, Tablet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { everyScreen } from '@/content/home'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/reveal'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { Section, SectionHeading } from './section'

const devices = [
  { key: 'desktop', label: 'Desktop', icon: Monitor, width: '100%' },
  { key: 'tablet', label: 'Tablet', icon: Tablet, width: '68%' },
  { key: 'mobile', label: 'Mobile', icon: Smartphone, width: '38%' },
] as const

const STEP_MS = 2600

/** One mock site resizing laptop → tablet → phone; its content reflows via container queries. */
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
          <div className="flex h-[22rem] items-start justify-center sm:h-[24rem]">
            <div
              className="@container h-full overflow-hidden rounded-2xl frame-glass transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
              style={{ width: device.width }}
              aria-hidden
            >
              <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-muted/40" />
                <span className="h-2 w-2 rounded-full bg-muted/40" />
                <span className="h-2 w-2 rounded-full bg-muted/40" />
              </div>
              <div className="p-4 @sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="h-2.5 w-14 rounded bg-foreground/70" />
                  <span className="hidden gap-2 @md:flex">
                    <span className="h-2 w-8 rounded bg-muted/40" />
                    <span className="h-2 w-8 rounded bg-muted/40" />
                    <span className="h-2 w-8 rounded bg-accent/70" />
                  </span>
                  <span className="flex flex-col gap-0.5 @md:hidden">
                    <span className="h-0.5 w-4 rounded bg-foreground/70" />
                    <span className="h-0.5 w-4 rounded bg-foreground/70" />
                    <span className="h-0.5 w-4 rounded bg-foreground/70" />
                  </span>
                </div>
                <div className="mt-5 grid gap-4 @md:grid-cols-[1.2fr_1fr] @md:items-center">
                  <div>
                    <span className="block h-4 w-11/12 rounded bg-foreground/85" />
                    <span className="mt-2 block h-4 w-2/3 rounded bg-foreground/60" />
                    <span className="mt-3 block h-2 w-3/4 rounded bg-muted/50" />
                    <span className="mt-4 inline-block h-7 w-24 rounded-full bg-accent-gradient" />
                  </div>
                  <span className="hidden h-24 rounded-xl bg-accent/15 @md:block" />
                </div>
                <div className="mt-5 grid grid-cols-1 gap-2 @sm:grid-cols-2 @md:grid-cols-3">
                  {[0, 1, 2].map((k) => (
                    <span
                      key={k}
                      className="h-12 rounded-lg border border-border bg-background/60 @sm:h-14"
                    />
                  ))}
                </div>
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
                      'flex items-center gap-2 text-sm font-medium transition-colors',
                      active ? 'text-foreground' : 'text-muted hover:text-foreground',
                    )}
                  >
                    <Icon className={cn('h-4 w-4', active && 'text-accent')} />
                    {d.label}
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
