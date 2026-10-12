import { Check } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { whyUs } from '@/content/home'
import { Card, Section, SectionHeading } from './section'

export function WhyUs() {
  return (
    <Section id="why-us" className="cv-auto">
      <SectionHeading eyebrow="Why us" title={whyUs.heading} />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {whyUs.cards.map((c, i) => (
          <Reveal key={c.title} as="li" index={i}>
            <Card className="h-full">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                <Check className="h-4 w-4" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{c.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{c.line}</p>
            </Card>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
