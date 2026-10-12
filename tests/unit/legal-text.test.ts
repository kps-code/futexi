import { describe, expect, it } from 'vitest'
import { legalParagraphs, legalRuns } from '@/lib/legal-text'

const vars = {
  brand: 'KAPOSA FUTEXI',
  email: 'hello@example.com',
  phone: '+91 88836 73422',
  price: 'From ₹5,000',
}

describe('legalRuns', () => {
  it('fills placeholders and isolates the email as its own run', () => {
    expect(legalRuns('Email {email} or call {phone}. {brand} thanks you.', vars)).toEqual([
      { kind: 'text', value: 'Email ' },
      { kind: 'email', value: 'hello@example.com' },
      { kind: 'text', value: ' or call +91 88836 73422. KAPOSA FUTEXI thanks you.' },
    ])
  })
  it('leaves text without placeholders untouched', () => {
    expect(legalRuns('Plain sentence.', vars)).toEqual([{ kind: 'text', value: 'Plain sentence.' }])
  })
  it('handles a placeholder at the start', () => {
    expect(legalRuns('{price}. Quotes are valid for 30 days.', vars)[0]).toEqual({
      kind: 'text',
      value: 'From ₹5,000. Quotes are valid for 30 days.',
    })
  })
})

describe('legalParagraphs', () => {
  it('splits on blank lines and joins soft line breaks', () => {
    expect(legalParagraphs('First line\ncontinues.\n\n\nSecond paragraph.\n')).toEqual([
      'First line continues.',
      'Second paragraph.',
    ])
  })
})
