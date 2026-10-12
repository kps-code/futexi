import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { CACHE_TAGS } from '@/payload/hooks/revalidate'
import { HttpError, withRoute } from '@/server/logging/with-logging'

export const dynamic = 'force-dynamic'

const body = z.object({ tags: z.array(z.enum(Object.values(CACHE_TAGS) as [string, ...string[]])).min(1) })

/**
 * Development only: lets scripts that write through the Local API (npm run seed)
 * expire the server's tagged caches. Returns 404 in production.
 */
export const POST = withRoute('dev.revalidate', async (req) => {
  if (process.env.NODE_ENV === 'production') throw new HttpError(404, 'NOT_FOUND', 'Not found', false)
  const parsed = body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) throw new HttpError(400, 'VALIDATION_FAILED', 'tags[] required')
  for (const tag of parsed.data.tags) revalidateTag(tag, 'max')
  return Response.json({ ok: true, tags: parsed.data.tags })
})
