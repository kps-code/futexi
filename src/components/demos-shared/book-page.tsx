import type { DemoBusiness } from '@/content/demo-businesses'
import { bookableDatesNow } from '@/server/demo-booking'
import { BookingFlow } from './booking-flow'
import { DemoShell } from './chrome'

/** The /book (or /reserve) page every bookable demo shares. */
export function DemoBookPage({
  business,
  initialService,
  initialDate,
  title,
  intro,
}: {
  business: DemoBusiness
  initialService?: string
  initialDate?: string
  title: string
  intro: string
}) {
  const dates = bookableDatesNow(business)
  return (
    <DemoShell business={business}>
      <section className="container-dm max-w-3xl py-10 sm:py-14">
        <p className="text-dm-brand text-xs font-semibold tracking-[0.18em] uppercase">
          {business.bookingNoun === 'reservation' ? 'Reservations' : 'Appointments'}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="text-dm-muted mt-2">{intro}</p>
        <div className="mt-8">
          <BookingFlow
            business={business}
            dates={dates}
            initialService={initialService}
            initialDate={initialDate}
            requestHref={`/contact?type=${business.contactType}`}
          />
        </div>
      </section>
    </DemoShell>
  )
}
