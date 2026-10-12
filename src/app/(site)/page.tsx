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
import { TrustStrip } from '@/components/home/trust-strip'
import { WhatWeBuild } from '@/components/home/what-we-build'
import { WhyUs } from '@/components/home/why-us'
import { getAboutPage, getFeaturedDemos, getSiteSettings, getTeamMembers } from '@/server/site-data'

/** Home. Section order: docs/content-lock.md §2. */
export default async function HomePage() {
  const [settings, team, about, featured] = await Promise.all([
    getSiteSettings(),
    getTeamMembers(),
    getAboutPage(),
    getFeaturedDemos(),
  ])

  return (
    <>
      <Hero />
      <TrustStrip />
      <WhatWeBuild />
      <FeaturedDemos demos={featured} />
      <AiSection />
      <BeforeAfter />
      <EveryScreen />
      <HowWeWork />
      <WhyUs />
      <Investment startingPriceText={settings.startingPriceText} />
      <AboutTeaser team={team} intro={about.intro} />
      <Technology />
      <HomeFaq startingPriceText={settings.startingPriceText} />
      <FinalCta whatsappNumber={settings.whatsappNumber} />
    </>
  )
}
