import { getPayload } from 'payload'
import config from '@payload-config'
import { getServerEnv } from '@/server/env'
import { HttpError, withRoute } from '@/server/logging/with-logging'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/** Retention windows (docs/architecture.md §4.7). */
const RETENTION_DAYS = {
  'api-logs': 90,
  'page-views': 180,
  events: 180,
  sessions: 180,
} as const

function cutoff(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

/**
 * Daily retention job. Vercel Cron calls this with `Authorization: Bearer CRON_SECRET`.
 */
export const GET = withRoute('cron.cleanup', async (req) => {
  const env = getServerEnv()
  if (!env.CRON_SECRET) throw new HttpError(503, 'CRON_DISABLED', 'CRON_SECRET is not configured', false)
  const auth = req.headers.get('authorization') ?? ''
  if (auth !== `Bearer ${env.CRON_SECRET}`)
    throw new HttpError(401, 'UNAUTHORIZED', 'Invalid cron secret', false)

  const payload = await getPayload({ config })
  const deleted: Record<string, number> = {}

  for (const [collection, days] of Object.entries(RETENTION_DAYS) as [
    keyof typeof RETENTION_DAYS,
    number,
  ][]) {
    const res = await payload.delete({
      collection,
      where: { createdAt: { less_than: cutoff(days) } },
      overrideAccess: true,
      depth: 0,
    })
    deleted[collection] = res.docs.length
  }

  return Response.json({ ok: true, deleted, at: new Date().toISOString() })
})
