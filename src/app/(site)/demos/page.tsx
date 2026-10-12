import type { Metadata } from 'next'
import { PageIntro } from '@/components/site/page-intro'

export const metadata: Metadata = { title: 'Demos' }

export default function DemosPage() {
  return (
    <PageIntro eyebrow="Demos" title="See What We Can Build">
      Interactive website concepts for different business needs. Every demo is a real, working mini website.
    </PageIntro>
  )
}
