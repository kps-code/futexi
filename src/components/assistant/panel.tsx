'use client'

import { MessageCircle, Send, X } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { submitAssistantLead, type AssistantLeadFieldErrors } from '@/server/actions/submit-assistant-lead'
import type { AssistantLauncherProps } from './launcher'

/**
 * The Ask-us chat panel (docs/architecture.md, section 4.8). Loaded on first open. Keeps the
 * conversation in sessionStorage so it survives page changes, streams answers from
 * /api/assistant line by line, and shows a two-field lead form when the server says so.
 */

type Role = 'user' | 'assistant'
type Msg = {
  id: string
  role: Role
  content: string
  pending?: boolean
  error?: boolean
  /** Server asked for the lead form under this answer. */
  form?: boolean
  /** The visitor sent the form; keep the thank-you in place. */
  lead?: { name: string; whatsappUrl: string }
}
type Stored = { chatId: string; messages: Msg[] }

const STORAGE_KEY = 'kf_assistant_v2'
const MAX_HISTORY = 12
const MAX_INPUT = 1000

const newId = () => crypto.randomUUID().replace(/-/g, '')

function load(): Stored {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      const s = JSON.parse(raw) as Stored
      if (s && typeof s.chatId === 'string' && Array.isArray(s.messages)) {
        return { chatId: s.chatId, messages: s.messages.filter((m) => !m.pending && m.content) }
      }
    }
  } catch {
    // Private mode or a full store: start fresh.
  }
  return { chatId: newId(), messages: [] }
}

function save(s: Stored) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch {
    // Ignore: the chat still works for this page.
  }
}

