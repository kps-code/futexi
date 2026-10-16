'use client'

import { Flame, Leaf } from 'lucide-react'
import { useState } from 'react'
import { formatInr } from '@/lib/booking'
import { cn } from '@/lib/utils'
import { Photo, type DemoPhoto } from './photo'

export type MenuItem = {
  name: string
  line: string
  price: number
  veg?: boolean
  spicy?: boolean
  popular?: boolean
  /** Optional dish photo, shown as a thumbnail. */
  photo?: DemoPhoto
}

/** Veg / non-veg mark used by the menu and the order page. */
export function VegMark({ veg }: { veg?: boolean }) {
  return (
    <span
      className={cn(
        'inline-block h-3 w-3 shrink-0 rounded-sm border-2',
        veg ? 'border-emerald-500' : 'border-red-500',
      )}
      role="img"
      aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'}
    >
      <span
        className={cn('block h-full w-full scale-50 rounded-full', veg ? 'bg-emerald-500' : 'bg-red-500')}
      />
    </span>
  )
}
export type MenuCategory = { name: string; items: readonly MenuItem[] }

/** Digital menu with category tabs. */
export function MenuTabs({ categories }: { categories: readonly MenuCategory[] }) {
  const [active, setActive] = useState(0)
  const cat = categories[active]
  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Menu categories">
        {categories.map((c, i) => (
          <button
            key={c.name}
            role="tab"
            type="button"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            data-track="demo_filter"
            data-track-props={`{"demo":"restaurant","category":"${c.name}"}`}
            className={cn(
              'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              i === active
                ? 'border-dm-brand bg-dm-brand text-dm-on-brand'
                : 'border-dm-line bg-dm-surface text-dm-muted hover:text-dm-ink',
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-label={cat.name}>
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {cat.items.map((m) => (
            <li key={m.name} className="dm-card dm-lift flex items-start justify-between gap-4 p-4">
              {m.photo && <Photo photo={m.photo} className="h-16 w-16 shrink-0 rounded-xl" sizes="64px" />}
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-display font-semibold">
                  <VegMark veg={m.veg} />
                  {m.name}
                  {m.spicy && <Flame className="text-dm-accent h-3.5 w-3.5" aria-label="Spicy" />}
                  {m.popular && (
                    <span className="bg-dm-brand-soft text-dm-brand-ink rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase">
                      Popular
                    </span>
                  )}
                </p>
                <p className="text-dm-muted mt-1 text-sm">{m.line}</p>
              </div>
              <span className="shrink-0 font-semibold">{formatInr(m.price)}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-dm-muted mt-4 flex items-center gap-1.5 text-xs">
        <Leaf className="h-3.5 w-3.5 text-emerald-500" /> Green mark: vegetarian. Prices include taxes.
      </p>
    </div>
  )
}
