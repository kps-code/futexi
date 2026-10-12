import type { Metadata } from 'next'
import { DemoBookPage } from '@/components/demos-shared/book-page'
import { saffron } from '@/content/demo-businesses'

export const metadata: Metadata = { title: `Reserve a table · ${saffron.name}` }
export const dynamic = 'force-dynamic'

export default async function SaffronReservePage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>
}) {
  const { service } = await searchParams
  return (
    <DemoBookPage
      business={saffron}
      initialService={service}
      title="Reserve a table"
      intro="Choose your party size and a time. We hold tables for 15 minutes past the reservation."
    />
  )
}
