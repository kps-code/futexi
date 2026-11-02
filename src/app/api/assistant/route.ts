import { z } from 'zod'
import { isBotUserAgent } from '@/lib/bots'
import { parseCookies } from '@/lib/cookies'
import { SESSION_COOKIE, VISITOR_COOKIE, isValidVisitorId, parseSessionCookie } from '@/lib/session'
import { answerChat, chatRequest, type ChatEvent } from '@/server/assistant/chat'
import { getServerEnv } from '@/server/env'
import { requestMetaFromHeaders } from '@/server/logging/request-meta'
import { HttpError, withRoute } from '@/server/logging/with-logging'
import { assistantLimiterByIp } from '@/server/rate-limit'

export const dynamic = 'force-dynamic'
/** A slow model plus a fallback can take a while; the provider itself gives up long before this. */
export const maxDuration = 60

const MAX_BODY_BYTES = 16_000

/**
 * Ask-us chat (docs/architecture.md, section 4.8). One visitor message in, a newline-delimited
 * JSON stream out: `{"t":"text"}` lines as the answer arrives, then one
 * `{"done":true,"form":bool,"source":"model"|"fallback"}` line.
 */
export const POST = withRoute('assistant.chat', async (req) => {
  if (req.headers.get('x-kf-bot') === '1' || isBotUserAgent(req.headers.get('user-agent'))) {
    throw new HttpError(403, 'BOT', 'Not available')
  }

  const text = await req.text()
  if (text.length > MAX_BODY_BYTES) throw new HttpError(413, 'PAYLOAD_TOO_LARGE', 'Message too long')

  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    throw new HttpError(400, 'INVALID_JSON', 'Body must be JSON')
  }
  const parsed = chatRequest.safeParse(json)
  if (!parsed.success) {
    throw new HttpError(400, 'VALIDATION_FAILED', z.prettifyError(parsed.error).slice(0, 500))
  }
  if (parsed.data.messages[parsed.data.messages.length - 1].role !== 'user') {
    throw new HttpError(400, 'VALIDATION_FAILED', 'The last message must be from the visitor')
  }

  const env = getServerEnv()
  const url = new URL(req.url)
  const meta = requestMetaFromHeaders(req.headers, req.method, url.pathname, env.IP_HASH_SALT)
  if (meta.ipHash && !assistantLimiterByIp.check(meta.ipHash).ok) {
    throw new HttpError(
      429,
      'RATE_LIMITED',
      'Too many messages in a short time. Please wait a few minutes or message us on WhatsApp.',
    )
  }

  const cookies = parseCookies(req.headers.get('cookie'))
  const vid = cookies[VISITOR_COOKIE]
  const session = parseSessionCookie(cookies[SESSION_COOKIE])
  const path = parsed.data.path && parsed.data.path.startsWith('/') ? parsed.data.path : '/'

  const events = answerChat(parsed.data, {
    visitorId: isValidVisitorId(vid) ? vid : 'unknown',
    sessionId: session?.sessionId ?? 'unknown',
    path,
  })

  return new Response(ndjson(events, req.signal), {
    status: 200,
    headers: {
      'content-type': 'application/x-ndjson; charset=utf-8',
      'cache-control': 'no-store',
      'x-accel-buffering': 'no',
    },
  })
})

/** Streams one JSON object per line. Stops reading from the model when the visitor goes away. */
function ndjson(events: AsyncGenerator<ChatEvent>, signal: AbortSignal): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  const stop = () => void events.return(undefined).catch(() => {})
  signal.addEventListener('abort', stop, { once: true })
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { value, done } = await events.next()
        if (done) {
          controller.close()
          signal.removeEventListener('abort', stop)
          return
        }
        controller.enqueue(encoder.encode(`${JSON.stringify(value)}\n`))
      } catch (err) {
        controller.enqueue(
          encoder.encode(`${JSON.stringify({ done: true, form: false, source: 'fallback', error: true })}\n`),
        )
        controller.close()
        signal.removeEventListener('abort', stop)
        throw err
      }
    },
    cancel: stop,
  })
}
