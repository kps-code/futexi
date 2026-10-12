import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Demo } from '@/content/demos'
import { Card } from '@/components/home/section'
import { cn } from '@/lib/utils'
import { DemoPreview } from './demo-preview'

/** Category chip tinted with the demo's accent, readable in both themes. */
const chip: Record<Demo['accent'], string> = {
  violet: 'border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300',
  cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
  amber: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  rose: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300',
  emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  sky: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  indigo: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300',
}

export function DemoCard({ demo }: { demo: Demo }) {
  return (
    <Link
      href={`/demos/${demo.slug}`}
      className="block h-full focus-visible:outline-none"
      data-track="demo_open"
      data-track-props={`{"slug":"${demo.slug}","where":"card"}`}
    >
      <Card className="flex h-full flex-col p-4">
        <DemoPreview demo={demo} />
        <div className="flex flex-1 flex-col p-2 pt-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg font-semibold">{demo.title}</h3>
            <span
              className={cn(
                'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase',
                chip[demo.accent],
              )}
            >
              {demo.category}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted">{demo.line}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {demo.tags.map((t) => (
              <li
                key={t}
                className="rounded-full bg-background px-2.5 py-1 text-xs text-foreground/80 transition-colors group-hover:bg-surface-strong"
              >
                {t}
              </li>
            ))}
          </ul>
          <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-accent">
            View Demo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Card>
    </Link>
  )
}
