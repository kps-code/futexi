import { describe, expect, it } from 'vitest'
import { wantsQuoteForm } from '@/server/assistant/intent'
import { QUOTE_FORM_TOKEN } from '@/server/assistant/knowledge'
import { repetitionCutoff, TokenFilter } from '@/server/assistant/stream-filter'

function run(deltas: string[]) {
  const f = new TokenFilter(QUOTE_FORM_TOKEN)
  let out = ''
  for (const d of deltas) out += f.push(d)
  out += f.flush()
  return { out, found: f.found }
}

describe('TokenFilter', () => {
  it('passes ordinary text through unchanged, including stray brackets', () => {
    expect(run(['Hello [world]', ' and [more'])).toEqual({ out: 'Hello [world] and [more', found: false })
  })

  it('removes the token when it arrives whole', () => {
    expect(run([`Share your details.\n${QUOTE_FORM_TOKEN}`])).toEqual({
      out: 'Share your details.\n',
      found: true,
    })
  })

  it('removes the token when it is split across deltas', () => {
    expect(run(['Share your details.\n[OP', 'EN_QUO', 'TE_FORM]'])).toEqual({
      out: 'Share your details.\n',
      found: true,
    })
  })

  it('releases a held bracket that turned out not to be the token', () => {
    expect(run(['Price [OPEN', ' market] is fair'])).toEqual({
      out: 'Price [OPEN market] is fair',
      found: false,
    })
  })

  it('flushes a dangling prefix at the end of the stream', () => {
    expect(run(['See [OPEN_'])).toEqual({ out: 'See [OPEN_', found: false })
  })
})

describe('wantsQuoteForm', () => {
  it('is true for quote, call back, start and phone numbers', () => {
    for (const t of [
      'Can I get a quote?',
      'please call me back',
      'ok lets start',
      'my number is 9876543210',
      'quote venum',
      'start pannalam',
      'விலைப்பட்டியல் வேண்டும்',
    ]) {
      expect(wantsQuoteForm(t), t).toBe(true)
    }
  })
  it('is false for plain price and timeline questions', () => {
    for (const t of [
      'How much does a website cost?',
      'how long will it take',
      'what do you build',
      'evlo aagum?',
    ]) {
      expect(wantsQuoteForm(t), t).toBe(false)
    }
  })
})

describe('repetitionCutoff', () => {
  it('leaves ordinary text alone', () => {
    expect(repetitionCutoff('We build websites. We build apps. We build tools.')).toBe(-1)
    expect(repetitionCutoff('WhatsApp us on WhatsApp at WhatsApp')).toBe(-1)
  })
  it('cuts a looping tail and keeps one copy', () => {
    const junk = 'ச/WhatsApp-ஐ பயன்படுத்தி '
    const text = `விலை ₹5,000 இல் தொடங்குகிறது. ${junk.repeat(6)}`
    const cut = repetitionCutoff(text)
    expect(cut).toBeGreaterThan(0)
    expect(text.slice(0, cut)).toBe(`விலை ₹5,000 இல் தொடங்குகிறது. ${junk}`)
  })
})
