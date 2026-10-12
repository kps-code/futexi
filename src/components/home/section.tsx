import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/reveal'

export function Section({
  id,
  children,
  className,
  tone = 'default',
}: {
  id?: string
  children: ReactNode
  className?: string
  tone?: 'default' | 'surface'
}) {
  return (
    <section
      id={id}
      className={cn(
        'py-20 sm:py-28',
        tone === 'surface' && 'border-y border-border bg-surface/50',
        className,
      )}
    >
      <div className="container-site">{children}</div>
    </section>
  )
}

/** Small label above a heading: a gradient dot and tracked uppercase text. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-muted uppercase sm:text-[11px] sm:tracking-[0.2em]',
        className,
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent-gradient" />
      {children}
    </p>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = 'center',
  className,
}: {
  eyebrow?: string
  title: ReactNode
  sub?: ReactNode
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <Reveal
      className={cn('mb-12 max-w-3xl sm:mb-16', align === 'center' && 'mx-auto text-center', className)}
    >
      {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
      <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-balance sm:text-4xl lg:text-[3.25rem] lg:leading-[1.08]">
        {title}
      </h2>
      {sub && <p className="mt-5 text-base text-pretty text-muted sm:text-lg">{sub}</p>}
    </Reveal>
  )
}

/**
 * Shared card look: glass surface, gradient border and tinted shadow on hover,
 * a small lift. Exported so <article> and <li> elements can share it.
 */
export const cardClasses =
  'group relative rounded-2xl border border-border bg-surface p-6 glow-ring transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-card'

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(cardClasses, className)}>{children}</div>
}

export function IconBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-accent transition-[background-color,color,border-color] duration-300 group-hover:border-transparent group-hover:bg-accent-gradient group-hover:text-white',
        className,
      )}
    >
      {children}
    </span>
  )
}
