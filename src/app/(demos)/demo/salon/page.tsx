import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Gem, Hand, Palette, Scissors, Sparkles, SprayCan, type LucideIcon } from 'lucide-react'
import { DemoButton, DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { HeroScene } from '@/components/demos-shared/motion-v2/hero-scene'
import { MotionV2 } from '@/components/demos-shared/motion-v2/motion'
import { Photo } from '@/components/demos-shared/photo'
import { CtaBand, Testimonials } from '@/components/demos-shared/sections'
import { FadeUp, Words } from '@/components/demos-shared/words'
import { Reveal } from '@/components/reveal'
import { velvet } from '@/content/demo-businesses'
import {
  velvetGallery,
  velvetHighlights,
  velvetLounge,
  velvetMarqueeExtras,
  velvetMenu,
  velvetPhotos,
  velvetProducts,
  velvetQuickPrices,
  velvetStats,
  velvetTeam,
  velvetTestimonials,
  type VelvetIcon,
} from '@/content/demo-velvet'
import { whatsappLink } from '@/lib/whatsapp'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: `${velvet.name} · ${velvet.tagline}`,
  description: `${velvet.blurb} Salon website concept by KAPOSA FUTEXI.`,
}

const icons: Record<VelvetIcon, LucideIcon> = {
  scissors: Scissors,
  razor: SprayCan,
  palette: Palette,
  sparkles: Sparkles,
  hand: Hand,
  gem: Gem,
}

const band = [...velvetMenu.map((g) => g.category), ...velvetMarqueeExtras]
const bandRow = (items: readonly string[]) =>
  [...items, ...items, ...items].map((item, i) => (
    <span key={`${item}-${i}`} className="inline-flex items-center gap-10">
      {item}
      <i>·</i>
    </span>
  ))

const wedding = [
  {
    n: '01',
    title: 'Consultation',
    line: 'Thirty minutes with Meera and Faisal about the outfits, the jewellery and the venue light.',
    photo: velvetPhotos.makeupKit,
  },
  {
    n: '02',
    title: 'Trial',
    line: 'Her full look, photographed in daylight and tungsten. His cut and beard, a week before.',
    photo: velvetPhotos.makeupEye,
  },
  {
    n: '03',
    title: 'The morning',
    line: 'Two artists and a barber at the venue, two hours before. The touch-up kit stays with you.',
    photo: velvetPhotos.barber,
  },
  {
    n: '04',
    title: 'Reception',
    line: 'A second look for her, a fresh line-up for him, lasting until the last photo.',
    photo: velvetPhotos.heroPortrait,
  },
] as const

