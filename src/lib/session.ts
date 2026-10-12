import { uuidv7, UUID_RE } from './ids'

/**
 * Session stitching rules (docs/architecture.md §4.2).
 * A session ends after 30 minutes idle or 4 hours total. The cookie carries
 * the session id and its start time so no database lookup is needed.
 * Pure functions; safe in the proxy and in tests.
 */

export const VISITOR_COOKIE = 'kf_vid'
export const SESSION_COOKIE = 'kf_sid'

export const VISITOR_MAX_AGE_S = 60 * 60 * 24 * 395 // 13 months
export const SESSION_IDLE_MS = 30 * 60 * 1000
export const SESSION_MAX_MS = 4 * 60 * 60 * 1000

export type SessionCookie = { sessionId: string; startedAt: number }

export function parseSessionCookie(value: string | undefined | null): SessionCookie | null {
  if (!value) return null
  const [sessionId, startedRaw] = value.split('.')
  const startedAt = Number(startedRaw)
  if (!sessionId || !UUID_RE.test(sessionId) || !Number.isFinite(startedAt) || startedAt <= 0) return null
  return { sessionId, startedAt }
}

export function formatSessionCookie(s: SessionCookie): string {
  return `${s.sessionId}.${s.startedAt}`
}

export type SessionDecision = SessionCookie & { isNew: boolean }

/**
 * Decide which session a request belongs to.
 * `lastActivityAt` is the time the current cookie was last refreshed; the
 * caller passes the cookie's own refresh time (we refresh on every request,
 * so a cookie that is still present means activity within the idle window).
 */
export function nextSession(current: SessionCookie | null, now: number = Date.now()): SessionDecision {
  if (current && now - current.startedAt < SESSION_MAX_MS && now >= current.startedAt) {
    return { ...current, isNew: false }
  }
  return { sessionId: uuidv7(now), startedAt: now, isNew: true }
}

export function isValidVisitorId(value: string | undefined | null): value is string {
  return Boolean(value && UUID_RE.test(value))
}

export function newVisitorId(now: number = Date.now()): string {
  return uuidv7(now)
}
