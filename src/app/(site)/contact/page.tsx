import type { Metadata } from 'next'
import { PageIntro } from '@/components/site/page-intro'

export const metadata: Metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <PageIntro eyebrow="Contact" title="Let's talk about your project.">
      Tell us what you need. We reply within one working day.
    </PageIntro>
  )
}
