/** Fills {brand}, {email}, {phone}, {price} in admin-written legal text. */
export type LegalVars = { brand: string; email: string; phone: string; price: string }

export type LegalRun = { kind: 'text'; value: string } | { kind: 'email'; value: string }

const TOKEN = /\{(brand|email|phone|price)\}/g

/** Splits one paragraph into text runs and email runs, so the email can be a mailto link. */
export function legalRuns(text: string, vars: LegalVars): LegalRun[] {
  const runs: LegalRun[] = []
  let last = 0
  for (const m of text.matchAll(TOKEN)) {
    const key = m[1] as keyof LegalVars
    if (m.index! > last) runs.push({ kind: 'text', value: text.slice(last, m.index) })
    runs.push(key === 'email' ? { kind: 'email', value: vars.email } : { kind: 'text', value: vars[key] })
    last = m.index! + m[0].length
  }
  if (last < text.length) runs.push({ kind: 'text', value: text.slice(last) })
  // Merge neighbouring text runs.
  return runs.reduce<LegalRun[]>((acc, r) => {
    const prev = acc[acc.length - 1]
    if (prev && prev.kind === 'text' && r.kind === 'text') prev.value += r.value
    else acc.push({ ...r })
    return acc
  }, [])
}

/** Paragraphs are separated by one or more blank lines. */
export function legalParagraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)
}
