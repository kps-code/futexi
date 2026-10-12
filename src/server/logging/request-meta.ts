import 'server-only'
import { createHash, randomUUID } from 'node:crypto'
import { truncateHeader } from './sanitize'

export const REQUEST_ID_HEADER = 'x-request-id'
export const VISITOR_COOKIE = 'kf_vid'

export type RequestMeta = {
  requestId: string
  method: string
  path: string
  visitorId?: string
  ipHash?: string
  country?: string
  city?: string
  userAgent?: string
  referer?: string
  hasAdminCookie: boolean
}

/** Hash an IP with a daily-rotating salt so it cannot be reversed or joined across days. */
export function hashIp(ip: string | undefined, salt: string): string | undefined {
  if (!ip) return undefined
  const day = new Date().toISOString().slice(0, 10)
  return createHash('sha256').update(`${ip}|${salt}|${day}`).digest('hex').slice(0, 32)
}

function cookieValue(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined
  for (const part of cookieHeader.split(';')) {
    const [k, ...rest] = part.trim().split('=')
    if (k === name) return decodeURIComponent(rest.join('='))
  }
  return undefined
}

function clientIp(headers: Headers): string | undefined {
  const xff = headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]?.trim()
  return headers.get('x-real-ip') ?? undefined
}

function safeDecode(value: string | null): string | undefined {
  if (!value) return undefined
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/** Extract log metadata from request headers. Never throws. */
export function requestMetaFromHeaders(
  headers: Headers,
  method: string,
  path: string,
  ipSalt: string,
): RequestMeta {
  const cookie = headers.get('cookie')
  return {
    requestId: headers.get(REQUEST_ID_HEADER) || randomUUID(),
    method,
    path,
    visitorId: cookieValue(cookie, VISITOR_COOKIE),
    ipHash: hashIp(clientIp(headers), ipSalt),
    country: headers.get('x-vercel-ip-country') ?? undefined,
    city: safeDecode(headers.get('x-vercel-ip-city')),
    userAgent: truncateHeader(headers.get('user-agent')),
    referer: truncateHeader(headers.get('referer')),
    hasAdminCookie: Boolean(cookieValue(cookie, 'payload-token')),
  }
}
