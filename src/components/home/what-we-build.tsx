import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { whatWeBuild } from '@/content/home'
import { Reveal } from '@/components/reveal'
import { Icon } from './icons'
import { Card, IconBadge, Section, SectionHeading } from './section'

export function WhatWeBuild() {
  return (
    <Section id="what-we-build" className="cv-auto">
      <SectionHeading eyebrow="What we build" title={whatWeBuild.heading} sub={whatWeBuild.sub} />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {whatWeBuild.cards.map((c, i) => (
          <Reveal key={c.id} as="li" index={i}>
            <Link href={`/services#${c.id}`} className="block h-full focus-visible:outline-none">
              <Card className="h-full">
                <IconBadge>
                  <Icon name={c.icon} className="h-5 w-5" />
                </IconBadge>
                <h3 className="mt-5 font-display text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 font-medium text-foreground/90">{c.outcome}</p>
                <p className="mt-1.5 text-sm text-muted">{c.what}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
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
