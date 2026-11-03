import { describe, expect, it, vi } from 'vitest'
import { QUOTE_FORM_TOKEN } from '@/server/assistant/knowledge'
import {
  AssistantUnavailableError,
  createProvider,
  modelOptions,
  orderModels,
  type AssistantConfig,
  type ChatMessage,
} from '@/server/assistant/provider'

const LIGHTNING = 'nvidia/nemotron-3.5-lightning-30b-a3b'
const GPT_OSS = 'openai/gpt-oss-20b'

const config: AssistantConfig = {
  enabled: true,
  apiUrl: 'https://example.test/v1',
  apiKey: 'test-key',
  models: [LIGHTNING, GPT_OSS],
  timeoutMs: 1_000,
  mock: false,
}

const ask = (text: string): ChatMessage[] => [
  { role: 'system', content: 'sheet' },
  { role: 'user', content: text },
]

const encoder = new TextEncoder()

/** A text/event-stream response built from raw chunks (so line splits across chunks can be tested). */
function sseResponse(chunks: string[], status = 200): Response {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const c of chunks) controller.enqueue(encoder.encode(c))
      controller.close()
    },
  })
  return new Response(body, { status, headers: { 'content-type': 'text/event-stream' } })
}

const delta = (content: string) => `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`
const reasoning = (text: string) =>
  `data: ${JSON.stringify({ choices: [{ delta: { reasoning_content: text } }] })}\n\n`
const DONE = 'data: [DONE]\n\n'

function neverResolves(signal: AbortSignal | null | undefined): Promise<Response> {
  return new Promise((_, reject) => {
    signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')))
  })
}

type Call = { url: string; body: Record<string, unknown>; headers: Record<string, string> }
function recordCall(calls: Call[], url: string | URL | Request, init?: RequestInit): Call {
  const call: Call = {
    url: String(url),
    body: JSON.parse(String(init?.body)) as Record<string, unknown>,
    headers: (init?.headers ?? {}) as Record<string, string>,
  }
  calls.push(call)
  return call
}

