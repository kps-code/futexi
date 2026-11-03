import Image from 'next/image'
import { initials } from '@/lib/initials'
import { cn } from '@/lib/utils'

/**
 * Team avatar. Shows the uploaded photo when there is one; otherwise the
 * person's initials on a deep gradient, varied per person so the cards do
 * not look identical. Initials read as a real company; cartoons did not.
 */

function hash(s: string): number {
  let h = 0
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h
}

const gradients = [
  'linear-gradient(135deg, #2a3246, #4b5876)',
  'linear-gradient(135deg, #2d2a46, #5a4b76)',
  'linear-gradient(135deg, #2a4640, #4b766b)',
]

export function Avatar({
  name,
  photoUrl,
  photoAlt,
  size = 64,
  className,
}: {
  name: string
  photoUrl?: string
  photoAlt?: string
  size?: number
  className?: string
}) {
  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt={photoAlt ?? name}
        width={size}
        height={size}
        className={cn('rounded-full object-cover', className)}
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <span
      role="img"
      aria-label={`${name}, initials`}
      className={cn(
        'inline-block shrink-0 rounded-full font-display font-bold text-[#eef2f8] ring-1 ring-white/20 select-none ring-inset',
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.32),
        background: gradients[hash(name) % gradients.length],
      }}
    >
      {/* Callers pass display classes (block); the inner flex box does the centring. */}
      <span className="flex h-full w-full items-center justify-center">{initials(name)}</span>
    </span>
  )
}
