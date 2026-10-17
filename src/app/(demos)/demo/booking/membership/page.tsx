import type { Metadata } from 'next'
import { Check, Phone } from 'lucide-react'
import { DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { Photo } from '@/components/demos-shared/photo'
import { CtaBand } from '@/components/demos-shared/sections'
import { Reveal } from '@/components/reveal'
import { nova } from '@/content/demo-businesses'
import { novaPerks, novaPhotos, novaPlans } from '@/content/demo-nova'
import { whatsappLink } from '@/lib/whatsapp'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: `Memberships and gift cards · ${nova.name}`,
  description: `Monthly membership, five-session packs and gift cards at ${nova.name}, Anna Nagar. Booking website concept by KAPOSA FUTEXI.`,
}

/** Booking demo: memberships and gift cards, settled on WhatsApp. */
export default async function NovaMembershipPage() {
  const settings = await getSiteSettings()
  const enquire = (name: string) =>
    whatsappLink(
      settings.whatsappNumber,
      `${nova.name}: I would like the ${name} plan.\nName:\nPreferred start date:`,
    )
  return (
    <DemoShell business={nova} whatsappNumber={settings.whatsappNumber}>
      <section className="container-dm pt-14 sm:pt-20">
        <p className="dm-label text-dm-accent-ink">Memberships</p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl text-balance sm:text-6xl">
          Come back <em>often.</em>
        </h1>
        <p className="text-dm-muted mt-5 max-w-2xl text-lg">
          Members get the quiet weekend slots first and pay less for every visit. Gift cards arrive on
          WhatsApp with their name on them.
        </p>
      </section>

      <section id="plans" className="container-dm py-16 sm:py-20">
        <ul className="grid gap-6 lg:grid-cols-3" data-testid="plans">
          {novaPlans.map((pl, i) => (
            <Reveal key={pl.slug} as="li" index={i} className="dm-scale-in">
              <article
                data-tilt="4"
                data-cursor="Plan"
                className="dm-card dm-lift flex h-full flex-col overflow-hidden"
              >
                <Photo
                  photo={pl.photo}
                  className="aspect-[16/10] rounded-none"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-display text-3xl">{pl.name}</h2>
                  <p className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-3xl">{pl.price}</span>
                    <span className="text-dm-muted text-xs">{pl.priceNote}</span>
                  </p>
                  <p className="text-dm-muted mt-2 text-sm">{pl.line}</p>
                  <ul className="mt-5 flex-1 space-y-2 text-sm">
                    {pl.included.map((inc) => (
                      <li key={inc} className="flex items-start gap-2">
                        <Check className="text-dm-accent-ink mt-0.5 h-4 w-4 shrink-0" /> {inc}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 grid gap-2">
                    <a
                      href={enquire(pl.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-magnetic
                      data-cursor="Ask"
                      data-track="whatsapp_click"
                      data-track-props={`{"where":"demo_membership","demo":"booking","plan":"${pl.slug}"}`}
                      className="dm-btn-motion inline-flex h-11 items-center justify-center rounded-[var(--dm-radius-btn)] bg-[#25D366] px-5 text-sm font-medium text-white"
                    >
                      Start on WhatsApp
                    </a>
                    <a
                      href={`tel:+${settings.whatsappNumber}`}
                      className="border-dm-line-strong text-dm-ink hover:bg-dm-surface-2 inline-flex h-11 items-center justify-center gap-2 rounded-[var(--dm-radius-btn)] border px-5 text-sm font-medium"
                    >
                      <Phone className="h-4 w-4" /> Call the studio
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="bg-dm-surface py-20 sm:py-28">
        <div className="container-dm grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="dm-parallax relative aspect-[4/3] overflow-hidden rounded-[var(--dm-radius-img)]">
            <Photo
              photo={novaPhotos.sunset}
              className="absolute inset-0 h-full w-full rounded-none"
              sizes="(min-width: 1024px) 50vw, 100vw"
              zoom={false}
            />
          </Reveal>
          <Reveal index={1}>
            <SectionTitle eyebrow="Every plan" title="What members always get" />
            <ul className="mt-6 space-y-4">
              {novaPerks.map((p) => (
                <li key={p.title} className="flex items-start gap-3">
                  <span className="bg-dm-brand-soft text-dm-brand mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <b className="font-medium">{p.title}.</b> <span className="text-dm-muted">{p.line}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <CtaBand
        business={nova}
        title="Not sure yet?"
        line="Book a single treatment first. Members can join on their next visit."
        label="Book a treatment"
      />
    </DemoShell>
  )
}
