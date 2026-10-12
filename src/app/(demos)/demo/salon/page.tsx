import type { Metadata } from 'next'
import { Calendar, MapPin, Scissors, Sparkles } from 'lucide-react'
import { DemoButton, DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { CtaBand, RatingPill, ServicesGrid, Testimonials, Tile } from '@/components/demos-shared/sections'
import { Reveal } from '@/components/reveal'
import { velvet } from '@/content/demo-businesses'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: `${velvet.name} · ${velvet.tagline}`,
  description: `${velvet.blurb} Salon website concept by KAPOSA FUTEXI.`,
}

const gallery = [
  { tile: 'tile-rose', label: 'Balayage' },
  { tile: 'tile-gold', label: 'Bridal glow' },
  { tile: 'tile-plum', label: 'Global colour' },
  { tile: 'tile-sand', label: 'Keratin finish' },
  { tile: 'tile-coal', label: 'Precision cut' },
  { tile: 'tile-rose', label: 'Nail art' },
] as const

const team = [
  { name: 'Meera Nair', role: 'Creative Director · 14 yrs', focus: 'Colour and bridal' },
  { name: 'Arjun Das', role: 'Senior Stylist · 9 yrs', focus: 'Cuts and keratin' },
  { name: 'Shalini K.', role: 'Skin & Nails · 6 yrs', focus: 'Facials and nail art' },
] as const

const testimonials = [
  { quote: 'Walked in for a trim, walked out with the best balayage I have ever had.', name: 'Anitha V.' },
  { quote: 'Booked online, chair ready the moment I arrived. Zero waiting.', name: 'Rahul S.' },
  { quote: 'My bridal trial felt like a conversation, not a sales pitch.', name: 'Keerthana M.' },
] as const

/** Salon Website demo (Post 1): Velvet Salon home. */
export default async function VelvetHomePage() {
  const settings = await getSiteSettings()
  return (
    <DemoShell business={velvet} whatsappNumber={settings.whatsappNumber}>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_20%_0%,var(--dm-brand-soft)_0%,transparent_60%)]"
        />
        <div className="container-dm grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1fr_1fr]">
          <div>
            <RatingPill business={velvet} />
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Hair, skin and nails. <span className="text-dm-brand">Done beautifully.</span>
            </h1>
            <p className="text-dm-muted mt-5 max-w-xl text-base text-pretty sm:text-lg">{velvet.blurb}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <DemoButton
                href={velvet.bookPath!}
                size="lg"
                data-track="cta_click"
                data-track-props='{"cta":"demo_hero","demo":"salon"}'
              >
                <Calendar className="h-4 w-4" /> Book an appointment
              </DemoButton>
              <DemoButton href="#services" variant="secondary" size="lg">
                See services and prices
              </DemoButton>
            </div>
            <ul className="text-dm-muted mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Scissors className="text-dm-brand h-4 w-4" /> Unisex · walk-ins welcome
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="text-dm-brand h-4 w-4" /> {velvet.area}
              </li>
            </ul>
          </div>
          <Reveal className="grid grid-cols-2 gap-3">
            <Tile tile="tile-rose" label="Balayage" className="aspect-[4/5]" />
            <Tile tile="tile-gold" label="Bridal glow" className="mt-8 aspect-[4/5]" />
          </Reveal>
        </div>
      </section>

      <ServicesGrid
        business={velvet}
        cols={3}
        title="Services and prices"
        sub="What you see is what you pay. Consultation is always free."
      />

      <section id="gallery" className="scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm">
          <SectionTitle eyebrow="Gallery" title="Recent work from the chair" />
          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
            {gallery.map((g, i) => (
              <Reveal key={`${g.label}-${i}`} as="li" index={i}>
                <Tile tile={g.tile} label={g.label} className="aspect-square" />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="team" className="bg-dm-surface scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm">
          <SectionTitle eyebrow="Team" title="Stylists who listen first" />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {team.map((m, i) => (
              <Reveal key={m.name} as="li" index={i} className="dm-card bg-dm-bg flex items-center gap-4 p-5">
                <span className="bg-dm-brand text-dm-on-brand inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-display font-bold">
                  {m.name
                    .split(' ')
                    .map((p) => p[0])
                    .join('')}
                </span>
                <div className="min-w-0">
                  <p className="font-display font-semibold">{m.name}</p>
                  <p className="text-dm-muted text-sm">{m.role}</p>
                  <p className="text-dm-muted mt-1 flex items-center gap-1 text-xs">
                    <Sparkles className="text-dm-accent h-3 w-3" /> {m.focus}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Testimonials items={testimonials} tone="bg" />
      <CtaBand
        business={velvet}
        title="Your chair is waiting."
        line="Pick a stylist-free slot and we will have everything ready."
      />
    </DemoShell>
  )
}
