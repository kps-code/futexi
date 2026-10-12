import { bookableDates, isValidDate, slotsForDate } from '@/lib/booking'
import { bookableBusiness, bookedTimesFor, rulesFor } from '@/server/demo-booking'
import { HttpError, withRoute } from '@/server/logging/with-logging'

export const dynamic = 'force-dynamic'

/** Live slot availability: GET /api/demo/booking/slots?business=salon&date=YYYY-MM-DD */
export const GET = withRoute('demo.booking.slots', async (req) => {
  const url = new URL(req.url)
  const business = bookableBusiness(url.searchParams.get('business') ?? 'booking')
  if (!business) throw new HttpError(400, 'UNKNOWN_BUSINESS', 'Unknown business')
  const date = url.searchParams.get('date') ?? ''
  if (!isValidDate(date)) throw new HttpError(400, 'INVALID_DATE', 'date must be YYYY-MM-DD')
  const rules = rulesFor(business)
  const now = Date.now()
  if (!bookableDates(now, rules).includes(date)) {
    throw new HttpError(400, 'DATE_NOT_BOOKABLE', 'That date is outside the booking window')
  }
  const booked = await bookedTimesFor(business.id, date)
  return Response.json(
    {
      business: business.id,
      date,
      slots: slotsForDate(date, booked, now, rules),
      generatedAt: new Date(now).toISOString(),
    },
    { headers: { 'cache-control': 'no-store' } },
  )
})
