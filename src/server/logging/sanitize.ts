/**
 * Turns arbitrary input into a safe, small summary for logs.
 * Rules (docs/architecture.md §3.3): no secrets, no raw phone, no raw email,
 * no free text. Everything is bounded in size and depth.
 */

const SECRET_KEY = /pass(word)?|token|secret|authori[sz]ation|cookie|api[-_]?key|hash|salt/i
const EMAIL_KEY = /e-?mail/i
const PHONE_KEY = /phone|whatsapp|mobile|tel/i
const FREE_TEXT_KEY = /details|message|notes|description|body|content|comment/i

const MAX_DEPTH = 2
const MAX_KEYS = 25
const MAX_STRING = 60

export function maskEmail(value: string): string {
  const at = value.indexOf('@')
  if (at <= 0) return '***'
  const local = value.slice(0, at)
  const domain = value.slice(at + 1)
  const visible = local.slice(0, Math.min(2, local.length))
  return `${visible}***@${domain}`
}

export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length < 4) return '***'
  const last4 = digits.slice(-4)
  const prefix = value.trim().startsWith('+') ? '+' : ''
  return `${prefix}${'*'.repeat(Math.max(0, digits.length - 4))}${last4}`
}

function truncate(value: string, max = MAX_STRING): string {
  return value.length > max ? `${value.slice(0, max)}…(${value.length})` : value
}

type Json = string | number | boolean | null | Json[] | { [k: string]: Json }

/**
 * Summarise an input object for api_logs.input_summary.
 * Returns JSON-serialisable data; never throws.
 */
export function summarizeInput(input: unknown, depth = 0): Json {
  try {
    if (input === null || input === undefined) return null
    if (typeof input === 'string') return truncate(input)
    if (typeof input === 'number' || typeof input === 'boolean') return input
    if (typeof input === 'bigint') return input.toString()
    if (input instanceof Date) return input.toISOString()
    if (depth >= MAX_DEPTH) return '[nested]'

    if (Array.isArray(input)) {
      return `[array:${input.length}]`
    }

    if (typeof input === 'object') {
      const out: { [k: string]: Json } = {}
      const entries = Object.entries(input as Record<string, unknown>)
      for (const [key, value] of entries.slice(0, MAX_KEYS)) {
        if (SECRET_KEY.test(key)) {
          out[key] = '[redacted]'
        } else if (typeof value === 'string' && EMAIL_KEY.test(key)) {
          out[key] = maskEmail(value)
        } else if (typeof value === 'string' && PHONE_KEY.test(key)) {
          out[key] = maskPhone(value)
        } else if (typeof value === 'string' && FREE_TEXT_KEY.test(key)) {
          out[key] = `[text:${value.length}]`
        } else {
          out[key] = summarizeInput(value, depth + 1)
        }
      }
      if (entries.length > MAX_KEYS) out['…'] = `+${entries.length - MAX_KEYS} keys`
      return out
    }

    return String(input)
  } catch {
    return '[unserialisable]'
  }
}

/** Short, bounded error message without stack. */
export function errorMessageOf(err: unknown): string {
  if (err instanceof Error) return truncate(err.message, 500)
  return truncate(String(err), 500)
}

/** A stable error code: custom `.code`, else the class name. */
export function errorCodeOf(err: unknown): string {
  if (err && typeof err === 'object') {
    const code = (err as { code?: unknown }).code
    if (typeof code === 'string' && code) return code
    if (err instanceof Error && err.name) return err.name
  }
  return 'UNKNOWN'
}

export function truncateHeader(value: string | null | undefined, max = 255): string | undefined {
  if (!value) return undefined
  return truncate(value, max)
}
