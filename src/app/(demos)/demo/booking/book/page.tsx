import type { Metadata } from 'next'
import { DemoBookPage } from '@/components/demos-shared/book-page'
import { nova } from '@/content/demo-businesses'

export const metadata: Metadata = { title: `Book an appointment · ${nova.name}` }
export const dynamic = 'force-dynamic'

export default async function NovaBookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; date?: string }>
}) {
  const { service, date } = await searchParams
  return (
    <DemoBookPage
      business={nova}
      initialService={service}
      initialDate={date}
      title="Book your visit"
      intro="Choose a service, pick a free slot, and confirm. About a minute."
    />
  )
}
