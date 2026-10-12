import type { Metadata } from 'next'
import { ArrowRight, Bot, Clock, Dumbbell, MessageCircle, Workflow, Zap } from 'lucide-react'
import { AiAssistant } from '@/components/demos-shared/ai-assistant'
import { DemoButton, DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { CtaBand, RatingPill, ServicesGrid } from '@/components/demos-shared/sections'
import { Reveal } from '@/components/reveal'
import { pulse } from '@/content/demo-businesses'
import { pulseKnowledge } from '@/lib/ai-demo'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: `${pulse.name} · ${pulse.tagline}`,
  description: `${pulse.blurb} AI-powered website concept by KAPOSA FUTEXI.`,
}

const classes = [
  { name: 'HIIT', when: '6 AM · 7 AM · 7 PM', tile: 'tile-leaf' },
  { name: 'Strength', when: 'Every hour', tile: 'tile-coal' },
  { name: 'Yoga', when: '6:30 AM · 6 PM', tile: 'tile-ocean' },
  { name: 'Zumba', when: '7:30 PM', tile: 'tile-rose' },
  { name: 'Spin', when: '6 AM · 8 PM', tile: 'tile-plum' },
  { name: 'Boxing', when: '7 PM Tue · Thu · Sat', tile: 'tile-ember' },
] as const

const faq = [
  ['What do the plans cost?', pulseKnowledge.plans],
  ['What are your timings?', pulseKnowledge.timings],
  ['Is the first visit free?', pulseKnowledge.trial],
  ['Which classes run?', pulseKnowledge.classes],
  ['Is there parking?', pulseKnowledge.parking],
  ['Can I pause my plan?', pulseKnowledge.cancel],
] as const

const flow = [
  { icon: MessageCircle, title: 'Visitor asks', line: 'Any question, any hour. Plans, timings, classes.' },
  { icon: Bot, title: 'AI answers', line: 'Instantly, from the studio knowledge base.' },
  { icon: Zap, title: 'Lead captured', line: 'Name and WhatsApp number collected in the chat.' },
  { icon: Workflow, title: 'Automation', line: 'Owner notified, welcome sent, follow-up scheduled.' },
] as const

/** AI-Powered Business Website demo (Post 6): Pulse Fitness. */
export default async function PulseHomePage() {
  const settings = await getSiteSettings()
  const requestHref = `/contact?type=${pulse.contactType}`
  return (
    <DemoShell business={pulse} whatsappNumber={settings.whatsappNumber} ctaHref="#assistant">
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_80%_0%,var(--dm-brand-soft)_0%,transparent_60%)]"
        />
        <div className="container-dm grid items-start gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <RatingPill business={pulse} />
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Train smarter. <span className="text-dm-brand">Ask anything, any time.</span>
            </h1>
            <p className="text-dm-muted mt-5 max-w-xl text-base text-pretty sm:text-lg">{pulse.blurb}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <DemoButton
                href="#assistant"
                size="lg"
                data-track="cta_click"
                data-track-props='{"cta":"demo_hero","demo":"ai-business"}'
              >
                <Bot className="h-4 w-4" /> Ask the assistant
              </DemoButton>
              <DemoButton href="#plans" variant="secondary" size="lg">
                See plans
              </DemoButton>
            </div>
            <ul className="text-dm-muted mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Clock className="text-dm-brand h-4 w-4" /> 5:30 AM to 10:30 PM
              </li>
              <li className="flex items-center gap-2">
                <Dumbbell className="text-dm-brand h-4 w-4" /> Free one-day trial
              </li>
            </ul>
          </div>
          <Reveal>
            <AiAssistant requestHref={requestHref} />
          </Reveal>
        </div>
      </section>

      <section className="border-dm-line bg-dm-surface border-y py-14">
        <div className="container-dm">
          <SectionTitle eyebrow="How it works" title="A website that answers and follows up" />
          <ol className="mt-10 grid gap-4 md:grid-cols-4">
            {flow.map((f, i) => {
              const Icon = f.icon
              return (
                <Reveal
                  key={f.title}
                  as="li"
                  index={i}
                  className="border-dm-line bg-dm-bg relative rounded-2xl border p-5"
                >
                  <span className="bg-dm-brand text-dm-on-brand inline-flex h-10 w-10 items-center justify-center rounded-xl">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 font-display font-semibold">{f.title}</p>
                  <p className="text-dm-muted mt-1 text-sm">{f.line}</p>
                  {i < flow.length - 1 && (
                    <ArrowRight className="text-dm-muted absolute top-1/2 -right-4 hidden h-5 w-5 -translate-y-1/2 md:block" />
                  )}
                </Reveal>
              )
            })}
          </ol>
        </div>
      </section>

      <div id="plans" className="scroll-mt-20">
        <ServicesGrid business={pulse} eyebrow="Plans" title="Simple plans. No joining fee." cols={3} />
      </div>

      <section id="classes" className="scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm">
          <SectionTitle eyebrow="Classes" title="Something for every hour" />
          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
            {classes.map((c, i) => (
              <Reveal
                key={c.name}
                as="li"
                index={i}
                className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${c.tile}`}
              >
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(0,0,0,.55))]"
                />
                <div className="absolute right-3 bottom-3 left-3 text-white">
                  <p className="font-display text-lg font-semibold">{c.name}</p>
                  <p className="text-xs opacity-90">{c.when}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="faq" className="bg-dm-surface scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionTitle
            eyebrow="Smart FAQ"
            title="The assistant knows all of this"
            sub="One knowledge base powers the chat and this list. Update once in the admin, both change."
          />
          <div className="divide-dm-line border-dm-line bg-dm-bg divide-y rounded-2xl border px-6">
            {faq.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {q}
                  <span aria-hidden className="text-dm-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="text-dm-muted mt-3 text-sm">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        business={pulse}
        title="Your first session is free."
        line="Ask the assistant to book it, or come by any time after 5:30 AM."
        href="#assistant"
        label="Book a free trial"
      />
    </DemoShell>
  )
}
