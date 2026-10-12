'use client'

import { Bot, CheckCircle2, MessageCircle, Workflow, Globe } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/**
 * Hero visual: one browser frame cycling through
 * Website → AI Assistant → Enquiry Collected → WhatsApp → Automation.
 * Pure CSS transitions on opacity/transform; pauses on hover and for reduced motion.
 */

const steps = [
  { key: 'website', label: 'Website', icon: Globe },
  { key: 'ai', label: 'AI Assistant', icon: Bot },
  { key: 'enquiry', label: 'Enquiry Collected', icon: CheckCircle2 },
  { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { key: 'automation', label: 'Automation', icon: Workflow },
] as const

const STEP_MS = 2400

export function HeroMockup() {
  const reduce = usePrefersReducedMotion()
  const [step, setStep] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reduce || paused) return
    const id = window.setInterval(() => setStep((s) => (s + 1) % steps.length), STEP_MS)
    return () => window.clearInterval(id)
  }, [reduce, paused])

  const active = reduce ? steps.length - 1 : step
  const show = (i: number) => (reduce ? true : active >= i)

  return (
    <div
      className="relative mx-auto w-full max-w-xl lg:animate-float"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="How a KAPOSA FUTEXI website turns a visitor into a WhatsApp enquiry"
      role="img"
    >
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent-gradient opacity-20 blur-3xl"
      />

      {/* Leans towards the copy on desktop; turns to face the visitor on hover. */}
      <div className="overflow-hidden rounded-2xl frame-glass transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] lg:[transform:perspective(1400px)_rotateY(-7deg)_rotateX(2deg)] lg:hover:[transform:perspective(1400px)_rotateY(0deg)_rotateX(0deg)]">
        {/* Browser bar */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-3 flex-1 rounded-md bg-background/70 px-3 py-1 text-[11px] text-muted">
            yourbusiness.com
          </span>
        </div>

        <div className="grid grid-cols-[1fr_auto]">
          {/* Mini website */}
          <div className="relative min-h-[260px] p-4 sm:min-h-[300px] sm:p-5">
            <div className="flex items-center justify-between">
              <span className="h-2.5 w-20 rounded bg-foreground/60" />
              <span className="flex gap-2">
                <span className="h-2 w-8 rounded bg-muted/40" />
                <span className="h-2 w-8 rounded bg-muted/40" />
                <span className="h-2 w-10 rounded bg-accent/70" />
              </span>
            </div>
            <div className="mt-6 space-y-2">
              <span className="block h-4 w-3/4 rounded bg-foreground/80" />
              <span className="block h-4 w-1/2 rounded bg-foreground/60" />
              <span className="mt-3 block h-2 w-2/3 rounded bg-muted/50" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-14 rounded-lg border border-border bg-background/60" />
              ))}
            </div>

            {/* Step overlays */}
            <Overlay show={show(1)} className="right-4 bottom-4 sm:right-5 sm:bottom-5">
              <div className="flex items-start gap-2 rounded-2xl rounded-br-sm bg-accent-gradient p-3 text-white shadow-lg">
                <Bot className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-[11px] leading-snug">
                  Hi! Looking for a booking website? Tell me about your business.
                </p>
              </div>
            </Overlay>

            <Overlay show={show(2)} className="top-16 left-4 sm:left-5">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background/95 px-3 py-2 shadow-lg">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <div className="text-[11px] leading-tight">
                  <p className="font-semibold">Enquiry collected</p>
                  <p className="text-muted">Priya · Salon · Booking</p>
                </div>
              </div>
            </Overlay>

            <Overlay show={show(3)} className="top-[7.5rem] left-10 sm:left-14">
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-white shadow-lg">
                <MessageCircle className="h-4 w-4" />
                <p className="text-[11px] font-medium">Sent to your WhatsApp</p>
              </div>
            </Overlay>

            <Overlay show={show(4)} className="top-[10.5rem] left-16 sm:left-24">
              <div className="flex items-center gap-1.5 rounded-xl border border-border bg-background/95 px-3 py-2 shadow-lg">
                <Workflow className="h-4 w-4 text-accent" />
                {['Email', 'CRM', 'Follow-up'].map((t) => (
                  <span key={t} className="rounded-md bg-surface px-1.5 py-0.5 text-[10px] font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </Overlay>
          </div>

          {/* Flow rail */}
          <ol className="flex flex-col justify-between gap-3 border-l border-border bg-background/40 px-3 py-4 sm:px-4">
            {steps.map((s, i) => {
              const Icon = s.icon
              const isActive = i === active
              const done = i < active
              return (
                <li key={s.key} className="flex items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors duration-500',
                      isActive
                        ? 'border-transparent bg-accent-gradient text-white'
                        : done
                          ? 'border-accent/50 text-accent'
                          : 'border-border text-muted',
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span
                    className={cn(
                      'hidden text-[11px] font-medium transition-colors duration-500 sm:inline',
                      isActive ? 'text-foreground' : 'text-muted',
                    )}
                  >
                    {s.label}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-muted">
        Visitor opens your website. The AI assistant answers. The enquiry reaches you on WhatsApp.
      </p>
    </div>
  )
}

function Overlay({
  show,
  className,
  children,
}: {
  show: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'absolute max-w-[14rem] transition-[opacity,transform] duration-500 ease-out',
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
