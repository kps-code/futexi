import type { Metadata } from 'next'
import { PageIntro } from '@/components/site/page-intro'

export const metadata: Metadata = { title: 'Services' }

export default function ServicesPage() {
  return (
    <PageIntro eyebrow="Services" title="Digital Solutions Built Around Your Business">
      Pick what you need today. Add more as you grow.
    </PageIntro>
  )
}
