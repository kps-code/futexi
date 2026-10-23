import type { Metadata } from 'next'
import { DemoButton, DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { Photo } from '@/components/demos-shared/photo'
import { CtaBand } from '@/components/demos-shared/sections'
import { Reveal } from '@/components/reveal'
import { pulse } from '@/content/demo-businesses'
import { pulseCoaches, pulsePhotos, pulseTransformations } from '@/content/demo-pulse'
import { pulseKnowledge } from '@/lib/ai-demo'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: `Coaches and results · ${pulse.name}`,
  description: `Eight certified coaches and member transformations at ${pulse.name}, Velachery. AI-powered website concept by KAPOSA FUTEXI.`,
}

/** AI demo: coaches with certifications, and measured member transformations. */
export default async function PulseTrainersPage() {
  const settings = await getSiteSettings()
  return (
    <DemoShell business={pulse} whatsappNumber={settings.whatsappNumber} ctaHref={`${pulse.path}#assistant`}>
      <section className="relative isolate overflow-hidden">
        <div className="dm-parallax absolute inset-0 -z-10">
          <Photo
            photo={pulsePhotos.press}
            priority
            zoom={false}
            sizes="100vw"
            className="dm-grit absolute inset-0 h-full w-full rounded-none"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,16,32,0.7),rgba(11,16,32,0.96))]"
          />
        </div>
        <div className="container-dm pt-16 pb-12 sm:pt-20">
          <p className="dm-label text-dm-brand">Coaches</p>
          <h1 className="mt-4 font-display text-7xl sm:text-8xl lg:text-9xl">
            Coached, <em>not watched.</em>
          </h1>
          <p className="text-dm-muted mt-5 max-w-xl text-lg">{pulseKnowledge.trainers}</p>
        </div>
      </section>

      <section className="container-dm py-16 sm:py-20">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-testid="coaches">
          {pulseCoaches.map((c, i) => (
            <Reveal key={c.name} as="li" index={i}>
              <article
                data-tilt="6"
                data-cursor="View"
                className="dm-card dm-lift flex h-full flex-col overflow-hidden"
              >
                <Photo
                  photo={c.photo}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="dm-grit aspect-[3/4] rounded-none"
                />
                <div className="p-5">
                  <p className="font-display text-4xl">{c.name}</p>
                  <p className="text-dm-brand text-xs font-bold uppercase">{c.role}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {c.certs.map((cert) => (
                      <li
                        key={cert}
                        className="border-dm-line text-dm-muted rounded-[var(--dm-radius)] border px-2 py-0.5 text-[11px]"
                      >
                        {cert}
                      </li>
                    ))}
                  </ul>
                  <p className="text-dm-muted mt-3 text-sm">{c.focus}</p>
                  <p className="mt-3 font-display text-3xl">
                    <span data-count={c.years} data-count-suffix=" yrs">
                      {c.years} yrs
                    </span>
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="bg-dm-surface dm-diagonal py-20 sm:py-24">
        <div className="container-dm">
          <SectionTitle
            eyebrow="Transformations"
            title="Twelve weeks, measured"
            sub="Real members, real numbers, with their permission."
          />
          <ul className="mt-10 grid gap-6 md:grid-cols-3" data-testid="transformations">
            {pulseTransformations.map((t, i) => (
              <Reveal key={t.name} as="li" index={i}>
                <article className="dm-card dm-lift flex h-full flex-col overflow-hidden">
                  <Photo
                    photo={t.photo}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="dm-grit aspect-[4/3] rounded-none"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <p className="dm-label text-dm-muted">
                      {t.metric} · {t.weeks} weeks
                    </p>
                    <p className="mt-2 font-display text-5xl">
                      <span className="text-dm-muted">{t.before}</span>
                      <span className="text-dm-brand"> → {t.after}</span>
                    </p>
                    <p className="mt-4 flex-1 text-sm">“{t.quote}”</p>
                    <p className="text-dm-muted mt-3 text-xs font-bold uppercase">
                      {t.name}, {t.age}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
          <div className="mt-10">
            <DemoButton href={`${pulse.path}#assistant`} size="lg" data-magnetic data-cursor="Ask">
              Start with a free session
            </DemoButton>
          </div>
        </div>
      </section>

      <CtaBand
        business={pulse}
        title="Your first session is free."
        line="Ask the assistant to book it, or come by any time after 5:30 AM."
        href={`${pulse.path}#assistant`}
        label="Book a free trial"
      />
    </DemoShell>
  )
}
