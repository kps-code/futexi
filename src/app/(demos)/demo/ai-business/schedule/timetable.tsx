'use client'

import { useState } from 'react'
import { pulseClasses, pulseDays, type PulseClassType, type PulseSlot } from '@/content/demo-pulse'
import { cn } from '@/lib/utils'

const minutes = (t: string) => {
  const [hm, ap] = t.split(' ')
  const [h, m] = hm.split(':').map(Number)
  return ((h % 12) + (ap === 'PM' ? 12 : 0)) * 60 + m
}

/** Weekly timetable with a class-type filter. Columns are days; a card per slot. */
export function Timetable({ schedule, initial }: { schedule: readonly PulseSlot[]; initial?: string }) {
  const start = pulseClasses.some((c) => c.key === initial) ? (initial as PulseClassType) : 'all'
  const [filter, setFilter] = useState<PulseClassType | 'all'>(start)
  const shown = schedule.filter((s) => filter === 'all' || s.cls === filter)
  const byDay = pulseDays.map((_, d) =>
    shown.filter((s) => s.day === d).sort((a, b) => minutes(a.time) - minutes(b.time)),
  )
  const count = (k: PulseClassType | 'all') =>
    k === 'all' ? schedule.length : schedule.filter((s) => s.cls === k).length

  return (
    <div>
      <ul className="flex flex-wrap gap-2" aria-label="Filter by class">
        {[
          { key: 'all' as const, name: 'All classes' },
          ...pulseClasses.map((c) => ({ key: c.key, name: c.name })),
        ].map((c) => (
          <li key={c.key}>
            <button
              type="button"
              aria-pressed={filter === c.key}
              onClick={() => setFilter(c.key)}
              className={cn(
                'inline-flex h-10 items-center gap-2 rounded-[var(--dm-radius)] border px-4 text-sm font-bold tracking-wide uppercase transition-[transform,background-color,color] duration-200 active:scale-95',
                filter === c.key
                  ? 'border-dm-brand bg-dm-brand text-dm-on-brand'
                  : 'border-dm-line-strong text-dm-muted hover:text-dm-ink',
              )}
            >
              {c.name}
              <span className="font-display text-base opacity-70">{count(c.key)}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="text-dm-muted mt-3 text-xs" data-testid="slot-count">
        {shown.length} sessions this week
      </p>

      <div className="mt-6 overflow-x-auto pb-2">
        <ol className="grid min-w-[56rem] grid-cols-7 gap-2" data-testid="timetable">
          {byDay.map((slots, d) => (
            <li key={pulseDays[d]} className="min-w-0">
              <p className="border-dm-line sticky top-0 border-b pb-2 font-display text-2xl">
                {pulseDays[d]}
                <span className="text-dm-muted ml-2 font-sans text-sm font-normal">{slots.length}</span>
              </p>
              <ul className="mt-2 space-y-2">
                {slots.map((s) => {
                  const c = pulseClasses.find((x) => x.key === s.cls)!
                  return (
                    <li key={`${s.day}-${s.time}-${s.cls}`} className="dm-card dm-lift p-2.5 text-xs">
                      <p className="text-dm-brand font-bold">{s.time}</p>
                      <p className="mt-0.5 font-display text-lg leading-none">{c.name}</p>
                      <p className="text-dm-muted mt-1">
                        {s.coach} · {s.spots} spots
                      </p>
                    </li>
                  )
                })}
                {slots.length === 0 && <li className="text-dm-muted text-xs">Rest day</li>}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
