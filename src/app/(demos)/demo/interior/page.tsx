import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Award, MapPin, Ruler } from 'lucide-react'
import { DemoButton, DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { EnquiryForm } from '@/components/demos-shared/enquiry-form'
import { RatingPill, ServicesGrid, Steps, Testimonials, Tile } from '@/components/demos-shared/sections'
import { Reveal } from '@/components/reveal'
import { nila } from '@/content/demo-businesses'
import { interiorProcess, interiorProjects, interiorTestimonials } from '@/content/demo-interior'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: `${nila.name} · ${nila.tagline}`,
  description: `${nila.blurb} Portfolio website concept by KAPOSA FUTEXI.`,
}

/** Interior Designer Website demo (Post 3): Atelier Nila home. */
export default async function NilaHomePage() {
  const settings = await getSiteSettings()
  const [featured, ...rest] = interiorProjects
  return (
    <DemoShell business={nila} whatsappNumber={settings.whatsappNumber} ctaHref="#enquire">
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_15%_0%,var(--dm-brand-soft)_0%,transparent_60%)]"
        />
        <div className="container-dm grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <RatingPill business={nila} />
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Interiors that <span className="text-dm-brand">feel like you.</span>
            </h1>
            <p className="text-dm-muted mt-5 max-w-xl text-base text-pretty sm:text-lg">{nila.blurb}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <DemoButton
                href="#projects"
                size="lg"
                data-track="cta_click"
                data-track-props='{"cta":"demo_hero","demo":"interior"}'
              >
                See our projects
              </DemoButton>
              <DemoButton href="#enquire" variant="secondary" size="lg">
                Start a project
              </DemoButton>
            </div>
            <ul className="text-dm-muted mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Award className="text-dm-brand h-4 w-4" /> 60+ homes and workplaces since 2018
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="text-dm-brand h-4 w-4" /> {nila.area}
              </li>
            </ul>
          </div>
          <Reveal>
            <Link
              href={`${nila.path}/projects/${featured.slug}`}
              className="group block"
              data-track="demo_open"
              data-track-props='{"demo":"interior","project":"featured"}'
            >
              <Tile
                tile={featured.tile}
                label={featured.name}
                className="aspect-[5/4] transition-transform duration-500 group-hover:scale-[1.01]"
              />
              <p className="mt-3 flex items-center justify-between text-sm">
                <span className="font-medium">
                  {featured.name} <span className="text-dm-muted">· {featured.location}</span>
                </span>
                <span className="text-dm-brand inline-flex items-center gap-1">
                  View project{' '}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </p>
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="projects" className="bg-dm-surface scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm">
          <SectionTitle
            eyebrow="Projects"
            title="Selected work"
            sub="Hover a project for a glimpse. Open it for the full story, palette and plans."
          />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[featured, ...rest].map((p, i) => (
              <Reveal key={p.slug} as="li" index={i}>
                <Link
                  href={`${nila.path}/projects/${p.slug}`}
                  className="group block focus-visible:outline-none"
                  data-track="demo_open"
                  data-track-props={`{"demo":"interior","project":"${p.slug}"}`}
                >
                  <div className="relative overflow-hidden rounded-2xl">
                    <Tile
                      tile={p.tile}
                      label={p.type}
                      className="aspect-[4/3] transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex translate-y-3 flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="text-xs text-white/80">
                        {p.year} · {p.area}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-white">{p.summary}</p>
                    </div>
                  </div>
                  <h3 className="group-hover:text-dm-brand mt-3 font-display text-lg font-semibold">
                    {p.name}
                  </h3>
                  <p className="text-dm-muted text-sm">{p.location}</p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <ServicesGrid
        business={nila}
        title="What we design and build"
        itemCta={{ label: 'Enquire', href: '#enquire' }}
      />
      <Steps eyebrow="Process" title="Three stages. One team throughout." steps={interiorProcess} />

      <section id="studio" className="bg-dm-surface scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
          <Reveal>
            <Tile tile="tile-sand" label="The studio" className="aspect-[4/3]" />
          </Reveal>
          <Reveal index={1}>
            <SectionTitle
              eyebrow="Studio"
              title="A designer, a carpenter and a site engineer in every meeting"
            />
            <p className="text-dm-muted mt-4">
              Atelier Nila is a team of eleven: four designers, our own carpentry workshop in Ambattur and a
              site crew that has worked together for six years. We quote once, in writing, and we build what
              we drew.
            </p>
            <p className="text-dm-muted mt-3 flex items-center gap-2 text-sm">
              <Ruler className="text-dm-brand h-4 w-4" /> Design fee adjusted against the build
            </p>
          </Reveal>
        </div>
      </section>

      <Testimonials items={interiorTestimonials} tone="bg" />

      <section id="enquire" className="bg-dm-surface scroll-mt-20 py-16 sm:py-20">
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
    </DemoShell>
  )
}
