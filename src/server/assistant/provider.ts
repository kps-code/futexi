import 'server-only'
import { logger } from '@/server/logging/logger'
import { QUOTE_FORM_TOKEN } from './knowledge'
import { hasTamilScript } from './lang'

/**
 * Chat model access for the Ask-us assistant (docs/architecture.md, section 4.8).
 *
 * Talks to any OpenAI-compatible `/chat/completions` endpoint (NVIDIA NIM free tier today).
 * Models are tried in order until one starts answering: a 404/410 (model not on this account
 * or retired), 429, 5xx, network error, empty answer or a slow first token all move on to the
 * next model. The caller gets a stream of text deltas and never waits longer than the
 * configured budget for the first token. When every model fails the route falls back to the
 * scripted replies in ./fallback.ts, so a provider outage never shows the visitor an error.
 */

export type ChatRole = 'system' | 'user' | 'assistant'
export type ChatMessage = { role: ChatRole; content: string }

export type ChatInput = {
  messages: ChatMessage[]
  /** Hard cap on reply length. Keeps every call small and inside the free tier. */
  maxTokens?: number
  temperature?: number
}

export type AssistantConfig = {
  enabled: boolean
  apiUrl: string
  apiKey: string
  /** Tried in order; the first model that starts answering wins. */
  models: string[]
  /** Total time to wait for a first token across all models. */
  timeoutMs: number
  /** Canned replies, no network. For tests and local UI work. */
  mock: boolean
}

export type AttemptOutcome = 'ok' | 'http' | 'timeout' | 'network' | 'empty'
export type Attempt = { model: string; outcome: AttemptOutcome; status?: number; ms: number }

export type ChatStream = {
  model: string
  attempts: Attempt[]
  /** Text deltas as the model produces them. Ends when the model stops or stalls. */
  deltas: AsyncIterable<string>
}

export type ChatResult = { model: string; text: string; attempts: Attempt[] }

export type Provider = {
  stream(input: ChatInput): Promise<ChatStream>
  complete(input: ChatInput): Promise<ChatResult>
}

export class AssistantUnavailableError extends Error {
  readonly attempts: Attempt[]
  constructor(attempts: Attempt[]) {
    super(
      attempts.length
        ? `No model answered: ${attempts
            .map((a) => `${a.model} ${a.outcome}${a.status ? ` ${a.status}` : ''}`)
            .join('; ')}`
        : 'Assistant is disabled',
    )
    this.name = 'AssistantUnavailableError'
    this.attempts = attempts
  }
}

export const DEFAULT_API_URL = 'https://integrate.api.nvidia.com/v1'
export const DEFAULT_MODEL = 'nvidia/nemotron-3.5-lightning-30b-a3b'
export const DEFAULT_TIMEOUT_MS = 20_000
export const DEFAULT_MAX_TOKENS = 300

/** Smallest first-token budget a model gets when earlier models used up time. */
const MIN_ATTEMPT_MS = 5_000
/** Longest silence tolerated between two deltas once a model has started. */
const STALL_MS = 15_000
/** Safety net: stop reading if a model ignores max_tokens. */
const MAX_RESPONSE_CHARS = 4_000

/** Models that write Tamil script well. Lightning handles Tanglish but garbles Tamil letters. */
const TAMIL_SCRIPT_PREFIXES = ['openai/gpt-oss']

/** Tamil-script messages go to a model that can write Tamil; everything else keeps the configured order. */
export function orderModels(models: readonly string[], lastUserText: string): string[] {
  if (!hasTamilScript(lastUserText)) return [...models]
  const writesTamil = (m: string) => TAMIL_SCRIPT_PREFIXES.some((p) => m.startsWith(p))
  return [...models.filter(writesTamil), ...models.filter((m) => !writesTamil(m))]
}

/**
 * Vendor knobs. Without them lightning spends its tokens "thinking" and gpt-oss reasons until
 * max_tokens runs out and returns nothing visible.
 */
export function modelOptions(model: string): Record<string, unknown> {
  if (model.startsWith('openai/gpt-oss')) return { reasoning_effort: 'low' }
  if (model.includes('nemotron')) return { chat_template_kwargs: { enable_thinking: false } }
  return {}
}

export function lastUserText(messages: readonly ChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') return messages[i].content
  }
  return ''
}

type Opened =
  | { ok: true; deltas: AsyncIterable<string> }
  | { ok: false; outcome: Exclude<AttemptOutcome, 'ok'>; status?: number }

