'use server'

import { cookies, headers } from 'next/headers'
import { getPayload } from 'payload'
import { z } from 'zod'
import config from '@payload-config'
import type { DemoBooking } from '@/payload-types'
import { novaServiceBySlug, novaServices } from '@/content/demo-booking'
import { formatDateLong, formatInr, formatTime12, isBookable } from '@/lib/booking'
import { isValidVisitorId, parseSessionCookie, SESSION_COOKIE, VISITOR_COOKIE } from '@/lib/session'
import { whatsappLink } from '@/lib/whatsapp'
import { runAfter } from '@/server/after'
import { bookedTimesFor, bookingRules } from '@/server/demo-booking'
import { getServerEnv } from '@/server/env'
import { logger } from '@/server/logging/logger'
import { requestMetaFromHeaders } from '@/server/logging/request-meta'
import { HttpError, withAction } from '@/server/logging/with-logging'
import { createLimiter } from '@/server/rate-limit'
import { getSiteSettings } from '@/server/site-data'

const limiter = createLimiter(10, 10 * 60_000)

const schema = z.object({
  service: z.enum(novaServices.map((s) => s.slug) as [string, ...string[]]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s-]{10,16}$/, 'Enter a valid WhatsApp number with 10 digits'),
  notes: z.string().trim().max(500).optional().or(z.literal('')),
  website: z.string().max(0).optional().or(z.literal('')), // honeypot
})

export type BookingInput = z.infer<typeof schema>

export type BookingResult =
  | {
      status: 'error'
      message: string
      fieldErrors?: Partial<Record<keyof BookingInput, string>>
      slotTaken?: boolean
    }
  | {
      status: 'success'
      reference: string
      summary: { service: string; date: string; time: string; name: string; price: string; minutes: number }
      whatsappUrl: string
    }

function makeReference(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  return `NV-${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')}`
}

const createInner = withAction(
  'demo.booking.create',
  async (raw: Record<string, string>): Promise<BookingResult> => {
    const env = getServerEnv()
    const h = await headers()
    const meta = requestMetaFromHeaders(h, 'ACTION', '/demo/booking/book', env.IP_HASH_SALT)
    if (meta.ipHash && !limiter.check(meta.ipHash).ok) {
      throw new HttpError(
        429,
        'RATE_LIMITED',
        'Too many bookings from this device. Please try again in a few minutes.',
      )
    }

    const parsed = schema.safeParse(raw)
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof BookingInput, string>> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof BookingInput | undefined
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message
      }
      return { status: 'error', message: 'Please check the highlighted fields.', fieldErrors }
    }
    const input = parsed.data
    const service = novaServiceBySlug(input.service)!
    const settings = await getSiteSettings()

    const summary = {
      service: service.name,
      date: formatDateLong(input.date),
      time: formatTime12(input.time),
      name: input.name,
      price: formatInr(service.price),
      minutes: service.minutes,
    }
    const whatsappUrl = whatsappLink(
      settings.whatsappNumber,
      `Booking request (Nova Studio demo): ${summary.service}, ${summary.date} at ${summary.time}. Name: ${input.name}.`,
    )

    // Honeypot: look successful, store nothing.
    if (input.website) {
      logger.warn({ requestId: meta.requestId }, 'demo booking honeypot triggered')
      return { status: 'success', reference: makeReference(), summary, whatsappUrl }
    }

    const now = Date.now()
    const booked = await bookedTimesFor(input.date)
    if (!isBookable(input.date, input.time, booked, now, bookingRules)) {
      return {
        status: 'error',
        message: 'That slot is no longer available. Please pick another time.',
        slotTaken: true,
      }
    }

    const cookieStore = await cookies()
    const vid = cookieStore.get(VISITOR_COOKIE)?.value ?? h.get('x-kf-vid') ?? undefined
    const visitorId = isValidVisitorId(vid) ? vid : undefined
    const session = parseSessionCookie(cookieStore.get(SESSION_COOKIE)?.value ?? h.get('x-kf-sid'))

    const payload = await getPayload({ config })
    const reference = makeReference()
    try {
      await payload.create({
        collection: 'demo-bookings',
        overrideAccess: true,
        depth: 0,
        data: {
          service: input.service as DemoBooking['service'],
          date: input.date,
          time: input.time,
          name: input.name,
          phone: input.phone,
          notes: input.notes || undefined,
          status: 'requested',
          reference,
          visitorId,
        },
      })
    } catch (err) {
      // Two people confirmed the same slot at once: the unique (date, time) index wins.
      logger.info({ err, requestId: meta.requestId }, 'demo booking slot race')
      return {
        status: 'error',
        message: 'Someone just took that slot. Please pick another time.',
        slotTaken: true,
      }
    }

    if (visitorId && session) {
      runAfter(() =>
        payload
          .create({
            collection: 'events',
            overrideAccess: true,
            depth: 0,
            data: {
              visitorId,
              sessionId: session.sessionId,
              name: 'form_submit',
              path: '/demo/booking/book',
              props: { demo: 'booking', service: input.service },
            },
          })
          .catch(() => undefined),
      )
    }

    return { status: 'success', reference, summary, whatsappUrl }
  },
)

export async function createDemoBooking(input: BookingInput): Promise<BookingResult> {
  const raw: Record<string, string> = {}
  for (const [k, v] of Object.entries(input)) if (typeof v === 'string') raw[k] = v
  try {
    return await createInner(raw)
  } catch (err) {
    if (err instanceof HttpError && err.expose) return { status: 'error', message: err.message }
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }
}
