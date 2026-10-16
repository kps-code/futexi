import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CalendarCheck, Clock, Flame, MapPin, ShoppingBag } from 'lucide-react'
import { DemoButton, DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { MenuTabs } from '@/components/demos-shared/menu-tabs'
import { Photo } from '@/components/demos-shared/photo'
import { CtaBand, RatingPill, Testimonials } from '@/components/demos-shared/sections'
import { Reveal } from '@/components/reveal'
import { saffron } from '@/content/demo-businesses'
import {
  saffronGallery,
  saffronMenu,
  saffronOffers,
  saffronPhotos,
  saffronPrivate,
  saffronTestimonials,
} from '@/content/demo-restaurant'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: `${saffron.name} · ${saffron.tagline}`,
  description: `${saffron.blurb} Restaurant website concept by KAPOSA FUTEXI.`,
}

/** Restaurant Website demo (Post 2): Saffron Kitchen home. */
export default async function SaffronHomePage() {
  const settings = await getSiteSettings()
  const occasions = [saffronPrivate[0], saffronPrivate[2]]
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
              <DemoButton
                href={`${saffron.path}/order`}
                variant="secondary"
                size="lg"
                data-track="cta_click"
                data-track-props='{"cta":"demo_hero_order","demo":"restaurant"}'
              >
                <ShoppingBag className="h-4 w-4" /> Order online
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
            <Photo
              photo={saffronPhotos.heroFire}
              label="From the fire"
              priority
              sizes="(min-width: 1024px) 24vw, 50vw"
              className="aspect-[4/5]"
            />
            <Photo
              photo={saffronPhotos.heroCandle}
              label="Candle-light dinner"
              priority
              sizes="(min-width: 1024px) 24vw, 50vw"
              className="mt-8 aspect-[4/5]"
            />
          </Reveal>
        </div>
      </section>

      <section id="menu" className="bg-dm-surface scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              eyebrow="Menu"
              title="Tonight's menu"
              sub="Updated by the kitchen from the admin. No PDFs, no blurry photos."
            />
            <Link
              href={`${saffron.path}/order`}
              className="text-dm-brand inline-flex items-center gap-1 text-sm font-medium hover:underline"
            >
              Order for delivery or pickup <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10">
            <MenuTabs categories={saffronMenu} />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-dm">
          <SectionTitle eyebrow="Gallery" title="From the pass" />
          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {saffronGallery.map((g, i) => (
              <Reveal key={g.label} as="li" index={i}>
                <Photo
                  photo={g.photo}
                  label={g.label}
                  className="aspect-square"
                  sizes="(min-width: 768px) 25vw, 50vw"
                />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="occasions" className="bg-dm-surface scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              eyebrow="Private dining"
              title="Dinner, made an occasion"
              sub="A candle-lit table for two or the whole hall for forty."
            />
            <Link
              href={`${saffron.path}/private-dining`}
              className="text-dm-brand inline-flex items-center gap-1 text-sm font-medium hover:underline"
            >
              All packages <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {occasions.map((pk, i) => (
              <Reveal key={pk.slug} as="li" index={i}>
                <Link
                  href={`${saffron.path}/private-dining#packages`}
                  className="group dm-card dm-lift bg-dm-bg flex gap-5 overflow-hidden p-3"
                >
                  <Photo
                    photo={pk.photo}
                    className="h-36 w-36 shrink-0 rounded-xl sm:h-40 sm:w-44"
                    sizes="176px"
                    imgClassName="transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="flex flex-col justify-center py-2">
                    <p className="text-dm-muted text-xs font-medium">{pk.guests}</p>
                    <h3 className="mt-1 font-display text-xl font-semibold">{pk.name}</h3>
                    <p className="text-dm-muted mt-1 text-sm">{pk.line}</p>
                    <p className="mt-3 text-sm font-semibold">
                      {pk.price} <span className="text-dm-muted font-normal">{pk.priceNote}</span>
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="offers" className="scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm">
          <SectionTitle eyebrow="Offers" title="This week" />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {saffronOffers.map((o, i) => (
              <Reveal
                key={o.title}
                as="li"
                index={i}
                className="dm-card dm-lift flex items-start justify-between gap-4 p-6"
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

      <section id="about" className="bg-dm-surface scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
          <Reveal>
            <Photo
              photo={saffronPhotos.about}
              label="The dining room"
              className="aspect-[4/3]"
              sizes="(min-width: 768px) 40vw, 100vw"
            />
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

      <Testimonials items={saffronTestimonials} tone="bg" />
      <CtaBand
        business={saffron}
        title="Dinner, sorted."
        line="Reserve a table and we will hold it for 15 minutes past your time."
      />
    </DemoShell>
  )
}
