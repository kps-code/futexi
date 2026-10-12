import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { bookableBusinesses, businessById, type DemoBusiness } from '@/content/demo-businesses'
import { bookableDates, type BookingRules } from '@/lib/booking'

export function rulesFor(b: DemoBusiness): BookingRules {
  return {
    openHour: b.hours.open,
    closeHour: b.hours.close,
    slotMinutes: b.slotMinutes,
    closedWeekday: b.closedWeekday,
    windowDays: b.windowDays,
  }
}

/** A bookable business by id, or undefined. */
export function bookableBusiness(id: string | null | undefined): DemoBusiness | undefined {
  const b = id ? businessById(id) : undefined
  return b && bookableBusinesses.includes(b) ? b : undefined
}

/** Dates a visitor can book right now (IST today onwards). */
export function bookableDatesNow(b: DemoBusiness): string[] {
  return bookableDates(Date.now(), rulesFor(b))
}

/** Booked times for a business and date, excluding cancelled bookings. */
export async function bookedTimesFor(businessId: string, date: string): Promise<string[]> {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'demo-bookings',
    where: {
      and: [
        { business: { equals: businessId } },
        { date: { equals: date } },
        { status: { not_equals: 'cancelled' } },
      ],
    },
    limit: 200,
    depth: 0,
    overrideAccess: true,
    select: { time: true },
  })
  return res.docs.map((d) => d.time)
}
