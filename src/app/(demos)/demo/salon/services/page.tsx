import type { Metadata } from 'next'
import { DemoButton, DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { Photo } from '@/components/demos-shared/photo'
import { CtaBand } from '@/components/demos-shared/sections'
import { Reveal } from '@/components/reveal'
import { velvet } from '@/content/demo-businesses'
import { velvetMenu, velvetPhotos } from '@/content/demo-velvet'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: `Services and prices · ${velvet.name}`,
  description: `Hair, barber, skin, nails and makeup prices for him and her at ${velvet.name}, T. Nagar. Consultation is free. Salon website concept by KAPOSA FUTEXI.`,
}

/** Salon demo: the full price list, grouped like a magazine spread. */
export default async function VelvetServicesPage() {
  const settings = await getSiteSettings()
  return (
    <DemoShell business={velvet} whatsappNumber={settings.whatsappNumber}>
      <section className="container-dm grid items-end gap-10 pt-16 sm:pt-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="dm-label text-dm-brand">Services</p>
          <h1 className="mt-5 font-display text-5xl leading-[0.98] text-balance sm:text-6xl lg:text-7xl">
            The price list, <em>in full.</em>
          </h1>
          <p className="text-dm-muted mt-6 max-w-md">
            Her side and his side, one list. Every price includes consultation, wash and finish. No surprises
            at the counter.
          </p>
        </div>
        <Reveal className="lg:col-span-5">
          <Photo
            photo={velvetPhotos.toolsDark}
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="dm-frame aspect-[4/3]"
          />
        </Reveal>
      </section>

      <section className="container-dm py-20 sm:py-28" data-testid="price-list">
        <div className="space-y-20">
          {velvetMenu.map((group, gi) => (
            <Reveal key={group.category} as="article" className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <div className={gi % 2 === 1 ? 'lg:order-2 lg:col-span-4' : 'lg:col-span-4'}>
                <Photo
                  photo={group.photo}
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="dm-frame aspect-[3/4]"
                />
              </div>
              <div className={gi % 2 === 1 ? 'lg:order-1 lg:col-span-8' : 'lg:col-span-8'}>
                <h2 className="font-display text-4xl sm:text-5xl">{group.category}</h2>
                <p className="text-dm-muted mt-2 text-sm">{group.note}</p>
                <ul className="divide-dm-line mt-6 divide-y">
                  {group.items.map((it) => (
                    <li key={it.name} className="flex items-center justify-between gap-6 py-4">
                      <span className="min-w-0">
                        <span className="block text-lg">{it.name}</span>
                        {it.line && <span className="text-dm-muted block text-sm">{it.line}</span>}
                      </span>
                      <span className="flex shrink-0 items-center gap-4">
                        <span className="font-display text-3xl whitespace-nowrap">{it.price}</span>
                        {it.slug && (
                          <DemoButton
                            href={`${velvet.bookPath}?service=${it.slug}`}
                            size="sm"
                            variant="secondary"
                            data-cursor="Book"
                            data-track="cta_click"
                            data-track-props={`{"cta":"demo_service","demo":"salon","service":"${it.slug}"}`}
                          >
                            Book
                          </DemoButton>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-dm-surface py-16">
        <div className="container-dm grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <SectionTitle
            eyebrow="Not sure?"
            title="Come for the free consultation"
            sub="Fifteen minutes with a stylist. Leave with a plan and a price, no obligation."
          />
          <DemoButton href={velvet.bookPath!} size="lg" data-magnetic data-cursor="Book">
            Book a consultation
          </DemoButton>
        </div>
      </section>

      <CtaBand
        business={velvet}
        title="Your chair is waiting."
        line="Pick a free slot and we will have everything ready."
      />
    </DemoShell>
  )
}
