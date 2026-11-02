import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { logger } from '@/server/logging/logger'

/**
 * Site-wide daily message cap (docs/architecture.md, section 4.8). Every answered message writes
 * one `assistant_message` event; this counter reads today's total from the events table at most
 * once a minute per server instance and counts locally in between. Approximate by design: a few
 * messages over the cap on a busy day is fine, a database read per message is not.
 */
const REFRESH_MS = 60_000

type Counter = { day: string; count: number; fetchedAt: number }
let counter: Counter | undefined

/** Calendar day in India, where the business and almost all visitors are. */
export function indiaDay(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(now)
}

function startOfIndiaDay(day: string): string {
  // en-CA gives YYYY-MM-DD; India is UTC+05:30 all year.
  return new Date(`${day}T00:00:00+05:30`).toISOString()
}

export async function todaysMessageCount(now = new Date()): Promise<number> {
  const day = indiaDay(now)
  if (counter && counter.day === day && now.getTime() - counter.fetchedAt < REFRESH_MS) return counter.count
  try {
    const payload = await getPayload({ config })
    const { totalDocs } = await payload.count({
      collection: 'events',
      overrideAccess: true,
      where: {
        and: [
          { name: { equals: 'assistant_message' } },
          { createdAt: { greater_than_equal: startOfIndiaDay(day) } },
        ],
      },
    })
    counter = { day, count: totalDocs, fetchedAt: now.getTime() }
  } catch (err) {
    logger.warn({ err }, 'assistant daily count failed; using local counter')
    if (!counter || counter.day !== day) counter = { day, count: 0, fetchedAt: now.getTime() }
  }
  return counter.count
}

/** Call after a message is answered so the local count moves before the next refresh. */
export function noteMessageAnswered(now = new Date()): void {
  const day = indiaDay(now)
  if (!counter || counter.day !== day) counter = { day, count: 0, fetchedAt: 0 }
  counter.count++
}

/** Test hook. */
export function resetDailyCounter(): void {
  counter = undefined
}
