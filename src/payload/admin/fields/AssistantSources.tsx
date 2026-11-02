/**
 * Where the assistant's facts live. Shown at the top of Site Assistant > Knowledge so nobody
 * looks for a price field here: each fact is edited once, in the place the website already uses.
 */
const sources = [
  {
    label: 'Starting price',
    where: 'Site Settings → Texts → Starting price text',
    href: '/admin/globals/site-settings',
  },
  {
    label: 'Timelines and common answers',
    where: 'FAQ (for example "How long does a website take?")',
    href: '/admin/collections/faqs',
  },
  {
    label: 'Services, pricing text, process',
    where: 'Services and Home Page',
    href: '/admin/collections/services',
  },
  { label: 'Which demos are mentioned', where: 'Demos (show / hide)', href: '/admin/globals/demo-settings' },
]

export function AssistantSources() {
  return (
    <div style={{ marginBottom: 'var(--base)' }}>
      <p style={{ margin: '0 0 calc(var(--base) / 2)', color: 'var(--theme-elevation-600)' }}>
        The assistant reads these automatically. Change a fact there and it answers with the new value within
        a few seconds, on the website and in the chat.
      </p>
      <ul style={{ margin: 0, paddingLeft: '1.2em', lineHeight: 1.7 }}>
        {sources.map((s) => (
          <li key={s.label}>
            <strong>{s.label}</strong>: {s.where}{' '}
            <a href={s.href} style={{ textDecoration: 'underline' }}>
              Open
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
