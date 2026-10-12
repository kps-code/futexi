import { z } from 'zod'

/** Wire format sent by the client tracker. Every string is bounded. */

const path = z.string().min(1).max(300)
const short = z.string().max(300)
const ts = z.number().int().positive()

export const pageViewItem = z.object({
  type: z.literal('page_view'),
  path,
  title: short.optional(),
  referrer: z.string().max(1000).optional(),
  search: z.string().max(1000).optional(),
  viewportWidth: z.number().int().min(0).max(20000).optional(),
  theme: z.enum(['dark', 'light']).optional(),
  ts,
})

export const pageLeaveItem = z.object({
  type: z.literal('page_leave'),
  path,
  durationMs: z
    .number()
    .int()
    .min(0)
    .max(24 * 60 * 60 * 1000),
  maxScrollPct: z.number().int().min(0).max(100),
  ts,
})

export const eventNames = [
  'cta_click',
  'whatsapp_click',
  'demo_open',
  'demo_filter',
  'ai_demo_chip',
  'theme_toggle',
  'form_start',
  'form_submit',
  'form_error',
  'outbound_click',
] as const

export const eventItem = z.object({
  type: z.literal('event'),
  name: z.enum(eventNames),
  path,
  props: z.record(z.string().max(40), z.union([z.string().max(200), z.number(), z.boolean()])).optional(),
  ts,
})

export const trackItem = z.discriminatedUnion('type', [pageViewItem, pageLeaveItem, eventItem])

export const trackBatch = z.object({
  items: z.array(trackItem).min(1).max(20),
})

export type TrackItem = z.infer<typeof trackItem>
export type TrackBatch = z.infer<typeof trackBatch>
export type EventName = (typeof eventNames)[number]
