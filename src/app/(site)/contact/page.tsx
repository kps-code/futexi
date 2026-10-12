import type { Metadata } from 'next'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { ContactForm } from '@/components/site/contact-form'
import { PageIntro } from '@/components/site/page-intro'
import { InstagramIcon, LinkedinIcon } from '@/components/site/social-icons'
import { ButtonLink } from '@/components/ui/button'
import { needOptions } from '@/content/contact'
import { whatsappLink } from '@/lib/whatsapp'
import { getFaqs, getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = { title: 'Contact' }

const typeMap: Record<string, (typeof needOptions)[number]> = {
  ai: 'AI Integration',
  booking: 'Booking Website',
  landing: 'Landing Page',
  automation: 'Automation',
  app: 'Mobile App',
  software: 'Custom Software',
  website: 'Website',
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const [settings, faq, params] = await Promise.all([getSiteSettings(), getFaqs(), searchParams])
  const defaultNeed = params.type ? typeMap[params.type] : undefined
  const wa = whatsappLink(settings.whatsappNumber, settings.whatsappMessage)

  const lines = [
    { icon: Phone, label: settings.phone, href: `tel:+${settings.whatsappNumber}` },
    { icon: Mail, label: settings.email, href: `mailto:${settings.email}` },
    settings.instagram ? { icon: InstagramIcon, label: 'Instagram', href: settings.instagram } : null,
    settings.linkedin ? { icon: LinkedinIcon, label: 'LinkedIn', href: settings.linkedin } : null,
  ].filter((x): x is NonNullable<typeof x> => Boolean(x))

  return (
    <>
      <PageIntro eyebrow="Contact" title="Let's talk about your project.">
        Tell us what you need. {settings.replyTimeText}
      </PageIntro>

      <section className="container-site grid gap-12 pb-20 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-8">
          <ul className="space-y-4">
            {lines.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="flex items-center gap-3 text-foreground/90 transition-colors hover:text-foreground"
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm">{label}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="flex items-center gap-3 text-sm text-foreground/90">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface">
              <MapPin aria-hidden className="h-4 w-4" />
            </span>
            <span>
              {settings.city}, {settings.region}
              {settings.serviceAreaText && (
                <span className="block text-muted">{settings.serviceAreaText}</span>
              )}
            </span>
          </p>
          <ButtonLink
            href={wa}
            size="lg"
            data-track="whatsapp_click"
            data-track-props='{"where":"contact_page"}'
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </ButtonLink>
          <p className="text-sm text-muted">{settings.startingPriceText}. Final price depends on scope.</p>
        </div>

        <ContactForm defaultNeed={defaultNeed} />
      </section>

      <section className="border-t border-border bg-surface/50">
        <div className="container-site py-16 sm:py-20">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Questions businesses ask us</h2>
          <div className="mt-8 divide-y divide-border">
            {faq.map((item) => (
              <details key={item.id} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium transition-colors group-open:text-accent hover:text-accent">
                  {item.question}
                  <span
                    aria-hidden
                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-[transform,border-color,color] duration-300 group-open:rotate-45 group-open:border-accent group-open:text-accent"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-3xl text-sm text-muted">
                  {item.answer.replace('{price}', settings.startingPriceText)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
