import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { AdminViewServerProps } from 'payload'
import { getDashboardStats, type Kpis, type NamedCount } from '@/server/analytics/stats'

/** Admin > Analytics. Server component, data via raw SQL aggregates. */
export async function AnalyticsView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, permissions, visibleEntities, locale } = initPageResult
  const user = req.user
  if (!user)
    redirect(`${req.payload.config.routes.admin}/login?redirect=${encodeURIComponent('/admin/analytics')}`)

  const stats = await getDashboardStats(req.payload)
  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      dateStyle: 'medium',
      timeStyle: 'short',
    })

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={user}
      visibleEntities={visibleEntities}
    >
      <Gutter className="kf-analytics">
        <header className="kf-analytics__header">
          <h1>Analytics</h1>
          <p>
            Generated {fmtTime(stats.generatedAt)} IST ·{' '}
            <Link href="/admin/analytics" className="kf-analytics__refresh" prefetch={false}>
              Refresh
            </Link>
          </p>
        </header>

        <section className="kf-analytics__kpis">
          <KpiColumn title="Today" k={stats.periods.today} />
          <KpiColumn title="Last 7 days" k={stats.periods.week} />
          <KpiColumn title="Last 30 days" k={stats.periods.month} />
        </section>

        <section className="kf-analytics__grid">
          <Card title="Funnel · last 30 days">
            <FunnelRow label="Sessions" value={stats.funnel.sessions} base={stats.funnel.sessions} />
            <FunnelRow label="Opened a demo" value={stats.funnel.demoOpen} base={stats.funnel.sessions} />
            <FunnelRow label="Clicked a CTA" value={stats.funnel.ctaClick} base={stats.funnel.sessions} />
            <FunnelRow label="WhatsApp or form" value={stats.funnel.contact} base={stats.funnel.sessions} />
          </Card>

          <Card title="Top pages · last 30 days">
            <table className="kf-table">
              <thead>
                <tr>
                  <th>Path</th>
                  <th>Views</th>
                  <th>Visitors</th>
                  <th>Avg time</th>
                  <th>Avg scroll</th>
                </tr>
              </thead>
              <tbody>
                {stats.topPages.length === 0 && <Empty cols={5} />}
                {stats.topPages.map((p) => (
                  <tr key={p.path}>
                    <td className="kf-mono">{p.path}</td>
                    <td>{p.views}</td>
                    <td>{p.visitors}</td>
                    <td>{p.avgMs == null ? '–' : `${Math.round(p.avgMs / 1000)}s`}</td>
                    <td>{p.avgScroll == null ? '–' : `${Math.round(p.avgScroll)}%`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card title="Referrers · last 30 days">
            <Bars rows={stats.referrers} />
          </Card>
          <Card title="UTM sources · last 30 days">
            <Bars rows={stats.utmSources} />
          </Card>
          <Card title="Devices · last 30 days">
            <Bars rows={stats.devices} />
          </Card>
          <Card title="Countries · last 30 days">
            <Bars rows={stats.countries} />
          </Card>
        </section>

        <Card title="Live · last 50 page views">
          <table className="kf-table">
            <thead>
              <tr>
                <th>Time (IST)</th>
                <th>Path</th>
                <th>Visitor</th>
                <th>Where</th>
                <th>Device</th>
                <th>Time on page</th>
              </tr>
            </thead>
            <tbody>
              {stats.live.length === 0 && <Empty cols={6} />}
              {stats.live.map((v, i) => (
                <tr key={`${v.at}-${i}`}>
                  <td>{fmtTime(v.at)}</td>
                  <td className="kf-mono">{v.path}</td>
                  <td className="kf-mono">
                    <Link
                      href={`/admin/collections/visitors?where[visitorId][equals]=${v.visitorId}`}
                      prefetch={false}
                    >
                      {v.visitorId.slice(0, 8)}…
                    </Link>
                  </td>
                  <td>{v.country ?? '–'}</td>
                  <td>{v.device ?? '–'}</td>
                  <td>{v.durationMs == null ? '–' : `${Math.round(v.durationMs / 1000)}s`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Gutter>
    </DefaultTemplate>
  )
}

function KpiColumn({ title, k }: { title: string; k: Kpis }) {
  const items: [string, number][] = [
    ['Visitors', k.visitors],
    ['Sessions', k.sessions],
    ['Page views', k.pageViews],
    ['WhatsApp clicks', k.whatsappClicks],
    ['Form submits', k.formSubmits],
    ['Leads', k.leads],
  ]
  return (
    <div className="kf-card">
      <h2 className="kf-card__title">{title}</h2>
      <dl className="kf-kpis">
        {items.map(([label, value]) => (
          <div key={label} className="kf-kpi">
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="kf-card">
      <h2 className="kf-card__title">{title}</h2>
      {children}
    </div>
  )
}

function Bars({ rows }: { rows: NamedCount[] }) {
  const max = Math.max(1, ...rows.map((r) => r.count))
  if (!rows.length) return <p className="kf-empty">No data yet.</p>
  return (
    <ul className="kf-bars">
      {rows.map((r) => (
        <li key={r.name}>
          <span className="kf-bars__label">{r.name}</span>
          <span className="kf-bars__track">
            <span className="kf-bars__fill" style={{ width: `${(r.count / max) * 100}%` }} />
          </span>
          <span className="kf-bars__value">{r.count}</span>
        </li>
      ))}
    </ul>
  )
}

function FunnelRow({ label, value, base }: { label: string; value: number; base: number }) {
  const pct = base > 0 ? Math.round((value / base) * 100) : 0
  return (
    <div className="kf-funnel__row">
      <span className="kf-funnel__label">{label}</span>
      <span className="kf-bars__track">
        <span className="kf-bars__fill" style={{ width: `${pct}%` }} />
      </span>
      <span className="kf-funnel__value">
        {value} <small>({pct}%)</small>
      </span>
    </div>
  )
}

function Empty({ cols }: { cols: number }) {
  return (
    <tr>
      <td colSpan={cols} className="kf-empty">
        No data yet.
      </td>
    </tr>
  )
}
