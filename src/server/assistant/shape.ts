/**
 * Deterministic safety net for the fixed answer shape (knowledge.ts rule 8). A small model copies
 * the format of the turns it sees, so one paragraph answer in the history breeds more paragraphs
 * whatever the rules say. When the whole answer is a block of three or more sentences with no list
 * lines, the middle sentences become "• " lines: the first sentence stays the direct answer and the
 * last one the closing line. Short answers and anything already shaped pass through untouched.
 */

const MIN_WORDS = 30
const MIN_SENTENCES = 3
const MAX_BULLETS = 5
const LIST_LINE = /^\s*(?:•|[-*]|\d+[.)])\s/m
const INLINE_BULLET = /\s*•\s*/g

export function shapeAnswer(text: string): string {
  const trimmed = text.trim()
  if (!trimmed) return trimmed
  if (LIST_LINE.test(trimmed)) return trimmed
  // Bullets written inline ("... products. • We build ... • We also ...") become their own lines.
  if (trimmed.includes('•')) return trimmed.replace(INLINE_BULLET, '\n• ').trim()
  if (trimmed.split(/\s+/).length < MIN_WORDS) return trimmed
  const sentences = splitSentences(trimmed)
  if (sentences.length < MIN_SENTENCES) return trimmed
  const first = sentences[0]
  const middle = sentences.slice(1, -1)
  const bullets = middle.slice(0, MAX_BULLETS)
  const closing = [...middle.slice(MAX_BULLETS), sentences[sentences.length - 1]].join(' ')
  return [first, ...bullets.map((s) => `• ${s}`), closing].join('\n')
}

/**
 * Splits on line breaks and on sentence-ending punctuation followed by a space and a new start.
 * The next character must not be a lowercase letter, so "e.g. this" and "etc. and" stay together
 * while "₹5,000. We" and "/demo/salon. Pricing" split.
 */
export function splitSentences(text: string): string[] {
  return text
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[.!?])\s+(?=[^\sa-z])/))
    .map((s) => s.trim())
    .filter(Boolean)
}
