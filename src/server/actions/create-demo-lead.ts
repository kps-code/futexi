'use server'

import { cookies, headers } from 'next/headers'
import { getPayload } from 'payload'
import { z } from 'zod'
import config from '@payload-config'
import { pulse } from '@/content/demo-businesses'
import { isValidVisitorId, parseSessionCookie, SESSION_COOKIE, VISITOR_COOKIE } from '@/lib/session'
import { whatsappLink } from '@/lib/whatsapp'
import { runAfter } from '@/server/after'
import { getServerEnv } from '@/server/env'
import { requestMetaFromHeaders } from '@/server/logging/request-meta'
import { HttpError, withAction } from '@/server/logging/with-logging'
import { createLimiter } from '@/server/rate-limit'
import { getSiteSettings } from '@/server/site-data'

const limiter = createLimiter(6, 10 * 60_000)

const schema = z.object({
  name: z.string().trim().min(2).max(60),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s-]{10,16}$/),
  interest: z.string().trim().min(1).max(60),
  transcript: z.array(z.object({ role: z.enum(['user', 'assistant']), text: z.string().max(600) })).max(40),
})

export type DemoLeadInput = z.infer<typeof schema>
export type DemoLeadResult =
  { status: 'error'; message: string } | { status: 'success'; reference: string; whatsappUrl: string }

function makeReference(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  return `PF-${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')}`
}

const inner = withAction('demo.lead.create', async (input: DemoLeadInput): Promise<DemoLeadResult> => {
  const env = getServerEnv()
  const h = await headers()
  const meta = requestMetaFromHeaders(h, 'ACTION', pulse.path, env.IP_HASH_SALT)
  if (meta.ipHash && !limiter.check(meta.ipHash).ok) {
    throw new HttpError(429, 'RATE_LIMITED', 'Too many requests from this device. Please try again later.')
  }
  const parsed = schema.safeParse(input)
  if (!parsed.success) return { status: 'error', message: 'Please check the name and number.' }
  const data = parsed.data

  const settings = await getSiteSettings()
  const whatsappUrl = whatsappLink(
    settings.whatsappNumber,
    `${pulse.whatsappIntro}: ${data.interest}. Name: ${data.name}, WhatsApp: ${data.phone}.`,
  )

  const cookieStore = await cookies()
  const vid = cookieStore.get(VISITOR_COOKIE)?.value ?? h.get('x-kf-vid') ?? undefined
  const visitorId = isValidVisitorId(vid) ? vid : undefined
  const session = parseSessionCookie(cookieStore.get(SESSION_COOKIE)?.value ?? h.get('x-kf-sid'))

  const payload = await getPayload({ config })
  const reference = makeReference()
  await payload.create({
    collection: 'demo-leads',
    overrideAccess: true,
    depth: 0,
    data: {
      business: 'ai-business',
      interest: data.interest,
      name: data.name,
      phone: data.phone,
      transcript: data.transcript,
      status: 'new',
      reference,
      visitorId,
    },
  })

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
            path: pulse.path,
            props: { demo: 'ai-business', interest: data.interest },
          },
        })
        .catch(() => undefined),
    )
  }

  return { status: 'success', reference, whatsappUrl }
})

export async function createDemoLead(input: DemoLeadInput): Promise<DemoLeadResult> {
  try {
    return await inner(input)
  } catch (err) {
    if (err instanceof HttpError && err.expose) return { status: 'error', message: err.message }
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }
}
