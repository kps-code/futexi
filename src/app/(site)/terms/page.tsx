import type { Metadata } from 'next'
import { PageIntro } from '@/components/site/page-intro'
import { brand } from '@/content/site'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = { title: 'Terms', robots: { index: false } }

/** Draft. Review before launch (docs/content-lock.md §12, item 5). */
export default async function TermsPage() {
  const settings = await getSiteSettings()
  return (
    <>
      <PageIntro eyebrow="Legal" title="Terms">
        Plain-language terms for using this website and working with {brand.name}. Last updated 7 October
        2026.
      </PageIntro>
      <section className="container-site max-w-3xl space-y-8 pb-24">
        <Part title="This website">
          <p>
            Content, demos and designs on this site are the work of {brand.name}. You may browse and share
            links freely. Please do not copy the demos or designs for commercial use without asking.
          </p>
          <p>Demos are concept projects. Businesses shown in them are examples unless stated otherwise.</p>
        </Part>
        <Part title="Enquiries and quotes">
          <p>
            {settings.startingPriceText}. A quote is prepared after we understand your requirements and is
            valid for 30 days. The final scope, price and timeline are confirmed in writing before work
            begins.
          </p>
        </Part>
        <Part title="Projects">
          <p>
            Work starts after the agreed advance payment. We deliver in stages and share progress for your
            review. Change requests outside the agreed scope are quoted separately. You own the final website,
            its content and its domain once the project is paid in full.
          </p>
        </Part>
        <Part title="Third-party services">
          <p>
            Domains, hosting, email, AI APIs and similar services are billed by their providers at their
            rates. We help you set them up in accounts you own.
          </p>
        </Part>
        <Part title="Support">
          <p>
            Bugs in delivered work are fixed free of charge for 30 days after launch. Ongoing updates and
            maintenance are available as a separate agreement.
          </p>
        </Part>
        <Part title="Contact">
          <p>
            Questions about these terms:{' '}
            <a className="text-accent underline-offset-4 hover:underline" href={`mailto:${settings.email}`}>
              {settings.email}
            </a>
            .
          </p>
        </Part>
      </section>
    </>
  )
}

function Part({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted sm:text-base">{children}</div>
    </div>
  )
}
