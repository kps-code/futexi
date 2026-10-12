/* Payload REST API, wrapped so every call is logged (docs/architecture.md §3.3). */
import config from '@payload-config'
import '@payloadcms/next/css'
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes'
import { withRoute } from '@/server/logging/with-logging'

type Ctx = { params: Promise<{ slug: string[] }> }
const opts = { kind: 'payload' as const }

export const GET = withRoute<Ctx>('payload.rest.get', REST_GET(config), opts)
export const POST = withRoute<Ctx>('payload.rest.post', REST_POST(config), opts)
export const DELETE = withRoute<Ctx>('payload.rest.delete', REST_DELETE(config), opts)
export const PATCH = withRoute<Ctx>('payload.rest.patch', REST_PATCH(config), opts)
export const PUT = withRoute<Ctx>('payload.rest.put', REST_PUT(config), opts)
export const OPTIONS = REST_OPTIONS(config)
