import type { Metadata } from 'next'
import { Check, Phone } from 'lucide-react'
import { DemoButton, DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { Photo } from '@/components/demos-shared/photo'
import { Reveal } from '@/components/reveal'
import { velvet } from '@/content/demo-businesses'
import {
  velvetBridal,
  velvetBridalFaq,
  velvetBridalSteps,
  velvetGroom,
  velvetPhotos,
} from '@/content/demo-velvet'
import { whatsappLink } from '@/lib/whatsapp'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: `Bridal · ${velvet.name}`,
  description: `Engagement, muhurtham and reception packages for the bride, and the groom's morning, at ${velvet.name}, T. Nagar, with a trial credited against the booking. Salon website concept by KAPOSA FUTEXI.`,
}

/** Salon demo: bridal packages, the highest-value booking. */
export default async function VelvetBridalPage() {
  const settings = await getSiteSettings()
  const enquire = (name: string) =>
    whatsappLink(
      settings.whatsappNumber,
      `Bridal enquiry (${velvet.name}): ${name}\nWedding date:\nVenue:\nLooks needed:`,
    )
  return (
    <DemoShell
      business={velvet}
      whatsappNumber={settings.whatsappNumber}
      ctaHref={`${velvet.bookPath}?service=velvet-bridal`}
    >
      <section className="container-dm grid items-end gap-10 pt-16 sm:pt-20 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="dm-label text-dm-brand">Bridal</p>
          <h1 className="mt-5 font-display text-5xl leading-[0.98] text-balance sm:text-6xl lg:text-7xl">
            The morning <em>you remember.</em>
          </h1>
          <p className="text-dm-muted mt-6 max-w-md">
            One artist for the trial, two on the day, at the venue before you wake. And a barber for him.
            Sixty weddings this season.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <DemoButton
              href={`${velvet.bookPath}?service=velvet-bridal`}
              size="lg"
              className="dm-shimmer"
              data-magnetic
              data-cursor="Book"
              data-track="cta_click"
              data-track-props='{"cta":"demo_bridal_trial","demo":"salon"}'
            >
              Book a trial
            </DemoButton>
            <DemoButton href="#packages" variant="secondary" size="lg">
              Packages
            </DemoButton>
          </div>
        </div>
        <Reveal className="dm-parallax relative aspect-[4/5] overflow-hidden lg:col-span-6">
          <Photo
            photo={velvetPhotos.heroPortrait}
            priority
            zoom={false}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="dm-frame absolute inset-0 h-full w-full"
          />
        </Reveal>
      </section>

      <section id="packages" className="container-dm scroll-mt-20 py-20 sm:py-28">
        <SectionTitle
          eyebrow="Packages"
          title="Three ways to say yes"
          sub="Trial charged at ₹2,999, credited in full when you book."
        />
        <ul className="mt-12 grid gap-8 lg:grid-cols-3" data-testid="packages">
          {velvetBridal.map((pk, i) => (
            <Reveal key={pk.slug} as="li" index={i}>
              <article
                data-tilt="4"
                data-cursor="View"
                className="border-dm-line flex h-full flex-col border p-5"
              >
                <Photo photo={pk.photo} sizes="(min-width: 1024px) 33vw, 100vw" className="aspect-[4/3]" />
                <h2 className="mt-6 font-display text-3xl">{pk.name}</h2>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-4xl">{pk.price}</span>
                </p>
                <p className="text-dm-muted text-xs">{pk.priceNote}</p>
                <p className="text-dm-muted mt-3 text-sm">{pk.line}</p>
                <ul className="mt-5 flex-1 space-y-2 text-sm">
                  {pk.included.map((inc) => (
                    <li key={inc} className="flex items-start gap-2">
                      <Check className="text-dm-brand mt-0.5 h-4 w-4 shrink-0" /> {inc}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 grid gap-2">
                  <a
                    href={enquire(pk.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="whatsapp_click"
                    data-track-props={`{"where":"demo_bridal","demo":"salon","package":"${pk.slug}"}`}
                    className="dm-btn-motion inline-flex h-11 items-center justify-center rounded-[var(--dm-radius-btn)] bg-[#25D366] px-5 text-white"
                  >
                    Enquire on WhatsApp
                  </a>
                  <a
                    href={`tel:+${settings.whatsappNumber}`}
                    className="dm-btn-motion border-dm-line-strong text-dm-ink hover:bg-dm-surface-2 inline-flex h-11 items-center justify-center gap-2 rounded-[var(--dm-radius-btn)] border px-5"
                  >
                    <Phone className="h-4 w-4" /> Call Meera
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* The groom's side, with any package or on its own. */}
      <section className="container-dm pb-20 sm:pb-28" data-testid="groom">
        <Reveal className="border-dm-line grid gap-8 border p-5 lg:grid-cols-[1fr_1.4fr] lg:p-8">
          <Photo photo={velvetGroom.photo} sizes="(min-width: 1024px) 35vw, 100vw" className="aspect-[4/3]" />
          <div className="flex flex-col">
            <p className="dm-label text-dm-brand">For him</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">{velvetGroom.name}</h2>
            <p className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-4xl">{velvetGroom.price}</span>
            </p>
            <p className="text-dm-muted text-xs">{velvetGroom.priceNote}</p>
            <p className="text-dm-muted mt-3 max-w-xl text-sm">{velvetGroom.line}</p>
            <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
              {velvetGroom.included.map((inc) => (
                <li key={inc} className="flex items-start gap-2">
                  <Check className="text-dm-brand mt-0.5 h-4 w-4 shrink-0" /> {inc}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <a
                href={enquire(velvetGroom.name)}
                target="_blank"
                rel="noopener noreferrer"
                data-track="whatsapp_click"
                data-track-props='{"where":"demo_bridal","demo":"salon","package":"groom"}'
                className="dm-btn-motion inline-flex h-11 items-center justify-center rounded-[var(--dm-radius-btn)] bg-[#25D366] px-5 text-white"
              >
                Enquire for the groom
              </a>
              <DemoButton href={`${velvet.bookPath}?service=velvet-beard`} variant="secondary">
                Book his trim
              </DemoButton>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-dm-surface py-20 sm:py-28">
        <div className="container-dm grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionTitle eyebrow="How it works" title="From first call to the mandap" />
          <ol className="border-dm-line space-y-8 border-l pl-8">
            {velvetBridalSteps.map((s, i) => (
              <Reveal key={s.title} as="li" index={i} className="relative">
                <span className="bg-dm-brand text-dm-on-brand absolute top-0 -left-[2.6rem] inline-flex h-7 w-7 items-center justify-center text-xs font-medium">
                  {i + 1}
                </span>
                <h3 className="font-display text-2xl">{s.title}</h3>
                <p className="text-dm-muted mt-1 max-w-xl text-sm">{s.line}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-dm grid gap-10 py-20 sm:py-28 lg:grid-cols-[1fr_1.6fr]">
        <SectionTitle eyebrow="Questions" title="Before you book" />
        <div className="divide-dm-line divide-y" data-testid="faq">
          {velvetBridalFaq.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  className="text-dm-brand text-2xl leading-none transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="text-dm-muted mt-3 max-w-2xl text-sm">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </DemoShell>
  )
}
