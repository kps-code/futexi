'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import { Resend } from 'resend'
import { z } from 'zod'
import config from '@payload-config'
import { runAfter } from '@/server/after'
import { getServerEnv } from '@/server/env'
import { logger } from '@/server/logging/logger'
import { requestMetaFromHeaders } from '@/server/logging/request-meta'
import { HttpError, withAction } from '@/server/logging/with-logging'
import { feedbackLimiterByIp } from '@/server/rate-limit'
import { getSiteSettings } from '@/server/site-data'

const schema = z.object({
  token: z.string().trim().min(8).max(64),
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  business: z.string().trim().max(120).optional().or(z.literal('')),
  rating: z.coerce.number().int().min(1, 'Please choose a star rating').max(5),
  quote: z
    .string()
    .trim()
    .min(20, 'Please write at least a sentence (20 characters)')
    .max(400, 'Please keep it under 400 characters'),
  consent: z.literal('on', { message: 'Please allow us to show your feedback' }),
  // Honeypot: real users never fill this.
  website: z.string().max(0).optional().or(z.literal('')),
})

export type FeedbackFieldErrors = Partial<Record<keyof z.infer<typeof schema>, string>>

export type FeedbackState =
  | { status: 'idle' }
  | { status: 'error'; message: string; fieldErrors?: FeedbackFieldErrors }
  | { status: 'success'; name: string }

const submitFeedbackInner = withAction(
  'feedback.submit',
  async (raw: Record<string, string>): Promise<FeedbackState> => {
    const env = getServerEnv()
    const h = await headers()
    const meta = requestMetaFromHeaders(h, 'ACTION', '/feedback', env.IP_HASH_SALT)

    if (meta.ipHash && !feedbackLimiterByIp.check(meta.ipHash).ok) {
      throw new HttpError(429, 'RATE_LIMITED', 'Too many submissions. Please try again in a few minutes.')
    }

    const parsed = schema.safeParse(raw)
    if (!parsed.success) {
      const fieldErrors: FeedbackFieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FeedbackFieldErrors | undefined
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message
      }
      return { status: 'error', message: 'Please check the highlighted fields.', fieldErrors }
    }
    const input = parsed.data

    // Honeypot hit: look successful, store nothing.
    if (input.website) {
      logger.warn({ requestId: meta.requestId }, 'feedback honeypot triggered')
      return { status: 'success', name: input.name }
    }

    const payload = await getPayload({ config })
    const found = await payload.find({
      collection: 'testimonials',
      where: { token: { equals: input.token } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const doc = found.docs[0]
    if (!doc) throw new HttpError(404, 'NOT_FOUND', 'This feedback link is not valid.')
    if (doc.submittedAt)
      throw new HttpError(409, 'ALREADY_SUBMITTED', 'Feedback for this link was already received. Thank you!')

    await payload.update({
      collection: 'testimonials',
      id: doc.id,
      overrideAccess: true,
      depth: 0,
      data: {
        name: input.name,
        business: input.business || undefined,
        rating: input.rating,
        quote: input.quote,
        submittedAt: new Date().toISOString(),
        // Stays hidden until a team member reviews it in the admin.
        visible: false,
      },
    })

    runAfter(async () => {
      try {
        if (!env.RESEND_API_KEY) {
          logger.info({ testimonialId: doc.id }, 'feedback received (email disabled: RESEND_API_KEY not set)')
          return
        }
        const settings = await getSiteSettings()
        const resend = new Resend(env.RESEND_API_KEY)
        await resend.emails.send({
          from: env.LEAD_FROM_EMAIL ?? 'KAPOSA FUTEXI <onboarding@resend.dev>',
          to: [env.LEAD_NOTIFY_EMAIL ?? settings.email],
          subject: `New feedback: ${input.name}${input.business ? ` · ${input.business}` : ''} · ${input.rating}/5`,
          text: [
            `Name: ${input.name}`,
            `Business: ${input.business || '-'}`,
            `Rating: ${input.rating} / 5`,
            '',
            input.quote,
            '',
            'It is hidden until you tick Visible in the admin:',
            `${process.env.NEXT_PUBLIC_SITE_URL}/admin/collections/testimonials/${doc.id}`,
          ].join('\n'),
        })
      } catch (err) {
        logger.warn({ err, testimonialId: doc.id }, 'feedback notification failed')
      }
    })

    return { status: 'success', name: input.name }
  },
)

/** Form action for useActionState. */
export async function submitFeedback(_prev: FeedbackState, formData: FormData): Promise<FeedbackState> {
  const raw: Record<string, string> = {}
  for (const [k, v] of formData.entries()) {
    if (typeof v === 'string') raw[k] = v
  }
  try {
    return await submitFeedbackInner(raw)
  } catch (err) {
    if (err instanceof HttpError && err.expose) return { status: 'error', message: err.message }
    return { status: 'error', message: 'Something went wrong. Please try again or message us on WhatsApp.' }
  }
}
