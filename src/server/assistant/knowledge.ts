import { budgetOptions } from '@/content/contact'
import { demos, type Demo } from '@/content/demos'
import { faq, homeFaqCount } from '@/content/faq'
import { howWeWork, pricing, technology, whyUs } from '@/content/home'
import { services } from '@/content/services'
import { brand, contactDefaults } from '@/content/site'
import { formatIndianPhone } from '@/lib/whatsapp'

/**
 * Knowledge sheet for the site assistant (docs/architecture.md §4.9). Everything the model may
 * say about KAPOSA FUTEXI comes from here: site content files plus the admin-editable globals.
 * `buildKnowledge` is pure so unit tests and the preview script can run it without a database;
 * `load-knowledge.ts` fills the input from Payload.
 */

export const ASSISTANT_DEFAULT_NAME = 'KAPOSA Assistant'
/** The model ends a reply with this token when the visitor wants a quote; the UI opens the form. */
export const QUOTE_FORM_TOKEN = '[OPEN_QUOTE_FORM]'

export type KnowledgeSettings = {
  phone: string
  whatsappNumber: string
  email: string
  replyTimeText: string
  startingPriceText: string
  city: string
  region: string
  serviceAreaText: string
  tagline: string
}
export type KnowledgeFaq = { question: string; answer: string }
export type KnowledgeDemo = Pick<
  Demo,
  'slug' | 'title' | 'category' | 'line' | 'status' | 'liveHref' | 'automation'
>
export type KnowledgePricing = {
  line: string
  note: { title: string; body: string }
  setups: readonly { title: string; bestFor: string; items: readonly string[] }[]
}
export type KnowledgeInput = {
  assistantName?: string
  siteUrl?: string
  settings: KnowledgeSettings
  faqs: readonly KnowledgeFaq[]
  demos: readonly KnowledgeDemo[]
  pricing: KnowledgePricing
  howWeWork: readonly { title: string; line: string }[]
  whyUs: readonly { title: string; line: string }[]
  technology: readonly string[]
  about?: string
  /** Free text the owners type in the admin: offers, holidays, rules. Read as instructions. */
  extraNotes?: string
}

/** Input built from the content files alone: used by tests, the preview and as a fallback. */
export function defaultKnowledgeInput(): KnowledgeInput {
  return {
    settings: {
      phone: contactDefaults.phoneDisplay,
      whatsappNumber: contactDefaults.whatsappNumber,
      email: contactDefaults.email,
      replyTimeText: contactDefaults.replyTimeText,
      startingPriceText: contactDefaults.startingPriceText,
      city: contactDefaults.city,
      region: contactDefaults.region,
      serviceAreaText: contactDefaults.serviceAreaText,
      tagline: brand.tagline,
    },
    faqs: faq.slice(0, Math.max(homeFaqCount, faq.length)).map((f) => ({ question: f.q, answer: f.a })),
    demos,
    pricing,
    howWeWork: howWeWork.steps,
    whyUs: whyUs.cards,
    technology: technology.items,
  }
}

const price = (text: string, settings: KnowledgeSettings) =>
  text.replace('{price}', settings.startingPriceText)
const bullet = (lines: readonly string[]) => lines.map((l) => `- ${l}`).join('\n')