describe('assistant provider', () => {
  it('streams content deltas from the first model and sends its vendor options', async () => {
    const calls: Call[] = []
    const fetchImpl = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      recordCall(calls, url, init)
      return sseResponse([delta('Hello'), delta(' there'), reasoning('ignored'), DONE])
    })
    const provider = createProvider(config, fetchImpl as unknown as typeof fetch)

    const result = await provider.complete({ messages: ask('hi') })

    expect(result.text).toBe('Hello there')
    expect(result.model).toBe(LIGHTNING)
    expect(result.attempts).toEqual([{ model: LIGHTNING, outcome: 'ok', ms: expect.any(Number) }])
    expect(calls).toHaveLength(1)
    expect(calls[0].url).toBe('https://example.test/v1/chat/completions')
    expect(calls[0].headers.authorization).toBe('Bearer test-key')
    expect(calls[0].body).toMatchObject({
      model: LIGHTNING,
      stream: true,
      max_tokens: 300,
      chat_template_kwargs: { enable_thinking: false },
    })
  })

  it('parses SSE lines that are split across chunks', async () => {
    const line = delta('split across chunks')
    const fetchImpl = vi.fn(async () =>
      sseResponse([line.slice(0, 12), line.slice(12, 30), line.slice(30), DONE]),
    )
    const provider = createProvider(config, fetchImpl as unknown as typeof fetch)

    const result = await provider.complete({ messages: ask('hi') })

    expect(result.text).toBe('split across chunks')
  })

  it('moves to the next model on 404 and records both attempts', async () => {
    const calls: Call[] = []
    const fetchImpl = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      const call = recordCall(calls, url, init)
      if (call.body.model === LIGHTNING)
        return new Response('{"detail":"Function not found"}', { status: 404 })
      return sseResponse([delta('From the fallback'), DONE])
    })
    const provider = createProvider(config, fetchImpl as unknown as typeof fetch)

    const result = await provider.complete({ messages: ask('hi') })

    expect(result.text).toBe('From the fallback')
    expect(result.model).toBe(GPT_OSS)
    expect(result.attempts.map((a) => [a.model, a.outcome, a.status])).toEqual([
      [LIGHTNING, 'http', 404],
      [GPT_OSS, 'ok', undefined],
    ])
    expect(calls[1].body).toMatchObject({ model: GPT_OSS, reasoning_effort: 'low' })
    expect(calls[1].body).not.toHaveProperty('chat_template_kwargs')
  })

  it('treats a stream with no visible content as empty and tries the next model', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(sseResponse([reasoning('thinking...'), DONE]))
      .mockResolvedValueOnce(sseResponse([delta('Visible'), DONE]))
    const provider = createProvider(config, fetchImpl as unknown as typeof fetch)

    const result = await provider.complete({ messages: ask('hi') })

    expect(result.text).toBe('Visible')
    expect(result.attempts[0]).toMatchObject({ model: LIGHTNING, outcome: 'empty' })
  })

  it('gives up on a model whose first token is too slow and still answers from the next', async () => {
    const fetchImpl = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as { model: string }
      if (body.model === LIGHTNING) return neverResolves(init?.signal)
      return sseResponse([delta('Quick one'), DONE])
    })
    const provider = createProvider(config, fetchImpl as unknown as typeof fetch)

    const started = Date.now()
    const result = await provider.complete({ messages: ask('hi') })

    expect(result.text).toBe('Quick one')
    expect(result.attempts[0]).toMatchObject({ model: LIGHTNING, outcome: 'timeout' })
    expect(Date.now() - started).toBeLessThan(config.timeoutMs + 500)
  })

  it('throws AssistantUnavailableError with every attempt when all models fail', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response('gone', { status: 410 }))
      .mockRejectedValueOnce(new TypeError('fetch failed'))
    const provider = createProvider(config, fetchImpl as unknown as typeof fetch)

    const err = await provider.complete({ messages: ask('hi') }).catch((e: unknown) => e)

    expect(err).toBeInstanceOf(AssistantUnavailableError)
    expect((err as AssistantUnavailableError).attempts.map((a) => a.outcome)).toEqual(['http', 'network'])
  })

  it('sends Tamil-script messages to gpt-oss first', async () => {
    const calls: Call[] = []
    const fetchImpl = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      recordCall(calls, url, init)
      return sseResponse([delta('வணக்கம்'), DONE])
    })
    const provider = createProvider(config, fetchImpl as unknown as typeof fetch)

    const result = await provider.complete({ messages: ask('விலை எவ்வளவு?') })

    expect(result.model).toBe(GPT_OSS)
    expect(calls[0].body.model).toBe(GPT_OSS)
    expect(orderModels([LIGHTNING, GPT_OSS], 'evlo aagum?')).toEqual([LIGHTNING, GPT_OSS])
  })

  it('throws when disabled and never calls the network', async () => {
    const fetchImpl = vi.fn()
    const provider = createProvider({ ...config, enabled: false }, fetchImpl as unknown as typeof fetch)

    await expect(provider.complete({ messages: ask('hi') })).rejects.toBeInstanceOf(AssistantUnavailableError)
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('answers from canned text in mock mode, with the quote token on a quote request', async () => {
    const fetchImpl = vi.fn()
    const provider = createProvider({ ...config, mock: true }, fetchImpl as unknown as typeof fetch)

    const plain = await provider.complete({ messages: ask('what do you build?') })
    const quote = await provider.complete({ messages: ask('I want a quote') })

    expect(plain.model).toBe('mock')
    expect(plain.text).toContain('what do you build?')
    expect(plain.text).not.toContain(QUOTE_FORM_TOKEN)
    expect(quote.text.trimEnd().endsWith(QUOTE_FORM_TOKEN)).toBe(true)
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('knows the vendor options per model family', () => {
    expect(modelOptions(LIGHTNING)).toEqual({ chat_template_kwargs: { enable_thinking: false } })
    expect(modelOptions(GPT_OSS)).toEqual({ reasoning_effort: 'low' })
    expect(modelOptions('meta/llama-3.3-70b-instruct')).toEqual({})
  })
})
