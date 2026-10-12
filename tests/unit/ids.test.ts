import { describe, expect, it } from 'vitest'
import { uuidv7, UUID_RE } from '@/lib/ids'

describe('uuidv7', () => {
  it('matches the uuid shape with version 7 and variant bits', () => {
    const id = uuidv7()
    expect(id).toMatch(UUID_RE)
    expect(id[14]).toBe('7')
    expect(['8', '9', 'a', 'b']).toContain(id[19])
  })
  it('sorts by time', () => {
    const a = uuidv7(1_000_000)
    const b = uuidv7(2_000_000)
    expect(a < b).toBe(true)
  })
})
