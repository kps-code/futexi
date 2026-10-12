'use client'

import { Bot, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ButtonLink } from '@/components/ui/button'
import { aiScript, type AiScriptItem } from '@/content/ai-script'
import { aiSection } from '@/content/home'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Phase = 'idle' | 'asking' | 'thinking' | 'answering' | 'done'

/** Scripted sample conversation (docs/content-lock.md §10). No model call. */
export function AiDemoBox() {
  const reduce = usePrefersReducedMotion()
  const [item, setItem] = useState<AiScriptItem | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [typed, setTyped] = useState('')
  const timers = useRef<number[]>([])

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }
  useEffect(() => clear, [])

  const pick = (next: AiScriptItem) => {
    clear()
    setItem(next)
    setTyped('')
    if (reduce) {
      setTyped(next.answer)
      setPhase('done')
      return
    }
    setPhase('asking')
    timers.current.push(window.setTimeout(() => setPhase('thinking'), 500))
    timers.current.push(
      window.setTimeout(() => {
        setPhase('answering')
        const chars = Array.from(next.answer)
        let i = 0
        const tick = () => {
          i += 3
          setTyped(chars.slice(0, i).join(''))
          if (i < chars.length) timers.current.push(window.setTimeout(tick, 18))
          else setPhase('done')
        }
        tick()
      }, 1300),
    )
  }

  return (
    <div className="glow-ring glow-ring-on rounded-2xl p-5 frame-glass sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent-gradient text-white">
            <Bot className="h-4 w-4" />
          </span>
          <div>
            <p className="flex items-center gap-2 font-display text-sm font-semibold">
              {aiSection.demoTitle}
              <span aria-hidden className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-emerald-400" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            </p>
            <p className="text-[11px] text-muted">{aiSection.demoLabel}</p>
          </div>
        </div>
        <Sparkles className="h-4 w-4 text-accent" />
      </div>

      <p className="mt-5 text-xs font-medium text-muted">Pick a business to see a sample answer:</p>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Business types">
        {aiScript.map((s) => (
          <button
            key={s.chip}
            type="button"
            onClick={() => pick(s)}
            data-track="ai_demo_chip"
            data-track-props={`{"chip":"${s.chip}"}`}
            aria-pressed={item?.chip === s.chip}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              item?.chip === s.chip
                ? 'border-transparent bg-accent-gradient text-white'
                : 'border-border bg-background text-foreground/85 hover:border-border-strong',
            )}
          >
            {s.chip}
          </button>
        ))}
      </div>

      <div className="mt-5 min-h-[9.5rem] space-y-3" aria-live="polite">
        {item && (
          <div className="flex justify-end">
            <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-surface-strong px-4 py-2.5 text-sm">
              {item.question}
            </p>
          </div>
        )}
        {item && phase === 'thinking' && (
          <div className="flex items-center gap-1.5 pl-1 text-muted" aria-label="Assistant is typing">
            <Dot delay="0ms" />
            <Dot delay="150ms" />
            <Dot delay="300ms" />
          </div>
        )}
        {item && (phase === 'answering' || phase === 'done') && (
          <div className="flex gap-2.5">
            <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-gradient text-white">
              <Bot className="h-3 w-3" />
            </span>
            <p className="max-w-[90%] rounded-2xl rounded-bl-sm border border-border bg-background px-4 py-2.5 text-sm leading-relaxed">
              {typed}
              {phase === 'answering' && (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-accent align-middle" />
              )}
            </p>
          </div>
        )}
        {!item && (
          <p className="pl-1 text-sm text-muted">
            The assistant on your website would answer questions like this, day and night.
          </p>
        )}
      </div>

      <div
        className={cn(
          'mt-5 transition-opacity duration-500',
          phase === 'done' ? 'opacity-100' : 'opacity-60',
        )}
      >
        <ButtonLink
          href={aiSection.demoCta.href}
          size="md"
          className="w-full sm:w-auto"
          data-track="cta_click"
          data-track-props='{"cta":"ai_demo"}'
        >
          {aiSection.demoCta.label}
        </ButtonLink>
      </div>
    </div>
  )
}

function Dot({ delay }: { delay: string }) {
  return (
    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: delay }} />
  )
}
