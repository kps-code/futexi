import type { ReactNode } from 'react'
import { Eyebrow } from '@/components/home/section'

/** Shared page heading block used by inner pages. */
export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string
  title: string
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid" />
        <div className="glow-blob -top-48 -left-24 h-[28rem] w-[28rem]" />
      </div>
      <div className="container-site pt-16 pb-10 sm:pt-24 sm:pb-14">
        {eyebrow && <Eyebrow className="mb-5 lg:animate-rise">{eyebrow}</Eyebrow>}
        <h1 className="max-w-3xl font-display text-4xl font-bold tracking-[-0.02em] text-balance sm:text-5xl lg:animate-rise-soft lg:text-6xl">
          {title}
        </h1>
        {children && (
          <div className="mt-5 max-w-2xl text-base text-muted [--rise-delay:120ms] sm:text-lg lg:animate-rise">
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
