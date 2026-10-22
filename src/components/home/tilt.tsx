import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * A card that lights up and tilts under the cursor. Server-rendered: the
 * behaviour comes from `CardMotion` (one client component in the site layout)
 * through the `.sr-card` class, so a page full of cards adds no hydration work.
 */
export function Tilt({
  as: Tag = 'div',
  className,
  children,
  max = 8,
  id,
}: {
  as?: 'div' | 'li' | 'article'
  className?: string
  children: ReactNode
  /** Maximum tilt in degrees. */
  max?: number
  id?: string
}) {
  return (
    <Tag id={id} className={cn('sr-card', className)} data-tilt-max={max} style={{ willChange: 'transform' }}>
      {children}
    </Tag>
  )
}
