import { ButtonLink } from '@/components/ui/button'
import { hero } from '@/content/site'
import { HeroMockup } from './hero-mockup'
import { Eyebrow } from './section'

/**
 * Above the fold. Text rises in first, mockup follows. The h1 only slides
 * (no fade) so it can be painted immediately as the LCP element.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid" />
        <div className="glow-blob -top-40 -left-32 h-[34rem] w-[34rem] lg:animate-float" />
        <div className="glow-blob top-24 -right-40 h-[30rem] w-[30rem] opacity-80 [--float-delay:2s] lg:animate-float" />
      </div>

      <div className="container-site grid min-h-[calc(100dvh-4.5rem)] items-center gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-20">
        <div className="text-center lg:text-left">
          <Eyebrow className="mb-6 lg:animate-rise">{hero.eyebrow}</Eyebrow>
          <h1 className="font-display text-4xl leading-[1.05] font-bold tracking-[-0.02em] text-balance sm:text-6xl lg:animate-rise-soft lg:text-[4.75rem] lg:leading-[1.02]">
            Your Ideas. Our Technology.
            <br />
            <span className="text-gradient lg:text-gradient-live">Built for What&apos;s Next.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-pretty text-muted [--rise-delay:120ms] sm:text-lg lg:mx-0 lg:animate-rise">
            {hero.sub}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 [--rise-delay:200ms] sm:flex-row lg:animate-rise lg:justify-start">
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
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-medium text-muted [--rise-delay:280ms] lg:animate-rise lg:justify-start">
            {hero.trustLine.map((item, i) => (
              <li key={item} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-muted/60" />}
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="[--rise-delay:160ms] lg:animate-rise">
          <HeroMockup />
        </div>
      </div>
    </section>
  )
}
