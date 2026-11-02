import { describe, expect, it } from 'vitest'
import { firstName, initials } from '@/lib/initials'

describe('initials', () => {
  it('takes the first letter of the first and last word', () => {
    expect(initials('Sankaralingam K')).toBe('SK')
    expect(initials('Kannan A')).toBe('KA')
    expect(initials('  nanthakumar   g  ')).toBe('NG')
  })

  it('handles single names and empty strings', () => {
    expect(initials('Kannan')).toBe('K')
    expect(initials('   ')).toBe('?')
  })
})

describe('firstName', () => {
  it('returns the first word', () => {
    expect(firstName('Sankaralingam K')).toBe('Sankaralingam')
    expect(firstName('Kannan')).toBe('Kannan')
  })
})
