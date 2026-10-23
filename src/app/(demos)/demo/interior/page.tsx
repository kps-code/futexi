import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Ruler } from 'lucide-react'
import { DemoButton, DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { EnquiryForm } from '@/components/demos-shared/enquiry-form'
import { HeroScene } from '@/components/demos-shared/motion-v2/hero-scene'
import { MotionV2 } from '@/components/demos-shared/motion-v2/motion'
import { Photo } from '@/components/demos-shared/photo'
import { Testimonials } from '@/components/demos-shared/sections'
import { FadeUp, Words } from '@/components/demos-shared/words'
import { Reveal } from '@/components/reveal'
import { nila } from '@/content/demo-businesses'
import {
  interiorHeroPhoto,
  interiorNumbers,
  interiorPlan,
  interiorProcess,
  interiorProjects,
  interiorRows,
  interiorTestimonials,
  studioPhoto,
} from '@/content/demo-interior'
import { getSiteSettings } from '@/server/site-data'
import { playfair } from './font'

export const metadata: Metadata = {
  title: `${nila.name} · ${nila.tagline}`,
  description: `${nila.blurb} Portfolio website concept by KAPOSA FUTEXI.`,
}

/** Interior Designer Website demo (Post 3): Atelier Nila home, a monochrome architectural gallery. */
export default async function NilaHomePage() {
  const settings = await getSiteSettings()
  const [featured, second, third] = interiorProjects
  const rows = interiorRows.map((r) => ({ ...r, service: nila.services.find((s) => s.slug === r.slug)! }))
  return (
    <DemoShell
      business={nila}
      whatsappNumber={settings.whatsappNumber}
      ctaHref="#enquire"
      className={playfair.variable}
    >
      {/* Hero: copy on the left over a wireframe room (3D, desktop), the kitchen photo on the right.
          On desktop, Motion v2 tracks the headline words in and opens the photo through five blinds. */}
      <section className="v2-hero relative isolate overflow-hidden">
        <HeroScene scene="nila" />
        <div className="container-dm grid items-center gap-12 py-16 sm:py-20 lg:min-h-[86vh] lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <FadeUp index={0} className="dm-label text-dm-muted">
              Interior architecture · {nila.area} · Since 2018 · ★ {nila.rating}
            </FadeUp>
            <h1 className="mt-6 font-display text-[2.75rem] leading-[1.04] text-balance sm:text-6xl lg:text-[4.5rem]">
              <Words text="Rooms, drawn" />
              <br />
              <Words text="to be lived in." accent={['lived']} startIndex={2} />
            </h1>
            <FadeUp index={1} as="p" className="text-dm-muted mt-7 max-w-md text-base text-pretty sm:text-lg">
              {nila.blurb}
            </FadeUp>
            <FadeUp index={2} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <DemoButton
                href={`${nila.path}/projects`}
                size="lg"
                className="dm-shimmer"
                data-magnetic
                data-track="cta_click"
                data-track-props='{"cta":"demo_hero","demo":"interior"}'
              >
                See the projects
              </DemoButton>
              <DemoButton href="#enquire" variant="secondary" size="lg">
                Start a project
              </DemoButton>
            </FadeUp>
            <FadeUp index={3} as="p" className="text-dm-muted mt-10 flex items-center gap-2 text-sm">
              <Ruler className="text-dm-accent-ink h-4 w-4" /> Design fee adjusted against the build
            </FadeUp>
          </div>
          <div className="relative lg:col-span-7">
            <div className="in-hero-frame relative overflow-hidden">
              <Photo
                photo={interiorHeroPhoto}
                priority
                quality={62}
                zoom={false}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="aspect-[4/3] rounded-none lg:aspect-[5/4]"
              />
              <div className="in-blinds" aria-hidden>
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
            <p className="dm-label text-dm-muted mt-3 flex items-center justify-between">
              <span>{featured.name}</span>
              <span>{featured.location}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Numbers. */}
      <section className="border-dm-line border-y">
        <div className="container-dm divide-dm-line grid grid-cols-2 md:grid-cols-4 md:divide-x">
          {interiorNumbers.map((n, i) => (
            <Reveal key={n.label} index={i} className="py-8 md:px-6 md:first:pl-0">
              <p className="font-display text-5xl">
                <span data-count={n.value} data-count-suffix={n.suffix}>
                  {n.value}
                  {n.suffix}
                </span>
              </p>
              <p className="dm-label text-dm-muted mt-2">{n.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Projects: an editorial grid, one large and two small, each frame opening as it enters. */}
      <section id="projects" className="scroll-mt-20 py-20 sm:py-28">
        <div className="container-dm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              eyebrow="Projects"
              title="Selected work"
              sub="Open one for the full story, palette and plans."
            />
            <Link href={`${nila.path}/projects`} className="dm-underline dm-label text-dm-ink">
              All {interiorProjects.length} projects <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="in-projects mt-12 grid gap-6 lg:grid-cols-12">
            {[featured, second, third].map((p, i) => (
              <Link
                key={p.slug}
                href={`${nila.path}/projects/${p.slug}`}
                className={i === 0 ? 'group block lg:col-span-8' : 'group block lg:col-span-4'}
                data-track="demo_open"
                data-track-props={`{"demo":"interior","project":"${p.slug}"}`}
              >
                <div className="in-frame overflow-hidden">
                  <Photo
                    photo={p.cover}
                    sizes={i === 0 ? '(min-width: 1024px) 66vw, 100vw' : '(min-width: 1024px) 33vw, 100vw'}
                    className={
                      i === 0 ? 'aspect-[16/10] rounded-none' : 'aspect-[4/5] rounded-none lg:aspect-[16/10]'
                    }
                    imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="dm-label text-dm-muted">
                    0{i + 1} / 0{interiorProjects.length}
                  </span>
                  <span className="dm-label text-dm-muted">{p.type}</span>
                </div>
                <h3 className="group-hover:text-dm-accent-ink mt-2 font-display text-2xl">{p.name}</h3>
                <p className="text-dm-muted text-sm">{p.location}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Plan to room: pinned on desktop, the blueprint erases to the material study and then the room. */}
      <section className="in-plan bg-dm-surface border-dm-line border-y py-20 sm:py-28">
        <div className="container-dm grid items-center gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionTitle eyebrow="How a room happens" title="Plan. Material. Room." />
            <ol className="mt-10 space-y-8">
              {interiorPlan.steps.map((s, i) => (
                <li key={s.title} className={i === 0 ? 'in-plan-step is-on' : 'in-plan-step'}>
                  <p className="dm-label text-dm-accent-ink">0{i + 1}</p>
                  <h3 className="mt-1 font-display text-2xl">{s.title}</h3>
                  <p className="text-dm-muted mt-2 max-w-sm text-sm">{s.line}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="in-plan-frame relative overflow-hidden">
            <Photo
              photo={interiorPlan.photo}
              zoom={false}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="in-plan-photo aspect-[4/3] rounded-none"
            />
            <div className="in-blueprint" aria-hidden>
              <svg viewBox="0 0 400 300" preserveAspectRatio="none">
                <rect x="24" y="24" width="352" height="252" />
                <path d="M24 150 H 200 M200 24 V 150 M200 150 V 276 M290 150 V 276" />
                <path d="M60 24 h 50 M250 24 h 50" strokeWidth="4" />
                <path d="M24 200 v 40 M376 70 v 60" strokeWidth="4" />
                <rect x="44" y="44" width="120" height="50" />
                <rect x="48" y="110" width="28" height="28" />
                <rect x="230" y="44" width="118" height="28" />
                <circle cx="300" cy="110" r="22" />
                <rect x="214" y="170" width="62" height="96" />
                <rect x="306" y="170" width="56" height="40" />
                <path d="M200 150 A 36 36 0 0 1 236 186 M290 276 A 32 32 0 0 1 322 244" />
              </svg>
              <span className="dm-label">Ground floor · 1 : 50</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services as numbered rows; the photo appears beside the row you point at (desktop). */}
      <section id="services" className="scroll-mt-20 py-20 sm:py-28">
        <div className="container-dm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              eyebrow="What we design and build"
              title="Four ways to work with us"
              sub="Packages and indicative prices are on the Services page."
            />
            <Link href={`${nila.path}/services`} className="dm-underline dm-label text-dm-ink">
              Packages and prices <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="in-rows divide-dm-line border-dm-line mt-12 divide-y border-y">
            {rows.map((r, i) => (
              <li key={r.slug} className="in-row relative">
                <Link
                  href={`${nila.path}/services`}
                  className="grid items-center gap-4 py-7 sm:grid-cols-[4rem_1fr_auto] sm:py-9"
                >
                  <span className="dm-label text-dm-muted">0{i + 1}</span>
                  <span>
                    <span className="block font-display text-2xl sm:text-3xl">{r.service.name}</span>
                    <span className="text-dm-muted mt-1 block max-w-xl text-sm">{r.service.line}</span>
                  </span>
                  <ArrowUpRight className="text-dm-muted h-5 w-5 justify-self-end" />
                </Link>
                <Photo photo={r.photo} sizes="18rem" className="in-row-photo aspect-[4/3]" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process: three stages on one drawn line. */}
      <section id="how" className="bg-dm-surface border-dm-line scroll-mt-20 border-y py-20 sm:py-28">
        <div className="container-dm">
          <SectionTitle eyebrow="Process" title="Three stages. One team throughout." />
          <div className="in-process relative mt-12">
            <svg className="in-process-line" viewBox="0 0 1200 4" preserveAspectRatio="none" aria-hidden>
              <path d="M0 2 H 1200" />
            </svg>
            <ol className="grid gap-10 md:grid-cols-3">
              {interiorProcess.map((s, i) => (
                <li key={s.title} className="in-process-step pt-8">
                  <span className="in-process-dot" aria-hidden />
                  <p className="dm-label text-dm-accent-ink">Stage 0{i + 1}</p>
                  <h3 className="mt-2 font-display text-2xl">{s.title}</h3>
                  <p className="text-dm-muted mt-2 text-sm">{s.line}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Studio. */}
      <section id="studio" className="scroll-mt-20 py-20 sm:py-28">
        <div className="container-dm grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal className="in-studio-photo relative aspect-[4/3] overflow-hidden">
            <Photo
              photo={studioPhoto}
              zoom={false}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="absolute inset-0 h-full w-full rounded-none"
            />
          </Reveal>
          <div className="in-studio-copy">
            <SectionTitle
              eyebrow="Studio"
              title="A designer, a carpenter and a site engineer in every meeting"
            />
            <p className="text-dm-muted mt-5">
              Atelier Nila is a team of eleven: four designers, our own carpentry workshop in Ambattur and a
              site crew that has worked together for six years. We quote once, in writing, and we build what
              we drew.
            </p>
          </div>
        </div>
      </section>

      <Testimonials items={interiorTestimonials} tone="bg" />

      <section id="enquire" className="bg-dm-surface border-dm-line scroll-mt-20 border-t py-16 sm:py-20">
        <div className="container-dm grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <SectionTitle
            eyebrow="Start a project"
            title="Tell us about your space"
            sub="A short note is enough. We reply on WhatsApp within a working day with next steps."
          />
          <EnquiryForm
            business={nila}
            interestLabel="Project type"
            interests={nila.services.map((s) => s.name)}
            detailsLabel="About the space"
            detailsPlaceholder="Location, size, rooms, timeline, anything that helps."
            submitLabel="Start the conversation"
            successTitle="Thanks, your project is noted."
          />
        </div>
      </section>
      <MotionV2 recipe="nila" />
    </DemoShell>
  )
}
