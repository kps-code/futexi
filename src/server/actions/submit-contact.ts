'use server'

import { cookies, headers } from 'next/headers'
import { getPayload } from 'payload'
import { Resend } from 'resend'
import { z } from 'zod'
import config from '@payload-config'
import { budgetOptions, needOptions } from '@/content/contact'
import { parseSessionCookie, SESSION_COOKIE, VISITOR_COOKIE, isValidVisitorId } from '@/lib/session'
import { whatsappLink } from '@/lib/whatsapp'
import { runAfter } from '@/server/after'
import { getServerEnv } from '@/server/env'
import { logger } from '@/server/logging/logger'
import { requestMetaFromHeaders } from '@/server/logging/request-meta'
import { HttpError, withAction } from '@/server/logging/with-logging'
import { contactLimiterByIp } from '@/server/rate-limit'
import { getSiteSettings } from '@/server/site-data'

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  businessName: z.string().trim().max(120).optional().or(z.literal('')),
  email: z.email('Please enter a valid email').max(120),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\+?[\d\s-]{10,16}$/, 'Enter a valid WhatsApp number with 10 digits'),
  businessType: z.string().trim().max(80).optional().or(z.literal('')),
  need: z.enum(needOptions, { message: 'Please choose what you need' }),
  budget: z.enum(budgetOptions).optional().or(z.literal('')),
  details: z.string().trim().max(2000).optional().or(z.literal('')),
  // Honeypot: real users never fill this.
  website: z.string().max(0).optional().or(z.literal('')),
})

export type ContactFieldErrors = Partial<Record<keyof z.infer<typeof schema>, string>>

export type ContactState =
  | { status: 'idle' }
  | { status: 'error'; message: string; fieldErrors?: ContactFieldErrors }
  | { status: 'success'; name: string; whatsappUrl: string }

const submitContactInner = withAction(
  'contact.submit',
  async (raw: Record<string, string>): Promise<ContactState> => {
    const env = getServerEnv()
    const h = await headers()
    const meta = requestMetaFromHeaders(h, 'ACTION', '/contact', env.IP_HASH_SALT)

    if (meta.ipHash && !contactLimiterByIp.check(meta.ipHash).ok) {
      throw new HttpError(429, 'RATE_LIMITED', 'Too many submissions. Please try again in a few minutes.')
    }

    const parsed = schema.safeParse(raw)
    if (!parsed.success) {
      const fieldErrors: ContactFieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactFieldErrors | undefined
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message
      }
      return { status: 'error', message: 'Please check the highlighted fields.', fieldErrors }
    }
    const input = parsed.data
    const settings = await getSiteSettings()

    const summary = [
      `Hi KAPOSA FUTEXI, I'm ${input.name}${input.businessName ? ` from ${input.businessName}` : ''}.`,
      `I need: ${input.need}.`,
      input.budget ? `Budget: ${input.budget}.` : null,
      input.details ? `Details: ${input.details.slice(0, 300)}` : null,
    ]
      .filter(Boolean)
      .join(' ')
    const whatsappUrl = whatsappLink(settings.whatsappNumber, summary)

    // Honeypot hit: look successful, store nothing.
    if (input.website) {
      logger.warn({ requestId: meta.requestId }, 'contact honeypot triggered')
      return { status: 'success', name: input.name, whatsappUrl }
    }

    const cookieStore = await cookies()
    const vidCookie = cookieStore.get(VISITOR_COOKIE)?.value ?? h.get('x-kf-vid') ?? undefined
    const visitorId = isValidVisitorId(vidCookie) ? vidCookie : undefined
    const session = parseSessionCookie(cookieStore.get(SESSION_COOKIE)?.value ?? h.get('x-kf-sid'))

    const payload = await getPayload({ config })

    const visitor = visitorId
      ? (
          await payload.find({
            collection: 'visitors',
            where: { visitorId: { equals: visitorId } },
            limit: 1,
            depth: 0,
            overrideAccess: true,
          })
        ).docs[0]
      : undefined

    const lead = await payload.create({
      collection: 'leads',
      overrideAccess: true,
      depth: 0,
      data: {
        name: input.name,
        businessName: input.businessName || undefined,
        email: input.email,
        whatsapp: input.whatsapp,
        businessType: input.businessType || undefined,
        need: input.need,
        budget: input.budget || undefined,
        details: input.details || undefined,
        status: 'new',
        visitorId,
        source: {
          utmSource: visitor?.firstUtm?.source ?? undefined,
          utmMedium: visitor?.firstUtm?.medium ?? undefined,
          utmCampaign: visitor?.firstUtm?.campaign ?? undefined,
          referrer: visitor?.firstReferrer ?? undefined,
          landingPath: visitor?.firstLandingPath ?? undefined,
        },
      },
    })

    runAfter(async () => {
      try {
        if (visitor) {
          await payload.update({
            collection: 'visitors',
            id: visitor.id,
            overrideAccess: true,
            depth: 0,
            data: { lead: lead.id },
          })
        }
        if (visitorId && session) {
          await payload.create({
            collection: 'events',
            overrideAccess: true,
            depth: 0,
            data: {
              visitorId,
              sessionId: session.sessionId,
              name: 'form_submit',
              path: '/contact',
              props: { need: input.need, leadId: lead.id },
            },
          })
        }
        if (env.RESEND_API_KEY) {
          const resend = new Resend(env.RESEND_API_KEY)
          await resend.emails.send({
            from: env.LEAD_FROM_EMAIL ?? 'KAPOSA FUTEXI <onboarding@resend.dev>',
            to: [env.LEAD_NOTIFY_EMAIL ?? settings.email],
            replyTo: input.email,
            subject: `New lead: ${input.name} · ${input.need}`,
            text: [
              `Name: ${input.name}`,
              `Business: ${input.businessName || '-'}`,
              `Email: ${input.email}`,
              `WhatsApp: ${input.whatsapp}`,
              `Business type: ${input.businessType || '-'}`,
              `Need: ${input.need}`,
              `Budget: ${input.budget || '-'}`,
              '',
              input.details || '(no details)',
              '',
              `Open in admin: ${process.env.NEXT_PUBLIC_SITE_URL}/admin/collections/leads/${lead.id}`,
            ].join('\n'),
          })
        } else {
          logger.info({ leadId: lead.id }, 'lead created (email disabled: RESEND_API_KEY not set)')
        }
      } catch (err) {
        logger.warn({ err, leadId: lead.id }, 'lead post-processing failed')
      }
    })

    return { status: 'success', name: input.name, whatsappUrl }
  },
)

/** Form action for useActionState. Converts FormData to a plain object for logging and validation. */
export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw: Record<string, string> = {}
  for (const [k, v] of formData.entries()) {
    if (typeof v === 'string') raw[k] = v
  }
  try {
    return await submitContactInner(raw)
  } catch (err) {
    if (err instanceof HttpError && err.expose) return { status: 'error', message: err.message }
    return { status: 'error', message: 'Something went wrong. Please try again or message us on WhatsApp.' }
  }
}
