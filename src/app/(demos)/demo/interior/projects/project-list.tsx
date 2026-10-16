'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Photo } from '@/components/demos-shared/photo'
import type { InteriorKind, InteriorProject } from '@/content/demo-interior'
import { cn } from '@/lib/utils'

type Kind = InteriorKind | 'all'
const counter = (n: number) => String(n).padStart(2, '0')

/** Filter chips plus an editorial list: photo on alternating sides, counter, meta and two highlights. */
export function ProjectList({
  projects,
  kinds,
  basePath,
}: {
  projects: readonly InteriorProject[]
  kinds: readonly { key: Kind; label: string }[]
  basePath: string
}) {
  const [kind, setKind] = useState<Kind>('all')
  const shown = kind === 'all' ? projects : projects.filter((p) => p.kind === kind)
  const count = (k: Kind) => (k === 'all' ? projects.length : projects.filter((p) => p.kind === k).length)

  return (
    <section className="container-dm pb-16 sm:pb-20">
      <div className="border-dm-line flex flex-wrap items-center justify-between gap-4 border-y py-4">
        <ul className="flex flex-wrap gap-2" aria-label="Filter projects">
          {kinds.map((k) => (
            <li key={k.key}>
              <button
                type="button"
                aria-pressed={kind === k.key}
                onClick={() => setKind(k.key)}
                className={cn(
                  'inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors',
                  kind === k.key
                    ? 'bg-dm-brand text-dm-on-brand border-dm-brand'
                    : 'border-dm-line-strong text-dm-muted hover:text-dm-ink hover:bg-dm-surface',
                )}
              >
                {k.label}
                <span className="font-mono text-[11px]">{counter(count(k.key))}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="text-dm-muted font-mono text-xs tracking-widest uppercase" data-testid="project-count">
          {counter(shown.length)} {shown.length === 1 ? 'project' : 'projects'}
        </p>
      </div>

      <ol className="mt-10 space-y-14 sm:space-y-20" data-testid="project-list">
        {shown.map((p, i) => {
          const n = projects.indexOf(p) + 1
          return (
            <li key={p.slug} className="grid items-center gap-6 lg:grid-cols-12 lg:gap-10">
              <Link
                href={`${basePath}/projects/${p.slug}`}
                className={cn('group block lg:col-span-7', i % 2 === 1 && 'lg:order-2')}
                data-track="demo_open"
                data-track-props={`{"demo":"interior","project":"${p.slug}","where":"gallery"}`}
              >
                <Photo
                  photo={p.cover}
                  label={p.type}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="aspect-[4/3]"
                  imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </Link>
              <div className={cn('lg:col-span-5', i % 2 === 1 && 'lg:order-1')}>
                <div className="text-dm-muted flex items-center justify-between font-mono text-xs tracking-widest uppercase">
                  <span>{p.location}</span>
                  <span>
                    {counter(n)} / {counter(projects.length)}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">{p.name}</h2>
                <p className="text-dm-muted mt-2 text-sm">
                  {p.type} · {p.area} · {p.year}
                </p>
                <p className="text-dm-muted mt-4 text-pretty">{p.summary}</p>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {p.highlights.slice(0, 2).map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <span className="bg-dm-accent mt-2 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
                      {h}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`${basePath}/projects/${p.slug}`}
                  className="text-dm-brand mt-6 inline-flex items-center gap-1 text-sm font-medium hover:underline"
                >
                  View project <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
