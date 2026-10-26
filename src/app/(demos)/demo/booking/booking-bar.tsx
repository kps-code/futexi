'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import type { DemoService } from '@/content/demo-businesses'
import { cn } from '@/lib/utils'

/**
 * Hotel-style search bar: treatment, date strip, then straight into the booking
 * flow with both preselected. Pure links, so it works before hydration too.
 */
export function BookingBar({
  services,
  dates,
  bookPath,
}: {
  services: readonly DemoService[]
  dates: readonly string[]
  bookPath: string
}) {
  const [service, setService] = useState(services[0]?.slug ?? '')
  const [date, setDate] = useState(dates[0] ?? '')
  const chosen = services.find((s) => s.slug === service)
  const href = `${bookPath}?service=${encodeURIComponent(service)}&date=${encodeURIComponent(date)}`

  return (
    <div className="container-dm relative z-10 -mt-14 sm:-mt-20" data-testid="booking-bar">
      <div className="dm-glass grid overflow-hidden rounded-[var(--dm-radius)] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] md:grid-cols-[1.3fr_1fr_auto]">
        <label className="border-dm-line flex flex-col gap-1 border-b px-6 py-4 md:border-r md:border-b-0">
          <span className="dm-label">Treatment</span>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="bg-transparent text-base font-medium outline-none"
            aria-label="Treatment"
          >
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name} · {s.minutes} min
              </option>
            ))}
          </select>
        </label>
        <div className="border-dm-line flex flex-col gap-1 border-b px-6 py-4 md:border-r md:border-b-0">
          <span className="dm-label">Date</span>
          <span className="text-base font-medium">{longDate(date)}</span>
        </div>
        <div className="flex items-center px-4 py-3 md:px-5">
          <Link
            href={href}
            data-magnetic
            data-cursor="Book"
            data-track="cta_click"
            data-track-props='{"cta":"demo_booking_bar","demo":"booking"}'
            className="dm-btn-motion dm-shimmer bg-dm-brand text-dm-on-brand inline-flex h-12 w-full items-center justify-center gap-2 rounded-[var(--dm-radius-btn)] px-6 text-sm font-medium"
          >
            Check availability <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <ul className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Choose a date">
        {dates.slice(0, 8).map((d) => {
          const on = d === date
          const dt = new Date(d + 'T00:00:00')
          return (
            <li key={d}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setDate(d)}
                className={cn(
                  'flex w-16 shrink-0 flex-col items-center rounded-[var(--dm-radius)] border py-2 text-xs transition-[transform,background-color,color,border-color] duration-300',
                  on
                    ? 'border-dm-brand bg-dm-brand text-dm-on-brand -translate-y-0.5'
                    : 'border-dm-line bg-dm-surface/70 text-dm-muted hover:text-dm-ink hover:-translate-y-0.5',
                )}
              >
                <span className="tracking-widest uppercase">
                  {dt.toLocaleDateString('en-IN', { weekday: 'short' })}
                </span>
                <span className="mt-0.5 text-lg font-medium">{dt.getDate()}</span>
              </button>
            </li>
          )
        })}
      </ul>
      {chosen && (
        <p className="text-dm-muted mt-3 text-xs">
          {chosen.name}: {chosen.minutes} minutes, ₹{chosen.price.toLocaleString('en-IN')}. Only free slots
          are shown on the next screen.
        </p>
      )}
    </div>
  )
}

function longDate(d: string) {
  if (!d) return ''
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}
