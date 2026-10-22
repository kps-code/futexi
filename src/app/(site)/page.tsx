import { AiSection } from '@/components/home/ai-section'
import { DemoShowcase } from '@/components/home/demo-showcase'
import { FinalCta } from '@/components/home/final-cta'
import { HomeFaq } from '@/components/home/home-faq'
import { HowWeWork } from '@/components/home/how-we-work'
import { Pricing } from '@/components/home/pricing'
import { ServicesCards } from '@/components/home/services-cards'
import { Showroom } from '@/components/home/showroom/showroom'
import { Trust } from '@/components/home/trust'
import { hero } from '@/content/site'
import { whatsappLink } from '@/lib/whatsapp'
import {
  getFaqs,
  getHomePage,
  getServices,
  getSiteSettings,
  getTeamMembers,
  getTestimonials,
  getVisibleDemos,
} from '@/server/site-data'

/** Home. Section order: docs/content-lock.md §2 (showroom edition). */
export default async function HomePage() {
  const [settings, team, demos, home, faqs, testimonials, services] = await Promise.all([
    getSiteSettings(),
    getTeamMembers(),
    getVisibleDemos(),
    getHomePage(),
    getFaqs(),
    getTestimonials(),
    getServices(),
  ])
  const whatsappHref = whatsappLink(settings.whatsappNumber, settings.whatsappMessage)
  const liveDemos = demos.filter((d) => d.status === 'live')

  return (
    <>
      <Showroom
        hero={home.hero}
        journey={home.journey}
        whatsappHref={whatsappHref}
        primaryHref={hero.primary.href}
        secondaryHref={hero.secondary.href}
      />
      <ServicesCards services={services} whatsappNumber={settings.whatsappNumber} />
      <DemoShowcase demos={liveDemos} />
      <AiSection />
      <HowWeWork content={home.howWeWork} technology={home.technology} />
      <Trust
        whyUs={home.whyUs}
        testimonials={testimonials}
        team={team}
        stats={{ demos: liveDemos.length, city: settings.city, replyTime: settings.replyTimeText }}
      />
      <Pricing
        content={home.pricing}
        startingPriceText={settings.startingPriceText}
        whatsappHref={whatsappHref}
      />
      <HomeFaq faqs={faqs} startingPriceText={settings.startingPriceText} />
      <FinalCta
        content={home.finalCta}
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={settings.whatsappMessage}
      />
    </>
  )
}
