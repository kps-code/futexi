import { describe, expect, it } from 'vitest'
import { shapeAnswer, splitSentences } from '@/server/assistant/shape'

const PARAGRAPH =
  'Demo sites are examples, not packages. Each shows a different business type: booking, salon, restaurant, interior designer, tuition centre and AI-powered. Live links are at /demo/booking, /demo/salon, /demo/restaurant, /demo/interior, /demo/tuition and /demo/ai-business. Pricing starts from ₹5,000. We send a clear quote after a short chat.'

describe('shapeAnswer', () => {
  it('turns a long paragraph into first line, bullets and a closing line', () => {
    const out = shapeAnswer(PARAGRAPH)
    expect(out.split('\n')).toEqual([
      'Demo sites are examples, not packages.',
      '• Each shows a different business type: booking, salon, restaurant, interior designer, tuition centre and AI-powered.',
      '• Live links are at /demo/booking, /demo/salon, /demo/restaurant, /demo/interior, /demo/tuition and /demo/ai-business.',
      '• Pricing starts from ₹5,000.',
      'We send a clear quote after a short chat.',
    ])
  })

  it('leaves short answers and answers that already have list lines alone', () => {
    const short = 'Projects start from ₹5,000. We send a quote after a short chat. See /#pricing.'
    expect(shapeAnswer(short)).toBe(short)
    const listed = 'We build six demos.\n• Booking: /demo/booking\n• Salon: /demo/salon\nWant the links?'
    expect(shapeAnswer(listed)).toBe(listed)
    const dashed = 'We build six demos.\n- Booking: /demo/booking\n- Salon: /demo/salon\nWant the links?'
    expect(shapeAnswer(dashed)).toBe(dashed)
  })

  it('caps the bullets at five and folds the rest into the closing line', () => {
    const sentences = Array.from({ length: 9 }, (_, i) => `Sentence number ${i + 1} has enough words in it.`)
    const out = shapeAnswer(sentences.join(' '))
    const lines = out.split('\n')
    expect(lines).toHaveLength(7)
    expect(lines.filter((l) => l.startsWith('• '))).toHaveLength(5)
    expect(lines[6]).toBe(
      'Sentence number 7 has enough words in it. Sentence number 8 has enough words in it. Sentence number 9 has enough words in it.',
    )
  })

  it('splits sentences on terminal punctuation but not inside e.g. or lowercase continuations', () => {
    expect(splitSentences('We build sites, e.g. booking pages. Prices start from ₹5,000. Ask us!')).toEqual([
      'We build sites, e.g. booking pages.',
      'Prices start from ₹5,000.',
      'Ask us!',
    ])
  })
})

describe('shapeAnswer with inline bullets', () => {
  it('moves bullets the model wrote mid-line onto their own lines without doubling them', () => {
    const inline =
      'We are a Chennai-based team of software engineers who build websites and AI products. • We build business websites and landing pages. • We add AI assistants and automation. • You can learn more on our /about page. Would you like to chat about your project?'
    expect(shapeAnswer(inline).split('\n')).toEqual([
      'We are a Chennai-based team of software engineers who build websites and AI products.',
      '• We build business websites and landing pages.',
      '• We add AI assistants and automation.',
      '• You can learn more on our /about page. Would you like to chat about your project?',
    ])
  })
})
