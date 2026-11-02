import { formatIndianPhone, whatsappLink } from '@/lib/whatsapp'
import type { KnowledgeInput } from './knowledge'

/**
 * Scripted replies for when no model answers (provider outage, daily cap reached, AI switched
 * off). Picks the closest FAQ or a price, timeline or contact answer from the same admin data the
 * model reads, so the visitor still gets a true answer and a way to reach us. Plain English only:
 * no model, no translation.
 */

export type ScriptedIntent = 'price' | 'timeline' | 'contact' | 'faq' | 'none'
export type ScriptedReply = { text: string; intent: ScriptedIntent }

const PRICE =
  /\b(price|prices|pricing|cost|costs|rate|rates|charge|charges|budget|quote|quotation|how much|evlo|evvalavu|vilai|rs|rupees?|inr)\b|₹/i
const TIMELINE =
  /\b(how long|how many days|timeline|time ?frame|duration|deliver(y|ed)?|days?|weeks?|months?|evlo naal|naal|eppo|when)\b/i
const CONTACT =
  /\b(whatsapp|call|phone|number|contact|email|mail|reach|talk|speak|pesanum|pesalam|koopid[a-z]*|thodarbu)\b/i
const TIMELINE_FAQ = /\b(long|take|time|deliver|days|weeks)\b/i

const STOP_WORDS = new Set([
  'the',
  'and',
  'are',
  'you',
  'your',
  'our',
  'for',
  'with',
  'this',
  'that',
  'there',
  'any',
  'can',
  'will',
  'what',
  'how',
  'does',
  'did',
  'have',
  'has',
  'from',
  'about',
  'into',
  'than',
  'then',
  'also',
  'just',
  'please',
  'want',
  'need',
  'like',
  'get',
  'oru',
  'enna',
  'epdi',
  'ungal',
  'unga',
  'namma',
  'irukka',
  'iruku',
  'mudiyuma',
  'pannuvinga',
  'panreenga',
  'website',
  'site',
])
const MIN_FAQ_SCORE = 0.5

export function scriptedReply(input: KnowledgeInput, message: string): ScriptedReply {
  const { settings } = input
  const wa = formatIndianPhone(settings.whatsappNumber)
  const link = whatsappLink(settings.whatsappNumber)
  const price = settings.startingPriceText
  const fill = (text: string) => text.replaceAll('{price}', price)
  const text = message.trim()

  if (PRICE.test(text)) {
    return {
      intent: 'price',
      text: `${fill(input.pricing.line)} For an exact figure, tell us what you need on WhatsApp at ${wa} (${link}). ${settings.replyTimeText}`,
    }
  }

  if (TIMELINE.test(text)) {
    const faq = input.faqs.find((f) => TIMELINE_FAQ.test(f.question))
    return {
      intent: 'timeline',
      text: faq
        ? `${fill(faq.answer)} For a date that fits your project, message us on WhatsApp at ${wa} (${link}).`
        : `Timelines depend on the scope. Share what you need on WhatsApp at ${wa} (${link}) and we give you a clear estimate. ${settings.replyTimeText}`,
    }
  }

  if (CONTACT.test(text)) {
    return {
      intent: 'contact',
      text: `You can WhatsApp us at ${wa} (${link}), call ${settings.phone} or email ${settings.email}. ${settings.replyTimeText}`,
    }
  }

  const faq = bestFaq(input.faqs, text)
  if (faq) return { intent: 'faq', text: fill(faq.answer) }

  return {
    intent: 'none',
    text: `Our assistant is taking a short break. For anything about websites, demos or pricing, WhatsApp us at ${wa} (${link}) or use the form at /contact. ${settings.replyTimeText}`,
  }
}

export function bestFaq<T extends { question: string; answer: string }>(
  faqs: readonly T[],
  message: string,
): T | undefined {
  const asked = tokens(message)
  if (!asked.size) return undefined
  let best: T | undefined
  let bestScore = 0
  for (const faq of faqs) {
    const score = overlap(asked, tokens(faq.question))
    if (score > bestScore) {
      best = faq
      bestScore = score
    }
  }
  return bestScore >= MIN_FAQ_SCORE ? best : undefined
}

function tokens(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w)),
  )
}

/** Share of the smaller set found in the other. 1 when one question is contained in the other. */
function overlap(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0
  let hits = 0
  for (const word of a) if (b.has(word)) hits++
  return hits / Math.min(a.size, b.size)
}

/** Shown when one visitor chat has used its message allowance. */
export function chatLimitReply(input: KnowledgeInput): ScriptedReply {
  const { settings } = input
  const wa = formatIndianPhone(settings.whatsappNumber)
  const link = whatsappLink(settings.whatsappNumber)
  return {
    intent: 'none',
    text: `This chat has reached its limit for today. Let us continue on WhatsApp at ${wa} (${link}), where a real person answers. ${settings.replyTimeText}`,
  }
}
