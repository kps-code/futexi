import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { FeedbackForm } from '@/components/site/feedback-form'
import { PageIntro } from '@/components/site/page-intro'

/** Private per-client page; never indexed, never cached. */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Your feedback',
  robots: { index: false, follow: false },
}

export default async function FeedbackPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(token)) notFound()

  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'testimonials',
    where: { token: { equals: token } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const doc = res.docs[0]
  if (!doc) notFound()

  const firstName = doc.name.trim().split(/\s+/)[0] || doc.name

  return (
    <>
      <PageIntro eyebrow="Feedback" title={`Hi ${firstName}, how did we do?`}>
        Two minutes, two lines. Your words help other businesses decide to work with us.
      </PageIntro>
      <section className="container-site max-w-3xl pb-20">
        {doc.submittedAt ? (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Received</p>
            <h2 className="mt-3 font-display text-2xl font-bold">Thank you, {firstName}.</h2>
            <p className="mt-2 text-muted">
              We have your feedback. It means a lot to us, and we may feature it on our website.
            </p>
          </div>
        ) : (
          <FeedbackForm token={token} name={doc.name} business={doc.business ?? undefined} />
        )}
      </section>
    </>
  )
}