/** The model is told to write plain text; when it slips into markdown anyway, show it cleanly. */
function plainText(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/`([^`\n]+)`/g, '$1')
    .replace(/^#{1,3}\s+/gm, '')
    .replace(/^\s*[-*]\s+/gm, '• ')
}

/** Plain text with site paths and https links turned into anchors. */
function linkify(raw: string): ReactNode[] {
  const text = plainText(raw)
  const re = /(https?:\/\/[^\s)]+|(?<![\w/])\/[a-z0-9-]+(?:\/[a-z0-9-]+)*(?:#[a-z0-9-]+)?)/gi
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(re)) {
    const start = m.index ?? 0
    let href = m[0]
    let trail = ''
    while (/[.,;:!?]$/.test(href)) {
      trail = href.slice(-1) + trail
      href = href.slice(0, -1)
    }
    out.push(text.slice(last, start))
    const external = href.startsWith('http')
    out.push(
      <a
        key={`${start}-${href}`}
        href={href}
        className="underline underline-offset-2"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {href}
      </a>,
    )
    if (trail) out.push(trail)
    last = start + m[0].length
  }
  out.push(text.slice(last))
  return out
}

type PanelProps = AssistantLauncherProps & { onClose: () => void }

export function AssistantPanel({ name, welcome, chips, whatsappHref, onClose }: PanelProps) {
  const [stored] = useState(load)
  const [messages, setMessages] = useState<Msg[]>(stored.messages)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [shown, setShown] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const [chatId, setChatId] = useState(stored.chatId)

  useEffect(() => {
    // Next frame, so the panel slides in instead of appearing at its final position.
    const frame = requestAnimationFrame(() => setShown(true))
    inputRef.current?.focus()
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKey)
      abortRef.current?.abort()
    }
  }, [onClose])

  useEffect(() => {
    save({ chatId, messages })
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [chatId, messages])

  /** New chat id and empty history, so the model never sees the old turns again. */
  const startOver = () => {
    abortRef.current?.abort()
    setBusy(false)
    setMessages([])
    setChatId(newId())
    inputRef.current?.focus()
  }

  const patchLast = (patch: Partial<Msg>) =>
    setMessages((prev) => prev.map((m, i) => (i === prev.length - 1 ? { ...m, ...patch } : m)))

  async function send(raw: string) {
    const content = raw.trim().slice(0, MAX_INPUT)
    if (!content || busy) return
    setInput('')
    setBusy(true)

    const history = [...messages.filter((m) => !m.error && m.content), { role: 'user' as const, content }]
      .slice(-MAX_HISTORY)
      .map(({ role, content }) => ({ role, content }))
    setMessages((prev) => [
      ...prev,
      { id: newId(), role: 'user', content },
      { id: newId(), role: 'assistant', content: '', pending: true },
    ])

    const controller = new AbortController()
    abortRef.current = controller
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chatId, messages: history, path: window.location.pathname }),
        signal: controller.signal,
      })
      if (!res.ok || !res.body) {
        const err = (await res.json().catch(() => null)) as { error?: { message?: string } } | null
        throw new Error(err?.error?.message || 'Request failed')
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let text = ''
      let form = false
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        let nl: number
        while ((nl = buffer.indexOf('\n')) >= 0) {
          const line = buffer.slice(0, nl).trim()
          buffer = buffer.slice(nl + 1)
          if (!line) continue
          const ev = JSON.parse(line) as { t?: string; replace?: string; done?: boolean; form?: boolean }
          if (typeof ev.t === 'string') {
            text += ev.t
            patchLast({ content: text })
          } else if (typeof ev.replace === 'string') {
            text = ev.replace
            patchLast({ content: text })
          } else if (ev.done) {
            form = Boolean(ev.form)
          }
        }
      }
      patchLast({
        content: text.trim() || 'Sorry, I lost that one. Could you ask again?',
        pending: false,
        form,
      })
    } catch (err) {
      const message =
        err instanceof Error && err.message !== 'Request failed' && err.name !== 'AbortError'
          ? err.message
          : 'I could not answer just now. Please try again in a moment, or message us on WhatsApp.'
      patchLast({ content: message, pending: false, error: true })
    } finally {
      setBusy(false)
      inputRef.current?.focus()
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    void send(input)
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void send(input)
    }
  }

  const transcript = () =>
    messages
      .filter((m) => !m.error && m.content)
      .slice(-MAX_HISTORY)
      .map(({ role, content }) => ({ role, content }))

  return (
    <>
      <button
        type="button"
        aria-label="Close chat"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 sm:hidden"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`Chat with ${name}`}
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col overflow-hidden rounded-t-3xl border border-border bg-background shadow-2xl transition-[transform,opacity] duration-300 motion-reduce:transition-none',
          'sm:inset-x-auto sm:right-5 sm:bottom-5 sm:h-[600px] sm:max-h-[calc(100dvh-2.5rem)] sm:w-[380px] sm:rounded-3xl',
          shown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        )}
      >
        <header className="flex items-center gap-3 border-b border-border px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background">
            <MessageCircle className="h-4 w-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="text-xs text-muted">AI assistant, not a person. Answers from our website.</p>
          </div>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={startOver}
              className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              Start over
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>

        <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
          <Bubble role="assistant">{welcome}</Bubble>
          {messages.length === 0 && chips.length > 0 && (
            <div className="flex flex-wrap gap-2 pl-1">
              {chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => void send(chip)}
                  className="rounded-full border border-border-strong px-3 py-1.5 text-xs font-medium transition-colors hover:bg-surface"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id}>
              <Bubble role={m.role} pending={m.pending} error={m.error}>
                {m.pending && !m.content ? <Typing /> : linkify(m.content)}
              </Bubble>
              {m.role === 'assistant' && m.form && !m.pending && (
                <LeadForm
                  chatId={chatId}
                  transcript={transcript}
                  lead={m.lead}
                  onDone={(lead) =>
                    setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, lead } : x)))
                  }
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="border-t border-border px-3 py-3">
          <div className="flex items-end gap-2 rounded-2xl border border-border bg-surface px-3 py-2 focus-within:border-accent focus-within:ring-2 focus-within:ring-ring">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              maxLength={MAX_INPUT}
              placeholder="Type your question. Tanglish-um ok."
              aria-label="Your message"
              disabled={busy}
              className="max-h-28 min-h-6 flex-1 resize-none bg-transparent text-sm leading-6 text-foreground placeholder:text-muted/70 focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-opacity disabled:opacity-40"
            >
              <Send className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <p className="mt-2 flex items-center justify-between px-1 text-[11px] text-muted">
            <span>Prices and timelines are indicative.</span>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
              data-track="whatsapp_click"
              data-track-props='{"where":"assistant"}'
            >
              Prefer WhatsApp?
            </a>
          </p>
        </form>
      </section>
    </>
  )
}

function Bubble({
  role,
  pending,
  error,
  children,
}: {
  role: Role
  pending?: boolean
  error?: boolean
  children: ReactNode
}) {
  return (
    <div className={cn('flex', role === 'user' ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap',
          role === 'user'
            ? 'rounded-br-md bg-foreground text-background'
            : 'rounded-bl-md bg-surface text-foreground',
          error && 'border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
          pending && 'min-w-16',
        )}
      >
        {children}
      </div>
    </div>
  )
}

function Typing() {
  return (
    <span className="inline-flex gap-1 py-1" aria-label="Typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted motion-reduce:animate-none"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </span>
  )
}

const fieldClass =
  'w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring'

function LeadForm({
  chatId,
  transcript,
  lead,
  onDone,
}: {
  chatId: string
  transcript: () => { role: Role; content: string }[]
  lead?: { name: string; whatsappUrl: string }
  onDone: (lead: { name: string; whatsappUrl: string }) => void
}) {
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [errors, setErrors] = useState<AssistantLeadFieldErrors>({})

  if (lead) {
    return (
      <div className="mt-2 ml-1 max-w-[85%] rounded-2xl border border-border bg-surface p-3 text-sm">
        <p className="font-medium">Thanks, {lead.name}. We reply within one working day.</p>
        <a
          href={lead.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex h-9 items-center gap-2 rounded-full bg-[#25d366] px-4 text-xs font-semibold text-[#06281a]"
          data-track="whatsapp_click"
          data-track-props='{"where":"assistant_lead"}'
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          Faster on WhatsApp
        </a>
      </div>
    )
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (pending) return
    setPending(true)
    setMessage(null)
    const result = await submitAssistantLead({
      chatId,
      name,
      whatsapp,
      email,
      path: window.location.pathname,
      transcript: transcript(),
      website: '',
    })
    setPending(false)
    if (result.status === 'success') onDone({ name: result.name, whatsappUrl: result.whatsappUrl })
    else if (result.status === 'error') {
      setMessage(result.message)
      setErrors(result.fieldErrors ?? {})
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mt-2 ml-1 max-w-[85%] space-y-2 rounded-2xl border border-border bg-surface p-3"
      aria-label="Share your details"
    >
      <div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          aria-label="Your name"
          autoComplete="name"
          required
          className={fieldClass}
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>
      <div>
        <input
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="WhatsApp number"
          aria-label="WhatsApp number"
          inputMode="tel"
          autoComplete="tel"
          required
          className={fieldClass}
        />
        {errors.whatsapp && <p className="mt-1 text-xs text-red-500">{errors.whatsapp}</p>}
      </div>
      <div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (optional)"
          aria-label="Email, optional"
          type="email"
          autoComplete="email"
          className={fieldClass}
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>
      {message && <p className="text-xs text-red-500">{message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-9 w-full items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background disabled:opacity-50"
      >
        {pending ? 'Sending…' : 'Send my details'}
      </button>
    </form>
  )
}
