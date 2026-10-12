import { Reveal } from '@/components/reveal'
import { technology } from '@/content/home'
import { Section, SectionHeading } from './section'

export function Technology() {
  return (
    <Section id="technology" tone="surface" className="py-16 cv-auto sm:py-20">
      <SectionHeading
        eyebrow="Technology"
        title={technology.heading}
        sub={technology.line}
        className="mb-8 sm:mb-10"
      />
      <ul className="flex flex-wrap justify-center gap-2.5">
        {technology.items.map((t, i) => (
          <Reveal key={t} as="li" index={i}>
            <span className="inline-block rounded-full border border-border bg-background px-4 py-2 text-sm font-medium">
              {t}
            </span>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
