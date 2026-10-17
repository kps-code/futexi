import { Fragment, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/**
 * Hero text that reveals word by word on page load (CSS only; see .dm-word in
 * demo.css). Each word sits in a clipped box and slides up with a stagger.
 * `accent` words (matched case-insensitively) get the theme's accent styling.
 * Spaces are emitted between the boxes, not inside them, so they survive the
 * inline-block layout.
 */
export function Words({
  text,
  className,
  accent = [],
  startIndex = 0,
}: {
  text: string
  className?: string
  /** Words to wrap in <em> for the accent colour or italic. */
  accent?: readonly string[]
  /** Offsets the stagger so a second line continues after the first. */
  startIndex?: number
}) {
  const lower = accent.map((a) => a.toLowerCase())
  const words = text.split(' ')
  return (
    <span className={cn('dm-words', className)}>
      {words.map((word, i) => {
        const clean = word.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase()
        const isAccent = lower.includes(clean)
        return (
          <Fragment key={`${word}-${i}`}>
            <span className="dm-word" style={{ '--i': startIndex + i } as CSSProperties}>
              <span>{isAccent ? <em>{word}</em> : word}</span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        )
      })}
    </span>
  )
}

/** Elements below the headline that fade up after it, in order. */
export function FadeUp({
  children,
  index = 0,
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  index?: number
  className?: string
  as?: 'div' | 'p' | 'ul' | 'span'
}) {
  return (
    <Tag className={cn('dm-fade-up', className)} style={{ '--i': index } as CSSProperties}>
      {children}
    </Tag>
  )
}
