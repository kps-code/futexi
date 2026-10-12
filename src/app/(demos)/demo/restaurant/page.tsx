import type { Metadata } from 'next'
import { CalendarCheck, Clock, Flame, MapPin } from 'lucide-react'
import { DemoButton, DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { MenuTabs, type MenuCategory } from '@/components/demos-shared/menu-tabs'
import { CtaBand, RatingPill, Testimonials, Tile } from '@/components/demos-shared/sections'
import { Reveal } from '@/components/reveal'
import { saffron } from '@/content/demo-businesses'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: `${saffron.name} · ${saffron.tagline}`,
  description: `${saffron.blurb} Restaurant website concept by KAPOSA FUTEXI.`,
}

const menu: readonly MenuCategory[] = [
  {
    name: 'Starters',
    items: [
      {
        name: 'Chettinad Pepper Chicken',
        line: 'Slow-fried with black pepper, curry leaf and fennel.',
        price: 349,
        spicy: true,
        popular: true,
      },
      { name: 'Banana Flower Vadai', line: 'Crisp lentil fritters, coconut chutney.', price: 199, veg: true },
      {
        name: 'Karaikudi Prawn Fry',
        line: 'Tiger prawns, roasted spice crust, lime.',
        price: 429,
        spicy: true,
      },
      { name: 'Paniyaram Trio', line: 'Sweet, savoury and herb, with podi.', price: 179, veg: true },
    ],
  },
  {
    name: 'Mains',
    items: [
      {
        name: 'Mutton Kuzhambu',
        line: 'Shoulder cut, tamarind, shallots. Served with idiyappam.',
        price: 549,
        spicy: true,
        popular: true,
      },
      {
        name: 'Kathirikai Kara Kuzhambu',
        line: 'Baby brinjal in a smoky tamarind gravy.',
        price: 299,
        veg: true,
        spicy: true,
      },
      { name: 'Meen Varuval Thali', line: 'Seer fish fry, rasam, poriyal, rice, appalam.', price: 599 },
      {
        name: 'Vegetable Biryani',
        line: 'Seeraga samba rice, seasonal vegetables, raita.',
        price: 329,
        veg: true,
      },
    ],
  },
  {
    name: 'Breads & Rice',
    items: [
      { name: 'Malabar Parotta (2)', line: 'Layered and flaky, griddled to order.', price: 99, veg: true },
      { name: 'Ghee Rice', line: 'Short-grain rice, cashew, clove.', price: 179, veg: true },
      { name: 'Idiyappam (4)', line: 'Steamed rice noodles.', price: 119, veg: true },
    ],
  },
  {
    name: 'Desserts & Drinks',
    items: [
      {
        name: 'Filter Coffee Panna Cotta',
        line: 'Our signature. Strong, silky, not too sweet.',
        price: 229,
        veg: true,
        popular: true,
      },
      { name: 'Elaneer Payasam', line: 'Tender coconut, jaggery, cardamom.', price: 199, veg: true },
      { name: 'Nannari Sherbet', line: 'Sarsaparilla root, lime, soda.', price: 129, veg: true },
    ],
  },
]

const gallery = [
  { tile: 'tile-ember', label: 'Open fire kitchen' },
  { tile: 'tile-gold', label: 'Meen varuval thali' },
  { tile: 'tile-sand', label: 'Courtyard seating' },
  { tile: 'tile-coal', label: 'Pepper chicken' },
] as const

const offers = [
  { title: 'Weekday lunch thali', line: 'Unlimited thali, 12 to 3 PM, Monday to Friday.', price: '₹349' },
  {
    title: 'Family Sunday',
    line: 'Tables of 6 or more get a complimentary dessert platter.',
    price: 'Free dessert',
  },
] as const

const testimonials = [
  { quote: 'The pepper chicken alone is worth the drive across the city.', name: 'Vignesh R.' },
  { quote: 'Reserved online, table ready at 8 sharp on a Saturday. Unheard of.', name: 'Lakshmi N.' },
  { quote: 'Menu on the website meant no squinting at a blurry photo on Instagram.', name: 'Jonathan P.' },
] as const

