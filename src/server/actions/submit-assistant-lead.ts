'use server'

import { cookies, headers } from 'next/headers'
import { getPayload } from 'payload'
import { Resend } from 'resend'
import { z } from 'zod'
import config from '@payload-config'
import type { NeedOption } from '@/content/contact'
import { SESSION_COOKIE, VISITOR_COOKIE, isValidVisitorId, parseSessionCookie } from '@/lib/session'
import { whatsappLink } from '@/lib/whatsapp'
import { runAfter } from '@/server/after'
import { leadEmail } from '@/server/email/notify'
import { getServerEnv } from '@/server/env'
import { logger } from '@/server/logging/logger'
import { requestMetaFromHeaders } from '@/server/logging/request-meta'
import { HttpError, withAction } from '@/server/logging/with-logging'
import { contactLimiterByIp } from '@/server/rate-limit'
import { getSiteSettings } from '@/server/site-data'

/**
 * The short "share your details" form inside the Ask-us chat (docs/architecture.md, section 4.8).
 * Name and WhatsApp are enough; email is optional. The chat transcript goes into the lead's
 * details so the follow-up starts with context.
 */

const turn = z.object({ role: z.enum(['user', 'assistant']), content: z.string().trim().min(1).max(1000) })

const schema = z.object({
  chatId: z.string().regex(/^[A-Za-z0-9_-]{8,40}$/),
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\+?[\d\s-]{10,16}$/, 'Enter a valid WhatsApp number with 10 digits'),
  email: z.email('Please enter a valid email').max(120).optional().or(z.literal('')),
  path: z.string().max(200).optional(),
  transcript: z.array(turn).max(12),
  // Honeypot: real users never fill this.
  website: z.string().max(0).optional().or(z.literal('')),
})

export type AssistantLeadInput = z.infer<typeof schema>
export type AssistantLeadFieldErrors = Partial<Record<'name' | 'whatsapp' | 'email', string>>
export type AssistantLeadState =
  | { status: 'idle' }
  | { status: 'error'; message: string; fieldErrors?: AssistantLeadFieldErrors }
  | { status: 'success'; name: string; whatsappUrl: string }

const NEED_HINTS: [RegExp, NeedOption][] = [
  [/\b(booking|appointment|salon|clinic|doctor|spa|slot)/i, 'Booking Website'],
  [/\b(landing|one.?page|campaign|ad page)/i, 'Landing Page'],
  [/\b(ai|chatbot|assistant|gpt)\b/i, 'AI Integration'],
  [/\b(automation|automate|reminder|whatsapp message|workflow)/i, 'Automation'],
  [/\b(mobile app|android|ios|play store)/i, 'Mobile App'],
  [/\b(web app|dashboard|portal|crm|erp|software|system)/i, 'Web Application'],
]

/** Best guess at what the visitor wants, from their own words in the chat. */
export async function pickNeed(transcript: { role: string; content: string }[]): Promise<NeedOption> {
  const said = transcript
    .filter((t) => t.role === 'user')
    .map((t) => t.content)
    .join(' ')
  for (const [re, need] of NEED_HINTS) if (re.test(said)) return need
  return 'Website'
}

function transcriptText(transcript: { role: string; content: string }[], path: string): string {
  const lines = transcript.map((t) => `${t.role === 'user' ? 'Visitor' : 'Assistant'}: ${t.content}`)
  return `Via the Ask-us chat on ${path}.\n\n${lines.join('\n\n')}`.slice(0, 4000)
}

const submitInner = withAction(
  'assistant.lead',
  async (raw: AssistantLeadInput): Promise<AssistantLeadState> => {
    const env = getServerEnv()
    const h = await headers()
    const path = raw.path && raw.path.startsWith('/') ? raw.path : '/'
    const meta = requestMetaFromHeaders(h, 'ACTION', path, env.IP_HASH_SALT)

    if (meta.ipHash && !contactLimiterByIp.check(meta.ipHash).ok) {
      throw new HttpError(429, 'RATE_LIMITED', 'Too many submissions. Please try again in a few minutes.')
    }

    const parsed = schema.safeParse(raw)
    if (!parsed.success) {
      const fieldErrors: AssistantLeadFieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if ((key === 'name' || key === 'whatsapp' || key === 'email') && !fieldErrors[key])
          fieldErrors[key] = issue.message
      }
      return { status: 'error', message: 'Please check the highlighted fields.', fieldErrors }
    }
    const input = parsed.data
    const settings = await getSiteSettings()
    const need = await pickNeed(input.transcript)
    const whatsappUrl = whatsappLink(
      settings.whatsappNumber,
      `Hi KAPOSA FUTEXI, I'm ${input.name}. I was chatting on your website about: ${need}.`,
    )

    if (input.website) {
      logger.warn({ requestId: meta.requestId }, 'assistant lead honeypot triggered')
      return { status: 'success', name: input.name, whatsappUrl }
    }

    const cookieStore = await cookies()
    const vidCookie = cookieStore.get(VISITOR_COOKIE)?.value ?? undefined
    const visitorId = isValidVisitorId(vidCookie) ? vidCookie : undefined
    const session = parseSessionCookie(cookieStore.get(SESSION_COOKIE)?.value)

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

    const details = transcriptText(input.transcript, path)
    const lead = await payload.create({
      collection: 'leads',
      overrideAccess: true,
      depth: 0,
      data: {
        name: input.name,
        email: input.email || undefined,
        whatsapp: input.whatsapp,
        need,
        details,
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
              path,
              props: { where: 'assistant', need, leadId: lead.id, chatId: input.chatId },
            },
          })
        }
        if (env.RESEND_API_KEY) {
          const resend = new Resend(env.RESEND_API_KEY)
          const mail = leadEmail({
            id: lead.id,
            createdAt: new Date(lead.createdAt),
            siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? '',
            name: input.name,
            email: input.email || 'not given (chat lead)',
            whatsapp: input.whatsapp,
            need,
            details,
            source: {
              utmSource: visitor?.firstUtm?.source ?? undefined,
              referrer: visitor?.firstReferrer ?? undefined,
              landingPath: visitor?.firstLandingPath ?? undefined,
            },
          })
          await resend.emails.send({
            from: env.LEAD_FROM_EMAIL ?? 'KAPOSA FUTEXI <onboarding@resend.dev>',
            to: [env.LEAD_NOTIFY_EMAIL ?? settings.email],
            ...(input.email ? { replyTo: input.email } : {}),
            subject: `[Chat] ${mail.subject}`,
            html: mail.html,
            text: mail.text,
          })
        } else {
          logger.info({ leadId: lead.id }, 'assistant lead created (email disabled: RESEND_API_KEY not set)')
        }
      } catch (err) {
        logger.warn({ err, leadId: lead.id }, 'assistant lead post-processing failed')
      }
    })

    return { status: 'success', name: input.name, whatsappUrl }
  },
)

export async function submitAssistantLead(input: AssistantLeadInput): Promise<AssistantLeadState> {
  try {
    return await submitInner(input)
  } catch (err) {
    if (err instanceof HttpError && err.expose) return { status: 'error', message: err.message }
    return { status: 'error', message: 'Something went wrong. Please try again or message us on WhatsApp.' }
  }
}
