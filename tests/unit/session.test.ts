import { describe, expect, it } from 'vitest'
import {
  SESSION_MAX_MS,
  formatSessionCookie,
  isValidVisitorId,
  newVisitorId,
  nextSession,
  parseSessionCookie,
} from '@/lib/session'

const SID = '019245f3-0000-7000-8000-000000000000'

describe('session cookie', () => {
  it('round-trips', () => {
    const c = { sessionId: SID, startedAt: 1_700_000_000_000 }
    expect(parseSessionCookie(formatSessionCookie(c))).toEqual(c)
  })
  it('rejects junk', () => {
    expect(parseSessionCookie('')).toBeNull()
    expect(parseSessionCookie('abc.123')).toBeNull()
    expect(parseSessionCookie(`${SID}.notanumber`)).toBeNull()
    expect(parseSessionCookie(`${SID}.-5`)).toBeNull()
  })
})

describe('nextSession', () => {
  it('starts a new session when there is no cookie', () => {
    const s = nextSession(null, 1_000_000)
    expect(s.isNew).toBe(true)
    expect(s.startedAt).toBe(1_000_000)
  })
  it('keeps the session inside the 4 hour cap', () => {
    const now = 10_000_000
    const s = nextSession({ sessionId: SID, startedAt: now - SESSION_MAX_MS + 1 }, now)
    expect(s.isNew).toBe(false)
    expect(s.sessionId).toBe(SID)
  })
  it('rolls over after 4 hours', () => {
    const now = 10_000_000_000
    const s = nextSession({ sessionId: SID, startedAt: now - SESSION_MAX_MS }, now)
    expect(s.isNew).toBe(true)
    expect(s.sessionId).not.toBe(SID)
  })
  it('rejects a start time in the future', () => {
    const s = nextSession({ sessionId: SID, startedAt: 2_000 }, 1_000)
    expect(s.isNew).toBe(true)
  })
})

describe('visitor id', () => {
  it('validates uuids only', () => {
    expect(isValidVisitorId(newVisitorId())).toBe(true)
    expect(isValidVisitorId('nope')).toBe(false)
    expect(isValidVisitorId(undefined)).toBe(false)
  })
})
