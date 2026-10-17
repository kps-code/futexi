import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { DemoButton, DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { Photo } from '@/components/demos-shared/photo'
import { CtaBand, Steps, Testimonials } from '@/components/demos-shared/sections'
import { FadeUp, Words } from '@/components/demos-shared/words'
import { Reveal } from '@/components/reveal'
import { nova } from '@/content/demo-businesses'
import { novaPerks, novaPhotos, novaStats, novaTreatments, novaVisit } from '@/content/demo-nova'
import { formatInr } from '@/lib/booking'
import { bookableDatesNow } from '@/server/demo-booking'
import { getSiteSettings } from '@/server/site-data'
import { BookingBar } from './booking-bar'

export const metadata: Metadata = {
  title: `${nova.name} · ${nova.tagline}`,
  description: `${nova.blurb} Booking website concept by KAPOSA FUTEXI.`,
}

const steps = [
  { title: 'Choose a treatment', line: 'Duration and price upfront, no surprises at the desk.' },
  { title: 'Pick a date and time', line: 'Only free slots are shown, updated live.' },
  { title: 'Confirm on WhatsApp', line: 'Your summary arrives instantly. The studio gets it too.' },
] as const

const testimonials = [
  { quote: 'Booked at 11 pm from my couch. Slot confirmed before I put the phone down.', name: 'Priya R.' },
  { quote: 'No more calling three times to find a free slot. I just pick one.', name: 'Karthik M.' },
  { quote: 'The reminder on WhatsApp saved me from missing my appointment.', name: 'Divya S.' },
] as const

/** Booking Website demo (Post 0): Nova Studio home, presented like a boutique resort. */
export default async function NovaHomePage() {
  const settings = await getSiteSettings()
  const dates = bookableDatesNow(nova)
  return (
    <DemoShell business={nova} whatsappNumber={settings.whatsappNumber}>
      {/* Hero: full-bleed photo with parallax, word-by-word headline, floating booking bar. */}
      <section className="relative">
        <div className="dm-parallax relative h-[78vh] min-h-[520px] overflow-hidden">
          <Photo
            photo={novaPhotos.hero}
            priority
            quality={60}
            sizes="100vw"
            zoom={false}
            className="dm-settle absolute inset-0 h-full w-full rounded-none"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(27,42,65,0.78)_0%,rgba(27,42,65,0.38)_55%,rgba(246,241,234,0.1)_100%),linear-gradient(180deg,transparent_60%,rgba(246,241,234,0.9)_100%)]"
          />
          <div className="container-dm relative flex h-full flex-col justify-center pb-20 text-white">
            <FadeUp index={0} className="dm-label text-white/80">
              Wellness studio · Anna Nagar, Chennai · ★ {nova.rating}
            </FadeUp>
            <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.02] text-balance sm:text-6xl lg:text-7xl">
              <Words text="Your hour of calm," />
              <br />
              <Words text="booked in a minute." accent={['booked', 'minute']} startIndex={4} />
            </h1>
            <FadeUp index={1} as="p" className="mt-6 max-w-xl text-base text-white/85 sm:text-lg">
              {nova.blurb}
            </FadeUp>
            <FadeUp index={2} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <DemoButton
                href={nova.bookPath!}
                size="lg"
                className="dm-shimmer text-dm-ink bg-white"
                data-magnetic
                data-cursor="Book"
                data-track="cta_click"
                data-track-props='{"cta":"demo_hero","demo":"booking"}'
              >
                Book a treatment
              </DemoButton>
              <DemoButton
                href={`${nova.path}/treatments`}
                variant="secondary"
                size="lg"
                className="border-white/50 text-white hover:bg-white/10"
              >
                View treatments
              </DemoButton>
            </FadeUp>
          </div>
        </div>
        <BookingBar services={nova.services} dates={dates} bookPath={nova.bookPath!} />
      </section>

      {/* Treatments as rooms. */}
      <section id="services" className="scroll-mt-20 py-20 sm:py-28">
        <div className="container-dm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              eyebrow="Treatments"
              title="Choose your room of calm"
              sub="Four rooms, four ways to spend an hour on yourself. Prices include everything listed."
            />
            <Link
              href={`${nova.path}/treatments`}
              className="dm-underline text-dm-accent-ink text-sm font-medium"
            >
              All treatments <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {novaTreatments.map((t, i) => {
              const s = nova.services.find((x) => x.slug === t.slug)!
              return (
                <Reveal key={t.slug} as="li" index={i} className="dm-scale-in">
                  <article
                    data-tilt="5"
                    data-cursor="Book"
                    className="dm-card dm-lift flex h-full flex-col overflow-hidden"
                  >
                    <div className="relative">
                      <Photo
                        photo={t.photo}
                        className="aspect-[4/3] rounded-none"
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                        ★ {t.rating}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="dm-label text-dm-accent-ink">{t.label}</p>
                      <h3 className="mt-1 font-display text-2xl">{s.name}</h3>
                      <p className="text-dm-muted mt-1 text-sm">
                        {t.room} · {s.line}
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {t.included.slice(0, 3).map((inc) => (
                          <li
                            key={inc}
                            className="border-dm-line text-dm-muted rounded-full border px-2.5 py-1 text-[11px]"
                          >
                            {inc}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto flex items-center justify-between pt-5">
                        <span className="text-lg font-medium">
                          {formatInr(s.price)}{' '}
                          <span className="text-dm-muted text-xs font-normal">/ session</span>
                        </span>
                        <DemoButton
                          href={`${nova.bookPath}?service=${s.slug}`}
                          size="sm"
                          data-cursor="Book"
                          data-track="cta_click"
                          data-track-props={`{"cta":"demo_service","demo":"booking","service":"${s.slug}"}`}
                        >
                          Reserve
                        </DemoButton>
                      </div>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Stats that count up. */}
      <section className="bg-dm-surface border-dm-line border-y py-14">
        <div className="container-dm grid grid-cols-2 gap-8 md:grid-cols-4">
          {novaStats.map((st, i) => (
            <Reveal key={st.label} index={i} className="text-center">
              <p className="text-dm-ink font-display text-5xl">
                <span data-count={st.value} data-count-decimals={st.decimals} data-count-suffix={st.suffix}>
                  {st.value}
                  {st.suffix}
                </span>
              </p>
              <p className="dm-label text-dm-muted mt-2">{st.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pinned horizontal story: a visit, step by step. */}
      <section className="dm-pin" style={{ ['--dm-track-shift' as string]: '55%' }}>
        <div className="dm-pin-stage">
          <div className="container-dm w-full">
            <SectionTitle eyebrow="A visit" title="Sixty minutes, slowly" />
            <ol className="dm-pin-track mt-10">
              {novaVisit.map((v, i) => (
                <li key={v.title} data-cursor="View" className="w-[78vw] shrink-0 sm:w-[46vw] lg:w-[32vw]">
                  <Photo photo={v.photo} className="aspect-[4/3]" sizes="(min-width: 1024px) 32vw, 78vw" />
                  <p className="dm-label text-dm-accent-ink mt-5">0{i + 1}</p>
                  <h3 className="mt-1 font-display text-3xl">{v.title}</h3>
                  <p className="text-dm-muted mt-2 max-w-sm">{v.line}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <Steps eyebrow="How it works" title="Three steps. No phone calls." steps={steps} />

      {/* Studio. */}
      <section id="studio" className="bg-dm-surface scroll-mt-20 py-20 sm:py-28">
        <div className="container-dm grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal className="dm-parallax relative aspect-[4/5] overflow-hidden rounded-[var(--dm-radius-img)]">
            <Photo
              photo={novaPhotos.bath}
              className="absolute inset-0 h-full w-full rounded-none"
              sizes="(min-width: 1024px) 50vw, 100vw"
              zoom={false}
            />
          </Reveal>
          <Reveal index={1}>
            <SectionTitle eyebrow="The studio" title="Four rooms above the trees" />
            <p className="text-dm-muted mt-5 text-lg">
              A second-floor studio in Anna Nagar with a garden on the terrace. Four treatment rooms, a tea
              lounge and a team of six who have worked together for years.
            </p>
            <ul className="mt-6 space-y-3">
              {novaPerks.map((p) => (
                <li key={p.title} className="flex items-start gap-3">
                  <span className="bg-dm-brand-soft text-dm-brand mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <b className="font-medium">{p.title}.</b> <span className="text-dm-muted">{p.line}</span>
                  </span>
                </li>
              ))}
            </ul>
            <DemoButton href={`${nova.path}/membership`} variant="secondary" className="mt-8">
              Memberships and gift cards
            </DemoButton>
          </Reveal>
        </div>
      </section>

      <Testimonials items={testimonials} />
      <CtaBand
        business={nova}
        title="Ready when you are."
        line="Pick a slot now and get a WhatsApp confirmation straight away."
        label="Book a treatment"
      />
    </DemoShell>
  )
}
