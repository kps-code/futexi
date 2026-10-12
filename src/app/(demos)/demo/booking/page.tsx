import type { Metadata } from 'next'
import { DemoRibbon, NovaFooter, NovaNav, WhatsAppFab } from '@/components/demo-booking/chrome'
import {
  NovaCtaBand,
  NovaHero,
  NovaHow,
  NovaServices,
  NovaTestimonials,
} from '@/components/demo-booking/home-sections'
import { nova } from '@/content/demo-booking'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: `${nova.name} · ${nova.tagline}`,
  description: `${nova.blurb} Booking website concept by KAPOSA FUTEXI.`,
}

/** Booking Website demo (Post 0): the fictional Nova Studio home page. */
export default async function NovaHomePage() {
  const settings = await getSiteSettings()
  return (
    <>
      <DemoRibbon />
      <NovaNav />
      <main className="flex-1">
        <NovaHero />
        <NovaServices />
        <NovaHow />
        <NovaTestimonials />
        <NovaCtaBand />
      </main>
      <NovaFooter />
      <WhatsAppFab number={settings.whatsappNumber} />
    </>
  )
}
