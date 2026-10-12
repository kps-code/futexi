'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

type PageView = {
  id: number
  path: string
  createdAt: string
  durationMs?: number | null
  maxScrollPct?: number | null
  referrer?: string | null
}
type Event = {
  id: number
  name: string
  path: string
  createdAt: string
  props?: Record<string, unknown> | null
}
type Step = { at: string; kind: 'view' | 'event'; label: string; detail?: string }

async function fetchDocs<T>(collection: string, visitorId: string): Promise<T[]> {
  const q = new URLSearchParams({
    'where[visitorId][equals]': visitorId,
    sort: '-createdAt',
    limit: '100',
    depth: '0',
  })
  const res = await fetch(`/api/${collection}?${q}`, { credentials: 'include' })
  if (!res.ok) return []
  const json = (await res.json()) as { docs?: T[] }
  return json.docs ?? []
}

/** Shows every page view and event of the visitor who became this lead. */
export function LeadJourney() {
  const { savedDocumentData } = useDocumentInfo()
  const visitorId = typeof savedDocumentData?.visitorId === 'string' ? savedDocumentData.visitorId : undefined
  const [steps, setSteps] = useState<Step[] | null>(null)

  useEffect(() => {
    if (!visitorId) return
    let cancelled = false
    Promise.all([fetchDocs<PageView>('page-views', visitorId), fetchDocs<Event>('events', visitorId)]).then(
      ([views, events]) => {
        if (cancelled) return
        const merged: Step[] = [
          ...views.map((v) => ({
            at: v.createdAt,
            kind: 'view' as const,
            label: v.path,
            detail: [
              v.durationMs != null ? `${Math.round(v.durationMs / 1000)}s` : null,
              v.maxScrollPct != null ? `${v.maxScrollPct}% scroll` : null,
              v.referrer ? `from ${v.referrer}` : null,
            ]
              .filter(Boolean)
              .join(' · '),
          })),
          ...events.map((e) => ({
            at: e.createdAt,
            kind: 'event' as const,
            label: e.name,
            detail: [e.path, e.props ? JSON.stringify(e.props) : null].filter(Boolean).join(' · '),
          })),
        ].sort((a, b) => (a.at < b.at ? 1 : -1))
        setSteps(merged)
      },
    )
    return () => {
      cancelled = true
    }
  }, [visitorId])

  if (!visitorId) {
    return (
      <div className="kf-journey">
        <h3 className="kf-journey__title">Visitor journey</h3>
        <p className="kf-empty">No visitor id on this lead (form submitted without analytics cookies).</p>
      </div>
    )
  }

  return (
    <div className="kf-journey">
      <h3 className="kf-journey__title">
        Visitor journey ·{' '}
        <a href={`/admin/collections/visitors?where[visitorId][equals]=${visitorId}`}>
          {visitorId.slice(0, 8)}…
        </a>
      </h3>
      {steps === null && <p className="kf-empty">Loading…</p>}
      {steps !== null && steps.length === 0 && (
        <p className="kf-empty">No activity recorded for this visitor.</p>
      )}
      {steps !== null && steps.length > 0 && (
        <ol className="kf-journey__list">
          {steps.map((s, i) => (
            <li key={i} className={`kf-journey__step kf-journey__step--${s.kind}`}>
              <time dateTime={s.at}>
                {new Date(s.at).toLocaleString('en-IN', {
                  timeZone: 'Asia/Kolkata',
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </time>
              <span className="kf-journey__label">{s.label}</span>
              {s.detail && <span className="kf-journey__detail">{s.detail}</span>}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
