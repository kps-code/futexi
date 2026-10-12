import { bookableDates, isValidDate, slotsForDate } from '@/lib/booking'
import { bookedTimesFor, bookingRules } from '@/server/demo-booking'
import { HttpError, withRoute } from '@/server/logging/with-logging'

export const dynamic = 'force-dynamic'

/** Live slot availability for the Booking demo: GET /api/demo/booking/slots?date=YYYY-MM-DD */
export const GET = withRoute('demo.booking.slots', async (req) => {
  const date = new URL(req.url).searchParams.get('date') ?? ''
  if (!isValidDate(date)) throw new HttpError(400, 'INVALID_DATE', 'date must be YYYY-MM-DD')
  const now = Date.now()
  if (!bookableDates(now, bookingRules).includes(date)) {
    throw new HttpError(400, 'DATE_NOT_BOOKABLE', 'That date is outside the booking window')
  }
  const booked = await bookedTimesFor(date)
  return Response.json(
    { date, slots: slotsForDate(date, booked, now, bookingRules), generatedAt: new Date(now).toISOString() },
    { headers: { 'cache-control': 'no-store' } },
  )
})
