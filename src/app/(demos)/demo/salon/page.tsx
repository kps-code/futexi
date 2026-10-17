import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { DemoButton, DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { Photo } from '@/components/demos-shared/photo'
import { CtaBand, Testimonials } from '@/components/demos-shared/sections'
import { FadeUp, Words } from '@/components/demos-shared/words'
import { Reveal } from '@/components/reveal'
import { velvet } from '@/content/demo-businesses'
import {
  velvetGallery,
  velvetMenu,
  velvetPhotos,
  velvetStats,
  velvetTeam,
  velvetTestimonials,
} from '@/content/demo-velvet'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: `${velvet.name} · ${velvet.tagline}`,
  description: `${velvet.blurb} Salon website concept by KAPOSA FUTEXI.`,
}

/** Salon Website demo (Post 1): Velvet Salon home, a fashion-editorial layout. */
export default async function VelvetHomePage() {
  const settings = await getSiteSettings()
  return (
    <DemoShell business={velvet} whatsappNumber={settings.whatsappNumber}>
      {/* Hero: asymmetric editorial, tall portrait crop, gold hairlines. */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="dm-blob -top-40 -left-32 h-[32rem] w-[32rem] bg-[#d4a757]/15" />
        <div className="container-dm grid items-end gap-10 pt-16 pb-16 sm:pt-20 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <FadeUp index={0} className="dm-label text-dm-brand">
              T. Nagar · Est. 2014 · ★ {velvet.rating}
            </FadeUp>
            <h1 className="mt-6 font-display text-[3.2rem] leading-[0.98] text-balance sm:text-7xl lg:text-[6.5rem]">
              <Words text="Beauty," />
              <br />
              <Words text="redefined." accent={['redefined']} startIndex={1} />
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
              <DemoButton href={`${velvet.path}/services`} variant="secondary" size="lg">
                Price list
              </DemoButton>
            </FadeUp>
          </div>
          <div className="relative lg:col-span-5">
            <Reveal className="dm-parallax relative ml-auto aspect-[3/4] w-[88%] overflow-hidden">
              <Photo
                photo={velvetPhotos.heroPortrait}
                priority
                quality={60}
                zoom={false}
                sizes="(min-width: 1024px) 36vw, 88vw"
                className="dm-settle dm-frame absolute inset-0 h-full w-full"
              />
            </Reveal>
            <Reveal index={2} className="absolute -bottom-8 -left-2 w-[42%] sm:left-0">
              <Photo
                photo={velvetPhotos.heroHair}
                sizes="(min-width: 1024px) 16vw, 40vw"
                className="dm-frame aspect-[4/5]"
              />
            </Reveal>
            <p className="dm-label text-dm-muted absolute top-4 -right-2 hidden [writing-mode:vertical-rl] lg:block">
              Hair · Skin · Nails · Makeup
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

      {/* Price list, editorial two-column. */}
      <section id="services" className="scroll-mt-20 py-20 sm:py-28">
        <div className="container-dm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              eyebrow="Services"
              title="The price list"
              sub="What you see is what you pay. Consultation is always free."
            />
            <Link href={`${velvet.path}/services`} className="dm-underline text-dm-brand dm-label">
              Full list <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            {velvetMenu.slice(0, 2).map((group, gi) => (
              <Reveal key={group.category} index={gi} className="grid gap-6 sm:grid-cols-[9rem_1fr]">
                <Photo photo={group.photo} sizes="144px" className="dm-frame hidden aspect-[3/4] sm:block" />
                <div>
                  <h3 className="font-display text-3xl">{group.category}</h3>
                  <ul className="divide-dm-line mt-4 divide-y">
                    {group.items.slice(0, 4).map((it) => (
                      <li key={it.name} className="flex items-baseline justify-between gap-6 py-3">
                        <span>
                          <span className="block">{it.name}</span>
                          {it.line && <span className="text-dm-muted block text-xs">{it.line}</span>}
                        </span>
                        <span className="font-display text-2xl whitespace-nowrap">{it.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery: editorial masonry with tall crops. */}
      <section id="gallery" className="bg-dm-surface scroll-mt-20 py-20 sm:py-28">
        <div className="container-dm">
          <SectionTitle eyebrow="Gallery" title="Recent work from the chair" />
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

      {/* Bridal: the pinned story. */}
      <section className="dm-pin" style={{ ['--dm-track-shift' as string]: '50%' }}>
        <div className="dm-pin-stage">
          <div className="container-dm w-full">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionTitle eyebrow="Bridal" title="Your wedding morning, handled" />
              <Link href={`${velvet.path}/bridal`} className="dm-underline text-dm-brand dm-label">
                Bridal packages <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
              </Link>
            </div>
            <ol className="dm-pin-track mt-10">
              {[
                {
                  n: '01',
                  title: 'Consultation',
                  line: 'Thirty minutes with Meera about the outfit, the jewellery and the venue light.',
                  photo: velvetPhotos.makeupKit,
                },
                {
                  n: '02',
                  title: 'Trial',
                  line: 'A full look, photographed in daylight and tungsten.',
                  photo: velvetPhotos.makeupEye,
                },
                {
                  n: '03',
                  title: 'The day',
                  line: 'Two artists at the venue, two hours before. The touch-up kit stays with you.',
                  photo: velvetPhotos.heroPortrait,
                },
                {
                  n: '04',
                  title: 'Reception',
                  line: 'A second look that lasts until the last photo.',
                  photo: velvetPhotos.brushes,
                },
              ].map((s) => (
                <li key={s.n} data-cursor="View" className="w-[78vw] shrink-0 sm:w-[46vw] lg:w-[30vw]">
                  <Photo
                    photo={s.photo}
                    sizes="(min-width: 1024px) 30vw, 78vw"
                    className="dm-frame aspect-[3/4]"
                  />
                  <p className="dm-label text-dm-brand mt-6">{s.n}</p>
                  <h3 className="mt-1 font-display text-3xl">{s.title}</h3>
                  <p className="text-dm-muted mt-2 max-w-sm text-sm">{s.line}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Team. */}
      <section id="team" className="bg-dm-surface scroll-mt-20 py-20 sm:py-28">
        <div className="container-dm">
          <SectionTitle eyebrow="Team" title="Stylists who listen first" />
          <ul className="mt-12 grid gap-8 md:grid-cols-3">
            {velvetTeam.map((m, i) => (
              <Reveal key={m.name} as="li" index={i}>
                <article data-tilt="4" data-cursor="Book" className="group">
                  <Photo
                    photo={m.photo}
                    sizes="(min-width: 768px) 33vw, 100vw"
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
        line="Pick a free slot and we will have everything ready."
      />
    </DemoShell>
  )
}
