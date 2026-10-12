import { ArrowDown, ArrowRight, Check, X } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { beforeAfter } from '@/content/home'
import { Section, SectionHeading } from './section'

export function BeforeAfter() {
  return (
    <Section id="before-after" tone="surface" className="cv-auto">
      <SectionHeading eyebrow="Why a website" title={beforeAfter.heading} sub={beforeAfter.line} />
      <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto_1.2fr]">
        <Reveal>
          <div className="rounded-2xl border border-dashed border-border-strong p-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Before</p>
            <ul className="mt-4 space-y-3">
              {beforeAfter.before.map((b, i) => (
                <Reveal key={b} as="li" index={i} className="flex items-center gap-3 text-muted">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border">
                    <X className="h-3.5 w-3.5" />
                  </span>
                  <span className={b === 'No Website' ? 'line-through decoration-red-400/70' : ''}>{b}</span>
                </Reveal>
              ))}
            </ul>
            <p className="mt-5 text-sm text-muted">Scattered. Hard to find. Hard to trust.</p>
          </div>
        </Reveal>

        <Reveal className="flex justify-center">
          <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-gradient text-white shadow-lg">
            <span aria-hidden className="absolute inset-0 animate-ping-soft rounded-full bg-accent/60" />
            <ArrowRight className="relative hidden h-5 w-5 lg:block" />
            <ArrowDown className="relative h-5 w-5 lg:hidden" />
          </span>
        </Reveal>

        <Reveal index={2} className="relative">
          <div aria-hidden className="glow-blob -inset-8 -z-10" />
          <div className="glow-ring glow-ring-on rounded-2xl p-6 frame-glass">
            <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">After</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {beforeAfter.after.map((a, i) => (
                <Reveal key={a} as="li" index={i + 2} className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className={a === 'Professional Website' ? 'font-semibold' : ''}>{a}</span>
                </Reveal>
              ))}
            </ul>
            <p className="mt-5 text-sm text-muted">One place. Found on Google. Contacted on WhatsApp.</p>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
