/** Tiny cookie helpers for route handlers (no dependency, Node and Edge safe). */

export function parseCookies(header: string | null | undefined): Record<string, string> {
  const out: Record<string, string> = {}
  if (!header) return out
  for (const part of header.split(';')) {
    const i = part.indexOf('=')
    if (i < 0) continue
    const k = part.slice(0, i).trim()
    if (!k) continue
    try {
      out[k] = decodeURIComponent(part.slice(i + 1).trim())
    } catch {
      out[k] = part.slice(i + 1).trim()
    }
  }
  return out
}

export type CookieOptions = {
  maxAge: number
  path?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'Lax' | 'Strict' | 'None'
}

export function serializeCookie(name: string, value: string, o: CookieOptions): string {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `Max-Age=${Math.max(0, Math.floor(o.maxAge))}`,
    `Path=${o.path ?? '/'}`,
    `SameSite=${o.sameSite ?? 'Lax'}`,
  ]
  if (o.httpOnly ?? true) parts.push('HttpOnly')
  if (o.secure) parts.push('Secure')
  return parts.join('; ')
}
