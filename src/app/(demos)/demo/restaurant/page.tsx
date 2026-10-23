import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CalendarCheck, ShoppingBag } from 'lucide-react'
import { DemoButton, DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { MenuTabs } from '@/components/demos-shared/menu-tabs'
import { HeroScene } from '@/components/demos-shared/motion-v2/hero-scene'
import { MotionV2 } from '@/components/demos-shared/motion-v2/motion'
import { Photo } from '@/components/demos-shared/photo'
import { CtaBand, Testimonials } from '@/components/demos-shared/sections'
import { FadeUp, Words } from '@/components/demos-shared/words'
import { Reveal } from '@/components/reveal'
import { saffron } from '@/content/demo-businesses'
import {
  saffronGallery,
  saffronMenu,
  saffronOffers,
  saffronPhotos,
  saffronPrivate,
  saffronSignature,
  saffronStatement,
  saffronStory,
  saffronTestimonials,
} from '@/content/demo-restaurant'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: `${saffron.name} · ${saffron.tagline}`,
  description: `${saffron.blurb} Restaurant website concept by KAPOSA FUTEXI.`,
}

/** Restaurant Website demo (Post 2): Saffron Kitchen home, a dark fine-dining layout. */
export default async function SaffronHomePage() {
  const settings = await getSiteSettings()
  const occasions = [saffronPrivate[0], saffronPrivate[2]]
  return (
    <DemoShell business={saffron} whatsappNumber={settings.whatsappNumber}>
      {/* Hero: full screen, the fire photo almost black, a light serif headline in the centre.
          On desktop, Motion v2 blurs the characters in, lifts a 3D cloche off a plate and lets embers rise. */}
      <section className="v2-hero relative isolate flex min-h-[100dvh] items-center overflow-hidden">
        <div className="dm-parallax absolute inset-0 -z-10">
          <Photo
            photo={saffronPhotos.heroFire}
            priority
            quality={70}
            zoom={false}
            sizes="100vw"
            className="v2-hero-photo dm-settle absolute inset-0 h-full w-full rounded-none"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_40%,rgba(14,12,10,0.35)_0%,rgba(14,12,10,0.85)_70%,rgba(14,12,10,1)_100%)]"
          />
        </div>
        <HeroScene scene="saffron" />
        <div className="container-dm relative py-24 text-center">
          <FadeUp index={0} className="dm-label text-dm-brand">
            {saffron.area} · Chettinad fire kitchen · Since 2018 · ★ {saffron.rating}
          </FadeUp>
          <h1 className="mx-auto mt-8 max-w-5xl font-display text-5xl leading-[1] text-balance sm:text-7xl lg:text-[6.5rem]">
            <Words text="A table" />
            <br />
            <Words text="by the fire." accent={['fire.']} startIndex={2} />
          </h1>
          <FadeUp
            index={1}
            as="p"
            className="text-dm-muted mx-auto mt-8 max-w-xl text-base text-pretty sm:text-lg"
          >
            {saffron.blurb}
          </FadeUp>
          <FadeUp index={2} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <DemoButton
              href={saffron.bookPath!}
              size="lg"
              className="dm-shimmer"
              data-magnetic
              data-track="cta_click"
              data-track-props='{"cta":"demo_hero","demo":"restaurant"}'
            >
              <CalendarCheck className="h-4 w-4" /> Reserve a table
            </DemoButton>
            <DemoButton
              href="#menu"
              variant="secondary"
              size="lg"
              data-track="cta_click"
              data-track-props='{"cta":"demo_hero_menu","demo":"restaurant"}'
            >
              Tonight&apos;s menu
            </DemoButton>
          </FadeUp>
          <FadeUp
            index={3}
            className="rs-cue text-dm-muted mt-16 hidden flex-col items-center gap-3 text-[11px] tracking-[0.3em] uppercase lg:flex"
          >
            <span>Scroll</span>
            <span className="rs-cue-line" aria-hidden />
          </FadeUp>
        </div>
      </section>

      {/* Statement: one bold line, sharpened character by character on desktop. */}
      <section className="py-20 sm:py-28">
        <div className="container-dm grid gap-8 lg:grid-cols-[1fr_3fr]">
          <p className="dm-label text-dm-brand">The kitchen</p>
          <p className="rs-statement font-display text-3xl leading-tight text-balance sm:text-4xl lg:text-5xl">
            {saffronStatement}
          </p>
        </div>
      </section>

      {/* Signature dishes: a 3D ring that turns as you scroll (desktop); a two-column list on phones. */}
      <section className="rs-stage border-dm-line border-y py-20 sm:py-28">
        <div className="container-dm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle eyebrow="Signature" title="Six plates we are known for" />
            <Link
              href="#menu"
              className="dm-underline text-dm-brand inline-flex items-center gap-1 text-sm font-medium"
            >
              The full menu <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rs-ring-wrap mt-12">
            <ul className="rs-ring">
              {saffronSignature.map((d, i) => (
                <li key={d.name} className="rs-dish" style={{ ['--i' as string]: i }}>
                  <Photo
                    photo={d.photo}
                    quality={85}
                    sizes="(min-width: 1024px) 20rem, 45vw"
                    className="aspect-[4/5]"
                  />
                  <div className="rs-dish-copy">
                    <p className="font-display text-xl">{d.name}</p>
                    <p className="text-dm-muted mt-1 text-xs">{d.line}</p>
                    <p className="text-dm-brand mt-2 text-sm">{d.price}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <p className="rs-ring-caption text-dm-muted mt-8 hidden text-center text-sm lg:block" aria-hidden>
            {saffronSignature[0].name} · {saffronSignature[0].price}
          </p>
        </div>
      </section>

      {/* Menu: hairlines, no cards. */}
      <section id="menu" className="scroll-mt-20 py-20 sm:py-28">
        <div className="container-dm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              eyebrow="Menu"
              title="Tonight's menu"
              sub="Updated by the kitchen from the admin. No PDFs, no blurry photos."
            />
            <Link
              href={`${saffron.path}/order`}
              className="dm-underline text-dm-brand inline-flex items-center gap-1 text-sm font-medium"
            >
              <ShoppingBag className="h-4 w-4" /> Order for delivery or pickup
            </Link>
          </div>
          <div className="rs-menu mt-10">
            <MenuTabs categories={saffronMenu} />
          </div>
        </div>
      </section>

      {/* Story: the dining room, three facts, a quiet paragraph. */}
      <section id="about" className="bg-dm-surface scroll-mt-20 py-20 sm:py-28">
        <div className="container-dm grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <Reveal className="rs-story-photo relative aspect-[4/3] overflow-hidden rounded-[var(--dm-radius-img)]">
            <Photo
              photo={saffronPhotos.diningRoom}
              zoom={false}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="absolute inset-0 h-full w-full rounded-none"
            />
          </Reveal>
          <div className="rs-story-copy">
            <p className="dm-label text-dm-brand">The room</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">
              Forty seats, <em>one fire.</em>
            </h2>
            <p className="text-dm-muted mt-6">
              Saffron Kitchen started as a Sunday lunch for forty friends. Chef Meenakshi still grinds every
              masala in house and cooks the kuzhambu in the same brass vessel her grandmother used.
            </p>
            <ul className="divide-dm-line mt-8 divide-y">
              {saffronStory.map((f) => (
                <li key={f.label} className="flex items-baseline justify-between gap-6 py-3">
                  <span className="text-dm-muted text-sm">{f.label}</span>
                  <span className="font-display text-3xl">{f.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Private dining: two occasions as alternating editorial rows. */}
      <section id="occasions" className="scroll-mt-20 py-20 sm:py-28">
        <div className="container-dm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              eyebrow="Private dining"
              title="Dinner, made an occasion"
              sub="A candle-lit table for two or the whole hall for forty."
            />
            <Link
              href={`${saffron.path}/private-dining`}
              className="dm-underline text-dm-brand inline-flex items-center gap-1 text-sm font-medium"
            >
              All packages <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="mt-12 space-y-10">
            {occasions.map((pk, i) => (
              <li key={pk.slug} className="rs-row grid items-center gap-8 lg:grid-cols-2">
                <Link
                  href={`${saffron.path}/private-dining#packages`}
                  className={i % 2 ? 'rs-row-photo lg:order-2' : 'rs-row-photo'}
                >
                  <Photo
                    photo={pk.photo}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="aspect-[16/10]"
                  />
                </Link>
                <div className={i % 2 ? 'rs-row-copy lg:order-1 lg:pr-12' : 'rs-row-copy lg:pl-12'}>
                  <p className="dm-label text-dm-brand">{pk.guests}</p>
                  <h3 className="mt-3 font-display text-3xl sm:text-4xl">{pk.name}</h3>
                  <p className="text-dm-muted mt-4">{pk.line}</p>
                  <p className="mt-6 font-display text-2xl">
                    {pk.price} <span className="text-dm-muted text-base">{pk.priceNote}</span>
                  </p>
                  <DemoButton
                    href={`${saffron.path}/private-dining#packages`}
                    variant="secondary"
                    className="mt-6"
                  >
                    See the package
                  </DemoButton>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Offers: two hairline rows. */}
      <section id="offers" className="bg-dm-surface scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm">
          <SectionTitle eyebrow="Offers" title="This week" />
          <ul className="rs-offers divide-dm-line mt-8 divide-y">
            {saffronOffers.map((o) => (
              <li key={o.title} className="flex flex-wrap items-baseline justify-between gap-4 py-5">
                <div>
                  <p className="font-display text-2xl">{o.title}</p>
                  <p className="text-dm-muted mt-1 text-sm">{o.line}</p>
                </div>
                <span className="text-dm-brand font-display text-2xl">{o.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Gallery: from the pass. */}
      <section id="gallery" className="scroll-mt-20 py-20 sm:py-28">
        <div className="container-dm">
          <SectionTitle eyebrow="Gallery" title="From the pass" />
          <ul className="rs-gallery mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {saffronGallery.map((g) => (
              <li key={g.label}>
                <Photo
                  photo={g.photo}
                  label={g.label}
                  className="aspect-square"
                  sizes="(min-width: 768px) 25vw, 50vw"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Testimonials items={saffronTestimonials} tone="bg" />
      <CtaBand
        business={saffron}
        title="Dinner, sorted."
        line="Reserve a table and we will hold it for 15 minutes past your time."
      />
      <MotionV2 recipe="saffron" />
    </DemoShell>
  )
}
