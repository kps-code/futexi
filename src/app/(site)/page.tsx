import { ButtonLink } from '@/components/ui/button'
import { hero } from '@/content/site'

/**
 * Home. Phase 1 ships the hero only; the remaining sections
 * (docs/content-lock.md §2) land in Phase 3.
 */
export default function HomePage() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_70%)]"
      />
      <div className="container-site flex min-h-[calc(100dvh-4.5rem)] flex-col items-center justify-center py-20 text-center">
        <p className="mb-6 text-xs font-semibold tracking-[0.22em] text-muted uppercase">{hero.eyebrow}</p>
        <h1 className="max-w-4xl font-display text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Your Ideas. Our Technology.
          <br />
          <span className="text-gradient">Built for What&apos;s Next.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base text-muted sm:text-lg">{hero.sub}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
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
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-medium text-muted">
          {hero.trustLine.map((item, i) => (
            <li key={item} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-muted/60" />}
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
