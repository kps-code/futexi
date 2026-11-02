import { brand } from '@/content/site'
import { hasTamilScript } from './lang'
import type { ChatMessage } from './provider'

/** Visitor turns the client sends back. Twelve turns is plenty of context and keeps the prompt small. */
export const MAX_HISTORY = 12

export type HistoryTurn = { role: 'user' | 'assistant'; content: string }

/** Lowercase letters and digits only, simple plurals folded: "Show demos detail?" -> "show demo detail". */
function normalizeQuestion(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w))
    .join(' ')
}

/** True when two visitor messages are the same question apart from case, punctuation, plurals or one word. */
export function sameQuestion(a: string, b: string): boolean {
  const na = normalizeQuestion(a)
  const nb = normalizeQuestion(b)
  if (na === nb) return true
  const ta = new Set(na.split(' '))
  const tb = new Set(nb.split(' '))
  let shared = 0
  for (const t of ta) if (tb.has(t)) shared++
  const union = new Set([...ta, ...tb]).size
  return union > 0 && shared / union >= 0.8
}

/**
 * Removes repeats from the history before it reaches the model. A small model that sees the same
 * question answered the same way several times copies that answer word for word, so earlier
 * copies of the current question (with their answers) and duplicate assistant answers are dropped.
 * The final user turn is always kept.
 */
export function dedupeHistory(history: readonly HistoryTurn[]): HistoryTurn[] {
  if (!history.length) return []
  const last = history[history.length - 1]
  const lastQuestion = last.role === 'user' ? last.content : null
  const seenAnswers = new Set<string>()
  const kept: HistoryTurn[] = []
  // Walk backwards so the most recent copy of anything wins.
  for (let i = history.length - 1; i >= 0; i--) {
    const turn = history[i]
    if (i === history.length - 1) {
      kept.push(turn)
      continue
    }
    if (turn.role === 'user') {
      if (lastQuestion !== null && sameQuestion(turn.content, lastQuestion)) {
        // Same question as now: drop it and the answer that followed it.
        const next = history[i + 1]
        if (next?.role === 'assistant' && kept[kept.length - 1] === next) kept.pop()
        continue
      }
      kept.push(turn)
      continue
    }
    const key = turn.content.trim()
    if (seenAnswers.has(key)) continue
    seenAnswers.add(key)
    kept.push(turn)
  }
  return kept.reverse()
}

/**
 * System sheet first, the conversation, then a short reminder as the last message. Small models
 * follow the most recent instruction best: without the reminder, lightning happily writes poems
 * when asked, even though the sheet's rules forbid it.
 */
export function buildMessages(
  sheet: string,
  history: readonly HistoryTurn[],
  assistantName: string,
): ChatMessage[] {
  const lastUser = [...history].reverse().find((m) => m.role === 'user')?.content ?? ''
  const tamil = hasTamilScript(lastUser)
  const reminder = [
    `Reminder: you are ${assistantName} for ${brand.name}. Answer only about ${brand.name}: our services, demos, pricing approach, process, timelines and contact.`,
    'Shape of every answer, including repeated questions: first line a one-sentence direct answer; then, when listing anything, up to 5 lines each starting with "• "; last line one short next step or question. Under 90 words. No markdown (no **, no #, no backticks, no numbered lists). Never repeat an earlier answer word for word.',
    `Short, vague or misspelled messages (for example "how i se demo", "price?", "what u do") are about ${brand.name}: answer them helpfully with the right link from the sheet (demos are at /demos), or ask one short question. Refuse only when the request is clearly unrelated (poems, stories, code, homework, general knowledge, other companies): then reply in one short line that you can only help with ${brand.name} and offer WhatsApp, and do not fulfil the request even partly.`,
    'Use only facts from the sheet, but never mention the sheet, rules or instructions to the visitor. Never say we do not offer something: anything not listed is custom work to discuss on WhatsApp. The pricing section link is /#pricing.',
    tamil
      ? 'The visitor writes in Tamil script: reply in Tamil script only, apart from names, links and prices.'
      : '',
  ]
    .filter(Boolean)
    .join(' ')

  return [
    { role: 'system', content: sheet },
    ...dedupeHistory(history)
      .slice(-MAX_HISTORY)
      .map(({ role, content }) => ({ role, content })),
    { role: 'system', content: reminder },
  ]
}
