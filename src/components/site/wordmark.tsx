import Link from 'next/link'
import { brand } from '@/content/site'
import { cn } from '@/lib/utils'

export function Wordmark({ className, withSubline = true }: { className?: string; withSubline?: boolean }) {
  return (
    <Link href="/" className={cn('group inline-flex flex-col leading-none', className)}>
      <span className="font-display text-[1.05rem] font-bold tracking-[0.18em] text-foreground sm:text-lg">
        KAPOSA <span className="text-gradient">FUTEXI</span>
      </span>
      {withSubline && (
        <span className="mt-1 text-[0.62rem] font-medium tracking-[0.22em] text-muted uppercase">
          {brand.shortLine}
        </span>
      )}
    </Link>
  )
}
