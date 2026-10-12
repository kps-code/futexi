import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Demo } from '@/content/demos'
import { Card } from '@/components/home/section'
import { DemoPreview } from './demo-preview'

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
            <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold tracking-wide text-muted uppercase">
              {demo.category}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted">{demo.line}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {demo.tags.map((t) => (
              <li key={t} className="rounded-full bg-background px-2.5 py-1 text-xs text-foreground/80">
                {t}
              </li>
            ))}
          </ul>
          <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-accent">
            View Demo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Card>
    </Link>
  )
}
