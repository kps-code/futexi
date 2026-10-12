import { NextResponse, type NextRequest } from 'next/server'
import { BOT_UA_RE } from '@/lib/bots'
import { uuidv7, UUID_RE } from '@/lib/ids'
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

/**
 * Runs before every page and API request (docs/architecture.md §3.1, §4.2).
 * Header and cookie work only: no database, no fetches.
 *
 *  - x-request-id: one id per request, echoed on the response and used by
 *    the logger, api_logs and Sentry.
 *  - x-kf-bot: "1" when the user agent looks like a crawler.
 *  - kf_vid / kf_sid: first-party visitor and session cookies, issued on
 *    page requests so the very first tracker beacon already carries them.
 */

const REQUEST_ID_HEADER = 'x-request-id'
const BOT_HEADER = 'x-kf-bot'
const VISITOR_HEADER = 'x-kf-vid'
const SESSION_HEADER = 'x-kf-sid'

function isPageRequest(req: NextRequest): boolean {
  const p = req.nextUrl.pathname
  if (p.startsWith('/api/') || p.startsWith('/admin')) return false
  const accept = req.headers.get('accept') ?? ''
  // HTML navigations and RSC payloads for navigations; skip images etc.
  return accept.includes('text/html') || req.headers.has('rsc')
}

export function proxy(request: NextRequest) {
  const incoming = request.headers.get(REQUEST_ID_HEADER)
  const requestId = incoming && UUID_RE.test(incoming) ? incoming : uuidv7()
  const ua = request.headers.get('user-agent') ?? ''
  const isBot = BOT_UA_RE.test(ua)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(REQUEST_ID_HEADER, requestId)
  requestHeaders.set(BOT_HEADER, isBot ? '1' : '0')

  let visitorId: string | undefined
  let sessionValue: string | undefined
  let setVisitor = false

  if (!isBot && isPageRequest(request)) {
    const existing = request.cookies.get(VISITOR_COOKIE)?.value
    visitorId = isValidVisitorId(existing) ? existing : newVisitorId()
    setVisitor = visitorId !== existing
    const session = nextSession(parseSessionCookie(request.cookies.get(SESSION_COOKIE)?.value))
    sessionValue = formatSessionCookie(session)
    requestHeaders.set(VISITOR_HEADER, visitorId)
    requestHeaders.set(SESSION_HEADER, sessionValue)
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set(REQUEST_ID_HEADER, requestId)

  if (visitorId && sessionValue) {
    const secure = request.nextUrl.protocol === 'https:'
    if (setVisitor) {
      response.cookies.set(VISITOR_COOKIE, visitorId, {
        maxAge: VISITOR_MAX_AGE_S,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
        secure,
      })
    }
    response.cookies.set(SESSION_COOKIE, sessionValue, {
      maxAge: SESSION_IDLE_MS / 1000,
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
      secure,
    })
  }

  return response
}

export const config = {
  matcher: [
    // Everything except Next internals and static files.
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|avif|ico|woff2?|ttf|css|js|map)$).*)',
  ],
}
