/**
 * Scripted assistant for the AI-Powered Business demo (Pulse Fitness).
 * Keyword intents + a small lead-capture state machine. Pure and testable.
 * No model call at launch (content lock §0); the interface is shaped so a
 * real LLM can replace `respond()` later without touching the UI.
 */

export type ChatMessage = { role: 'user' | 'assistant'; text: string; chips?: readonly string[] }
export type LeadDraft = { interest?: string; name?: string; phone?: string }
export type Stage = 'chat' | 'ask-name' | 'ask-phone' | 'done'
export type AssistantState = { stage: Stage; lead: LeadDraft }

export type Intent =
  | 'greeting'
  | 'plans'
  | 'timings'
  | 'trial'
  | 'classes'
  | 'location'
  | 'trainers'
  | 'parking'
  | 'women'
  | 'cancel'
  | 'thanks'
  | 'unknown'

export const pulseKnowledge = {
  plans:
    'Monthly ₹1,999, Quarterly ₹4,999 (saves 17%) and Annual ₹14,999 with four coach sessions. Every plan includes all classes and equipment, with no joining fee.',
  timings:
    'We are open Monday to Saturday 5:30 AM to 10:30 PM, and Sunday 7:00 AM to 1:00 PM. Least crowded: 10 AM to 4 PM.',
  trial:
    'Your first visit is a free one-day trial: any class plus a 15-minute coach consultation. Just bring shoes and a towel.',
  classes:
    'HIIT (6 and 7 AM, 7 PM), Strength (every hour), Yoga (6:30 AM, 6 PM), Zumba (7:30 PM), Spin (6 AM, 8 PM) and Boxing (7 PM, Tue/Thu/Sat).',
  location: 'Third floor, Phoenix Mall Road, Velachery, Chennai 600042. Two minutes from Velachery MRTS.',
  trainers: 'Eight certified coaches (ACE and K11). Personal training is ₹899 per session or ₹7,999 for ten.',
  parking:
    'Free two-wheeler parking at the building, and car parking in the mall basement with validation at reception.',
  women: 'Women-only floor hours run 11 AM to 1 PM daily, with female coaches on duty.',
  cancel:
    'Pause any plan for up to 30 days a year. Cancel monthly plans any time before the next billing date.',
} as const

// Order matters: specific intents first, broad ones (plans, timings) later.
const RULES: readonly { intent: Intent; words: readonly string[] }[] = [
  {
    intent: 'trial',
    words: [
      'trial',
      'free day',
      'try',
      'first visit',
      'join',
      'sign up',
      'signup',
      'membership start',
      'enrol',
      'enroll',
      'register',
    ],
  },
  { intent: 'women', words: ['women', 'ladies', 'female', 'girls'] },
  { intent: 'parking', words: ['park', 'parking', 'bike', 'car', 'vehicle'] },
  { intent: 'trainers', words: ['trainer', 'coach', 'personal', 'pt', 'certified'] },
  { intent: 'cancel', words: ['cancel', 'pause', 'refund', 'freeze', 'stop'] },
  {
    intent: 'classes',
    words: ['class', 'zumba', 'yoga', 'hiit', 'spin', 'boxing', 'strength', 'cardio', 'schedule', 'group'],
  },
  {
    intent: 'location',
    words: ['where', 'location', 'address', 'velachery', 'map', 'reach', 'near', 'metro', 'mrts'],
  },
  {
    intent: 'plans',
    words: [
      'plan',
      'price',
      'pricing',
      'cost',
      'fee',
      'membership',
      'monthly',
      'annual',
      'quarterly',
      'how much',
      'rate',
    ],
  },
  {
    intent: 'timings',
    words: ['time', 'timing', 'open', 'close', 'hours', 'when', 'sunday', 'morning', 'night', 'crowd'],
  },
  { intent: 'thanks', words: ['thank', 'thanks', 'great', 'ok', 'okay', 'cool', 'super'] },
  { intent: 'greeting', words: ['hi', 'hello', 'hey', 'vanakkam', 'good morning', 'good evening'] },
]

export function detectIntent(text: string): Intent {
  const t = ` ${text
    .toLowerCase()
    .replace(/[^a-z0-9₹ ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `
  if (!t.trim()) return 'unknown'
  for (const r of RULES) {
    if (r.words.some((w) => t.includes(` ${w} `) || t.includes(` ${w}s `) || (w.length > 3 && t.includes(w))))
      return r.intent
  }
  return 'unknown'
}

