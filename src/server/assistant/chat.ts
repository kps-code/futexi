import 'server-only'
import { getPayload } from 'payload'
import { z } from 'zod'
import config from '@payload-config'
import { runAfter } from '@/server/after'
import { logger } from '@/server/logging/logger'
import { ASSISTANT_CHAT_COUNTER_MAX, assistantChatCounter } from '@/server/rate-limit'
import { getAssistantSettings } from '@/server/site-data'
import { assistantConfigFromEnv } from './config'
import { noteMessageAnswered, todaysMessageCount } from './daily-cap'
import { chatLimitReply, scriptedReply } from './fallback'
import { wantsQuoteForm } from './intent'
import { buildKnowledge, QUOTE_FORM_TOKEN } from './knowledge'
import { loadKnowledgeInput } from './load-knowledge'
import { buildMessages, MAX_HISTORY } from './messages'
import { AssistantUnavailableError, createProvider, type Provider } from './provider'
import { shapeAnswer } from './shape'
import { repetitionCutoff, TokenFilter } from './stream-filter'

/**
 * One visitor message in, one streamed answer out (docs/architecture.md, section 4.8).
 *
 * Order of checks: admin switch, per-chat limit, site-wide daily cap, then the model. Whenever
 * the model cannot be used the visitor still gets a scripted answer from the same knowledge, so
 * the chat never shows an error. Model answers are the only ones that count towards the cap.
 */

export const MAX_REPLY_TOKENS = 300

export const chatRequest = z.object({
  chatId: z.string().regex(/^[A-Za-z0-9_-]{8,40}$/, 'Invalid chat id'),
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().trim().min(1).max(1000),
      }),
    )
    .min(1)
    .max(MAX_HISTORY),
  path: z.string().max(200).optional(),
})
export type ChatRequest = z.infer<typeof chatRequest>

export type ChatContext = {
  visitorId: string
  sessionId: string
  path: string
}

export type ChatSource = 'model' | 'fallback'
export type FallbackReason = 'disabled' | 'chat-limit' | 'daily-cap' | 'unavailable'

export type ChatEvent =
  | { t: string }
  | { replace: string }
  | { done: true; form: boolean; source: ChatSource; model?: string; reason?: FallbackReason }

type Deps = { provider?: Provider; now?: () => number }

export async function* answerChat(
  req: ChatRequest,
  ctx: ChatContext,
  deps: Deps = {},
): AsyncGenerator<ChatEvent> {
  const started = (deps.now ?? Date.now)()
  const lastUser = [...req.messages].reverse().find((m) => m.role === 'user')?.content ?? ''
  const settings = await getAssistantSettings()
  const input = await loadKnowledgeInput({ assistantName: settings.name, extraNotes: settings.extraNotes })

  const finish = (
    text: string,
    source: ChatSource,
    extra: { model?: string; reason?: FallbackReason; form: boolean },
  ) => {
    const ms = (deps.now ?? Date.now)() - started
    logger.info(
      {
        chatId: req.chatId,
        source,
        model: extra.model,
        reason: extra.reason,
        ms,
        chars: text.length,
        form: extra.form,
      },
      'assistant answer',
    )
    if (source === 'model') {
      noteMessageAnswered()
      runAfter(() =>
        recordMessage(req, ctx, { model: extra.model, ms, chars: text.length, form: extra.form }),
      )
    }
  }

  const scripted = (reason: FallbackReason): ChatEvent[] => {
    const reply = reason === 'chat-limit' ? chatLimitReply(input) : scriptedReply(input, lastUser)
    finish(reply.text, 'fallback', { reason, form: false })
    return [{ t: reply.text }, { done: true, form: false, source: 'fallback', reason }]
  }

  if (!settings.enabled) return yield* scripted('disabled')

  const chat = assistantChatCounter.check(req.chatId)
  const usedInChat = ASSISTANT_CHAT_COUNTER_MAX - chat.remaining
  if (!chat.ok || usedInChat > settings.perChatMax) return yield* scripted('chat-limit')

  if (settings.dailyCap <= 0 || (await todaysMessageCount()) >= settings.dailyCap)
    return yield* scripted('daily-cap')

  const provider = deps.provider ?? createProvider(assistantConfigFromEnv())
  const messages = buildMessages(buildKnowledge(input), req.messages, settings.name)

  let stream
  try {
    stream = await provider.stream({ messages, maxTokens: MAX_REPLY_TOKENS })
  } catch (err) {
    if (!(err instanceof AssistantUnavailableError)) throw err
    return yield* scripted('unavailable')
  }

  const filter = new TokenFilter(QUOTE_FORM_TOKEN)
  let text = ''
  let looped = false
  for await (const delta of stream.deltas) {
    const safe = filter.push(delta)
    if (!safe) continue
    text += safe
    yield { t: safe }
    const cut = repetitionCutoff(text)
    if (cut >= 0) {
      // The model is looping: stop reading, keep one copy and tell the client to redraw.
      text = text.slice(0, cut).trimEnd()
      looped = true
      yield { replace: text }
      break
    }
  }
  const tail = looped ? '' : filter.flush()
  if (tail) {
    text += tail
    yield { t: tail }
  }

  if (!text.trim()) {
    // The model connected but said nothing useful: answer from the script instead.
    return yield* scripted('unavailable')
  }

  const shaped = shapeAnswer(text)
  if (shaped !== text.trim()) {
    // The model wrote one paragraph despite the rules: redraw it in the fixed shape.
    yield { replace: shaped }
  }
  text = shaped

  const form = filter.found && wantsQuoteForm(lastUser)
  finish(text, 'model', { model: stream.model, form })
  yield { done: true, form, source: 'model', model: stream.model }
}

async function recordMessage(
  req: ChatRequest,
  ctx: ChatContext,
  props: { model?: string; ms: number; chars: number; form: boolean },
): Promise<void> {
  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'events',
      overrideAccess: true,
      depth: 0,
      data: {
        visitorId: ctx.visitorId,
        sessionId: ctx.sessionId,
        name: 'assistant_message',
        path: ctx.path,
        props: { chatId: req.chatId, turn: req.messages.length, ...props },
      },
    })
  } catch (err) {
    logger.warn({ err, chatId: req.chatId }, 'assistant event write failed')
  }
}
