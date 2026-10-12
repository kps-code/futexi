'use client'

import { useState } from 'react'
import { demoCategories, demos } from '@/content/demos'
import { cn } from '@/lib/utils'
import { DemoCard } from './demo-card'

/** Filterable demo grid (docs/content-lock.md §4). */
export function DemosGrid() {
  const [filter, setFilter] = useState<(typeof demoCategories)[number]>('All')
  const visible = demos.filter((d) => filter === 'All' || d.category === filter || d.category === 'All')

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter demos by category">
        {demoCategories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            aria-pressed={filter === c}
            data-track="demo_filter"
            data-track-props={`{"category":"${c}"}`}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              filter === c
                ? 'border-transparent bg-accent-gradient text-white'
                : 'border-border bg-surface text-foreground/85 hover:border-border-strong',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <h2 className="sr-only">All demos</h2>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {visible.map((d) => (
          <li key={d.slug}>
            <DemoCard demo={d} />
          </li>
        ))}
      </ul>
      {visible.length === 0 && <p className="mt-10 text-muted">No demos in this category yet.</p>}
    </div>
  )
}