export function createProvider(config: AssistantConfig, fetchImpl: typeof fetch = fetch): Provider {
  async function stream(input: ChatInput): Promise<ChatStream> {
    if (!config.enabled) throw new AssistantUnavailableError([])
    if (config.mock) return mockStream(input)

    const models = orderModels(config.models, lastUserText(input.messages))
    const attempts: Attempt[] = []
    const deadline = Date.now() + config.timeoutMs
    const minAttempt = Math.min(MIN_ATTEMPT_MS, Math.floor(config.timeoutMs / Math.max(1, models.length)))

    for (let i = 0; i < models.length; i++) {
      const model = models[i]
      const remaining = deadline - Date.now()
      const reserve = (models.length - i - 1) * minAttempt
      const budget = Math.min(remaining, Math.max(minAttempt, remaining - reserve))
      if (budget < 250) break

      const started = Date.now()
      const opened = await open(model, input, budget)
      const ms = Date.now() - started
      if (opened.ok) {
        attempts.push({ model, outcome: 'ok', ms })
        return { model, attempts, deltas: opened.deltas }
      }
      attempts.push({ model, outcome: opened.outcome, status: opened.status, ms })
      logger.warn(
        { model, outcome: opened.outcome, status: opened.status, ms },
        'assistant model attempt failed',
      )
    }
    throw new AssistantUnavailableError(attempts)
  }

  async function open(model: string, input: ChatInput, budgetMs: number): Promise<Opened> {
    const controller = new AbortController()
    const firstToken = setTimeout(() => controller.abort(), budgetMs)
    try {
      const res = await fetchImpl(`${config.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${config.apiKey}`,
          'content-type': 'application/json',
          accept: 'text/event-stream',
        },
        body: JSON.stringify({
          model,
          messages: input.messages,
          max_tokens: input.maxTokens ?? DEFAULT_MAX_TOKENS,
          temperature: input.temperature ?? 0.4,
          stream: true,
          ...modelOptions(model),
        }),
        signal: controller.signal,
      })
      if (!res.ok || !res.body) {
        await res.body?.cancel().catch(() => {})
        return { ok: false, outcome: 'http', status: res.status }
      }
      const deltas = sseDeltas(res.body)
      const first = await deltas.next()
      clearTimeout(firstToken)
      if (first.done) return { ok: false, outcome: 'empty', status: res.status }
      return { ok: true, deltas: continueStream(first.value, deltas, controller) }
    } catch {
      clearTimeout(firstToken)
      return { ok: false, outcome: controller.signal.aborted ? 'timeout' : 'network' }
    }
  }

  async function complete(input: ChatInput): Promise<ChatResult> {
    const s = await stream(input)
    let text = ''
    for await (const delta of s.deltas) text += delta
    return { model: s.model, text, attempts: s.attempts }
  }

  return { stream, complete }
}

/** Yields the first delta, then the rest with a stall guard. Mid-stream failures end quietly. */
async function* continueStream(
  first: string,
  rest: AsyncGenerator<string>,
  controller: AbortController,
): AsyncGenerator<string> {
  let total = first.length
  yield first
  try {
    for (;;) {
      const stall = setTimeout(() => controller.abort(), STALL_MS)
      let next: IteratorResult<string>
      try {
        next = await rest.next()
      } catch {
        return
      } finally {
        clearTimeout(stall)
      }
      if (next.done) return
      total += next.value.length
      yield next.value
      if (total >= MAX_RESPONSE_CHARS) return
    }
  } finally {
    controller.abort()
    await rest.return(undefined).catch(() => {})
  }
}

/** Parses a text/event-stream body into content deltas. Stops at `[DONE]` or end of body. */
async function* sseDeltas(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  try {
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      let nl: number
      while ((nl = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, nl).trim()
        buffer = buffer.slice(nl + 1)
        if (!line.startsWith('data:')) continue
        const data = line.slice(5).trim()
        if (data === '[DONE]') return
        const text = deltaText(data)
        if (text) yield text
      }
    }
  } finally {
    await reader.cancel().catch(() => {})
  }
}

function deltaText(data: string): string {
  try {
    const json: unknown = JSON.parse(data)
    if (!json || typeof json !== 'object') return ''
    const choices = (json as { choices?: unknown }).choices
    if (!Array.isArray(choices) || !choices[0] || typeof choices[0] !== 'object') return ''
    const delta = (choices[0] as { delta?: unknown }).delta
    if (!delta || typeof delta !== 'object') return ''
    const content = (delta as { content?: unknown }).content
    return typeof content === 'string' ? content : ''
  } catch {
    return ''
  }
}

/** Deterministic replies for tests and local UI work. Word by word, so streaming UI is exercised. */
function mockStream(input: ChatInput): ChatStream {
  const last = lastUserText(input.messages)
  const wantsForm = /\b(quote|call ?back|start|proceed)\b|\b\d{10}\b/i.test(last)
  const text = wantsForm
    ? `Great, share your details below and we reply within one working day.\n${QUOTE_FORM_TOKEN}`
    : `Mock reply to "${last.slice(0, 80)}". We build fast websites and small AI tools for local businesses; see /services or message us on WhatsApp.`
  async function* deltas() {
    for (const word of text.split(/(?<=\s)/)) yield word
  }
  return { model: 'mock', attempts: [{ model: 'mock', outcome: 'ok', ms: 0 }], deltas: deltas() }
}
