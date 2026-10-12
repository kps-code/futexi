import type { Metadata } from 'next'
import { PageIntro } from '@/components/site/page-intro'
import { brand } from '@/content/site'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = { title: 'Privacy Policy', robots: { index: false } }

/** Draft. Review before launch (docs/content-lock.md §12, item 5). */
export default async function PrivacyPage() {
  const settings = await getSiteSettings()
  return (
    <>
      <PageIntro eyebrow="Legal" title="Privacy Policy">
        How {brand.name} handles information on this website. Last updated 7 October 2026.
      </PageIntro>
      <section className="container-site max-w-3xl space-y-8 pb-24 text-foreground/90">
        <Part title="What we collect">
          <p>
            When you browse, we record anonymous usage: pages viewed, time on page, scroll depth, button
            clicks, the page that referred you, your device type, browser, and country or city. We do not
            store your IP address; it is hashed with a daily key and cannot be reversed.
          </p>
          <p>
            When you submit the contact form, we store what you type: name, business name, email, WhatsApp
            number, business type, what you need, budget range and project details. We link it to your
            anonymous browsing so we can understand how you found us.
          </p>
        </Part>
        <Part title="Cookies">
          <p>
            We set two first-party cookies: <code>kf_vid</code> identifies your browser for up to 13 months
            and <code>kf_sid</code> groups one visit (it expires after 30 minutes of inactivity). They contain
            random identifiers only. We use no advertising or third-party tracking cookies.
          </p>
        </Part>
        <Part title="How we use it">
          <p>
            To reply to your enquiry, to understand which pages and demos are useful, and to improve the
            website. We never sell or share your information with third parties for marketing.
          </p>
        </Part>
        <Part title="Retention">
          <p>
            Anonymous browsing data is kept for 180 days and technical request logs for 90 days. Enquiries are
            kept until you ask us to delete them.
          </p>
        </Part>
        <Part title="Your rights">
          <p>
            You can ask us to show, correct or delete your information at any time. Email{' '}
            <a className="text-accent underline-offset-4 hover:underline" href={`mailto:${settings.email}`}>
              {settings.email}
            </a>{' '}
            or message us on WhatsApp at {settings.phone}.
          </p>
        </Part>
        <Part title="Services we use">
          <p>
            The site is hosted on Vercel. Images are stored on Vercel Blob. Error reports may be sent to
            Sentry. Lead notification emails are sent through Resend. Each provider processes data only to
            deliver its service.
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
