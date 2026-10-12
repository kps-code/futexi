import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Stagger index: delay = index * 80ms (capped at 600ms) */
  index?: number
  as?: 'div' | 'li' | 'section' | 'article'
}

/**
 * Fade-and-rise into view, once. A server component: it only emits a
 * `data-reveal` marker; `RevealObserver` (one client component in the layout)
 * flips `is-visible` when the element scrolls into view. Without JavaScript
 * everything stays visible (see globals.css).
 */
export function Reveal({ children, className, index = 0, as: Tag = 'div' }: RevealProps) {
  const delay = Math.min(index * 80, 600)
  const style = delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined
  return (
    <Tag data-reveal="" className={cn('reveal', className)} style={style}>
      {children}
    </Tag>
  )
}
