/**
 * Validated environment. Import `clientEnv` anywhere, `getServerEnv()` on the server.
 * Fails fast at startup (and at build, via next.config.ts) when a required
 * variable is missing or malformed.
 *
 * Database: set DATABASE_URL (Neon, CI), or the five DB_* parts (local service).
 * DATABASE_URL wins when both are present.
 */
import { z } from 'zod'
import { composeDatabaseUrl, isPostgresUrl } from './db-url'

const emptyToUndefined = (v: unknown) => (v === '' ? undefined : v)
const optionalString = () => z.preprocess(emptyToUndefined, z.string().optional())

const serverSchema = z
  .object({
    DATABASE_URL: z.preprocess(
      emptyToUndefined,
      z.string().refine(isPostgresUrl, 'DATABASE_URL must be a Postgres connection string').optional(),
    ),
    DB_USER: optionalString(),
    DB_PASSWORD: optionalString(),
    DB_HOST: optionalString(),
    DB_PORT: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).max(65535).optional()),
    DB_NAME: optionalString(),
    DB_SSL: z.preprocess(emptyToUndefined, z.enum(['true', 'false']).optional()),

    PAYLOAD_SECRET: z.string().min(32, 'PAYLOAD_SECRET must be at least 32 characters'),
    IP_HASH_SALT: z.string().min(16, 'IP_HASH_SALT must be at least 16 characters'),
    BLOB_READ_WRITE_TOKEN: optionalString(),
    SENTRY_DSN: z.preprocess(emptyToUndefined, z.url().optional()),
    SENTRY_AUTH_TOKEN: optionalString(),
    CRON_SECRET: z.preprocess(emptyToUndefined, z.string().min(16).optional()),
    LOG_LEVEL: z.preprocess(
      emptyToUndefined,
      z.enum(['trace', 'debug', 'info', 'warn', 'error']).default('info'),
    ),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    VERCEL_ENV: z.preprocess(emptyToUndefined, z.enum(['development', 'preview', 'production']).optional()),
  })
  .superRefine((v, ctx) => {
    const hasParts = Boolean(v.DB_USER && v.DB_PASSWORD && v.DB_HOST && v.DB_NAME)
    if (!v.DATABASE_URL && !hasParts) {
      ctx.addIssue({
        code: 'custom',
        path: ['DATABASE_URL'],
        message: 'Set DATABASE_URL, or all of DB_USER, DB_PASSWORD, DB_HOST, DB_NAME (DB_PORT optional)',
      })
    }
  })

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url('NEXT_PUBLIC_SITE_URL must be a full URL'),
  NEXT_PUBLIC_SENTRY_DSN: z.preprocess(emptyToUndefined, z.url().optional()),
})

export type ServerEnv = z.infer<typeof serverSchema>
export type ClientEnv = z.infer<typeof clientSchema>

function fail(scope: string, error: z.ZodError): never {
  throw new Error(`Invalid ${scope} environment:\n${z.prettifyError(error)}`)
}

// NEXT_PUBLIC_* must be read with literal property access so Next can inline them.
const clientResult = clientSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
})
if (!clientResult.success) fail('client', clientResult.error)
export const clientEnv: ClientEnv = clientResult.data

let serverCache: ServerEnv | undefined

/** Server-only. Throws if called in the browser. */
export function getServerEnv(): ServerEnv {
  if (typeof window !== 'undefined') {
    throw new Error('getServerEnv() must not be called in the browser')
  }
  if (serverCache) return serverCache
  const result = serverSchema.safeParse(process.env)
  if (!result.success) fail('server', result.error)
  serverCache = result.data
  return serverCache
}

/** The Postgres connection string Payload should use. */
export function getDatabaseUrl(): string {
  const env = getServerEnv()
  if (env.DATABASE_URL) return env.DATABASE_URL
  return composeDatabaseUrl({
    user: env.DB_USER!,
    password: env.DB_PASSWORD!,
    host: env.DB_HOST!,
    port: env.DB_PORT,
    database: env.DB_NAME!,
    ssl: env.DB_SSL === 'true',
  })
}

export const isProduction = () => getServerEnv().VERCEL_ENV === 'production'
