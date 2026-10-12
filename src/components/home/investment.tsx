import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'
import { investment } from '@/content/home'
import { Section } from './section'

export function Investment({ startingPriceText }: { startingPriceText: string }) {
  const [before, after] = investment.line.split('{price}')
  return (
    <Section id="pricing" tone="surface" className="cv-auto">
      <Reveal className="mx-auto max-w-3xl rounded-3xl p-8 text-center frame-glass sm:p-12">
        <p className="text-xs font-semibold tracking-[0.22em] text-muted uppercase">Investment</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {investment.heading}
        </h2>
        <p className="mt-5 text-base text-pretty text-muted sm:text-lg">
          {before}
          <strong className="font-semibold text-foreground">{startingPriceText}</strong>
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
      </Reveal>
    </Section>
  )
}
