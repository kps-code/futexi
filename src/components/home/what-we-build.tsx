import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { whatWeBuild } from '@/content/home'
import { Reveal } from '@/components/reveal'
import type { ServiceView } from '@/server/site-data'
import { Icon } from './icons'
import { Card, IconBadge, Section, SectionHeading } from './section'

/** One card per visible service (Content > Services). */
export function WhatWeBuild({ services }: { services: ServiceView[] }) {
  if (services.length === 0) return null
  return (
    <Section id="what-we-build" className="cv-auto">
      <SectionHeading eyebrow="What we build" title={whatWeBuild.heading} sub={whatWeBuild.sub} />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((c, i) => (
          <Reveal key={c.slug} as="li" index={i}>
            <Link href={`/services#${c.slug}`} className="block h-full focus-visible:outline-none">
              <Card className="h-full">
                <IconBadge>
                  <Icon name={c.icon} className="h-5 w-5" />
                </IconBadge>
                <h3 className="mt-5 font-display text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 font-medium text-foreground/90">{c.outcome}</p>
                {c.homeLine && <p className="mt-1.5 text-sm text-muted">{c.homeLine}</p>}
                <span className="mt-5 inline-flex translate-y-1 items-center gap-1 text-sm font-medium text-accent opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  Learn more <ArrowRight className="h-4 w-4" />
                </span>
              </Card>
            </Link>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
