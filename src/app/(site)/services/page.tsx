import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import { Icon } from '@/components/home/icons'
import { FinalCta } from '@/components/home/final-cta'
import { cardClasses, IconBadge } from '@/components/home/section'
import { Investment } from '@/components/home/investment'
import { PageIntro } from '@/components/site/page-intro'
import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'
import { getHomePage, getServices, getServicesPage, getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Business websites, landing pages, booking websites, AI solutions, automation and custom software for growing businesses.',
}

export default async function ServicesPage() {
  const [settings, home, services, page] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
    getServices(),
    getServicesPage(),
  ])
  return (
    <>
      <PageIntro eyebrow="Services" title={page.heading}>
        {page.sub}
      </PageIntro>

      <section className="container-site pb-20">
        <ul className="grid gap-6 lg:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.slug} as="li" index={i}>
              <article id={s.slug} className={cn(cardClasses, 'flex h-full scroll-mt-28 flex-col p-7')}>
                <div className="flex items-center gap-4">
                  <IconBadge>
                    <Icon name={s.icon} className="h-5 w-5" />
                  </IconBadge>
                  <h2 className="font-display text-xl font-semibold">{s.title}</h2>
                </div>
                <p className="mt-5 text-lg font-medium text-foreground/90">{s.outcome}</p>
                {s.included.length > 0 && (
                  <>
                    <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                      What is included
                    </p>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {s.included.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {s.goodFor && (
                  <p className="mt-5 text-sm text-muted">
                    <span className="font-semibold text-foreground/80">Good for: </span>
                    {s.goodFor}
                  </p>
                )}
                <div className="mt-auto pt-6">
                  <ButtonLink
                    href={`/contact?type=${s.contactType}`}
                    data-track="cta_click"
                    data-track-props={`{"cta":"service","service":"${s.slug}"}`}
                  >
                    Start a Project
                  </ButtonLink>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>

      <Investment startingPriceText={settings.startingPriceText} />
      <FinalCta
        content={home.finalCta}
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={settings.whatsappMessage}
      />
    </>
  )
}