/** Builds the system prompt: a compact, factual sheet followed by the behaviour rules. */
export function buildKnowledge(input: KnowledgeInput): string {
  const { settings } = input
  const name = input.assistantName?.trim() || ASSISTANT_DEFAULT_NAME
  const wa = formatIndianPhone(settings.whatsappNumber)
  const live = input.demos.filter((d) => d.status === 'live')
  const soon = input.demos.filter((d) => d.status !== 'live')

  const sections: string[] = []

  sections.push(
    `# Who we are
${brand.name} is a web and AI agency in ${settings.city}, ${settings.region}. ${settings.serviceAreaText}.
Tagline: "${settings.tagline}". Positioning: ${brand.positioning}.${input.about ? `\n${input.about}` : ''}`,
  )

  sections.push(
    `# What we build
${services
  .map((s) => `## ${s.title}\n${s.outcome}\nIncludes: ${s.included.join(', ')}.\nGood for: ${s.goodFor}`)
  .join('\n')}`,
  )

  sections.push(
    `# Pricing (the only numbers you may quote)
${price(input.pricing.line, settings)}
${input.pricing.note.title} ${input.pricing.note.body}
Typical setups:
${input.pricing.setups.map((s) => `- ${s.title} (best for: ${s.bestFor}): ${s.items.join(', ')}`).join('\n')}
Budget ranges on our contact form: ${budgetOptions.join(', ')}.
There is no fixed price list. Every quote is written for the visitor's scope after a short chat or call.`,
  )

  sections.push(
    `# Demos (sample websites we built to show our work; they are examples, not packages)
${live
  .map(
    (d) =>
      `- ${d.title} (${d.category}): ${d.line} Live demo: ${d.liveHref ?? `/demos/${d.slug}`}. Case study: /demos/${d.slug}. ${d.automation}`,
  )
  .join('\n')}${soon.length ? `\nComing soon: ${soon.map((d) => d.title).join(', ')}.` : ''}`,
  )

  sections.push(
    `# How we work\n${input.howWeWork.map((s, i) => `${i + 1}. ${s.title}: ${s.line}`).join('\n')}`,
  )
  sections.push(`# Why us\n${bullet(input.whyUs.map((c) => `${c.title}: ${c.line}`))}`)
  sections.push(`# Technology\n${input.technology.join(', ')}.`)
  sections.push(
    `# FAQ\n${input.faqs.map((f) => `Q: ${f.question}\nA: ${price(f.answer, settings)}`).join('\n')}`,
  )

  sections.push(
    `# Contact
WhatsApp: ${wa} (link: https://wa.me/${settings.whatsappNumber}). Phone: ${settings.phone}. Email: ${settings.email}.
${settings.replyTimeText} Contact page: /contact. Services: /services. All demos: /demos. Pricing section: /#pricing.`,
  )

  if (input.extraNotes?.trim()) {
    sections.push(
      `# Notes from the team (follow these, they override anything above)\n${input.extraNotes.trim()}`,
    )
  }

  sections.push(
    `# Rules
1. You are ${name}, the assistant on the ${brand.name} website. Speak as "we".
2. Only talk about ${brand.name}: our services, demos, pricing approach, process, timelines and contact. For anything else, say in one line that you can only help with ${brand.name} and offer WhatsApp.
3. Use only facts from this sheet. Never invent prices, discounts, delivery dates, client names or features. Never say we do not offer something unless this sheet says so: anything not listed (for example an online store with payments) is custom work, so say we can discuss it on WhatsApp.
4. You are an AI assistant, not a person. Never claim to be a person or a team member, and never say "I will call you". If asked who we are, who runs it, who the founders are or how many people we have: first line "We are a Chennai-based team of software engineers who build websites and AI products.", then list up to 5 things we build from the sheet, last line point to /about. Say nothing else about the team: never give names or a head count, and never describe how the team works or is organised.
5. Prices: quote only "${settings.startingPriceText}" and the pricing text above. For an exact price say we send a clear quote after a short chat.
6. Timelines: only what the FAQ says. Otherwise say it depends on scope. A demo's features describe that sample, not what a visitor's quote includes.
7. Language: reply in the visitor's language and script. Tamil script in, Tamil script out. Tanglish (Tamil in English letters) in: reply in short, simple English; at most one or two Tanglish words such as "sari" or "pannalam", never whole Tamil sentences in English letters. English in, English out.
8. Format every answer the same way. First line: the direct answer in one sentence. Then, when there is anything to list (services, demos, steps, what is included, prices), up to 5 short lines, each starting with "• " followed by a name and 3 to 8 words or a link. Last line: one short next step or one question. Under 90 words. No markdown: no **, no #, no backticks, no numbered lists. When you give a link, add a few words of context, never a bare link.
9. Links: use only site paths from this sheet (for example /services, /contact, /demos, or a demo path listed above) or the WhatsApp link. Write them plainly, no markdown.
10. Only when the visitor clearly asks for a quote or a call back, says they want to start, or shares a phone number: reply with one short sentence (for example "Great, share your details below and we reply within one working day.") and put ${QUOTE_FORM_TOKEN} alone on the last line. The website turns it into a short form. Do not ask for their details yourself. Never use the token for ordinary price or timeline questions.
11. Be warm and direct. No emoji unless the visitor uses them first.`,
  )

  return sections.join('\n\n')
}
