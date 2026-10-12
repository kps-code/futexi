import { Calendar, Clock, MessageCircle, Star } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { nova, novaServices, novaSteps, novaTestimonials } from '@/content/demo-booking'
import { formatInr } from '@/lib/booking'
import { NovaButton } from './chrome'

const BASE = '/demo/booking'

export function NovaHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_80%_0%,#ccfbf1_0%,transparent_60%)]"
      />
      <div className="container-nv grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="bg-nv-surface text-nv-muted ring-nv-line inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1">
            <Star className="fill-nv-accent text-nv-accent h-3.5 w-3.5" /> {nova.rating} · {nova.reviews}{' '}
            reviews · {nova.area}
          </p>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Book your appointment in under a minute.
          </h1>
          <p className="text-nv-muted mt-5 max-w-xl text-base text-pretty sm:text-lg">{nova.blurb}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <NovaButton
              href={`${BASE}/book`}
              size="lg"
              data-track="cta_click"
              data-track-props='{"cta":"nova_hero_book"}'
            >
              <Calendar className="h-4 w-4" /> Book now
            </NovaButton>
            <NovaButton href="#services" variant="secondary" size="lg">
              View services
            </NovaButton>
          </div>
          <ul className="text-nv-muted mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Clock className="text-nv-brand h-4 w-4" /> Open 10 AM to 8 PM
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="text-nv-brand h-4 w-4" /> Confirmation on WhatsApp
            </li>
          </ul>
        </div>

        <Reveal className="nv-card relative mx-auto w-full max-w-md p-5">
          <p className="text-nv-muted text-xs font-semibold tracking-[0.18em] uppercase">Next available</p>
          <ul className="mt-3 space-y-2">
            {['Today · 5:30 PM', 'Today · 7:00 PM', 'Tomorrow · 10:30 AM'].map((t, i) => (
              <li
                key={t}
                className="border-nv-line bg-nv-surface flex items-center justify-between rounded-xl border px-4 py-3 text-sm"
              >
                <span className="font-medium">{t}</span>
                <span
                  className={
                    i === 0
                      ? 'bg-nv-brand-soft text-nv-brand-ink rounded-full px-2 py-0.5 text-xs font-medium'
                      : 'text-nv-muted text-xs'
                  }
                >
                  {i === 0 ? 'Popular' : 'Free'}
                </span>
              </li>
            ))}
          </ul>
          <NovaButton
            href={`${BASE}/book`}
            className="mt-4 w-full"
            data-track="cta_click"
            data-track-props='{"cta":"nova_hero_card"}'
          >
            See all slots
          </NovaButton>
          <p className="text-nv-muted mt-3 text-center text-[11px]">
            Sample times. Real availability on the next screen.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

export function NovaServices() {
  return (
    <section id="services" className="bg-nv-surface scroll-mt-20 py-16 sm:py-20">
      <div className="container-nv">
        <div className="max-w-2xl">
          <p className="text-nv-brand text-xs font-semibold tracking-[0.18em] uppercase">Services</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Pick what you need. Prices upfront.
          </h2>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {novaServices.map((s, i) => (
            <Reveal key={s.slug} as="li" index={i} className="nv-card flex flex-col p-5">
              <span className={`h-1.5 w-10 rounded-full ${tone(s.tone)}`} />
              <h3 className="mt-4 font-display text-lg font-semibold">{s.name}</h3>
              <p className="text-nv-muted mt-1.5 flex-1 text-sm">{s.line}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-nv-muted flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {s.minutes} min
                </span>
                <span className="font-semibold">{formatInr(s.price)}</span>
              </div>
              <NovaButton
                href={`${BASE}/book?service=${s.slug}`}
                size="sm"
                variant="secondary"
                className="mt-4"
                data-track="cta_click"
                data-track-props={`{"cta":"nova_service","service":"${s.slug}"}`}
              >
                Book
              </NovaButton>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

function tone(t: string) {
  return (
    { teal: 'bg-teal-500', rose: 'bg-rose-400', amber: 'bg-amber-400', violet: 'bg-violet-400' }[t] ??
    'bg-teal-500'
  )
}

export function NovaHow() {
  return (
    <section id="how" className="scroll-mt-20 py-16 sm:py-20">
      <div className="container-nv">
        <div className="max-w-2xl">
          <p className="text-nv-brand text-xs font-semibold tracking-[0.18em] uppercase">How it works</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Three steps. No phone calls.
          </h2>
        </div>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {novaSteps.map((s, i) => (
            <Reveal key={s.n} as="li" index={i} className="relative pl-14">
              <span className="bg-nv-brand absolute top-0 left-0 inline-flex h-10 w-10 items-center justify-center rounded-full font-display font-bold text-white">
                {s.n}
              </span>
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              <p className="text-nv-muted mt-1.5 text-sm">{s.line}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function NovaTestimonials() {
  return (
    <section className="bg-nv-surface py-16 sm:py-20">
      <div className="container-nv">
        <ul className="grid gap-4 md:grid-cols-3">
          {novaTestimonials.map((t, i) => (
            <Reveal key={t.name} as="li" index={i} className="nv-card p-6">
              <div className="text-nv-accent flex gap-0.5">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-nv-ink mt-4 text-sm">“{t.quote}”</p>
              <p className="text-nv-muted mt-4 text-xs font-medium">{t.name}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function NovaCtaBand() {
  return (
    <section className="py-16 sm:py-20">
      <Reveal className="container-nv">
        <div className="bg-nv-brand rounded-3xl px-6 py-12 text-center text-white sm:px-12">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Ready when you are.</h2>
          <p className="mx-auto mt-3 max-w-md text-white/80">
            Pick a slot now and get a WhatsApp confirmation straight away.
          </p>
          <NovaButton
            href={`${BASE}/book`}
            size="lg"
            className="text-nv-brand-ink hover:bg-nv-brand-soft mt-8 bg-white"
            data-track="cta_click"
            data-track-props='{"cta":"nova_band_book"}'
          >
            Book an appointment
          </NovaButton>
        </div>
      </Reveal>
    </section>
  )
}
