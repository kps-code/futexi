/**
 * Removes a control token (for example `[OPEN_QUOTE_FORM]`) from streamed text while the text
 * is still arriving. A token may be split across deltas, so a possible prefix at the end of a
 * delta is held back until the next delta decides whether it was the token or ordinary text.
 */
export class TokenFilter {
  private pending = ''
  /** True once the whole token has been seen anywhere in the stream. */
  found = false

  constructor(private readonly token: string) {}

  /** Returns the part of the text that is safe to send on. */
  push(delta: string): string {
    let s = this.pending + delta
    this.pending = ''
    let out = ''
    while (s.length) {
      const at = s.indexOf(this.token[0])
      if (at < 0) {
        out += s
        break
      }
      out += s.slice(0, at)
      const rest = s.slice(at)
      if (rest.startsWith(this.token)) {
        this.found = true
        s = rest.slice(this.token.length)
        continue
      }
      if (this.token.startsWith(rest)) {
        this.pending = rest
        break
      }
      out += rest[0]
      s = rest.slice(1)
    }
    return out
  }

  /** Text held back as a possible token start. Call once the stream has ended. */
  flush(): string {
    const held = this.pending
    this.pending = ''
    return held
  }
}

/**
 * Detects a model stuck in a loop (the same chunk repeated at the end of the text, seen with
 * lightning on Tamil script). Returns the index to cut at, keeping one copy, or -1.
 */
export function repetitionCutoff(
  text: string,
  {
    minPeriod = 8,
    maxPeriod = 80,
    repeats = 3,
  }: { minPeriod?: number; maxPeriod?: number; repeats?: number } = {},
): number {
  for (let p = minPeriod; p <= maxPeriod && p * repeats <= text.length; p++) {
    const chunk = text.slice(-p)
    let count = 1
    while (count < repeats + 1 && text.endsWith(chunk.repeat(count + 1))) count++
    if (count >= repeats) {
      let start = text.length - p * count
      // Walk back over any further full copies so the whole run goes.
      while (start - p >= 0 && text.slice(start - p, start) === chunk) start -= p
      return start + p
    }
  }
  return -1
}
