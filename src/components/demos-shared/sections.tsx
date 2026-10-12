import { Clock, Star } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import type { DemoBusiness } from '@/content/demo-businesses'
import { formatInr } from '@/lib/booking'
import { cn } from '@/lib/utils'
import { DemoButton, SectionTitle } from './chrome'

/** Building blocks shared across the demo landing pages. */

export function RatingPill({ business }: { business: DemoBusiness }) {
  return (
    <p className="bg-dm-surface text-dm-muted ring-dm-line inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1">
      <Star className="fill-dm-accent text-dm-accent h-3.5 w-3.5" /> {business.rating} · {business.reviews}{' '}
      reviews · {business.area}
    </p>
  )
}

export function ServicesGrid({
  business,
  eyebrow = 'Services',
  title,
  sub,
  cols = 4,
  itemCta,
  priceSuffix,
}: {
  business: DemoBusiness
  eyebrow?: string
  title: string
  sub?: string
  cols?: 3 | 4
  /** For businesses without a booking flow: a label and anchor for each card. */
  itemCta?: { label: string; href: string }
  /** Appended to prices, e.g. "/month". */
  priceSuffix?: string
}) {
  return (
    <section id="services" className="bg-dm-surface scroll-mt-20 py-16 sm:py-20">
      <div className="container-dm">
        <SectionTitle eyebrow={eyebrow} title={title} sub={sub} />
        <ul
          className={cn('mt-10 grid gap-4 sm:grid-cols-2', cols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3')}
        >
          {business.services.map((s, i) => (
            <Reveal key={s.slug} as="li" index={i} className="dm-card bg-dm-bg flex flex-col p-5">
              <span className={cn('h-1.5 w-10 rounded-full', toneBar(s.tone))} />
              {s.category && (
                <p className="text-dm-muted mt-3 text-[11px] font-semibold tracking-wide uppercase">
                  {s.category}
                </p>
              )}
              <h3 className="mt-2 font-display text-lg font-semibold">{s.name}</h3>
              <p className="text-dm-muted mt-1.5 flex-1 text-sm">{s.line}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                {s.minutes > 0 ? (
                  <span className="text-dm-muted flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {s.minutes} min
                  </span>
                ) : (
                  <span />
                )}
                {business.showPrice && (
                  <span className="font-semibold">
                    {formatInr(s.price)}
                    {priceSuffix && <span className="text-dm-muted text-xs font-normal">{priceSuffix}</span>}
                  </span>
                )}
              </div>
              {(business.bookPath || itemCta) && (
                <DemoButton
                  href={business.bookPath ? `${business.bookPath}?service=${s.slug}` : (itemCta?.href ?? '#')}
                  size="sm"
                  variant="secondary"
                  className="mt-4"
                  data-track="cta_click"
                  data-track-props={`{"cta":"demo_service","demo":"${business.id}","service":"${s.slug}"}`}
                >
                  {business.bookPath ? 'Book' : itemCta?.label}
                </DemoButton>
              )}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function toneBar(t: string) {
  return (
    {
      teal: 'bg-teal-500',
      rose: 'bg-rose-400',
      amber: 'bg-amber-400',
      violet: 'bg-violet-400',
      lime: 'bg-lime-400',
      sky: 'bg-sky-400',
    }[t] ?? 'bg-dm-brand'
  )
}

export function Steps({
  eyebrow,
  title,
  steps,
}: {
  eyebrow: string
  title: string
  steps: readonly { title: string; line: string }[]
}) {
  return (
    <section id="how" className="scroll-mt-20 py-16 sm:py-20">
      <div className="container-dm">
        <SectionTitle eyebrow={eyebrow} title={title} />
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.title} as="li" index={i} className="relative pl-14">
              <span className="bg-dm-brand text-dm-on-brand absolute top-0 left-0 inline-flex h-10 w-10 items-center justify-center rounded-full font-display font-bold">
                {i + 1}
              </span>
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              <p className="text-dm-muted mt-1.5 text-sm">{s.line}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function Testimonials({
  items,
  tone = 'surface',
}: {
  items: readonly { quote: string; name: string }[]
  tone?: 'surface' | 'bg'
}) {
  return (
    <section className={cn('py-16 sm:py-20', tone === 'surface' ? 'bg-dm-surface' : '')}>
      <div className="container-dm">
        <ul className="grid gap-4 md:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.name} as="li" index={i} className="dm-card bg-dm-bg p-6">
              <div className="text-dm-accent flex gap-0.5">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm">“{t.quote}”</p>
              <p className="text-dm-muted mt-4 text-xs font-medium">{t.name}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function CtaBand({
  business,
  title,
  line,
  href,
  label,
}: {
  business: DemoBusiness
  title: string
  line: string
  href?: string
  label?: string
}) {
  return (
    <section className="py-16 sm:py-20">
      <Reveal className="container-dm">
        <div className="bg-dm-brand text-dm-on-brand rounded-3xl px-6 py-12 text-center sm:px-12">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-3 max-w-md opacity-80">{line}</p>
          <DemoButton
            href={href ?? business.bookPath ?? business.path}
            variant="inverse"
            size="lg"
            className="bg-dm-bg text-dm-ink mt-8"
            data-track="cta_click"
            data-track-props={`{"cta":"demo_band","demo":"${business.id}"}`}
          >
            {label ?? business.ctaLabel}
          </DemoButton>
        </div>
      </Reveal>
    </section>
  )
}

/** Abstract image tile for galleries. No stock photos, no licensing. */
export function Tile({ tile, label, className }: { tile: string; label: string; className?: string }) {
  return (
    <figure className={cn('relative overflow-hidden rounded-2xl', tile, className)} aria-label={label}>
      <span
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_60%_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]"
      />
      <figcaption className="absolute bottom-3 left-3 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
        {label}
      </figcaption>
    </figure>
  )
}
