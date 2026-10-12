import type { Metadata } from 'next'
import { DemoBookPage } from '@/components/demos-shared/book-page'
import { velvet } from '@/content/demo-businesses'

export const metadata: Metadata = { title: `Book an appointment · ${velvet.name}` }
export const dynamic = 'force-dynamic'

export default async function VelvetBookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>
}) {
  const { service } = await searchParams
  return (
    <DemoBookPage
      business={velvet}
      initialService={service}
      title="Book your appointment"
      intro="Pick a service and a free slot. Your stylist will be ready when you arrive."
    />
  )
}
