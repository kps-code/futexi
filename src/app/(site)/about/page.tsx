import type { Metadata } from 'next'
import { PageIntro } from '@/components/site/page-intro'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <PageIntro eyebrow="About" title="Three Builders. One Vision.">
      We are a small technology team focused on building modern websites, AI-powered experiences, automation
      solutions and digital products.
    </PageIntro>
  )
}
