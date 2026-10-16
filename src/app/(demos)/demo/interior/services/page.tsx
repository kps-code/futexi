import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import { DemoButton, DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { Photo } from '@/components/demos-shared/photo'
import { CtaBand } from '@/components/demos-shared/sections'
import { Reveal } from '@/components/reveal'
import { nila } from '@/content/demo-businesses'
import { interiorFaq, interiorPackages, interiorStages } from '@/content/demo-interior'
import { getSiteSettings } from '@/server/site-data'
import { playfair } from '../font'

export const metadata: Metadata = {
  title: `Services and pricing · ${nila.name}`,
  description: `Full home, kitchen and wardrobe, office and cafe interiors with indicative prices, a five-stage process and answers to common questions. Website concept by KAPOSA FUTEXI.`,
}

/** Interior Designer demo: packages, process and FAQ. */
export default async function NilaServicesPage() {
  const settings = await getSiteSettings()
  const enquire = `${nila.path}#enquire`
  return (
    <DemoShell
      business={nila}
      whatsappNumber={settings.whatsappNumber}
      ctaHref={enquire}
      className={playfair.variable}
    >
      <section className="container-dm pt-12 pb-10 sm:pt-16 sm:pb-14">
        <p className="text-dm-accent-ink text-xs font-semibold tracking-[0.18em] uppercase">Services</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl tracking-tight text-balance sm:text-5xl lg:text-6xl">
          Design, build and hand over.
        </h1>
        <p className="text-dm-muted mt-5 max-w-2xl text-pretty sm:text-lg">
          Three ways to work with us, each with one written quote and one team from the first visit to the
          snag walk. Prices are indicative; the quote follows a site visit.
        </p>
      </section>

      <section id="packages" className="bg-dm-surface scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm">
          <ul className="grid gap-5 lg:grid-cols-3" data-testid="packages">
            {interiorPackages.map((pk, i) => (
              <Reveal
                key={pk.slug}
                as="li"
                index={i}
                className="dm-card dm-lift bg-dm-bg flex flex-col overflow-hidden"
              >
                <Photo
                  photo={pk.photo}
                  className="aspect-[16/10] rounded-none"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-display text-2xl">{pk.name}</h2>
                  <p className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-3xl">{pk.price}</span>
                    <span className="text-dm-muted text-xs">{pk.priceNote}</span>
                  </p>
                  <p className="text-dm-muted mt-2 text-sm">{pk.line}</p>
                  <ul className="mt-5 space-y-2 text-sm">
                    {pk.included.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="text-dm-accent-ink mt-0.5 h-4 w-4 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-dm-muted mt-5 text-xs">
                    <span className="text-dm-ink font-medium">Good for:</span> {pk.goodFor}
                  </p>
                  <DemoButton
                    href={enquire}
                    className="mt-6"
                    data-track="cta_click"
                    data-track-props={`{"cta":"demo_package","demo":"interior","package":"${pk.slug}"}`}
                  >
                    Enquire about {pk.name.toLowerCase()}
                  </DemoButton>
                </div>
              </Reveal>
            ))}
          </ul>
          <p className="text-dm-muted mt-6 text-sm">
            Design only: ₹60 per sq ft for layouts, 3D views and a material list, adjusted against the build
            if you continue with us.
          </p>
        </div>
      </section>

      <section id="process" className="scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm">
          <SectionTitle
            eyebrow="Process"
            title="Eleven weeks, five stages"
            sub="The same sequence for a kitchen or a whole villa; only the weeks change."
          />
          <ol className="border-dm-line mt-10 space-y-8 border-l pl-8">
            {interiorStages.map((s, i) => (
              <Reveal key={s.title} as="li" index={i} className="relative">
                <span className="bg-dm-brand text-dm-on-brand absolute top-0 -left-[2.6rem] inline-flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs">
                  {i + 1}
                </span>
                <p className="text-dm-accent-ink font-mono text-xs tracking-widest uppercase">{s.when}</p>
                <h3 className="mt-1 font-display text-xl">{s.title}</h3>
                <p className="text-dm-muted mt-1 max-w-xl text-sm">{s.line}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section id="faq" className="bg-dm-surface scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionTitle eyebrow="Questions" title="Before you call" />
          <div className="divide-dm-line divide-y" data-testid="faq">
            {interiorFaq.map((f) => (
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
        business={nila}
        title="Not sure which package?"
        line="Tell us about the space and we will suggest one."
        href={enquire}
        label="Start a project"
      />
    </DemoShell>
  )
}
