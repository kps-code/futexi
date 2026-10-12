'use client'

import { Bot, Check, MessageCircle, Send, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState, useTransition } from 'react'
import { initialState, openingMessage, respond, type AssistantState, type ChatMessage } from '@/lib/ai-demo'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { cn } from '@/lib/utils'
import { createDemoLead, type DemoLeadResult } from '@/server/actions/create-demo-lead'

const automationSteps = [
  'Lead saved to the owner dashboard',
  'Coach notified on WhatsApp',
  'Welcome message sent to the visitor',
  'Follow-up reminder scheduled for tomorrow',
] as const

/** Chat widget: scripted assistant that answers questions and captures a trial lead. */
export function AiAssistant({ requestHref }: { requestHref: string }) {
  const reduce = usePrefersReducedMotion()
  const [messages, setMessages] = useState<ChatMessage[]>([openingMessage])
  const [state, setState] = useState<AssistantState>(initialState)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [lead, setLead] = useState<DemoLeadResult | null>(null)
  const [pending, startTransition] = useTransition()
  const listRef = useRef<HTMLDivElement>(null)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reduce ? 'auto' : 'smooth' })
  }, [messages, typing, lead, reduce])
  useEffect(() => () => void (timer.current && window.clearTimeout(timer.current)), [])

  const send = (text: string) => {
    const t = text.trim()
    if (!t || typing || pending) return
    setInput('')
    const result = respond(state, t)
    const [userMsg, ...assistantMsgs] = result.messages
    setMessages((m) => [...m, userMsg])
    setState(result.state)

    const deliver = () => {
      setTyping(false)
      setMessages((m) => [...m, ...assistantMsgs])
      if (result.captured) {
        const transcript = [...messages, userMsg, ...assistantMsgs].map(({ role, text }) => ({ role, text }))
        startTransition(async () => {
          setLead(await createDemoLead({ business: 'ai-business', ...result.captured!, transcript }))
        })
      }
    }
    if (reduce) {
      deliver()
    } else {
      setTyping(true)
      timer.current = window.setTimeout(deliver, 650)
    }
  }

  const lastChips = [...messages].reverse().find((m) => m.role === 'assistant')?.chips ?? []

  return (
    <div
      id="assistant"
      className="dm-card flex h-[34rem] max-h-[80dvh] scroll-mt-24 flex-col overflow-hidden"
    >
      <div className="border-dm-line flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="bg-dm-brand text-dm-on-brand inline-flex h-9 w-9 items-center justify-center rounded-full">
            <Bot className="h-4 w-4" />
          </span>
          <div>
            <p className="font-display text-sm font-semibold">Pulse assistant</p>
            <p className="text-dm-muted flex items-center gap-1 text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online · answers in seconds
            </p>
          </div>
        </div>
        <span className="bg-dm-brand-soft text-dm-brand-ink rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
          AI demo
        </span>
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <p
              className={cn(
                'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                m.role === 'user'
                  ? 'bg-dm-brand text-dm-on-brand rounded-br-sm'
                  : 'bg-dm-surface-2 text-dm-ink rounded-bl-sm',
              )}
            >
              {m.text}
            </p>
          </div>
        ))}
        {typing && (
          <div className="text-dm-muted flex items-center gap-1.5 pl-2" aria-label="Assistant is typing">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:300ms]" />
          </div>
        )}
        {lead?.status === 'success' && (
          <div className="border-dm-line bg-dm-bg rounded-2xl border p-4" data-testid="lead-captured">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="text-dm-brand h-4 w-4" /> Lead captured · {lead.reference}
            </p>
            <ol className="mt-3 space-y-2">
              {automationSteps.map((s, i) => (
                <li
                  key={s}
                  className="text-dm-muted flex [animation:kf-step-in_.4s_ease-out_forwards] items-center gap-2 text-xs opacity-0"
                  style={{ animationDelay: reduce ? '0ms' : `${i * 350}ms` }}
                >
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                    <Check className="h-3 w-3" />
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            <a
              href={lead.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-track="whatsapp_click"
              data-track-props='{"where":"demo_ai_lead","demo":"ai-business"}'
              className="mt-3 inline-flex h-9 items-center gap-2 rounded-full bg-[#25D366] px-4 text-xs font-medium text-white hover:brightness-95"
            >
              <MessageCircle className="h-3.5 w-3.5" /> Open WhatsApp
            </a>
            <p className="text-dm-muted mt-3 text-[11px]">
              Concept demo: the WhatsApp handoff goes to KAPOSA FUTEXI.{' '}
              <a
                href={requestHref}
                className="underline underline-offset-2"
                data-track="cta_click"
                data-track-props='{"cta":"demo_ai_lead","demo":"ai-business"}'
              >
                Want this on your website?
              </a>
            </p>
          </div>
        )}
        {lead?.status === 'error' && <p className="text-xs text-red-400">{lead.message}</p>}
      </div>

      {lastChips.length > 0 && !typing && (
        <div className="border-dm-line flex gap-2 overflow-x-auto border-t px-4 py-2">
          {lastChips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => send(c)}
              data-track="ai_demo_chip"
              data-track-props={`{"demo":"ai-business","chip":"${c}"}`}
              className="border-dm-line bg-dm-surface hover:border-dm-brand shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium"
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <form
        className="border-dm-line flex items-center gap-2 border-t p-3"
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
      >
        <label htmlFor="ai-input" className="sr-only">
          Message the assistant
        </label>
        <input
          id="ai-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            state.stage === 'ask-name'
              ? 'Your name'
              : state.stage === 'ask-phone'
                ? 'WhatsApp number'
                : 'Ask about plans, timings, classes…'
          }
          inputMode={state.stage === 'ask-phone' ? 'tel' : 'text'}
          autoComplete="off"
          className="border-dm-line bg-dm-surface text-dm-ink placeholder:text-dm-muted/70 focus:border-dm-brand focus:ring-dm-ring h-11 flex-1 rounded-full border px-4 text-sm focus:ring-2 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={!input.trim() || typing}
          className="bg-dm-brand text-dm-on-brand inline-flex h-11 w-11 items-center justify-center rounded-full disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
