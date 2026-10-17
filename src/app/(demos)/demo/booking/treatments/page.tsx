import type { Metadata } from 'next'
import { Check, Clock } from 'lucide-react'
import { DemoButton, DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { Photo } from '@/components/demos-shared/photo'
import { CtaBand } from '@/components/demos-shared/sections'
import { Reveal } from '@/components/reveal'
import { nova } from '@/content/demo-businesses'
import { novaFaq, novaPhotos, novaTreatments } from '@/content/demo-nova'
import { formatInr } from '@/lib/booking'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: `Treatments · ${nova.name}`,
  description: `Facials, body treatments, hair care and skin consultations at ${nova.name}, Anna Nagar. Duration, price and what is included for each. Booking website concept by KAPOSA FUTEXI.`,
}

/** Booking demo: treatments laid out like hotel rooms, each with its own photo and inclusions. */
export default async function NovaTreatmentsPage() {
  const settings = await getSiteSettings()
  return (
    <DemoShell business={nova} whatsappNumber={settings.whatsappNumber}>
      <section className="container-dm pt-14 sm:pt-20">
        <p className="dm-label text-dm-accent-ink">Treatments</p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl text-balance sm:text-6xl">
          Four rooms. <em>One quiet hour.</em>
        </h1>
        <p className="text-dm-muted mt-5 max-w-2xl text-lg">
          Every treatment includes the room, the tea afterwards and a note to take home. Prices are what you
          pay.
        </p>
        <Reveal className="dm-parallax relative mt-10 aspect-[21/9] overflow-hidden rounded-[var(--dm-radius-img)]">
          <Photo
            photo={novaPhotos.pool}
            priority
            className="absolute inset-0 h-full w-full rounded-none"
            sizes="100vw"
            zoom={false}
          />
        </Reveal>
      </section>

      <section className="container-dm space-y-20 py-20 sm:py-28" data-testid="treatments">
        {novaTreatments.map((t, i) => {
          const s = nova.services.find((x) => x.slug === t.slug)!
          const flip = i % 2 === 1
          return (
            <Reveal key={t.slug} as="article" className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
              <div className={flip ? 'lg:order-2 lg:col-span-7' : 'lg:col-span-7'}>
                <Photo photo={t.photo} className="aspect-[4/3]" sizes="(min-width: 1024px) 58vw, 100vw" />
              </div>
              <div className={flip ? 'lg:order-1 lg:col-span-5' : 'lg:col-span-5'}>
                <p className="dm-label text-dm-accent-ink">
                  {t.label} · {t.room}
                </p>
                <h2 className="mt-3 font-display text-4xl">{s.name}</h2>
                <p className="text-dm-muted mt-3 text-lg">{s.line}</p>
                <p className="text-dm-muted mt-2 text-sm">
                  <b className="text-dm-ink font-medium">Good for:</b> {t.goodFor}
                </p>
                <ul className="mt-5 space-y-2 text-sm">
                  {t.included.map((inc) => (
                    <li key={inc} className="flex items-start gap-2">
                      <Check className="text-dm-accent-ink mt-0.5 h-4 w-4 shrink-0" /> {inc}
                    </li>
                  ))}
                </ul>
                <div className="border-dm-line mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-5">
                  <span className="text-dm-muted flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" /> {s.minutes} min ·{' '}
                    <span className="text-dm-ink text-lg font-medium">{formatInr(s.price)}</span>
                  </span>
                  <DemoButton
                    href={`${nova.bookPath}?service=${s.slug}`}
                    data-magnetic
                    data-cursor="Book"
                    data-track="cta_click"
                    data-track-props={`{"cta":"demo_treatment","demo":"booking","service":"${s.slug}"}`}
                  >
                    Reserve this room
                  </DemoButton>
                </div>
              </div>
            </Reveal>
          )
        })}
      </section>

      <section className="bg-dm-surface py-20 sm:py-28">
        <div className="container-dm grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionTitle eyebrow="Before you come" title="Good to know" />
          <div className="divide-dm-line divide-y" data-testid="faq">
            {novaFaq.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    className="text-dm-muted text-2xl leading-none transition-transform group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <p className="text-dm-muted mt-3 max-w-2xl">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        business={nova}
        title="Pick a room and a time."
        line="Live availability, confirmation on WhatsApp."
        label="Book a treatment"
      />
    </DemoShell>
  )
}
