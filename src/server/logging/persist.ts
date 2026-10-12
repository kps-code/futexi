import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { RequestMeta } from './request-meta'
import { logger } from './logger'

export type ApiLogKind = 'route' | 'action' | 'payload'

export type ApiLogInput = {
  meta: RequestMeta
  kind: ApiLogKind
  name: string
  status: number
  durationMs: number
  inputSummary?: unknown
  errorCode?: string
  errorMessage?: string
  /** Raw request headers, used to resolve the admin user when a token cookie exists. */
  headers?: Headers
}

/**
 * Write one api_logs row. Runs inside `after()`, so it never delays a response.
 * Failures are logged and swallowed: logging must not break the app.
 */
export async function persistApiLog(input: ApiLogInput): Promise<void> {
  try {
    const payload = await getPayload({ config })

    let userId: number | undefined
    if (input.meta.hasAdminCookie && input.headers) {
      try {
        const { user } = await payload.auth({ headers: input.headers })
        userId = user?.id
      } catch {
        userId = undefined
      }
    }

    await payload.create({
      collection: 'api-logs',
      overrideAccess: true,
      depth: 0,
      data: {
        requestId: input.meta.requestId,
        kind: input.kind,
        name: input.name,
        method: input.meta.method,
        path: input.meta.path,
        status: input.status,
        durationMs: input.durationMs,
        visitorId: input.meta.visitorId,
        user: userId,
        ipHash: input.meta.ipHash,
        country: input.meta.country,
        city: input.meta.city,
        userAgent: input.meta.userAgent,
        referer: input.meta.referer,
        inputSummary: input.inputSummary as Record<string, unknown> | undefined,
        errorCode: input.errorCode,
        errorMessage: input.errorMessage,
      },
    })
  } catch (err) {
    logger.warn({ err, requestId: input.meta.requestId, name: input.name }, 'api log persist failed')
  }
}
