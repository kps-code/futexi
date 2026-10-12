import { Reveal } from '@/components/reveal'
import type { TechnologyContent } from '@/server/site-data'
import { Section, SectionHeading } from './section'

export function Technology({ content }: { content: TechnologyContent }) {
  return (
    <Section id="technology" tone="surface" className="py-16 cv-auto sm:py-20">
      <SectionHeading
        eyebrow="Technology"
        title={content.heading}
        sub={content.line}
        className="mb-8 sm:mb-10"
      />
      <ul className="flex flex-wrap justify-center gap-2.5">
        {content.items.map((t, i) => (
          <Reveal key={t} as="li" index={i}>
            <span className="inline-block rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition-[border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent">
              {t}
            </span>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
