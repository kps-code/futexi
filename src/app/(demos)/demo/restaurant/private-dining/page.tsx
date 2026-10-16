import type { Metadata } from 'next'
import { Check, Phone, Users } from 'lucide-react'
import { DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { Photo } from '@/components/demos-shared/photo'
import { CtaBand } from '@/components/demos-shared/sections'
import { Reveal } from '@/components/reveal'
import { saffron } from '@/content/demo-businesses'
import { saffronPhotos, saffronPrivate, saffronPrivateFaq } from '@/content/demo-restaurant'
import { whatsappLink } from '@/lib/whatsapp'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: `Private dining · ${saffron.name}`,
  description: `Candle-light dinners for two, celebration tables and a private hall at ${saffron.name}, Adyar. Restaurant website concept by KAPOSA FUTEXI.`,
}

/** Restaurant demo: occasions, from a candle-light dinner to the whole hall. */
export default async function SaffronPrivateDiningPage() {
  const settings = await getSiteSettings()
  const enquiry = (name: string) =>
    whatsappLink(settings.whatsappNumber, `Private dining enquiry (${saffron.name}): ${name}\nDate:\nGuests:`)
  return (
    <DemoShell business={saffron} whatsappNumber={settings.whatsappNumber}>
      <section className="container-dm pt-12 sm:pt-16">
        <p className="text-dm-brand text-xs font-semibold tracking-[0.18em] uppercase">Private dining</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          Dinner, made an occasion.
        </h1>
        <p className="text-dm-muted mt-4 max-w-2xl text-pretty sm:text-lg">
          A candle-lit alcove for two, a long table for the family, or the whole hall for the company. One
          message on WhatsApp and we take it from there.
        </p>
        <Reveal className="mt-10">
          <Photo
            photo={saffronPhotos.diningRoom}
            label="The dining room after dark"
            priority
            sizes="100vw"
            className="aspect-[21/9]"
          />
        </Reveal>
      </section>

      <section id="packages" className="scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm">
          <SectionTitle
            eyebrow="Occasions"
            title="Three ways to celebrate"
            sub="Prices include the set menu and service. Drinks are extra."
          />
          <ul className="mt-10 grid gap-5 lg:grid-cols-3" data-testid="packages">
            {saffronPrivate.map((pk, i) => (
              <Reveal
                key={pk.slug}
                as="li"
                index={i}
                className="dm-card dm-lift flex flex-col overflow-hidden"
              >
                <Photo
                  photo={pk.photo}
                  className="aspect-[16/10] rounded-none"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-dm-muted flex items-center gap-1.5 text-xs font-medium">
                    <Users className="h-3.5 w-3.5" /> {pk.guests}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold">{pk.name}</h2>
                  <p className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-3xl font-bold">{pk.price}</span>
                    <span className="text-dm-muted text-xs">{pk.priceNote}</span>
                  </p>
                  <p className="text-dm-muted mt-2 text-sm">{pk.line}</p>
                  <ul className="mt-5 flex-1 space-y-2 text-sm">
                    {pk.included.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="text-dm-brand mt-0.5 h-4 w-4 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 grid gap-2">
                    <a
                      href={enquiry(pk.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track="whatsapp_click"
                      data-track-props={`{"where":"demo_private","demo":"restaurant","package":"${pk.slug}"}`}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-[#25D366] px-5 text-sm font-medium text-white hover:brightness-110"
                    >
                      Enquire on WhatsApp
                    </a>
                    <a
                      href={`tel:+${settings.whatsappNumber}`}
                      className="border-dm-line-strong text-dm-ink hover:bg-dm-surface-2 inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium"
                    >
                      <Phone className="h-4 w-4" /> Call us
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="faq" className="bg-dm-surface scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionTitle eyebrow="Questions" title="Good to know" />
          <div className="divide-dm-line divide-y" data-testid="faq">
            {saffronPrivateFaq.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    className="text-dm-muted text-xl leading-none transition-transform group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <p className="text-dm-muted mt-3 max-w-2xl text-sm">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        business={saffron}
        title="Just dinner tonight?"
        line="Reserve a regular table and we hold it for 15 minutes past your time."
      />
    </DemoShell>
  )
}
