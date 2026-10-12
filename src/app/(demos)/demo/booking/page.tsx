import type { Metadata } from 'next'
import { Calendar, Clock, MessageCircle } from 'lucide-react'
import { DemoButton, DemoShell } from '@/components/demos-shared/chrome'
import { CtaBand, RatingPill, ServicesGrid, Steps, Testimonials } from '@/components/demos-shared/sections'
import { Reveal } from '@/components/reveal'
import { nova } from '@/content/demo-businesses'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: `${nova.name} · ${nova.tagline}`,
  description: `${nova.blurb} Booking website concept by KAPOSA FUTEXI.`,
}

const steps = [
  { title: 'Choose a service', line: 'Pick what you need and see the duration and price upfront.' },
  { title: 'Pick a date and time', line: 'Only free slots are shown, updated live.' },
  { title: 'Confirm on WhatsApp', line: 'Your booking summary arrives instantly. The studio gets it too.' },
] as const

const testimonials = [
  { quote: 'Booked at 11 pm from my couch. Slot confirmed before I put the phone down.', name: 'Priya R.' },
  { quote: 'No more calling three times to find a free slot. I just pick one.', name: 'Karthik M.' },
  { quote: 'The reminder on WhatsApp saved me from missing my appointment.', name: 'Divya S.' },
] as const

/** Booking Website demo (Post 0): Nova Studio home. */
export default async function NovaHomePage() {
  const settings = await getSiteSettings()
  return (
    <DemoShell business={nova} whatsappNumber={settings.whatsappNumber}>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_80%_0%,var(--dm-brand-soft)_0%,transparent_60%)]"
        />
        <div className="container-dm grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <RatingPill business={nova} />
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Book your appointment in under a minute.
            </h1>
            <p className="text-dm-muted mt-5 max-w-xl text-base text-pretty sm:text-lg">{nova.blurb}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <DemoButton
                href={nova.bookPath!}
                size="lg"
                data-track="cta_click"
                data-track-props='{"cta":"demo_hero","demo":"booking"}'
              >
                <Calendar className="h-4 w-4" /> Book now
              </DemoButton>
              <DemoButton href="#services" variant="secondary" size="lg">
                View services
              </DemoButton>
            </div>
            <ul className="text-dm-muted mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Clock className="text-dm-brand h-4 w-4" /> Open 10 AM to 8 PM
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="text-dm-brand h-4 w-4" /> Confirmation on WhatsApp
              </li>
            </ul>
          </div>

          <Reveal className="dm-card relative mx-auto w-full max-w-md p-5">
            <p className="text-dm-muted text-xs font-semibold tracking-[0.18em] uppercase">Next available</p>
            <ul className="mt-3 space-y-2">
              {['Today · 5:30 PM', 'Today · 7:00 PM', 'Tomorrow · 10:30 AM'].map((t, i) => (
                <li
                  key={t}
                  className="border-dm-line bg-dm-bg flex items-center justify-between rounded-xl border px-4 py-3 text-sm"
                >
                  <span className="font-medium">{t}</span>
                  <span
                    className={
                      i === 0
                        ? 'bg-dm-brand-soft text-dm-brand-ink rounded-full px-2 py-0.5 text-xs font-medium'
                        : 'text-dm-muted text-xs'
                    }
                  >
                    {i === 0 ? 'Popular' : 'Free'}
                  </span>
                </li>
              ))}
            </ul>
            <DemoButton
              href={nova.bookPath!}
              className="mt-4 w-full"
              data-track="cta_click"
              data-track-props='{"cta":"demo_hero_card","demo":"booking"}'
            >
              See all slots
            </DemoButton>
            <p className="text-dm-muted mt-3 text-center text-[11px]">
              Sample times. Real availability on the next screen.
            </p>
          </Reveal>
        </div>
      </section>

      <ServicesGrid business={nova} title="Pick what you need. Prices upfront." />
      <Steps eyebrow="How it works" title="Three steps. No phone calls." steps={steps} />
      <Testimonials items={testimonials} />
      <CtaBand
        business={nova}
        title="Ready when you are."
        line="Pick a slot now and get a WhatsApp confirmation straight away."
        label="Book an appointment"
      />
    </DemoShell>
  )
}
