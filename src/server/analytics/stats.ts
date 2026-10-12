import 'server-only'
import { sql } from '@payloadcms/db-postgres/drizzle'
import type { Payload } from 'payload'

/**
 * Dashboard aggregates via raw SQL (docs/architecture.md §4.6).
 * Table and column names follow Payload's Postgres naming (snake_case).
 * Day boundaries use India Standard Time.
 */

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

export function istDayStart(now: number = Date.now()): Date {
  const shifted = now + IST_OFFSET_MS
  return new Date(Math.floor(shifted / DAY_MS) * DAY_MS - IST_OFFSET_MS)
}

export type Kpis = {
  visitors: number
  sessions: number
  pageViews: number
  whatsappClicks: number
  formSubmits: number
  leads: number
}

export type NamedCount = { name: string; count: number }
export type PageStat = {
  path: string
  views: number
  visitors: number
  avgMs: number | null
  avgScroll: number | null
}
export type Funnel = { sessions: number; demoOpen: number; ctaClick: number; contact: number }
export type LivePageView = {
  at: string
  path: string
  visitorId: string
  country: string | null
  device: string | null
  durationMs: number | null
}

export type DashboardStats = {
  generatedAt: string
  periods: { today: Kpis; week: Kpis; month: Kpis }
  topPages: PageStat[]
  referrers: NamedCount[]
  utmSources: NamedCount[]
  devices: NamedCount[]
  countries: NamedCount[]
  funnel: Funnel
  live: LivePageView[]
}

type Db = { execute: (query: unknown) => Promise<{ rows: Record<string, unknown>[] }> }

function db(payload: Payload): Db {
  return (payload.db as unknown as { drizzle: Db }).drizzle
}

const n = (v: unknown): number => (v == null ? 0 : Number(v))
const nOrNull = (v: unknown): number | null => (v == null ? null : Number(v))

async function kpis(d: Db, since: Date): Promise<Kpis> {
  const { rows } = await d.execute(sql`
    select
      (select count(distinct visitor_id) from page_views where created_at >= ${since}) as visitors,
      (select count(*) from sessions where started_at >= ${since}) as sessions,
      (select count(*) from page_views where created_at >= ${since}) as page_views,
      (select count(*) from events where name = 'whatsapp_click' and created_at >= ${since}) as whatsapp_clicks,
      (select count(*) from events where name = 'form_submit' and created_at >= ${since}) as form_submits,
      (select count(*) from leads where created_at >= ${since}) as leads
  `)
  const r = rows[0] ?? {}
  return {
    visitors: n(r.visitors),
    sessions: n(r.sessions),
    pageViews: n(r.page_views),
    whatsappClicks: n(r.whatsapp_clicks),
    formSubmits: n(r.form_submits),
    leads: n(r.leads),
  }
}

export async function getDashboardStats(payload: Payload, now: number = Date.now()): Promise<DashboardStats> {
  const d = db(payload)
  const today = istDayStart(now)
  const week = new Date(now - 7 * DAY_MS)
  const month = new Date(now - 30 * DAY_MS)

  const [kToday, kWeek, kMonth, pages, refs, utm, devices, countries, funnel, live] = await Promise.all([
    kpis(d, today),
    kpis(d, week),
    kpis(d, month),
    d.execute(sql`
      select path,
             count(*) as views,
             count(distinct visitor_id) as visitors,
             avg(duration_ms) as avg_ms,
             avg(max_scroll_pct) as avg_scroll
      from page_views
      where created_at >= ${month}
      group by path
      order by views desc
      limit 12
    `),
    d.execute(sql`
      select coalesce(nullif(regexp_replace(regexp_replace(referrer, '^https?://(www\\.)?', ''), '/.*$', ''), ''), '(direct)') as name,
             count(*) as count
      from sessions
      where started_at >= ${month}
      group by 1
      order by count desc
      limit 10
    `),
    d.execute(sql`
      select coalesce(nullif(utm_source, ''), '(none)') as name, count(*) as count
      from sessions
      where started_at >= ${month}
      group by 1
      order by count desc
      limit 10
    `),
    d.execute(sql`
      select coalesce(device::text, 'unknown') as name, count(*) as count
      from sessions
      where started_at >= ${month}
      group by 1
      order by count desc
    `),
    d.execute(sql`
      select coalesce(nullif(country, ''), '?') as name, count(*) as count
      from sessions
      where started_at >= ${month}
      group by 1
      order by count desc
      limit 8
    `),
    d.execute(sql`
      select
        (select count(*) from sessions where started_at >= ${month}) as sessions,
        (select count(distinct session_id) from events where name = 'demo_open' and created_at >= ${month}) as demo_open,
        (select count(distinct session_id) from events where name = 'cta_click' and created_at >= ${month}) as cta_click,
        (select count(distinct session_id) from events where name in ('whatsapp_click', 'form_submit') and created_at >= ${month}) as contact
    `),
    d.execute(sql`
      select p.created_at as at, p.path, p.visitor_id, p.duration_ms, v.country, v.device::text as device
      from page_views p
      left join visitors v on v.visitor_id = p.visitor_id
      order by p.created_at desc
      limit 50
    `),
  ])

  const named = (rows: Record<string, unknown>[]): NamedCount[] =>
    rows.map((r) => ({ name: String(r.name ?? ''), count: n(r.count) }))

  const f = funnel.rows[0] ?? {}

  return {
    generatedAt: new Date(now).toISOString(),
    periods: { today: kToday, week: kWeek, month: kMonth },
    topPages: pages.rows.map((r) => ({
      path: String(r.path ?? ''),
      views: n(r.views),
      visitors: n(r.visitors),
      avgMs: nOrNull(r.avg_ms),
      avgScroll: nOrNull(r.avg_scroll),
    })),
    referrers: named(refs.rows),
    utmSources: named(utm.rows),
    devices: named(devices.rows),
    countries: named(countries.rows),
    funnel: {
      sessions: n(f.sessions),
      demoOpen: n(f.demo_open),
      ctaClick: n(f.cta_click),
      contact: n(f.contact),
    },
    live: live.rows.map((r) => ({
      at: r.at instanceof Date ? r.at.toISOString() : String(r.at ?? ''),
      path: String(r.path ?? ''),
      visitorId: String(r.visitor_id ?? ''),
      country: (r.country as string | null) ?? null,
      device: (r.device as string | null) ?? null,
      durationMs: nOrNull(r.duration_ms),
    })),
  }
}
