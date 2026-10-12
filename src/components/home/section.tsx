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
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-muted uppercase">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {sub && <p className="mt-4 text-base text-pretty text-muted sm:text-lg">{sub}</p>}
    </Reveal>
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'group relative rounded-2xl border border-border bg-surface p-6 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_20px_50px_-30px_rgba(99,102,241,0.45)]',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function IconBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-accent',
        className,
      )}
    >
      {children}
    </span>
  )
}