/** Salon Website demo (Post 1): Velvet Salon home, a dark barber lounge for him and for her. */
export default async function VelvetHomePage() {
  const settings = await getSiteSettings()
  const ask = (name: string) =>
    whatsappLink(
      settings.whatsappNumber,
      `Hi ${velvet.name}, is the ${name} in stock? I would like to pick one up.`,
    )
  return (
    <DemoShell business={velvet} whatsappNumber={settings.whatsappNumber}>
      {/* Hero: full-bleed lounge photo, headline on the left, her and him portrait cards on the right.
          On desktop, Motion v2 slides the headline words in from alternating sides, uncovers the
          portraits and rolls a gold silk ribbon over the dimmed photo. */}
      <section className="v2-hero relative isolate overflow-hidden">
        <div className="dm-parallax absolute inset-0 -z-10">
          <Photo
            photo={velvetPhotos.heroBarber}
            priority
            quality={60}
            zoom={false}
            sizes="100vw"
            className="v2-hero-photo dm-settle absolute inset-0 h-full w-full rounded-none"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,17,13,0.92)_0%,rgba(22,17,13,0.7)_45%,rgba(22,17,13,0.35)_100%),linear-gradient(180deg,rgba(22,17,13,0.2)_0%,transparent_30%,rgba(22,17,13,0.95)_100%)]"
          />
        </div>
        <HeroScene scene="velvet" />
        <div className="container-dm grid items-center gap-12 pt-16 pb-20 sm:pt-24 lg:min-h-[86vh] lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <FadeUp index={0} className="dm-label text-dm-brand">
              T. Nagar · Est. 2014 · For him and for her · ★ {velvet.rating}
            </FadeUp>
            <h1 className="mt-6 font-display text-[2.9rem] leading-[1.02] text-balance sm:text-7xl lg:text-[5.75rem]">
              <Words text="More than just" />
              <br />
              <Words text="a haircut." accent={['haircut.']} startIndex={3} />
            </h1>
            <FadeUp index={1} as="p" className="text-dm-muted mt-8 max-w-md text-base sm:text-lg">
              {velvet.blurb}
            </FadeUp>
            <FadeUp index={2} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <DemoButton
                href={velvet.bookPath!}
                size="lg"
                className="dm-shimmer"
                data-magnetic
                data-cursor="Book"
                data-track="cta_click"
                data-track-props='{"cta":"demo_hero","demo":"salon"}'
              >
                Book an appointment
              </DemoButton>
              <DemoButton href="#services" variant="secondary" size="lg">
                Explore services
              </DemoButton>
            </FadeUp>
          </div>
          <div className="relative grid grid-cols-2 gap-4 lg:col-span-5 lg:gap-6">
            <Reveal className="v2-portrait relative mt-10 overflow-hidden">
              <Photo
                photo={velvetPhotos.womanPortrait}
                priority
                quality={60}
                sizes="(min-width: 1024px) 20vw, 44vw"
                className="dm-frame aspect-[3/4]"
                label="For her"
              />
            </Reveal>
            <Reveal index={2} className="v2-portrait-sm relative overflow-hidden">
              <Photo
                photo={velvetPhotos.manPortrait}
                priority
                quality={60}
                sizes="(min-width: 1024px) 20vw, 44vw"
                className="dm-frame aspect-[3/4]"
                label="For him"
              />
            </Reveal>
            <p className="v2-hero-label dm-label text-dm-muted absolute top-4 -right-2 hidden [writing-mode:vertical-rl] lg:block">
              Hair · Beard · Skin · Nails
            </p>
          </div>
        </div>
      </section>

      {/* Stats line with counters. */}
      <section className="border-dm-line border-y">
        <div className="container-dm divide-dm-line grid grid-cols-2 md:grid-cols-4 md:divide-x">
          {velvetStats.map((st, i) => (
            <Reveal key={st.label} index={i} className="py-8 md:px-6 md:first:pl-0">
              <p className="font-display text-5xl">
                <span data-count={st.value} data-count-suffix={st.suffix}>
                  {st.value}
                  {st.suffix}
                </span>
              </p>
              <p className="dm-label text-dm-muted mt-2">{st.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Type band: outlined and gold rows that move against each other with the scroll (desktop);
          one row runs on its own on phones. */}
      <div className="v2-band" aria-hidden>
        <div className="v2-band-row">{bandRow(band)}</div>
        <div className="v2-band-row">{bandRow([...band].reverse())}</div>
      </div>

      {/* Services: photo cards with a gold icon square, for her, for him, for everyone. */}
      <section id="services" className="scroll-mt-20 py-20 sm:py-28">
        <div className="container-dm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              eyebrow="Our services"
              title="One floor for him, one for her, one chair for everyone"
              sub="Barber chairs downstairs, styling and skin upstairs. Book either in a minute."
            />
            <Link href={`${velvet.path}/services`} className="dm-underline text-dm-brand dm-label">
              Full price list <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {velvetHighlights.map((h, i) => {
              const Icon = icons[h.icon]
              return (
                <Reveal key={h.slug + h.for} as="li" index={i}>
                  <article
                    data-tilt="4"
                    data-cursor="Book"
                    className="vb-card border-dm-line flex h-full flex-col border"
                  >
                    <div className="relative">
                      <Photo
                        photo={h.photo}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="aspect-[4/3] rounded-none"
                      />
                      <span className="vb-icon absolute -bottom-6 left-5">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="dm-label absolute top-3 right-3 bg-black/50 px-2.5 py-1 text-[10px] text-white backdrop-blur">
                        For {h.for}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5 pt-10">
                      <h3 className="font-display text-2xl">{h.title}</h3>
                      <p className="text-dm-muted mt-2 flex-1 text-sm">{h.line}</p>
                      <DemoButton
                        href={`${velvet.bookPath}?service=${h.slug}`}
                        size="sm"
                        variant="secondary"
                        className="mt-5 self-start"
                        data-track="cta_click"
                        data-track-props={`{"cta":"demo_service","demo":"salon","service":"${h.slug}"}`}
                      >
                        Book this
                      </DemoButton>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Prices at a glance: dark cards with a gold icon, name and price. */}
      <section className="bg-dm-surface border-dm-line border-y py-20 sm:py-28">
        <div className="container-dm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              eyebrow="Prices"
              title="What you see is what you pay"
              sub="Consultation is always free. The full list has forty more lines."
            />
            <Link href={`${velvet.path}/services`} className="dm-underline text-dm-brand dm-label">
              Full list <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="v2-prices mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {velvetQuickPrices.map((p, i) => {
              const Icon = icons[p.icon]
              return (
                <Reveal key={p.name} as="li" index={i}>
                  <Link
                    href={`${velvet.bookPath}?service=${p.slug}`}
                    data-cursor="Book"
                    className="border-dm-line bg-dm-bg hover:border-dm-line-strong flex h-full flex-col gap-4 border p-5 transition-colors"
                  >
                    <span className="vb-icon">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1 text-sm">{p.name}</span>
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="font-display text-3xl">{p.price}</span>
                      <span className="dm-label text-dm-brand">Book</span>
                    </span>
                  </Link>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </section>

      {/* The lounge: the shop photo beside three features. */}
      <section className="vb-wood py-20 sm:py-28">
        <div className="container-dm grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal className="v2-lounge-photo dm-parallax relative aspect-[4/5] overflow-hidden lg:aspect-[4/5]">
            <Photo
              photo={velvetPhotos.shopInterior}
              zoom={false}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="dm-frame absolute inset-0 h-full w-full"
            />
          </Reveal>
          <div className="v2-lounge-copy">
            <SectionTitle
              eyebrow="The lounge"
              title="A lounge, not a waiting room"
              sub="Brick walls, leather chairs and an espresso machine that runs all day. Come early, leave late."
            />
            <ul className="mt-10 space-y-6">
              {velvetLounge.map((f) => (
                <li key={f.title} className="flex items-center gap-5">
                  <Photo photo={f.photo} sizes="96px" className="dm-frame h-20 w-20 shrink-0" />
                  <div>
                    <h3 className="font-display text-2xl">{f.title}</h3>
                    <p className="text-dm-muted mt-1 text-sm">{f.line}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Gallery: editorial masonry, her and him. */}
      <section id="gallery" className="scroll-mt-20 py-20 sm:py-28">
        <div className="container-dm">
          <SectionTitle eyebrow="Gallery" title="Recent work from both chairs" />
          <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {velvetGallery.map((g, i) => (
              <Reveal key={`${g.label}-${i}`} as="li" index={i} className={g.tall ? 'row-span-2' : ''}>
                <div data-cursor="View" className="dm-scale-in">
                  <Photo
                    photo={g.photo}
                    label={g.label}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className={g.tall ? 'dm-frame aspect-[3/4] h-full' : 'dm-frame aspect-square'}
                  />
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Weddings: the pinned story, bride and groom. */}
      <section className="dm-pin" style={{ ['--dm-track-shift' as string]: '50%' }}>
        <div className="dm-pin-stage">
          <div className="container-dm w-full">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionTitle eyebrow="Weddings" title="The wedding morning, handled for both of you" />
              <Link href={`${velvet.path}/bridal`} className="dm-underline text-dm-brand dm-label">
                Bridal and groom packages <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
              </Link>
            </div>
            <ol className="dm-pin-track mt-10">
              {wedding.map((s) => (
                <li key={s.n} data-cursor="View" className="w-[78vw] shrink-0 sm:w-[46vw] lg:w-[30vw]">
                  <Photo
                    photo={s.photo}
                    sizes="(min-width: 1024px) 30vw, 78vw"
                    className="dm-frame aspect-[3/4]"
                  />
                  <div className="v2-step-copy">
                    <p className="dm-label text-dm-brand mt-6">{s.n}</p>
                    <h3 className="mt-1 font-display text-3xl">{s.title}</h3>
                    <p className="text-dm-muted mt-2 max-w-sm text-sm">{s.line}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* The shelf: products customers ask for, reserved on WhatsApp. */}
      <section className="vb-wood border-dm-line border-y py-20 sm:py-28">
        <div className="container-dm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              eyebrow="The shelf"
              title="Take the chair home"
              sub="What we use at the chair, sold over the counter. Message us and we keep one aside."
            />
          </div>
          <ul className="v2-shelf mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {velvetProducts.map((p, i) => (
              <Reveal key={p.name} as="li" index={i}>
                <article data-tilt="4" className="vb-card border-dm-line flex h-full flex-col border">
                  <Photo
                    photo={p.photo}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="aspect-square rounded-none"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-xl">{p.name}</h3>
                    <p className="text-dm-muted mt-1 flex-1 text-sm">{p.line}</p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="font-display text-2xl">{p.price}</span>
                      <a
                        href={ask(p.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-track="whatsapp_click"
                        data-track-props={`{"where":"demo_shelf","demo":"salon","product":"${p.name}"}`}
                        className="dm-btn-motion inline-flex h-9 items-center justify-center rounded-[var(--dm-radius-btn)] bg-[#25D366] px-4 text-white"
                      >
                        Reserve
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Team. */}
      <section id="team" className="scroll-mt-20 py-20 sm:py-28">
        <div className="container-dm">
          <SectionTitle
            eyebrow="Our masters"
            title="Stylists and barbers who listen first"
            sub="Two chairs for her, two for him, and everyone asks what you want before picking up the scissors."
          />
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {velvetTeam.map((m, i) => (
              <Reveal key={m.name} as="li" index={i}>
                <article data-tilt="4" data-cursor="Book" className="group">
                  <Photo
                    photo={m.photo}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="dm-frame aspect-[4/5]"
                  />
                  <div className="mt-6 flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl">{m.name}</h3>
                    <span className="text-dm-brand font-display text-2xl">{m.years}y</span>
                  </div>
                  <p className="dm-label text-dm-muted mt-1">{m.role}</p>
                  <p className="text-dm-muted mt-2 text-sm">{m.focus}</p>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Testimonials items={velvetTestimonials} tone="bg" />
      <CtaBand
        business={velvet}
        title="Your chair is waiting."
        line="Pick a free slot and we will have everything ready, hot towel included."
      />
      <MotionV2 recipe="velvet" />
    </DemoShell>
  )
}
