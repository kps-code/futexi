'use server'

import { cookies, headers } from 'next/headers'
import { getPayload } from 'payload'
import { z } from 'zod'
import config from '@payload-config'
import type { DemoLead } from '@/payload-types'
import { businessById, enquiryBusinessIds } from '@/content/demo-businesses'
import { isValidVisitorId, parseSessionCookie, SESSION_COOKIE, VISITOR_COOKIE } from '@/lib/session'
import { whatsappLink } from '@/lib/whatsapp'
import { runAfter } from '@/server/after'
import { getServerEnv } from '@/server/env'
import { logger } from '@/server/logging/logger'
import { requestMetaFromHeaders } from '@/server/logging/request-meta'
import { HttpError, withAction } from '@/server/logging/with-logging'
import { createLimiter } from '@/server/rate-limit'
import { getSiteSettings } from '@/server/site-data'

const limiter = createLimiter(6, 10 * 60_000)

const schema = z.object({
  business: z.enum(enquiryBusinessIds),
  name: z.string().trim().min(2, 'Please enter your name').max(60),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s-]{10,16}$/, 'Enter a valid WhatsApp number with 10 digits'),
  interest: z.string().trim().min(1, 'Please choose one').max(80),
  details: z.string().trim().max(1000).optional().or(z.literal('')),
  transcript: z
    .array(z.object({ role: z.enum(['user', 'assistant']), text: z.string().max(600) }))
    .max(40)
    .optional(),
  website: z.string().max(0).optional().or(z.literal('')), // honeypot
})

export type DemoLeadInput = z.infer<typeof schema>
export type DemoLeadResult =
  | { status: 'error'; message: string; fieldErrors?: Partial<Record<keyof DemoLeadInput, string>> }
  | { status: 'success'; reference: string; whatsappUrl: string; name: string }

const PREFIX: Record<(typeof enquiryBusinessIds)[number], string> = {
  'ai-business': 'PF',
  interior: 'AN',
  tuition: 'VA',
}

function makeReference(prefix: string): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  return `${prefix}-${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')}`
}

const inner = withAction('demo.lead.create', async (input: DemoLeadInput): Promise<DemoLeadResult> => {
  const env = getServerEnv()
  const h = await headers()
  const business = businessById(input.business)
  const meta = requestMetaFromHeaders(h, 'ACTION', business?.path ?? '/demo', env.IP_HASH_SALT)
  if (meta.ipHash && !limiter.check(meta.ipHash).ok) {
    throw new HttpError(429, 'RATE_LIMITED', 'Too many requests from this device. Please try again later.')
  }
  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof DemoLeadInput, string>> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof DemoLeadInput | undefined
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return { status: 'error', message: 'Please check the highlighted fields.', fieldErrors }
  }
  const data = parsed.data
  if (!business) return { status: 'error', message: 'Unknown business.' }

  const settings = await getSiteSettings()
  const whatsappUrl = whatsappLink(
    settings.whatsappNumber,
    `${business.whatsappIntro}: ${data.interest}. Name: ${data.name}, WhatsApp: ${data.phone}.${data.details ? ` Message: ${data.details.slice(0, 200)}` : ''}`,
  )
  const reference = makeReference(PREFIX[data.business])

  // Honeypot: look successful, store nothing.
  if (data.website) {
    logger.warn({ requestId: meta.requestId }, 'demo lead honeypot triggered')
    return { status: 'success', reference, whatsappUrl, name: data.name }
  }

  const cookieStore = await cookies()
  const vid = cookieStore.get(VISITOR_COOKIE)?.value ?? h.get('x-kf-vid') ?? undefined
  const visitorId = isValidVisitorId(vid) ? vid : undefined
  const session = parseSessionCookie(cookieStore.get(SESSION_COOKIE)?.value ?? h.get('x-kf-sid'))

  const payload = await getPayload({ config })
  await payload.create({
    collection: 'demo-leads',
    overrideAccess: true,
    depth: 0,
    data: {
      business: data.business as DemoLead['business'],
      interest: data.interest,
      name: data.name,
      phone: data.phone,
      details: data.details || undefined,
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
            path: business.path,
            props: { demo: data.business, interest: data.interest },
          },
        })
        .catch(() => undefined),
    )
  }

  return { status: 'success', reference, whatsappUrl, name: data.name }
})

export async function createDemoLead(input: DemoLeadInput): Promise<DemoLeadResult> {
  try {
    return await inner(input)
  } catch (err) {
    if (err instanceof HttpError && err.expose) return { status: 'error', message: err.message }
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }
}

/** Form action for useActionState (enquiry forms). */
export async function submitDemoEnquiry(
  _prev: DemoLeadResult | null,
  formData: FormData,
): Promise<DemoLeadResult> {
  const get = (k: string) => {
    const v = formData.get(k)
    return typeof v === 'string' ? v : ''
  }
  // Any extra select/input (e.g. studentClass) is folded into the details text.
  const known = new Set(['business', 'name', 'phone', 'interest', 'details', 'website'])
  const extras: string[] = []
  for (const [k, v] of formData.entries()) {
    if (!known.has(k) && typeof v === 'string' && v.trim()) {
      const label = k.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase())
      extras.push(`${label}: ${v.trim()}`)
    }
  }
  const details = [extras.join(' · '), get('details').trim()].filter(Boolean).join('\n')
  return createDemoLead({
    business: get('business') as DemoLeadInput['business'],
    name: get('name'),
    phone: get('phone'),
    interest: get('interest'),
    details,
    website: get('website'),
  })
}
