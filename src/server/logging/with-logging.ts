import 'server-only'
import { headers as nextHeaders } from 'next/headers'
import { runAfter } from '@/server/after'
import { getServerEnv } from '@/server/env'
import { logger } from './logger'
import { persistApiLog, type ApiLogKind } from './persist'
import { requestMetaFromHeaders, type RequestMeta } from './request-meta'
import { errorCodeOf, errorMessageOf, summarizeInput } from './sanitize'

/**
 * Error subclass handlers can throw to control the logged status/code
 * while still letting Next return a proper response via `toResponse()`.
 */
export class HttpError extends Error {
  readonly status: number
  readonly code: string
  readonly expose: boolean

  constructor(status: number, code: string, message: string, expose = true) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
    this.expose = expose
  }

  toResponse(): Response {
    return Response.json(
      { error: { code: this.code, message: this.expose ? this.message : 'Request failed' } },
      { status: this.status },
    )
  }
}

type AnyCtx = unknown
type RouteHandler<Ctx extends AnyCtx> = (req: Request, ctx: Ctx) => Promise<Response> | Response

type Finish = {
  status: number
  errorCode?: string
  errorMessage?: string
  inputSummary?: unknown
}

function finishLog(
  kind: ApiLogKind,
  name: string,
  meta: RequestMeta,
  startedAt: number,
  result: Finish,
  reqHeaders?: Headers,
) {
  const durationMs = Math.round(performance.now() - startedAt)
  const line = {
    requestId: meta.requestId,
    kind,
    name,
    method: meta.method,
    path: meta.path,
    status: result.status,
    durationMs,
    visitorId: meta.visitorId,
    country: meta.country,
    errorCode: result.errorCode,
  }
  if (result.status >= 500) logger.error(line, 'request failed')
  else if (result.status >= 400) logger.warn(line, 'request rejected')
  else logger.info(line, 'request')

  runAfter(() =>
    persistApiLog({
      meta,
      kind,
      name,
      status: result.status,
      durationMs,
      inputSummary: result.inputSummary,
      errorCode: result.errorCode,
      errorMessage: result.errorMessage,
      headers: reqHeaders,
    }),
  )
}

/**
 * Wrap a Route Handler. Logs one line and one api_logs row per call.
 *
 *   export const GET = withRoute('health', async (req) => Response.json({ ok: true }))
 */
export function withRoute<Ctx extends AnyCtx = AnyCtx>(
  name: string,
  handler: RouteHandler<Ctx>,
  options: { kind?: ApiLogKind } = {},
): RouteHandler<Ctx> {
  const kind = options.kind ?? 'route'
  return async (req, ctx) => {
    const env = getServerEnv()
    const url = new URL(req.url)
    const meta = requestMetaFromHeaders(req.headers, req.method, url.pathname, env.IP_HASH_SALT)
    const startedAt = performance.now()

    try {
      const res = await handler(req, ctx)
      finishLog(kind, name, meta, startedAt, { status: res.status }, req.headers)
      return res
    } catch (err) {
      if (err instanceof HttpError) {
        finishLog(
          kind,
          name,
          meta,
          startedAt,
          {
            status: err.status,
            errorCode: err.code,
            errorMessage: err.message,
          },
          req.headers,
        )
        return err.toResponse()
      }
      finishLog(
        kind,
        name,
        meta,
        startedAt,
        {
          status: 500,
          errorCode: errorCodeOf(err),
          errorMessage: errorMessageOf(err),
        },
        req.headers,
      )
      throw err
    }
  }
}

/**
 * Wrap a Server Action. Input is summarised (masked, bounded) into the log row.
 *
 *   export const submitContact = withAction('contact.submit', async (input: ContactInput) => { ... })
 */
export function withAction<Input, Output>(
  name: string,
  fn: (input: Input) => Promise<Output>,
): (input: Input) => Promise<Output> {
  return async (input) => {
    const env = getServerEnv()
    const h = await nextHeaders()
    const path = h.get('x-invoke-path') || h.get('referer')?.replace(/^https?:\/\/[^/]+/, '') || '/'
    const meta = requestMetaFromHeaders(h, 'ACTION', path, env.IP_HASH_SALT)
    const startedAt = performance.now()
    const inputSummary = summarizeInput(input)

    try {
      const out = await fn(input)
      finishLog('action', name, meta, startedAt, { status: 200, inputSummary }, h)
      return out
    } catch (err) {
      const status = err instanceof HttpError ? err.status : 500
      finishLog(
        'action',
        name,
        meta,
        startedAt,
        {
          status,
          inputSummary,
          errorCode: errorCodeOf(err),
          errorMessage: errorMessageOf(err),
        },
        h,
      )
      throw err
    }
  }
}
