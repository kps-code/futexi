import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'
import { investment } from '@/content/home'
import { Eyebrow, Section } from './section'

export function Investment({ startingPriceText }: { startingPriceText: string }) {
  const [before, after] = investment.line.split('{price}')
  return (
    <Section id="pricing" tone="surface" className="cv-auto">
      <Reveal className="relative mx-auto max-w-3xl">
        <div aria-hidden className="glow-blob -inset-12 -z-10" />
        <div className="glow-ring glow-ring-on rounded-3xl p-8 text-center frame-glass sm:p-12">
          <Eyebrow>Investment</Eyebrow>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            {investment.heading}
          </h2>
          <p className="mt-5 text-base text-pretty text-muted sm:text-lg">
            {before}
            <strong className="text-gradient font-semibold">{startingPriceText}</strong>
            {after}
          </p>
          <ButtonLink
            href={investment.cta.href}
            size="lg"
            className="mt-8"
            data-track="cta_click"
            data-track-props='{"cta":"investment"}'
          >
            {investment.cta.label}
          </ButtonLink>
        </div>
      </Reveal>
    </Section>
  )
}
