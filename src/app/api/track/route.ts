import { z } from 'zod'
import { isBotUserAgent } from '@/lib/bots'
import { parseCookies, serializeCookie } from '@/lib/cookies'
import {
  SESSION_COOKIE,
  SESSION_IDLE_MS,
  VISITOR_COOKIE,
  VISITOR_MAX_AGE_S,
  formatSessionCookie,
  isValidVisitorId,
  newVisitorId,
  nextSession,
  parseSessionCookie,
} from '@/lib/session'
import { runAfter } from '@/server/after'
import { ingestBatch } from '@/server/analytics/ingest'
import { trackBatch } from '@/server/analytics/schema'
import { getServerEnv } from '@/server/env'
import { requestMetaFromHeaders } from '@/server/logging/request-meta'
import { HttpError, withRoute } from '@/server/logging/with-logging'
import { trackLimiterByIp, trackLimiterByVisitor } from '@/server/rate-limit'

export const dynamic = 'force-dynamic'

const MAX_BODY_BYTES = 20_000
const NO_CONTENT = () => new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } })

/**
 * Analytics ingest (docs/architecture.md §4.4). Accepts a small JSON batch
 * from the tracker via sendBeacon, answers 204 immediately and writes after.
 */
export const POST = withRoute('track.ingest', async (req) => {
  if (req.headers.get('x-kf-bot') === '1' || isBotUserAgent(req.headers.get('user-agent'))) {
    return NO_CONTENT()
  }

  const text = await req.text()
  if (text.length > MAX_BODY_BYTES) throw new HttpError(413, 'PAYLOAD_TOO_LARGE', 'Batch too large')

  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    throw new HttpError(400, 'INVALID_JSON', 'Body must be JSON')
  }
  const parsed = trackBatch.safeParse(json)
  if (!parsed.success) {
    throw new HttpError(400, 'VALIDATION_FAILED', z.prettifyError(parsed.error).slice(0, 500))
  }

  const env = getServerEnv()
  const url = new URL(req.url)
  const meta = requestMetaFromHeaders(req.headers, req.method, url.pathname, env.IP_HASH_SALT)
  const cookies = parseCookies(req.headers.get('cookie'))

  const existingVid = cookies[VISITOR_COOKIE]
  const visitorId = isValidVisitorId(existingVid) ? existingVid : newVisitorId()
  const session = nextSession(parseSessionCookie(cookies[SESSION_COOKIE]))

  if (
    !trackLimiterByVisitor.check(visitorId).ok ||
    (meta.ipHash && !trackLimiterByIp.check(meta.ipHash).ok)
  ) {
    throw new HttpError(429, 'RATE_LIMITED', 'Too many requests', false)
  }

  const res = NO_CONTENT()
  const secure = url.protocol === 'https:'
  if (visitorId !== existingVid) {
    res.headers.append(
      'set-cookie',
      serializeCookie(VISITOR_COOKIE, visitorId, { maxAge: VISITOR_MAX_AGE_S, secure, httpOnly: true }),
    )
  }
  // Refresh the session cookie on every batch so the 30-minute idle window rolls.
  res.headers.append(
    'set-cookie',
    serializeCookie(SESSION_COOKIE, formatSessionCookie(session), {
      maxAge: SESSION_IDLE_MS / 1000,
      secure,
      httpOnly: true,
    }),
  )

  const ownHost = new URL(
    env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_SITE_URL || req.url : req.url,
  ).hostname
  runAfter(() =>
    ingestBatch(parsed.data, {
      visitorId,
      session,
      meta,
      ownHost,
      now: Date.now(),
    }),
  )

  return res
})
