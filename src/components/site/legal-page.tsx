import { PageIntro } from '@/components/site/page-intro'
import { legalParagraphs, legalRuns, type LegalVars } from '@/lib/legal-text'
import type { LegalPageView } from '@/server/site-data'

function Runs({ text, vars }: { text: string; vars: LegalVars }) {
  return (
    <>
      {legalRuns(text, vars).map((r, i) =>
        r.kind === 'email' ? (
          <a key={i} className="text-accent underline-offset-4 hover:underline" href={`mailto:${r.value}`}>
            {r.value}
          </a>
        ) : (
          <span key={i}>{r.value}</span>
        ),
      )}
    </>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
      })
}

/** Privacy Policy and Terms, rendered from Content > Legal Pages. */
export function LegalPage({ page, vars }: { page: LegalPageView; vars: LegalVars }) {
  return (
    <>
      <PageIntro eyebrow="Legal" title={page.title}>
        {page.intro && <Runs text={page.intro} vars={vars} />}
        {page.updatedOn && <> Last updated {formatDate(page.updatedOn)}.</>}
      </PageIntro>
      <section className="container-site max-w-3xl space-y-8 pb-24 text-foreground/90">
        {page.sections.map((s) => (
          <div key={s.title} className="space-y-3">
            <h2 className="font-display text-xl font-semibold">{s.title}</h2>
            <div className="space-y-3 text-sm leading-relaxed text-muted sm:text-base">
              {legalParagraphs(s.body).map((p, i) => (
                <p key={i}>
                  <Runs text={p} vars={vars} />
                </p>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
