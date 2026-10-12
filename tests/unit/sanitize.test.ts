import { describe, expect, it } from 'vitest'
import { errorCodeOf, errorMessageOf, maskEmail, maskPhone, summarizeInput } from '@/server/logging/sanitize'

describe('maskEmail', () => {
  it('keeps two chars and the domain', () => {
    expect(maskEmail('kpsankar1398kp@gmail.com')).toBe('kp***@gmail.com')
  })
  it('handles junk', () => {
    expect(maskEmail('not-an-email')).toBe('***')
  })
})

describe('maskPhone', () => {
  it('keeps last four digits and the plus', () => {
    expect(maskPhone('+91 88836 73422')).toBe('+********3422')
  })
  it('handles short input', () => {
    expect(maskPhone('12')).toBe('***')
  })
})

describe('summarizeInput', () => {
  it('redacts secrets, masks contact fields, hides free text', () => {
    const out = summarizeInput({
      name: 'Sankar',
      email: 'kpsankar1398kp@gmail.com',
      whatsapp: '8883673422',
      password: 'hunter2',
      details: 'a long message about a website',
      need: 'Booking Website',
    })
    expect(out).toEqual({
      name: 'Sankar',
      email: 'kp***@gmail.com',
      whatsapp: '******3422',
      password: '[redacted]',
      details: '[text:30]',
      need: 'Booking Website',
    })
  })

  it('bounds depth, arrays and long strings', () => {
    const out = summarizeInput({
      a: { b: { c: { d: 1 } } },
      list: [1, 2, 3],
      long: 'x'.repeat(100),
    }) as Record<string, unknown>
    expect(out.a).toEqual({ b: '[nested]' })
    expect(out.list).toBe('[array:3]')
    expect(String(out.long)).toMatch(/^x{60}…\(100\)$/)
  })

  it('never throws', () => {
    const circular: Record<string, unknown> = {}
    circular.self = circular
    expect(() => summarizeInput(circular)).not.toThrow()
  })
})

describe('error helpers', () => {
  it('uses code when present, else the class name', () => {
    const e = Object.assign(new Error('boom'), { code: 'VALIDATION_FAILED' })
    expect(errorCodeOf(e)).toBe('VALIDATION_FAILED')
    expect(errorCodeOf(new TypeError('x'))).toBe('TypeError')
    expect(errorCodeOf('str')).toBe('UNKNOWN')
    expect(errorMessageOf(new Error('boom'))).toBe('boom')
  })
})
