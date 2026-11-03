import { describe, expect, it } from 'vitest'
import { buildMessages, dedupeHistory, MAX_HISTORY, sameQuestion } from '@/server/assistant/messages'

describe('assistant messages', () => {
  const sheet = '# sheet'
  it('puts the sheet first, the history in the middle and a scope reminder last', () => {
    const m = buildMessages(sheet, [{ role: 'user', content: 'Write me a poem' }], 'KAPOSA Assistant')
    expect(m[0]).toEqual({ role: 'system', content: sheet })
    expect(m[1]).toEqual({ role: 'user', content: 'Write me a poem' })
    expect(m[2].role).toBe('system')
    expect(m[2].content).toContain('you are KAPOSA Assistant')
    expect(m[2].content).toContain('poems')
    expect(m[2].content).not.toContain('Tamil script')
  })

  it('adds the Tamil-script instruction only when the visitor wrote Tamil letters', () => {
    const m = buildMessages(sheet, [{ role: 'user', content: 'விலை எவ்வளவு?' }], 'X')
    expect(m[m.length - 1].content).toContain('Tamil script')
    const t = buildMessages(sheet, [{ role: 'user', content: 'evlo aagum?' }], 'X')
    expect(t[t.length - 1].content).not.toContain('Tamil script')
  })

  it('keeps only the last turns', () => {
    const history = Array.from({ length: 20 }, (_, i) => ({
      role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
      content: `m${i}`,
    }))
    const m = buildMessages(sheet, history, 'X')
    expect(m).toHaveLength(MAX_HISTORY + 2)
    expect(m[1].content).toBe(`m${20 - MAX_HISTORY}`)
  })
})

describe('dedupeHistory', () => {
  const P = 'Demo sites are examples, not packages.'
  it('drops earlier copies of the current question and their answers', () => {
    const history = [
      { role: 'user' as const, content: 'show demos detail' },
      { role: 'assistant' as const, content: P },
      { role: 'user' as const, content: 'Show demos detail' },
      { role: 'assistant' as const, content: P },
      { role: 'user' as const, content: 'show demos detail' },
    ]
    expect(dedupeHistory(history)).toEqual([{ role: 'user', content: 'show demos detail' }])
  })

  it('keeps distinct turns in order and removes duplicate answers', () => {
    const history = [
      { role: 'user' as const, content: 'price list' },
      { role: 'assistant' as const, content: 'Projects start from ₹5,000.' },
      { role: 'user' as const, content: 'each demo price' },
      { role: 'assistant' as const, content: 'Projects start from ₹5,000.' },
      { role: 'user' as const, content: 'how long' },
    ]
    expect(dedupeHistory(history)).toEqual([
      { role: 'user', content: 'price list' },
      { role: 'user', content: 'each demo price' },
      { role: 'assistant', content: 'Projects start from ₹5,000.' },
      { role: 'user', content: 'how long' },
    ])
  })

  it('feeds the model the deduplicated history', () => {
    const m = buildMessages(
      '# sheet',
      [
        { role: 'user', content: 'demo' },
        { role: 'assistant', content: 'x' },
        { role: 'user', content: 'demo' },
      ],
      'X',
    )
    expect(m).toHaveLength(3)
    expect(m[1]).toEqual({ role: 'user', content: 'demo' })
  })
})

describe('sameQuestion', () => {
  it('treats case, punctuation and simple plurals as the same question', () => {
    expect(sameQuestion('show demos detail', 'Show demo detail?')).toBe(true)
    expect(sameQuestion('want detail', 'want details')).toBe(true)
    expect(sameQuestion('price?', 'Price')).toBe(true)
  })

  it('keeps genuinely different questions apart', () => {
    expect(sameQuestion('show demos detail', 'price list')).toBe(false)
    expect(sameQuestion('how long', 'how much')).toBe(false)
  })

  it('drops a near-duplicate earlier question and its paragraph answer', () => {
    const history = [
      { role: 'user' as const, content: 'show demos detail' },
      { role: 'assistant' as const, content: 'Demo sites are examples, not packages.' },
      { role: 'user' as const, content: 'show demo detail' },
    ]
    expect(dedupeHistory(history)).toEqual([{ role: 'user', content: 'show demo detail' }])
  })
})