export const openingMessage: ChatMessage = {
  role: 'assistant',
  text: 'Hi, I am the Pulse assistant. Ask me about plans, timings, classes or the free trial. I can also book your trial right here.',
  chips: ['Plans and pricing', 'Timings', 'Book a free trial', 'Classes', 'Where are you?'],
}

export const initialState: AssistantState = { stage: 'chat', lead: {} }

const FOLLOW_UP_CHIPS = ['Book a free trial', 'Plans and pricing', 'Classes', 'Timings']

export function isValidName(v: string): boolean {
  const t = v.trim()
  return t.length >= 2 && t.length <= 60 && /^[\p{L}][\p{L} .'-]*$/u.test(t)
}

export function isValidPhone(v: string): boolean {
  return /^\+?[\d\s-]{10,16}$/.test(v.trim())
}

export type RespondResult = {
  messages: ChatMessage[]
  state: AssistantState
  /** Set exactly once, when the lead is complete. */
  captured?: { name: string; phone: string; interest: string }
}

function answerFor(intent: Intent): string {
  switch (intent) {
    case 'plans':
      return pulseKnowledge.plans
    case 'timings':
      return pulseKnowledge.timings
    case 'classes':
      return pulseKnowledge.classes
    case 'location':
      return pulseKnowledge.location
    case 'trainers':
      return pulseKnowledge.trainers
    case 'parking':
      return pulseKnowledge.parking
    case 'women':
      return pulseKnowledge.women
    case 'cancel':
      return pulseKnowledge.cancel
    case 'greeting':
      return 'Hello! What would you like to know: plans, timings, classes, or shall I book your free trial?'
    case 'thanks':
      return 'Any time. Want me to book your free trial so you can see the floor yourself?'
    default:
      return 'I may not have that answer yet, but a coach will. Ask me about plans, timings, classes or the free trial, or I can connect you on WhatsApp.'
  }
}

export function respond(state: AssistantState, userText: string): RespondResult {
  const text = userText.trim()
  const user: ChatMessage = { role: 'user', text }

  if (state.stage === 'ask-name') {
    if (isValidName(text)) {
      const lead = { ...state.lead, name: text }
      return {
        messages: [
          user,
          {
            role: 'assistant',
            text: `Nice to meet you, ${text.split(' ')[0]}. What is your WhatsApp number? A coach will confirm your slot there.`,
          },
        ],
        state: { stage: 'ask-phone', lead },
      }
    }
    const intent = detectIntent(text)
    const extra =
      intent !== 'unknown' && intent !== 'greeting' && intent !== 'thanks' ? `${answerFor(intent)} ` : ''
    return {
      messages: [
        user,
        { role: 'assistant', text: `${extra}To book your trial I just need your name first.` },
      ],
      state,
    }
  }

  if (state.stage === 'ask-phone') {
    if (isValidPhone(text)) {
      const lead = { ...state.lead, phone: text }
      const name = lead.name ?? 'there'
      return {
        messages: [
          user,
          {
            role: 'assistant',
            text: `Done, ${name.split(' ')[0]}. Your free trial request is in. A coach will message you on WhatsApp within the hour to fix a time. Anything else I can answer meanwhile?`,
            chips: ['Timings', 'Classes', 'Parking'],
          },
        ],
        state: { stage: 'done', lead },
        captured: { name, phone: text, interest: lead.interest ?? 'Free trial' },
      }
    }
    return {
      messages: [
        user,
        {
          role: 'assistant',
          text: 'That does not look like a WhatsApp number. Please type it with the 10 digits, for example 98765 43210.',
        },
      ],
      state,
    }
  }

  const intent = detectIntent(text)

  if (intent === 'trial' && state.stage !== 'done') {
    return {
      messages: [
        user,
        { role: 'assistant', text: `${pulseKnowledge.trial} Let me book it for you. What is your name?` },
      ],
      state: { stage: 'ask-name', lead: { ...state.lead, interest: 'Free trial' } },
    }
  }

  return {
    messages: [
      user,
      {
        role: 'assistant',
        text: answerFor(intent),
        chips: state.stage === 'done' ? ['Timings', 'Classes', 'Parking'] : FOLLOW_UP_CHIPS,
      },
    ],
    state,
  }
}
