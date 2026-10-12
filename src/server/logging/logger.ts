import 'server-only'
import pino from 'pino'

const level = process.env.LOG_LEVEL || 'info'

/**
 * Structured JSON logger. One line per event, consumed by Vercel logs
 * (and an Axiom drain if enabled). Bind request context with `logger.child()`.
 */
export const logger = pino({
  level,
  base: {
    service: 'futexi',
    env: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
  },
  redact: {
    paths: ['headers.cookie', 'headers.authorization', '*.password', '*.token', '*.secret', 'input.password'],
    censor: '[redacted]',
  },
})

export type Logger = typeof logger
