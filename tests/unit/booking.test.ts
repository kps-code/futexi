import { describe, expect, it } from 'vitest'
import {
  addDays,
  allSlots,
  bookableDates,
  formatDateLong,
  formatInr,
  formatTime12,
  isBookable,
  isValidDate,
  isValidTime,
  istDate,
  slotsForDate,
  weekdayOf,
  type BookingRules,
} from '@/lib/booking'

const rules: BookingRules = { openHour: 10, closeHour: 20, slotMinutes: 30, closedWeekday: 2, windowDays: 14 }
// 2026-10-07 is a Wednesday. 11:00 UTC = 16:30 IST.
const NOW = Date.parse('2026-10-07T11:00:00Z')

describe('dates in IST', () => {
  it('rolls the calendar date at IST midnight', () => {
    expect(istDate(Date.parse('2026-10-07T18:29:00Z'))).toBe('2026-10-07')
    expect(istDate(Date.parse('2026-10-07T18:31:00Z'))).toBe('2026-10-08')
  })
  it('adds days across month boundaries', () => {
    expect(addDays('2026-10-30', 3)).toBe('2026-11-02')
  })
  it('knows weekdays and validates input', () => {
    expect(weekdayOf('2026-10-07')).toBe(3)
    expect(isValidDate('2026-02-30')).toBe(false)
    expect(isValidDate('2026-10-07')).toBe(true)
    expect(isValidTime('24:00')).toBe(false)
    expect(isValidTime('19:30')).toBe(true)
  })
})

describe('bookable dates', () => {
  it('starts today, spans the window and skips Tuesdays', () => {
    const dates = bookableDates(NOW, rules)
    expect(dates[0]).toBe('2026-10-07')
    expect(dates).not.toContain('2026-10-13')
    expect(dates).not.toContain('2026-10-20')
    expect(dates).toHaveLength(12)
  })
})

describe('slots', () => {
  it('generates 30 minute slots from open to close', () => {
    const s = allSlots(rules)
    expect(s[0]).toBe('10:00')
    expect(s[s.length - 1]).toBe('19:30')
    expect(s).toHaveLength(20)
  })
  it('marks past and booked slots for today with a 30 minute lead', () => {
    const s = slotsForDate('2026-10-07', ['18:00'], NOW, rules) // now 16:30 IST, cutoff 17:00
    const byTime = Object.fromEntries(s.map((x) => [x.time, x]))
    expect(byTime['16:30'].reason).toBe('past')
    expect(byTime['17:00'].available).toBe(true)
    expect(byTime['18:00'].reason).toBe('booked')
    expect(byTime['19:30'].available).toBe(true)
  })
  it('returns everything closed on the closed weekday', () => {
    expect(slotsForDate('2026-10-13', [], NOW, rules).every((x) => x.reason === 'closed')).toBe(true)
  })
  it('isBookable rejects past, booked, closed and out-of-window', () => {
    expect(isBookable('2026-10-07', '17:00', [], NOW, rules)).toBe(true)
    expect(isBookable('2026-10-07', '16:00', [], NOW, rules)).toBe(false)
    expect(isBookable('2026-10-08', '11:00', ['11:00'], NOW, rules)).toBe(false)
    expect(isBookable('2026-10-13', '11:00', [], NOW, rules)).toBe(false)
    expect(isBookable('2026-11-07', '11:00', [], NOW, rules)).toBe(false)
    expect(isBookable('bad', '11:00', [], NOW, rules)).toBe(false)
  })
})

describe('formatting', () => {
  it('formats times, dates and rupees', () => {
    expect(formatTime12('14:30')).toBe('2:30 PM')
    expect(formatTime12('12:00')).toBe('12:00 PM')
    expect(formatTime12('10:00')).toBe('10:00 AM')
    expect(formatDateLong('2026-10-07')).toBe('Wed, 7 Oct 2026')
    expect(formatInr(1499)).toBe('₹1,499')
  })
})
