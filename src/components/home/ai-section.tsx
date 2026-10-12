import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'
import { aiSection } from '@/content/home'
import { AiDemoBox } from './ai-demo-box'
import { Icon } from './icons'
import { IconBadge, Section, SectionHeading } from './section'

export function AiSection() {
  return (
    <Section id="ai" className="cv-auto">
      <SectionHeading eyebrow="AI" title={aiSection.heading} sub={aiSection.sub} />
      <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
        <ul className="grid gap-5 sm:grid-cols-2">
          {aiSection.features.map((f, i) => (
            <Reveal key={f.title} as="li" index={i} className="flex gap-4">
              <IconBadge className="shrink-0">
                <Icon name={f.icon} className="h-5 w-5" />
              </IconBadge>
              <div>
                <h3 className="font-display font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted">{f.line}</p>
              </div>
            </Reveal>
          ))}
          <Reveal as="li" index={6} className="sm:col-span-2">
            <ButtonLink
              href={aiSection.cta.href}
              variant="secondary"
              data-track="cta_click"
              data-track-props='{"cta":"explore_ai"}'
            >
              {aiSection.cta.label}
            </ButtonLink>
          </Reveal>
        </ul>
        <Reveal index={2}>
          <AiDemoBox />
        </Reveal>
      </div>
    </Section>
  )
}
