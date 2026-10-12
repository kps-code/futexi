import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { parseDevice } from '@/lib/device'
import type { SessionDecision } from '@/lib/session'
import { referrerHost, utmFromSearch } from '@/lib/utm'
import { logger } from '@/server/logging/logger'
import type { RequestMeta } from '@/server/logging/request-meta'
import type { TrackBatch } from './schema'

export type IngestContext = {
  visitorId: string
  session: SessionDecision
  meta: RequestMeta
  ownHost: string
  now: number
}

export type IngestResult = { pageViews: number; leaves: number; events: number; dropped: number }

const DEDUPE_MS = 1000

/**
 * Write one tracker batch to the database. Runs after the response is sent.
 * Visitor and session rows are upserted; page views, leaves and events are
 * appended. Never throws: failures are logged and swallowed.
 */
export async function ingestBatch(batch: TrackBatch, ctx: IngestContext): Promise<IngestResult> {
  const result: IngestResult = { pageViews: 0, leaves: 0, events: 0, dropped: 0 }
  const log = logger.child({ requestId: ctx.meta.requestId, name: 'track.ingest' })

  try {
    const payload = await getPayload({ config })
    const items = [...batch.items].sort((a, b) => a.ts - b.ts)
    const nowIso = new Date(ctx.now).toISOString()

    // Deduplicate page views: same path within one second (double-fire, strict mode).
    const views: Extract<TrackBatch['items'][number], { type: 'page_view' }>[] = []
    for (const item of items) {
      if (item.type !== 'page_view') continue
      const prev = views[views.length - 1]
      if (prev && prev.path === item.path && item.ts - prev.ts < DEDUPE_MS) {
        result.dropped++
        continue
      }
      views.push(item)
    }
    const leaves = items.filter((i) => i.type === 'page_leave')
    const events = items.filter((i) => i.type === 'event')

    const firstView = views[0]
    const lastView = views[views.length - 1]
    const externalReferrer = firstView ? referrerHost(firstView.referrer, ctx.ownHost) : undefined
    const referrerFull =
      externalReferrer && firstView?.referrer ? firstView.referrer.slice(0, 300) : undefined
    const utm = firstView ? utmFromSearch(firstView.search) : {}
    const device = parseDevice(ctx.meta.userAgent)

    // --- Visitor upsert -----------------------------------------------------
    const existingVisitor = await payload.find({
      collection: 'visitors',
      where: { visitorId: { equals: ctx.visitorId } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const visitor = existingVisitor.docs[0]

    if (!visitor) {
      try {
        await payload.create({
          collection: 'visitors',
          overrideAccess: true,
          depth: 0,
          data: {
            visitorId: ctx.visitorId,
            firstSeen: nowIso,
            lastSeen: nowIso,
            visitsCount: 1,
            firstReferrer: referrerFull,
            firstLandingPath: firstView?.path,
            firstUtm: utm,
            device: device.device,
            browser: device.browser,
            os: device.os,
            country: ctx.meta.country,
            city: ctx.meta.city,
          },
        })
      } catch (err) {
        // Concurrent first batches for the same visitor: the unique index wins; move on.
        log.debug({ err }, 'visitor create raced, continuing')
      }
    } else {
      await payload.update({
        collection: 'visitors',
        id: visitor.id,
        overrideAccess: true,
        depth: 0,
        data: {
          lastSeen: nowIso,
          visitsCount: (visitor.visitsCount ?? 1) + (ctx.session.isNew ? 1 : 0),
          device: visitor.device ?? device.device,
          browser: visitor.browser ?? device.browser,
          os: visitor.os ?? device.os,
          country: visitor.country ?? ctx.meta.country,
          city: visitor.city ?? ctx.meta.city,
        },
      })
    }

    // --- Session upsert -----------------------------------------------------
    const existingSession = await payload.find({
      collection: 'sessions',
      where: { sessionId: { equals: ctx.session.sessionId } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const session = existingSession.docs[0]
    const durationMs = Math.max(0, ctx.now - ctx.session.startedAt)

    if (!session) {
      try {
        await payload.create({
          collection: 'sessions',
          overrideAccess: true,
          depth: 0,
          data: {
            sessionId: ctx.session.sessionId,
            visitorId: ctx.visitorId,
            startedAt: new Date(ctx.session.startedAt).toISOString(),
            endedAt: nowIso,
            durationMs,
            pageCount: views.length,
            landingPath: firstView?.path ?? leaves[0]?.path ?? events[0]?.path ?? '/',
            exitPath: lastView?.path,
            referrer: referrerFull,
            utm,
            device: device.device,
            country: ctx.meta.country,
          },
        })
      } catch (err) {
        log.debug({ err }, 'session create raced, continuing')
      }
    } else {
      await payload.update({
        collection: 'sessions',
        id: session.id,
        overrideAccess: true,
        depth: 0,
        data: {
          endedAt: nowIso,
          durationMs,
          pageCount: (session.pageCount ?? 0) + views.length,
          exitPath: lastView?.path ?? session.exitPath,
        },
      })
    }

    // --- Page views ---------------------------------------------------------
    for (const v of views) {
      await payload.create({
        collection: 'page-views',
        overrideAccess: true,
        depth: 0,
        data: {
          visitorId: ctx.visitorId,
          sessionId: ctx.session.sessionId,
          path: v.path,
          title: v.title?.slice(0, 200),
          referrer: referrerHost(v.referrer, ctx.ownHost) ? v.referrer?.slice(0, 300) : undefined,
          theme: v.theme,
          viewportWidth: v.viewportWidth,
        },
      })
      result.pageViews++
    }

    // --- Page leaves: fill duration on the latest open view for that path ----
    for (const l of leaves) {
      if (l.type !== 'page_leave') continue
      const open = await payload.find({
        collection: 'page-views',
        where: {
          and: [
            { sessionId: { equals: ctx.session.sessionId } },
            { path: { equals: l.path } },
            { durationMs: { exists: false } },
          ],
        },
        sort: '-createdAt',
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      const doc = open.docs[0]
      if (!doc) {
        result.dropped++
        continue
      }
      await payload.update({
        collection: 'page-views',
        id: doc.id,
        overrideAccess: true,
        depth: 0,
        data: { durationMs: l.durationMs, maxScrollPct: l.maxScrollPct },
      })
      result.leaves++
    }

    // --- Events -------------------------------------------------------------
    for (const e of events) {
      if (e.type !== 'event') continue
      await payload.create({
        collection: 'events',
        overrideAccess: true,
        depth: 0,
        data: {
          visitorId: ctx.visitorId,
          sessionId: ctx.session.sessionId,
          name: e.name,
          path: e.path,
          props: e.props,
        },
      })
      result.events++
    }

    log.debug(result, 'ingested')
  } catch (err) {
    log.warn({ err }, 'ingest failed')
  }

  return result
}
