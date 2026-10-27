import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { DemoButton, DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { HeroScene } from '@/components/demos-shared/motion-v2/hero-scene'
import { MotionV2 } from '@/components/demos-shared/motion-v2/motion'
import { Photo } from '@/components/demos-shared/photo'
import { CtaBand } from '@/components/demos-shared/sections'
import { FadeUp, Words } from '@/components/demos-shared/words'
import { Reveal } from '@/components/reveal'
import { nova } from '@/content/demo-businesses'
import {
  novaPerks,
  novaPhotos,
  novaSide,
  novaStatement,
  novaStats,
  novaTreatments,
  novaVisit,
} from '@/content/demo-nova'
import { formatInr } from '@/lib/booking'
import { bookableDatesNow } from '@/server/demo-booking'
import { getSiteSettings } from '@/server/site-data'
import { BookingBar } from './booking-bar'

export const metadata: Metadata = {
  title: `${nova.name} · ${nova.tagline}`,
  description: `${nova.blurb} Booking website concept by KAPOSA FUTEXI.`,
}

const testimonials = [
  {
    quote: 'Booked at 11 pm from my couch. Slot confirmed before I put the phone down.',
    name: 'Priya R.',
    line: 'Member since 2024',
  },
  {
    quote: 'No more calling three times to find a free slot. I just pick one.',
    name: 'Karthik M.',
    line: 'Deep tissue, monthly',
  },
  {
    quote: 'The reminder on WhatsApp saved me from missing my appointment.',
    name: 'Divya S.',
    line: 'Signature facial',
  },
] as const

/** Booking Website demo (Post 0): Nova Studio home, black and red, bold and modern. */
export default async function NovaHomePage() {
  const settings = await getSiteSettings()
  const dates = bookableDatesNow(nova)
  return (
    <DemoShell business={nova} whatsappNumber={settings.whatsappNumber}>
      {/* Hero: bold uppercase headline on the left, a black-and-white portrait under a red disc on the right.
          On desktop, Motion v2 raises each headline word out of its own mask and floats the 3D stones. */}
      <section className="v2-hero relative isolate overflow-hidden">
        <div className="container-dm grid items-stretch gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
          <div className="flex flex-col justify-center py-16 sm:py-20 lg:py-24">
            <FadeUp index={0} className="dm-label">
              Wellness studio · Anna Nagar, Chennai
            </FadeUp>
            <h1 className="mt-6 font-display text-[4.5rem] text-balance sm:text-[6.5rem] lg:text-[8rem]">
              <Words text="Calm" />
              <br />
              <Words text="that" startIndex={1} />
              <br />
              <Words text="moves." accent={['moves.']} startIndex={2} />
            </h1>
            <FadeUp index={1} as="p" className="text-dm-muted mt-7 max-w-md text-base sm:text-lg">
              An hour that is only about you. Pick a treatment, choose a time, walk in. No calls, no waiting
              at the desk.
            </FadeUp>
            <FadeUp index={2} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <DemoButton
                href={nova.bookPath!}
                size="lg"
                className="dm-shimmer"
                data-magnetic
                data-track="cta_click"
                data-track-props='{"cta":"demo_hero","demo":"booking"}'
              >
                Book a treatment <ArrowUpRight className="h-4 w-4" />
              </DemoButton>
              <DemoButton href={`${nova.path}/treatments`} variant="secondary" size="lg">
                View treatments
              </DemoButton>
            </FadeUp>
          </div>
          <div className="nv-art relative min-h-[26rem] overflow-hidden lg:min-h-0">
            <span className="nv-shape nv-disc" aria-hidden />
            <Photo
              photo={novaPhotos.portrait}
              priority
              quality={62}
              zoom={false}
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="nv-portrait absolute inset-0 h-full w-full rounded-none"
            />
            <HeroScene scene="nova" over />
            <div className="absolute right-6 bottom-28 text-right lg:right-8 lg:bottom-32">
              <p className="font-display text-5xl leading-none [text-shadow:0_2px_16px_rgba(0,0,0,0.7)] sm:text-6xl">
                {nova.rating}
                <em>★</em>
              </p>
              <p className="text-dm-ink/80 mt-1 text-[11px] tracking-[0.2em] uppercase [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">
                {nova.reviews} reviews on Google
              </p>
            </div>
          </div>
        </div>
        <div className="relative z-10 pb-10">
          <BookingBar services={nova.services} dates={dates} bookPath={nova.bookPath!} />
        </div>
      </section>

      {/* Treatments: black-and-white photo cards, a red disc, uppercase name, price. */}
      <section id="services" className="border-dm-line scroll-mt-20 border-t py-20 sm:py-28">
        <div className="container-dm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle eyebrow="Selected treatments" title="Four rooms of calm" />
            <Link
              href={`${nova.path}/treatments`}
              className="dm-underline text-dm-brand text-xs font-semibold tracking-[0.16em] uppercase"
            >
              All treatments <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {novaTreatments.map((t, i) => {
              const s = nova.services.find((x) => x.slug === t.slug)!
              return (
                <Reveal key={t.slug} as="li" index={i} className="dm-scale-in">
                  <Link
                    href={`${nova.bookPath}?service=${s.slug}`}
                    data-tilt="4"
                    data-track="cta_click"
                    data-track-props={`{"cta":"demo_service","demo":"booking","service":"${s.slug}"}`}
                    className="nv-card border-dm-line relative block aspect-[4/5] overflow-hidden border"
                  >
                    <Photo
                      photo={t.photo}
                      zoom={false}
                      className="absolute inset-0 h-full w-full rounded-none opacity-60"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    />
                    <span className="nv-shape nv-card-disc" aria-hidden />
                    <span className="absolute top-5 right-5 left-5">
                      <span className="block font-display text-3xl leading-[0.95]">{s.name}</span>
                      <span className="mt-3 block text-[11px] tracking-[0.16em] text-white/80 uppercase">
                        {t.label} · {t.room}
                      </span>
                    </span>
                    <span className="absolute bottom-5 left-5 font-display text-2xl">
                      {formatInr(s.price)}
                    </span>
                    <span className="text-dm-brand absolute right-5 bottom-5">
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </Link>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Statement: two lists and the bold line in the middle. */}
      <section className="bg-dm-surface border-dm-line border-y py-20 sm:py-28">
        <div className="container-dm grid gap-12 lg:grid-cols-[1fr_1.3fr_1fr] lg:items-center">
          <div>
            <p className="dm-label">Treatments</p>
            <ul className="divide-dm-line mt-4 divide-y text-sm">
              {novaSide.left.map((r) => (
                <li key={r[0]} className="flex justify-between gap-4 py-2.5">
                  <span>{r[0]}</span>
                  <span className="text-dm-muted">{r[1]}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center">
            <h2 className="v2-quote font-display text-5xl sm:text-6xl lg:text-7xl">
              {novaStatement.line1} <em>{novaStatement.line2}</em>
            </h2>
            <p className="text-dm-muted mx-auto mt-6 max-w-sm">{novaStatement.sub}</p>
          </div>
          <div>
            <p className="dm-label">Why Nova</p>
            <ul className="divide-dm-line mt-4 divide-y text-sm">
              {novaStats.map((st) => (
                <li key={st.label} className="flex justify-between gap-4 py-2.5">
                  <span>{st.label}</span>
                  <span className="font-display text-xl">
                    <span
                      data-count={st.value}
                      data-count-decimals={st.decimals}
                      data-count-suffix={st.suffix}
                    >
                      {st.value}
                      {st.suffix}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <span className="v2-rule mt-4 block h-[3px] w-full" aria-hidden />
          </div>
        </div>
      </section>

      {/* A visit, step by step: a swipe row on phones, stacked black cards with red numbers on desktop. */}
      <section className="dm-pin" style={{ ['--dm-track-shift' as string]: '55%' }}>
        <div className="dm-pin-stage">
          <div className="container-dm w-full">
            <SectionTitle eyebrow="A visit" title="Sixty minutes, slowly" />
            <ol className="dm-pin-track mt-10">
              {novaVisit.map((v, i) => (
                <li key={v.title} className="w-[78vw] shrink-0 sm:w-[46vw] lg:w-[32vw]">
                  <Photo photo={v.photo} className="aspect-[4/3]" sizes="(min-width: 1024px) 40vw, 78vw" />
                  <div className="v2-visit-copy">
                    <p className="mt-5 font-display text-5xl lg:mt-0">
                      <em>0{i + 1}</em>
                    </p>
                    <h3 className="mt-1 font-display text-3xl">{v.title}</h3>
                    <p className="text-dm-muted mt-2 max-w-sm">{v.line}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Studio: the room in black and white, perks beside it. */}
      <section id="studio" className="bg-dm-surface border-dm-line scroll-mt-20 border-y py-20 sm:py-28">
        <div className="v2-studio container-dm grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative">
            <Photo
              photo={novaPhotos.bath}
              className="v2-studio-photo aspect-[4/5]"
              sizes="(min-width: 1024px) 50vw, 100vw"
              zoom={false}
            />
            <span className="nv-shape nv-studio-disc" aria-hidden />
          </div>
          <Reveal index={1} className="v2-studio-copy">
            <SectionTitle eyebrow="The studio" title="Four rooms above the trees" />
            <p className="text-dm-muted mt-5 text-lg">
              A second-floor studio in Anna Nagar with a garden on the terrace. Four treatment rooms, a tea
              lounge and a team of six who have worked together for years.
            </p>
            <ul className="divide-dm-line mt-6 divide-y">
              {novaPerks.map((p, i) => (
                <li key={p.title} className="flex items-start gap-4 py-3">
                  <span className="text-dm-brand font-display text-2xl leading-none">0{i + 1}</span>
                  <span>
                    <b className="block font-medium">{p.title}.</b>
                    <span className="text-dm-muted text-sm">{p.line}</span>
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

      {/* Testimonials: one big red quote mark, three voices. */}
      <section className="py-20 sm:py-28">
        <div className="container-dm">
          <ul className="grid gap-10 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} as="li" index={i} className="nv-quote">
                <span className="text-dm-brand block font-display text-8xl leading-[0.5]" aria-hidden>
                  “
                </span>
                <p className="mt-6 text-lg italic">{t.quote}</p>
                <p className="mt-5 text-sm font-medium">{t.name}</p>
                <p className="text-dm-muted text-[11px] tracking-[0.16em] uppercase">{t.line}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        business={nova}
        title="Let's book something calm."
        line="Pick a slot now and get a WhatsApp confirmation straight away."
        label="Book a treatment"
      />
      <MotionV2 recipe="nova" />
    </DemoShell>
  )
}
