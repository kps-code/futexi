import { withRoute } from '@/server/logging/with-logging'

export const dynamic = 'force-dynamic'

/** Uptime check. Does not touch the database on purpose. */
export const GET = withRoute('health', async () =>
  Response.json(
    {
      ok: true,
      service: 'futexi',
      time: new Date().toISOString(),
      env: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    },
    { headers: { 'cache-control': 'no-store' } },
  ),
)