/** Restaurant Website demo (Post 2): Saffron Kitchen home. */
export default async function SaffronHomePage() {
  const settings = await getSiteSettings()
  return (
    <DemoShell business={saffron} whatsappNumber={settings.whatsappNumber}>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_80%_0%,var(--dm-brand-soft)_0%,transparent_60%)]"
        />
        <div className="container-dm grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <RatingPill business={saffron} />
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Modern South Indian, <span className="text-dm-brand">cooked over fire.</span>
            </h1>
            <p className="text-dm-muted mt-5 max-w-xl text-base text-pretty sm:text-lg">{saffron.blurb}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <DemoButton
                href={saffron.bookPath!}
                size="lg"
                data-track="cta_click"
                data-track-props='{"cta":"demo_hero","demo":"restaurant"}'
              >
                <CalendarCheck className="h-4 w-4" /> Reserve a table
              </DemoButton>
              <DemoButton href="#menu" variant="secondary" size="lg">
                See the menu
              </DemoButton>
            </div>
            <ul className="text-dm-muted mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Clock className="text-dm-brand h-4 w-4" /> 12 PM to 11 PM, every day
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="text-dm-brand h-4 w-4" /> {saffron.area}
              </li>
            </ul>
          </div>
          <Reveal className="grid grid-cols-2 gap-3">
            <Tile tile="tile-ember" label="Open fire kitchen" className="aspect-[4/5]" />
            <Tile tile="tile-gold" label="Meen varuval thali" className="mt-8 aspect-[4/5]" />
          </Reveal>
        </div>
      </section>

      <section id="menu" className="bg-dm-surface scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm">
          <SectionTitle
            eyebrow="Menu"
            title="Tonight's menu"
            sub="Updated by the kitchen from the admin. No PDFs, no blurry photos."
          />
          <div className="mt-10">
            <MenuTabs categories={menu} />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-dm">
          <SectionTitle eyebrow="Gallery" title="From the pass" />
          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {gallery.map((g, i) => (
              <Reveal key={g.label} as="li" index={i}>
                <Tile tile={g.tile} label={g.label} className="aspect-square" />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="offers" className="bg-dm-surface scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm">
          <SectionTitle eyebrow="Offers" title="This week" />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {offers.map((o, i) => (
              <Reveal
                key={o.title}
                as="li"
                index={i}
                className="dm-card bg-dm-bg flex items-start justify-between gap-4 p-6"
              >
                <div>
                  <p className="font-display text-lg font-semibold">{o.title}</p>
                  <p className="text-dm-muted mt-1 text-sm">{o.line}</p>
                </div>
                <span className="bg-dm-brand-soft text-dm-brand-ink shrink-0 rounded-full px-3 py-1 text-sm font-semibold">
                  {o.price}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="about" className="scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
          <Reveal>
            <Tile tile="tile-sand" label="Chef Meenakshi" className="aspect-[4/3]" />
          </Reveal>
          <Reveal index={1}>
            <SectionTitle eyebrow="About" title="Recipes from the Chettinad coast" />
            <p className="text-dm-muted mt-4">
              Saffron Kitchen started as a Sunday lunch for forty friends. Chef Meenakshi still grinds every
              masala in house and cooks the kuzhambu in the same brass vessel her grandmother used.
            </p>
            <p className="text-dm-muted mt-3 flex items-center gap-2 text-sm">
              <Flame className="text-dm-brand h-4 w-4" /> Wood-fired since 2018
            </p>
          </Reveal>
        </div>
      </section>

      <Testimonials items={testimonials} />
      <CtaBand
        business={saffron}
        title="Dinner, sorted."
        line="Reserve a table and we will hold it for 15 minutes past your time."
      />
    </DemoShell>
  )
}
