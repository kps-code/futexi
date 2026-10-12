import { MapPin } from 'lucide-react'
import Link from 'next/link'
import { brand, footerColumns, legal } from '@/content/site'
import { whatsappLink } from '@/lib/whatsapp'
import { Wordmark } from './wordmark'

export type FooterContact = {
  phone: string
  whatsappNumber: string
  whatsappMessage: string
  email: string
  city: string
  region: string
  serviceAreaText: string
  instagram?: string | null
  linkedin?: string | null
  github?: string | null
}

export type FooterLink = { label: string; href: string }

export function Footer({ contact, solutions }: { contact: FooterContact; solutions: FooterLink[] }) {
  const columns = footerColumns.map((col) =>
    col.title === 'Solutions' && solutions.length > 0 ? { title: col.title, links: solutions } : col,
  )
  const connect = [
    contact.instagram ? { label: 'Instagram', href: contact.instagram } : null,
    contact.linkedin ? { label: 'LinkedIn', href: contact.linkedin } : null,
    contact.github ? { label: 'GitHub', href: contact.github } : null,
    { label: 'WhatsApp', href: whatsappLink(contact.whatsappNumber, contact.whatsappMessage) },
  ].filter((x): x is { label: string; href: string } => Boolean(x))

  return (
    <footer className="relative border-t border-border bg-surface/60">
      <div
        aria-hidden
        className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
      />
      <div className="container-site grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Wordmark withSubline={false} />
          <p className="text-sm text-muted">{brand.positioning}</p>
          <p className="font-display text-lg font-semibold">{brand.footerLine}</p>
          <p className="flex items-start gap-2 text-sm text-muted">
            <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>
              {contact.city}, {contact.region}
              {contact.serviceAreaText && <span className="block">{contact.serviceAreaText}</span>}
            </span>
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="mb-4 text-xs font-semibold tracking-[0.18em] text-muted uppercase">{col.title}</h2>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="mb-4 text-xs font-semibold tracking-[0.18em] text-muted uppercase">Connect</h2>
          <ul className="space-y-2.5">
            {connect.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track={l.label === 'WhatsApp' ? 'whatsapp_click' : 'outbound_click'}
                  data-track-props={`{"where":"footer","label":"${l.label}"}`}
                  className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href={`mailto:${contact.email}`}
                className="text-sm text-foreground/80 hover:text-foreground"
              >
                {contact.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:+${contact.whatsappNumber}`}
                className="text-sm text-foreground/80 hover:text-foreground"
              >
                {contact.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-site flex flex-col gap-3 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{legal.copyright}</p>
          <ul className="flex gap-5">
            {legal.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
