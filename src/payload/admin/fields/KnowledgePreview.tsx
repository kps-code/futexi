import type { Payload } from 'payload'
import { getKnowledge } from '@/server/assistant/load-knowledge'

/**
 * The exact text the model receives, built from the saved values. Lets the team check what the
 * assistant knows after a save without opening a chat.
 */
export async function KnowledgePreview({ payload }: { payload: Payload }) {
  const saved = await payload
    .findGlobal({ slug: 'assistant', depth: 0, overrideAccess: true })
    .catch(() => null)
  const sheet = await getKnowledge({
    assistantName: saved?.name ?? undefined,
    extraNotes: saved?.extraNotes ?? undefined,
  })
  const words = Math.round(sheet.length / 4.2)

  return (
    <details style={{ marginTop: 'var(--base)' }}>
      <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
        What the assistant reads (saved version, about {words.toLocaleString('en-IN')} tokens)
      </summary>
      <p style={{ margin: 'calc(var(--base) / 2) 0', color: 'var(--theme-elevation-600)' }}>
        Updates after you save. Facts come from the places listed above; the rules at the end are fixed in
        code.
      </p>
      <pre
        style={{
          whiteSpace: 'pre-wrap',
          fontSize: '12px',
          lineHeight: 1.5,
          maxHeight: '28rem',
          overflow: 'auto',
          padding: 'var(--base)',
          background: 'var(--theme-elevation-50)',
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: 'var(--style-radius-s)',
        }}
      >
        {sheet}
      </pre>
    </details>
  )
}
