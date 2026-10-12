import Link from 'next/link'
import { ArrowRight, Clock, MapPin, MessageCircle, Sparkles } from 'lucide-react'
import { demoNotice, type DemoBusiness } from '@/content/demo-businesses'
import { whatsappLink } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'

/** Thin dark bar above every demo site: who built it, and how to get one. */
export function DemoRibbon({ business }: { business: DemoBusiness }) {
  return (
    <div className="bg-[#0b0f1a] text-white">
      <div className="container-dm flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2 text-xs">
        <p className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
          <span className="text-white/80">{demoNotice.label}</span>
          <span className="hidden text-white/40 sm:inline">·</span>
          <Link
            href={`/demos/${business.id}`}
            className="hidden underline-offset-4 hover:underline sm:inline"
          >
            Read the case study
          </Link>
        </p>
        <Link
          href={`/contact?type=${business.contactType}`}
          className="inline-flex items-center gap-1.5 font-medium text-cyan-300 hover:text-white"
          data-track="cta_click"
          data-track-props={`{"cta":"demo_ribbon","demo":"${business.id}"}`}
        >
          {demoNotice.cta} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}

export function DemoLogo({ business, className }: { business: DemoBusiness; className?: string }) {
  return (
    <Link
      href={business.path}
      className={cn(
        'inline-flex items-center gap-2 font-display text-lg font-bold tracking-tight',
        className,
      )}
    >
      <span className="bg-dm-brand text-dm-on-brand inline-flex h-8 w-8 items-center justify-center rounded-full text-sm">
        {business.logoLetter}
      </span>
      {business.name}
    </Link>
  )
}

export function DemoNav({ business, ctaHref }: { business: DemoBusiness; ctaHref?: string }) {
  const href = ctaHref ?? business.bookPath ?? business.path
  return (
    <header className="border-dm-line bg-dm-bg/85 sticky top-0 z-40 border-b backdrop-blur">
      <div className="container-dm flex h-16 items-center justify-between gap-4">
        <DemoLogo business={business} />
        <nav
          aria-label={business.name}
          className="text-dm-muted hidden items-center gap-6 text-sm font-medium md:flex"
        >
          {business.nav.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-dm-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <DemoButton
          href={href}
          size="sm"
          data-track="cta_click"
          data-track-props={`{"cta":"demo_nav","demo":"${business.id}"}`}
        >
          {business.ctaLabel}
        </DemoButton>
      </div>
    </header>
  )
}

export function DemoFooter({ business }: { business: DemoBusiness }) {
  return (
    <footer id="visit" className="border-dm-line bg-dm-surface-2 mt-auto scroll-mt-20 border-t">
      <div className="container-dm grid gap-10 py-14 md:grid-cols-3">
        <div className="space-y-3">
          <DemoLogo business={business} />
          <p className="text-dm-muted text-sm">{business.tagline}</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="flex items-start gap-2">
            <MapPin className="text-dm-brand mt-0.5 h-4 w-4 shrink-0" />
            <span>{business.address}</span>
          </p>
          <a
            href={business.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dm-brand inline-block pl-6 font-medium hover:underline"
          >
            Open in Maps
          </a>
        </div>
        <div className="text-sm">
          <p className="flex items-center gap-2 font-medium">
            <Clock className="text-dm-brand h-4 w-4" /> Opening hours
          </p>
          <ul className="text-dm-muted mt-2 space-y-1 pl-6">
            {business.hoursText.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-dm-line border-t">
        <div className="container-dm text-dm-muted flex flex-col gap-2 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {business.name}. Sample business for a website concept.</p>
          <p>
            Website concept by{' '}
            <Link href="/" className="text-dm-ink font-medium hover:underline">
              KAPOSA FUTEXI
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

export function WhatsAppFab({ business, number }: { business: DemoBusiness; number: string }) {
  return (
    <a
      href={whatsappLink(number, `Hi, I found ${business.name} (KAPOSA FUTEXI demo) and have a question.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      data-track="whatsapp_click"
      data-track-props={`{"where":"demo_fab","demo":"${business.id}"}`}
      className="fixed right-4 bottom-4 z-40 inline-flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}

type BtnProps = {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'inverse'
  size?: 'sm' | 'md' | 'lg'
  className?: string
} & Record<`data-${string}`, string>

export function DemoButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: BtnProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background-color,transform,filter] active:scale-[0.98]',
        variant === 'primary' && 'bg-dm-brand text-dm-on-brand hover:brightness-110',
        variant === 'secondary' && 'border-dm-line-strong text-dm-ink hover:bg-dm-surface border',
        variant === 'inverse' && 'bg-dm-ink text-dm-bg hover:brightness-110',
        size === 'sm' && 'h-9 px-4 text-sm',
        size === 'md' && 'h-11 px-6 text-sm',
        size === 'lg' && 'h-13 px-8 text-base',
        className,
      )}
      {...rest}
    >
      {children}
    </Link>
  )
}

/** Wraps a demo page: applies the business theme and the standard chrome. */
export function DemoShell({
  business,
  children,
  whatsappNumber,
  ctaHref,
}: {
  business: DemoBusiness
  children: React.ReactNode
  whatsappNumber?: string
  ctaHref?: string
}) {
  return (
    <div className={cn(business.theme, 'bg-dm-bg text-dm-ink flex min-h-dvh flex-col')}>
      <DemoRibbon business={business} />
      <DemoNav business={business} ctaHref={ctaHref} />
      <main className="flex-1">{children}</main>
      <DemoFooter business={business} />
      {whatsappNumber && <WhatsAppFab business={business} number={whatsappNumber} />}
    </div>
  )
}

export function SectionTitle({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-dm-brand text-xs font-semibold tracking-[0.18em] uppercase">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {sub && <p className="text-dm-muted mt-3">{sub}</p>}
    </div>
  )
}
