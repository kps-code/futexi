import type { Metadata } from 'next'
import { BookingFlow } from '@/components/demo-booking/booking-flow'
import { DemoRibbon, NovaFooter, NovaNav } from '@/components/demo-booking/chrome'
import { demoNotice, nova, novaServices } from '@/content/demo-booking'
import { bookableDatesNow } from '@/server/demo-booking'

export const metadata: Metadata = {
  title: `Book an appointment · ${nova.name}`,
}

export const dynamic = 'force-dynamic'

export default async function NovaBookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>
}) {
  const { service } = await searchParams
  const dates = bookableDatesNow()
  return (
    <>
      <DemoRibbon />
      <NovaNav />
      <main className="flex-1">
        <section className="container-nv max-w-3xl py-10 sm:py-14">
          <p className="text-nv-brand text-xs font-semibold tracking-[0.18em] uppercase">Appointments</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Book your visit</h1>
          <p className="text-nv-muted mt-2">
            Choose a service, pick a free slot, and confirm. About a minute.
          </p>
          <div className="mt-8">
            <BookingFlow
              services={novaServices}
              dates={dates}
              initialService={service}
              requestHref={demoNotice.href}
            />
          </div>
        </section>
      </main>
      <NovaFooter />
    </>
  )
}
