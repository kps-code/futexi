import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { servicesSection } from '@/content/home'
import { whatsappLink } from '@/lib/whatsapp'
import type { ServiceView } from '@/server/site-data'
import { Icon } from './icons'
import { Section, SectionHeading } from './section'
import { Tilt } from './tilt'

/**
 * One card per visible service (Content > Services): outcome, what is
 * included, who it is for, and a WhatsApp pill that opens a chat about that
 * service. Cards tilt and light up under the cursor.
 */
export function ServicesCards({
  services,
  whatsappNumber,
}: {
  services: ServiceView[]
  whatsappNumber: string
}) {
  if (services.length === 0) return null
  return (
    <Section id="services">
      <SectionHeading
        align="left"
        eyebrow={servicesSection.eyebrow}
        title={servicesSection.heading}
        sub={servicesSection.sub}
      />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.slug} as="li" index={i} className="h-full">
            <Tilt as="article" className="h-full p-7">
              <span aria-hidden className="absolute top-7 right-7 text-[11px] tracking-[0.22em] text-muted">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="sr-ico mb-6">
                <Icon name={s.icon} className="h-6 w-6" />
              </span>
              <h3 className="font-display text-xl font-semibold tracking-[-0.01em]">
                <Link href={`/services#${s.slug}`} className="hover:underline hover:underline-offset-4">
                  {s.title}
                </Link>
              </h3>
              <p className="mt-2 min-h-[2.75rem] text-[15px] leading-relaxed text-muted">{s.outcome}</p>
              {s.included.length > 0 && (
                <ul className="mt-5 space-y-2.5 text-sm">
                  {s.included.slice(0, 3).map((item) => (
                    <li key={item} className="sr-check flex items-center gap-2.5">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-auto flex items-end justify-between gap-4 border-t border-border pt-5">
                <p className="text-xs leading-snug text-muted">
                  {s.goodFor && (
                    <>
                      <span className="mb-1 block text-[11px] font-medium tracking-[0.18em] text-foreground uppercase">
                        Good for
                      </span>
                      {s.goodFor}
                    </>
                  )}
                </p>
                <a
                  href={whatsappLink(whatsappNumber, `Hi KAPOSA FUTEXI, I'm interested in ${s.title}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sr-pill"
                  data-track="whatsapp_click"
                  data-track-props={`{"where":"service_card","service":"${s.slug}"}`}
                >
                  {servicesSection.ask}
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
