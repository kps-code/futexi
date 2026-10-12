import { AboutTeaser } from '@/components/home/about-teaser'
import { AiSection } from '@/components/home/ai-section'
import { BeforeAfter } from '@/components/home/before-after'
import { EveryScreen } from '@/components/home/every-screen'
import { FeaturedDemos } from '@/components/home/featured-demos'
import { FinalCta } from '@/components/home/final-cta'
import { Hero } from '@/components/home/hero'
import { HomeFaq } from '@/components/home/home-faq'
import { HowWeWork } from '@/components/home/how-we-work'
import { Investment } from '@/components/home/investment'
import { Technology } from '@/components/home/technology'
import { Testimonials } from '@/components/home/testimonials'
import { TrustStrip } from '@/components/home/trust-strip'
import { WhatWeBuild } from '@/components/home/what-we-build'
import { WhyUs } from '@/components/home/why-us'
import {
  getAboutPage,
  getFaqs,
  getFeaturedDemos,
  getHomePage,
  getServices,
  getSiteSettings,
  getTeamMembers,
  getTestimonials,
} from '@/server/site-data'

/** Home. Section order: docs/content-lock.md §2, plus Testimonials after Why Us. */
export default async function HomePage() {
  const [settings, team, about, featured, home, faqs, testimonials, services] = await Promise.all([
    getSiteSettings(),
    getTeamMembers(),
    getAboutPage(),
    getFeaturedDemos(),
    getHomePage(),
    getFaqs(),
    getTestimonials(),
    getServices(),
  ])

  return (
    <>
      <Hero content={home.hero} />
      <TrustStrip />
      <WhatWeBuild services={services} />
      <FeaturedDemos demos={featured} />
      <AiSection />
      <BeforeAfter />
      <EveryScreen />
      <HowWeWork content={home.howWeWork} />
      <WhyUs content={home.whyUs} />
      <Testimonials items={testimonials} />
      <Investment startingPriceText={settings.startingPriceText} />
      <AboutTeaser team={team} intro={about.intro} />
      <Technology content={home.technology} />
      <HomeFaq faqs={faqs} startingPriceText={settings.startingPriceText} />
      <FinalCta
        content={home.finalCta}
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={settings.whatsappMessage}
      />
    </>
  )
}
