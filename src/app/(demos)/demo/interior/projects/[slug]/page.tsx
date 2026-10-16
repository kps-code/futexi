import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { DemoButton, DemoShell } from '@/components/demos-shared/chrome'
import { Photo } from '@/components/demos-shared/photo'
import { Reveal } from '@/components/reveal'
import { nila } from '@/content/demo-businesses'
import { interiorProjectBySlug, interiorProjects } from '@/content/demo-interior'
import { getSiteSettings } from '@/server/site-data'
import { playfair } from '../../font'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return interiorProjects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const p = interiorProjectBySlug(slug)
  return p ? { title: `${p.name} · ${nila.name}`, description: p.summary } : {}
}

const counter = (n: number) => String(n).padStart(2, '0')

/** Project detail page for the Interior Designer demo. */
export default async function NilaProjectPage({ params }: Params) {
  const { slug } = await params
  const project = interiorProjectBySlug(slug)
  if (!project) notFound()
  const settings = await getSiteSettings()
  const index = interiorProjects.findIndex((p) => p.slug === slug)
  const next = interiorProjects[(index + 1) % interiorProjects.length]

  return (
    <DemoShell
      business={nila}
      whatsappNumber={settings.whatsappNumber}
      ctaHref={`${nila.path}#enquire`}
      className={playfair.variable}
    >
      <article>
        <section className="container-dm pt-10 sm:pt-14">
          <div className="text-dm-muted flex items-center justify-between text-sm">
            <Link href={`${nila.path}/projects`} className="hover:text-dm-ink inline-flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> All projects
            </Link>
            <span className="font-mono text-xs tracking-widest">
              {counter(index + 1)} / {counter(interiorProjects.length)}
            </span>
          </div>
          <div className="mt-6 grid items-end gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-dm-accent-ink text-xs font-semibold tracking-[0.18em] uppercase">
                {project.type}
              </p>
              <h1 className="mt-2 font-display text-4xl tracking-tight text-balance sm:text-5xl lg:text-6xl">
                {project.name}
              </h1>
              <p className="text-dm-muted mt-4 max-w-2xl text-pretty sm:text-lg">{project.summary}</p>
            </div>
            <dl className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-dm-muted text-xs uppercase">Location</dt>
                <dd className="mt-1 font-medium">{project.location}</dd>
              </div>
              <div>
                <dt className="text-dm-muted text-xs uppercase">Area</dt>
                <dd className="mt-1 font-medium">{project.area}</dd>
              </div>
              <div>
                <dt className="text-dm-muted text-xs uppercase">Completed</dt>
                <dd className="mt-1 font-medium">{project.year}</dd>
              </div>
            </dl>
          </div>
          <Reveal className="mt-10">
            <Photo
              photo={project.cover}
              label={project.gallery[0].label}
              priority
              sizes="100vw"
              className="aspect-[16/8]"
            />
          </Reveal>
        </section>

        <section className="container-dm grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="font-display text-3xl">What we did</h2>
            <ul className="mt-5 space-y-3">
              {project.highlights.map((h, i) => (
                <Reveal key={h} as="li" index={i} className="flex items-start gap-3">
                  <span className="bg-dm-brand-soft text-dm-brand-ink mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span>{h}</span>
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl">Palette</h2>
            <ul className="mt-5 flex gap-3">
              {project.palette.map((c) => (
                <li key={c} className="text-dm-muted flex flex-col items-center gap-2 text-xs">
                  <span
                    className="border-dm-line h-14 w-14 rounded-2xl border"
                    style={{ background: c }}
                    aria-hidden
                  />
                  <span className="font-mono">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-dm-surface py-16 sm:py-20">
          <div className="container-dm">
            <h2 className="font-display text-3xl">Gallery</h2>
            <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {project.gallery.map((g, i) => (
                <Reveal key={g.label} as="li" index={i}>
                  <Photo
                    photo={g.photo}
                    label={g.label}
                    className="aspect-square"
                    sizes="(min-width: 768px) 25vw, 50vw"
                  />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section className="container-dm py-16 sm:py-20">
          <div className="dm-card flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center">
            <div>
              <p className="text-dm-accent-ink text-xs font-semibold tracking-[0.18em] uppercase">
                Next project
              </p>
              <p className="mt-1 font-display text-2xl">{next.name}</p>
              <p className="text-dm-muted text-sm">{next.location}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <DemoButton href={`${nila.path}/projects/${next.slug}`} variant="secondary">
                View <ArrowRight className="h-4 w-4" />
              </DemoButton>
              <DemoButton
                href={`${nila.path}#enquire`}
                data-track="cta_click"
                data-track-props='{"cta":"demo_project_enquire","demo":"interior"}'
              >
                Start a project like this
              </DemoButton>
            </div>
          </div>
        </section>
      </article>
    </DemoShell>
  )
}
