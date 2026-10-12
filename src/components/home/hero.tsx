import { ButtonLink } from '@/components/ui/button'
import { hero } from '@/content/site'
import { HeroMockup } from './hero-mockup'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_30%_0%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_70%)]"
      />
      <div className="container-site grid min-h-[calc(100dvh-4.5rem)] items-center gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-20">
        <div className="text-center lg:text-left">
          <p className="mb-6 text-xs font-semibold tracking-[0.22em] text-muted uppercase">{hero.eyebrow}</p>
          <h1 className="font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl lg:text-[4.25rem]">
            Your Ideas. Our Technology.
            <br />
            <span className="text-gradient">Built for What&apos;s Next.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-pretty text-muted sm:text-lg lg:mx-0">
            {hero.sub}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <ButtonLink
              href={hero.primary.href}
              size="lg"
              data-track="cta_click"
              data-track-props='{"cta":"hero_primary"}'
            >
              {hero.primary.label}
            </ButtonLink>
            <ButtonLink
              href={hero.secondary.href}
              variant="secondary"
              size="lg"
              data-track="cta_click"
              data-track-props='{"cta":"hero_secondary"}'
            >
              {hero.secondary.label}
            </ButtonLink>
          </div>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-medium text-muted lg:justify-start">
            {hero.trustLine.map((item, i) => (
              <li key={item} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-muted/60" />}
                {item}
              </li>
            ))}
          </ul>
        </div>

        <HeroMockup />
      </div>
    </section>
  )
}
