import type { Metadata } from 'next'
import { LegalPage } from '@/components/site/legal-page'
import { brand } from '@/content/site'
import { getLegalPage, getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = { title: 'Terms', robots: { index: false } }

export default async function TermsPage() {
  const [settings, page] = await Promise.all([getSiteSettings(), getLegalPage('terms')])
  return (
    <LegalPage
      page={page}
      vars={{
        brand: brand.name,
        email: settings.email,
        phone: settings.phone,
        price: settings.startingPriceText,
      }}
    />
  )
}
