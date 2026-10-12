import { NextResponse, type NextRequest } from 'next/server'
import { uuidv7, UUID_RE } from '@/lib/ids'

/**
 * Runs before every page and API request (docs/architecture.md §3.1).
 * Keeps to header work only: no database, no fetches.
 *
 *  - x-request-id: one id per request, echoed on the response and used by
 *    the logger, api_logs and Sentry.
 *  - x-kf-bot: "1" when the user agent looks like a crawler, so analytics
 *    can skip it.
 */

const REQUEST_ID_HEADER = 'x-request-id'
const BOT_HEADER = 'x-kf-bot'
const BOT_RE =
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegrambot|preview|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|curl|wget|python-requests/i

export function proxy(request: NextRequest) {
  const incoming = request.headers.get(REQUEST_ID_HEADER)
  const requestId = incoming && UUID_RE.test(incoming) ? incoming : uuidv7()
  const ua = request.headers.get('user-agent') ?? ''

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(REQUEST_ID_HEADER, requestId)
  requestHeaders.set(BOT_HEADER, BOT_RE.test(ua) ? '1' : '0')

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set(REQUEST_ID_HEADER, requestId)
  return response
}

export const config = {
  matcher: [
    // Everything except Next internals and static files.
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|avif|ico|woff2?|ttf|css|js|map)$).*)',
  ],
}
