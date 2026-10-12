import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseStudy } from '@/components/case-study/case-study'
import { demoBySlug, demos } from '@/content/demos'
import { getSiteSettings, isDemoHidden } from '@/server/site-data'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return demos.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const demo = demoBySlug(slug)
  if (!demo) return {}
  return {
    title: `${demo.title} Demo`,
    description: demo.line,
    openGraph: { title: `${demo.title} Demo · KAPOSA FUTEXI`, description: demo.line },
  }
}

export default async function DemoCaseStudyPage({ params }: Params) {
  const { slug } = await params
  const demo = demoBySlug(slug)
  if (!demo || (await isDemoHidden(slug))) notFound()
  const settings = await getSiteSettings()
  return <CaseStudy demo={demo} whatsappNumber={settings.whatsappNumber} />
}
