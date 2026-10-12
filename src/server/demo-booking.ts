import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { nova } from '@/content/demo-booking'
import { bookableDates, type BookingRules } from '@/lib/booking'

export const bookingRules: BookingRules = {
  openHour: nova.hours.open,
  closeHour: nova.hours.close,
  slotMinutes: nova.slotMinutes,
  closedWeekday: nova.closedWeekday,
  windowDays: nova.bookingWindowDays,
}

/** Dates a visitor can book right now (IST today onwards). */
export function bookableDatesNow(): string[] {
  return bookableDates(Date.now(), bookingRules)
}

/** Booked times for a date, excluding cancelled bookings. */
export async function bookedTimesFor(date: string): Promise<string[]> {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'demo-bookings',
    where: { and: [{ date: { equals: date } }, { status: { not_equals: 'cancelled' } }] },
    limit: 200,
    depth: 0,
    overrideAccess: true,
    select: { time: true },
  })
  return res.docs.map((d) => d.time)
}
