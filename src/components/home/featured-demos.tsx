import { ButtonLink } from '@/components/ui/button'
import { DemoCard } from '@/components/demos/demo-card'
import { Reveal } from '@/components/reveal'
import { demoBySlug } from '@/content/demos'
import { featuredDemos } from '@/content/home'
import { Section, SectionHeading } from './section'

export function FeaturedDemos() {
  const items = featuredDemos.slugs.map(demoBySlug).filter((d): d is NonNullable<typeof d> => Boolean(d))
  return (
    <Section id="demos" tone="surface" className="cv-auto">
      <SectionHeading eyebrow="Demos" title={featuredDemos.heading} sub={featuredDemos.sub} />
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((d, i) => (
          <Reveal key={d.slug} as="li" index={i}>
            <DemoCard demo={d} />
          </Reveal>
        ))}
      </ul>
      <Reveal className="mt-12 text-center">
        <ButtonLink
          href={featuredDemos.cta.href}
          variant="secondary"
          size="lg"
          data-track="cta_click"
          data-track-props='{"cta":"view_all_demos"}'
        >
          {featuredDemos.cta.label}
        </ButtonLink>
      </Reveal>
    </Section>
  )
}
