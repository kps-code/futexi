import Image from 'next/image'
import { screenSizes, type Demo } from '@/content/demos'
import { cn } from '@/lib/utils'

const accents: Record<Demo['accent'], { bar: string; soft: string; text: string }> = {
  violet: { bar: 'bg-violet-500', soft: 'bg-violet-500/15', text: 'text-violet-400' },
  cyan: { bar: 'bg-cyan-500', soft: 'bg-cyan-500/15', text: 'text-cyan-400' },
  amber: { bar: 'bg-amber-500', soft: 'bg-amber-500/15', text: 'text-amber-400' },
  rose: { bar: 'bg-rose-500', soft: 'bg-rose-500/15', text: 'text-rose-400' },
  emerald: { bar: 'bg-emerald-500', soft: 'bg-emerald-500/15', text: 'text-emerald-400' },
  sky: { bar: 'bg-sky-500', soft: 'bg-sky-500/15', text: 'text-sky-400' },
  indigo: { bar: 'bg-indigo-500', soft: 'bg-indigo-500/15', text: 'text-indigo-400' },
}

type Props = {
  demo: Demo
  className?: string
  /** Responsive sizes hint for the screenshot. Defaults to a grid card. */
  sizes?: string
  /** Load eagerly (use for the case-study hero, the page's largest image). */
  priority?: boolean
}

/**
 * Browser-framed preview of a demo. Live demos show their real home-page
 * screenshot, which zooms slightly when the surrounding `.group` is hovered;
 * demos still in progress show a lightweight CSS mock.
 */
export function DemoPreview({
  demo,
  className,
  sizes = '(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw',
  priority = false,
}: Props) {
  const shot = demo.screens?.desktop[0]
  const a = accents[demo.accent]
  const live = demo.status === 'live'

  return (
    <div
      className={cn('relative overflow-hidden rounded-xl frame-glass', className)}
      aria-hidden={shot ? undefined : true}
    >
      <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-muted/40" />
        <span className="h-2 w-2 rounded-full bg-muted/40" />
        <span className="h-2 w-2 rounded-full bg-muted/40" />
        <span className="ml-2 h-2 flex-1 rounded bg-background/70" />
      </div>

      {shot ? (
        <div className="relative overflow-hidden">
          <Image
            src={shot.src}
            alt={shot.alt}
            width={screenSizes.desktop.width}
            height={screenSizes.desktop.height}
            sizes={sizes}
            priority={priority}
            className="block h-auto w-full transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
          />
          {live && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/60 to-transparent pt-12 pb-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <span className="translate-y-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-900 shadow-lg transition-transform duration-300 group-hover:translate-y-0">
                Open live demo
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3">
          <div className="flex items-center justify-between">
            <span className={cn('h-2 w-12 rounded', a.bar)} />
            <span className="flex gap-1.5">
              <span className="h-1.5 w-6 rounded bg-muted/40" />
              <span className="h-1.5 w-6 rounded bg-muted/40" />
              <span className={cn('h-1.5 w-8 rounded', a.bar)} />
            </span>
          </div>
          <div className={cn('mt-3 rounded-lg p-3', a.soft)}>
            <span className="block h-3 w-2/3 rounded bg-foreground/80" />
            <span className="mt-1.5 block h-2 w-1/2 rounded bg-foreground/50" />
            <span className={cn('mt-3 inline-block h-4 w-16 rounded-full', a.bar)} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-10 rounded-md border border-border bg-background/60" />
            ))}
          </div>
        </div>
      )}

      <span
        className={cn(
          'absolute top-2 right-2 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase',
          live ? 'bg-emerald-700 text-white' : 'bg-background/90 text-muted',
        )}
      >
        {live && (
          <span aria-hidden className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-white/80" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
          </span>
        )}
        {live ? 'Live' : 'Coming soon'}
      </span>
    </div>
  )
}
