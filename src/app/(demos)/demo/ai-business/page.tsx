import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Bot, Check, MessageCircle, Workflow, Zap } from 'lucide-react'
import { AiAssistant } from '@/components/demos-shared/ai-assistant'
import { DemoButton, DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { Photo } from '@/components/demos-shared/photo'
import { CtaBand, ServicesGrid } from '@/components/demos-shared/sections'
import { FadeUp, Words } from '@/components/demos-shared/words'
import { Reveal } from '@/components/reveal'
import { pulse } from '@/content/demo-businesses'
import {
  pulseAiCards,
  pulseClasses,
  pulsePhotos,
  pulseStats,
  pulseTransformations,
} from '@/content/demo-pulse'
import { pulseKnowledge } from '@/lib/ai-demo'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: `${pulse.name} · ${pulse.tagline}`,
  description: `${pulse.blurb} AI-powered website concept by KAPOSA FUTEXI.`,
}

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

/** AI-Powered Business Website demo (Post 6): Pulse Fitness, loud and sporty. */
export default async function PulseHomePage() {
  const settings = await getSiteSettings()
  const requestHref = `/contact?type=${pulse.contactType}`
  return (
    <DemoShell business={pulse} whatsappNumber={settings.whatsappNumber} ctaHref="#assistant">
      {/* Hero: gritty full-bleed photo, oversized headline that overlaps it, AI chat beside. */}
      <section className="relative overflow-hidden">
        <div className="dm-parallax absolute inset-0 -z-10">
          <Photo
            photo={pulsePhotos.hero}
            priority
            quality={60}
            zoom={false}
            sizes="100vw"
            className="dm-settle dm-grit absolute inset-0 h-full w-full rounded-none"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,16,32,0.94)_0%,rgba(11,16,32,0.72)_40%,rgba(11,16,32,0.3)_100%)]"
          />
          <div aria-hidden className="dm-blob -right-20 -bottom-20 h-[26rem] w-[26rem] bg-[#a3e635]/20" />
        </div>
        <div className="container-dm grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <FadeUp index={0} className="dm-label text-dm-brand">
              Velachery · 5:30 AM to 10:30 PM · ★ {pulse.rating}
            </FadeUp>
            <h1 className="mt-5 font-display text-[4.2rem] text-balance sm:text-8xl lg:text-[8.5rem]">
              <Words text="Train smarter." />
              <br />
              <Words text="Ask anything." accent={['anything.']} startIndex={2} />
            </h1>
            <FadeUp index={1} as="p" className="text-dm-muted mt-6 max-w-xl text-base sm:text-lg">
              {pulse.blurb}
            </FadeUp>
            <FadeUp index={2} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <DemoButton
                href="#assistant"
                size="lg"
                className="dm-shimmer"
                data-magnetic
                data-cursor="Ask"
                data-track="cta_click"
                data-track-props='{"cta":"demo_hero","demo":"ai-business"}'
              >
                <Bot className="h-4 w-4" /> Ask the assistant
              </DemoButton>
              <DemoButton href={`${pulse.path}/schedule`} variant="secondary" size="lg">
                Class schedule
              </DemoButton>
            </FadeUp>
            <FadeUp index={3} as="ul" className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {pulseStats.map((st) => (
                <li key={st.label}>
                  <p className="font-display text-4xl sm:text-5xl">
                    <span data-count={st.value} data-count-suffix={st.suffix} data-count-duration="900">
                      {st.value}
                      {st.suffix}
                    </span>
                  </p>
                  <p className="text-dm-muted text-xs">{st.label}</p>
                </li>
              ))}
            </FadeUp>
          </div>
          <Reveal data-reveal-once="">
            <AiAssistant requestHref={requestHref} />
          </Reveal>
        </div>
      </section>

      {/* AI coaching cards: progress ring, heart-rate line, next session. */}
      <section className="dm-diagonal bg-dm-surface relative py-20 sm:py-24">
        <div className="container-dm">
          <SectionTitle
            eyebrow="AI coach"
            title="Your numbers, every morning"
            sub="Members get a short WhatsApp each morning: progress, heart rate trend, next session."
          />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {pulseAiCards.map((c, i) => (
              <Reveal key={c.title} as="li" index={i}>
                <article data-tilt="6" className="dm-card dm-lift relative h-full overflow-hidden p-5">
                  <p className="dm-label text-dm-muted">{c.title}</p>
                  {i === 0 && (
                    <div className="mt-4 flex items-center gap-5">
                      <svg viewBox="0 0 100 100" className="dm-ring h-24 w-24" aria-hidden>
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="var(--dm-line-strong)"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="var(--dm-brand)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          pathLength="100"
                          strokeDasharray="100"
                          style={{ ['--dm-ring-value' as string]: c.value }}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <p className="font-display text-6xl">
                        <span data-count={c.value} data-count-suffix={c.unit}>
                          {c.value}
                          {c.unit}
                        </span>
                      </p>
                    </div>
                  )}
                  {i === 1 && (
                    <div className="mt-4">
                      <p className="font-display text-6xl">
                        <span data-count={c.value}>{c.value}</span>{' '}
                        <span className="text-dm-muted text-2xl">{c.unit}</span>
                      </p>
                      <svg viewBox="0 0 300 60" className="dm-pulse-line mt-3 h-14 w-full" aria-hidden>
                        <polyline
                          fill="none"
                          stroke="var(--dm-accent)"
                          strokeWidth="2.5"
                          strokeLinejoin="round"
                          pathLength="100"
                          points="0,40 30,40 40,38 50,42 60,10 70,55 80,30 90,40 130,40 140,36 150,44 160,8 170,56 180,32 190,40 230,40 240,38 250,42 260,12 270,54 280,30 300,40"
                        />
                      </svg>
                    </div>
                  )}
                  {i === 2 && (
                    <div className="mt-4">
                      <p className="font-display text-5xl">Thu · 8 PM</p>
                      <p className="text-dm-brand mt-2 flex items-center gap-2 text-sm font-medium">
                        <Check className="h-4 w-4" /> Spot held for you
                      </p>
                    </div>
                  )}
                  <p className="text-dm-muted mt-4 text-sm">{c.line}</p>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* How the AI works. */}
      <section className="py-20 sm:py-24">
        <div className="container-dm">
          <SectionTitle eyebrow="How it works" title="A website that answers and follows up" />
          <ol className="mt-10 grid gap-4 md:grid-cols-4">
            {flow.map((f, i) => {
              const Icon = f.icon
              return (
                <Reveal key={f.title} as="li" index={i} className="dm-card dm-lift relative p-5">
                  <span className="bg-dm-brand text-dm-on-brand inline-flex h-11 w-11 items-center justify-center rounded-[var(--dm-radius)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 font-display text-3xl">{f.title}</p>
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

      {/* Classes: pinned horizontal strip of photos. */}
      <section id="classes" className="dm-pin scroll-mt-20" style={{ ['--dm-track-shift' as string]: '58%' }}>
        <div className="dm-pin-stage bg-dm-surface dm-diagonal">
          <div className="container-dm w-full">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionTitle eyebrow="Classes" title="Something for every hour" />
              <Link
                href={`${pulse.path}/schedule`}
                className="dm-underline text-dm-brand text-sm font-bold uppercase"
              >
                Full timetable <ArrowRight className="ml-1 inline h-4 w-4" />
              </Link>
            </div>
            <ul className="dm-pin-track mt-8">
              {pulseClasses.map((c) => (
                <li key={c.key} data-cursor="View" className="w-[72vw] shrink-0 sm:w-[40vw] lg:w-[24vw]">
                  <Link href={`${pulse.path}/schedule?class=${c.key}`} className="group block">
                    <Photo
                      photo={c.photo}
                      sizes="(min-width: 1024px) 24vw, 72vw"
                      className="dm-grit aspect-[3/4]"
                    />
                    <p className="group-hover:text-dm-brand mt-4 font-display text-4xl">{c.name}</p>
                    <p className="text-dm-muted text-sm">
                      {c.minutes} min · {c.level}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div id="plans" className="scroll-mt-20">
        <ServicesGrid business={pulse} eyebrow="Plans" title="Simple plans. No joining fee." cols={3} />
      </div>

      {/* Transformations teaser. */}
      <section className="py-20 sm:py-24">
        <div className="container-dm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle eyebrow="Results" title="Members, measured" />
            <Link
              href={`${pulse.path}/trainers`}
              className="dm-underline text-dm-brand text-sm font-bold uppercase"
            >
              Coaches and stories <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
          </div>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {pulseTransformations.map((t, i) => (
              <Reveal key={t.name} as="li" index={i}>
                <article data-tilt="5" className="dm-card dm-lift flex h-full flex-col overflow-hidden">
                  <Photo
                    photo={t.photo}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="dm-grit aspect-[4/3] rounded-none"
                  />
                  <div className="p-5">
                    <p className="dm-label text-dm-muted">
                      {t.metric} · {t.weeks} weeks
                    </p>
                    <p className="mt-2 font-display text-4xl">
                      <span className="text-dm-muted">{t.before}</span>{' '}
                      <span className="text-dm-brand">→ {t.after}</span>
                    </p>
                    <p className="mt-3 text-sm">
                      {t.name}, {t.age}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="faq" className="bg-dm-surface scroll-mt-20 py-20 sm:py-24">
        <div className="container-dm grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionTitle
            eyebrow="Smart FAQ"
            title="The assistant knows all of this"
            sub="One knowledge base powers the chat and this list. Update once in the admin, both change."
          />
          <div className="divide-dm-line border-dm-line bg-dm-bg divide-y rounded-[var(--dm-radius)] border px-6">
            {faq.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                  {q}
                  <span aria-hidden className="text-dm-brand transition-transform group-open:rotate-45">
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
