/**
 * Booking slot logic. Pure functions, India Standard Time throughout.
 * Dates are 'YYYY-MM-DD', times are 'HH:MM' (24h).
 */

export const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

export type BookingRules = {
  openHour: number
  closeHour: number
  slotMinutes: number
  closedWeekday?: number
  windowDays: number
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Calendar date in IST for an instant. */
export function istDate(now: number): string {
  const d = new Date(now + IST_OFFSET_MS)
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
}

/** Minutes since midnight in IST for an instant. */
export function istMinutes(now: number): number {
  const d = new Date(now + IST_OFFSET_MS)
  return d.getUTCHours() * 60 + d.getUTCMinutes()
}

export function isValidDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
  const [y, m, d] = date.split('-').map(Number)
  const t = Date.UTC(y, m - 1, d)
  const back = new Date(t)
  return back.getUTCFullYear() === y && back.getUTCMonth() === m - 1 && back.getUTCDate() === d
}

export function isValidTime(time: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time)
}

export function weekdayOf(date: string): number {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number)
  const t = Date.UTC(y, m - 1, d) + days * DAY_MS
  return istDate(t - IST_OFFSET_MS)
}

/** The bookable dates starting today (IST), skipping closed weekdays. */
export function bookableDates(now: number, rules: BookingRules): string[] {
  const today = istDate(now)
  const out: string[] = []
  for (let i = 0; i < rules.windowDays; i++) {
    const date = addDays(today, i)
    if (rules.closedWeekday !== undefined && weekdayOf(date) === rules.closedWeekday) continue
    out.push(date)
  }
  return out
}

/** Every slot start time for a working day. */
export function allSlots(rules: BookingRules): string[] {
  const out: string[] = []
  for (let m = rules.openHour * 60; m + rules.slotMinutes <= rules.closeHour * 60; m += rules.slotMinutes) {
    out.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`)
  }
  return out
}

export type SlotState = { time: string; available: boolean; reason?: 'booked' | 'past' | 'closed' }

/**
 * Slot availability for a date. Past slots (today only, 30 min lead time) and
 * booked slots are unavailable. Closed days return every slot as closed.
 */
export function slotsForDate(
  date: string,
  booked: readonly string[],
  now: number,
  rules: BookingRules,
): SlotState[] {
  const times = allSlots(rules)
  if (rules.closedWeekday !== undefined && weekdayOf(date) === rules.closedWeekday) {
    return times.map((time) => ({ time, available: false, reason: 'closed' }))
  }
  const isToday = date === istDate(now)
  const cutoff = istMinutes(now) + 30
  const bookedSet = new Set(booked)
  return times.map((time) => {
    if (bookedSet.has(time)) return { time, available: false, reason: 'booked' }
    if (isToday) {
      const [h, m] = time.split(':').map(Number)
      if (h * 60 + m < cutoff) return { time, available: false, reason: 'past' }
    }
    return { time, available: true }
  })
}

export function isBookable(
  date: string,
  time: string,
  booked: readonly string[],
  now: number,
  rules: BookingRules,
): boolean {
  if (!isValidDate(date) || !isValidTime(time)) return false
  if (!bookableDates(now, rules).includes(date)) return false
  return slotsForDate(date, booked, now, rules).some((s) => s.time === time && s.available)
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatDateLabel(date: string): { weekday: string; day: string; month: string } {
  const [, m, d] = date.split('-').map(Number)
  return { weekday: WEEKDAYS[weekdayOf(date)], day: String(d), month: MONTHS[m - 1] }
}

export function formatDateLong(date: string): string {
  const l = formatDateLabel(date)
  return `${l.weekday}, ${l.day} ${l.month} ${date.slice(0, 4)}`
}

/** '14:30' -> '2:30 PM' */
export function formatTime12(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${pad(m)} ${suffix}`
}

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}
