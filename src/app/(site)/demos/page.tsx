import type { Metadata } from 'next'
import { DemosGrid } from '@/components/demos/demos-grid'
import { FinalCta } from '@/components/home/final-cta'
import { PageIntro } from '@/components/site/page-intro'
import { getSiteSettings, getVisibleDemos } from '@/server/site-data'

export const metadata: Metadata = {
  title: 'Demos',
  description:
    'Interactive website concepts for salons, restaurants, tuition centres, interior designers and AI-powered businesses.',
}

export default async function DemosPage() {
  const [settings, visible] = await Promise.all([getSiteSettings(), getVisibleDemos()])
  return (
    <>
      <PageIntro eyebrow="Demos" title="See What We Can Build">
        Interactive website concepts for different business needs. Every demo is a real, working mini website.
        <span className="mt-3 block text-sm">
          These are concept projects built by KAPOSA FUTEXI to show what is possible.
        </span>
      </PageIntro>
      <section className="container-site pb-20">
        <DemosGrid demos={visible} />
      </section>
      <FinalCta whatsappNumber={settings.whatsappNumber} />
    </>
  )
}
