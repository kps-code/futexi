import Link from 'next/link'
import { ArrowRight, Clock, MapPin, MessageCircle, Sparkles } from 'lucide-react'
import { demoNotice, nova } from '@/content/demo-booking'
import { whatsappLink } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'

const BASE = '/demo/booking'

/** Thin dark bar above the demo site so visitors know who built it, and how to get one. */
export function DemoRibbon() {
  return (
    <div className="bg-[#0b0f1a] text-white">
      <div className="container-nv flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2 text-xs">
        <p className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
          <span className="text-white/80">{demoNotice.label}</span>
          <span className="hidden text-white/40 sm:inline">·</span>
          <Link
            href={demoNotice.caseStudyHref}
            className="hidden underline-offset-4 hover:underline sm:inline"
          >
            Read the case study
          </Link>
        </p>
        <Link
          href={demoNotice.href}
          className="inline-flex items-center gap-1.5 font-medium text-cyan-300 hover:text-white"
          data-track="cta_click"
          data-track-props='{"cta":"demo_ribbon","demo":"booking"}'
        >
          {demoNotice.cta} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}

export function NovaLogo({ className }: { className?: string }) {
  return (
    <Link
      href={BASE}
      className={cn(
        'inline-flex items-center gap-2 font-display text-lg font-bold tracking-tight',
        className,
      )}
    >
      <span className="bg-nv-brand inline-flex h-8 w-8 items-center justify-center rounded-full text-sm text-white">
        N
      </span>
      {nova.name}
    </Link>
  )
}

export function NovaNav() {
  return (
    <header className="border-nv-line bg-nv-bg/85 sticky top-0 z-40 border-b backdrop-blur">
      <div className="container-nv flex h-16 items-center justify-between gap-4">
        <NovaLogo />
        <nav
          aria-label="Nova Studio"
          className="text-nv-muted hidden items-center gap-6 text-sm font-medium md:flex"
        >
          <a href={`${BASE}#services`} className="hover:text-nv-ink">
            Services
          </a>
          <a href={`${BASE}#how`} className="hover:text-nv-ink">
            How it works
          </a>
          <a href={`${BASE}#visit`} className="hover:text-nv-ink">
            Visit
          </a>
        </nav>
        <NovaButton
          href={`${BASE}/book`}
          size="sm"
          data-track="cta_click"
          data-track-props='{"cta":"nova_nav_book"}'
        >
          Book now
        </NovaButton>
      </div>
    </header>
  )
}

export function NovaFooter() {
  return (
    <footer id="visit" className="border-nv-line bg-nv-surface-2 mt-auto border-t">
      <div className="container-nv grid gap-10 py-14 md:grid-cols-3">
        <div className="space-y-3">
          <NovaLogo />
          <p className="text-nv-muted text-sm">{nova.tagline}</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="flex items-start gap-2">
            <MapPin className="text-nv-brand mt-0.5 h-4 w-4 shrink-0" />
            <span>{nova.address}</span>
          </p>
          <a
            href={nova.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-nv-brand inline-block pl-6 font-medium hover:underline"
          >
            Open in Maps
          </a>
        </div>
        <div className="text-sm">
          <p className="flex items-center gap-2 font-medium">
            <Clock className="text-nv-brand h-4 w-4" /> Opening hours
          </p>
          <ul className="text-nv-muted mt-2 space-y-1 pl-6">
            <li>Mon, Wed to Sun · 10:00 AM to 8:00 PM</li>
            <li>Tuesday · Closed</li>
          </ul>
        </div>
      </div>
      <div className="border-nv-line border-t">
        <div className="container-nv text-nv-muted flex flex-col gap-2 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {nova.name}. Sample business for a website concept.</p>
          <p>
            Website concept by{' '}
            <Link href="/" className="text-nv-ink font-medium hover:underline">
              KAPOSA FUTEXI
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

export function WhatsAppFab({ number }: { number: string }) {
  return (
    <a
      href={whatsappLink(number, 'Hi, I found Nova Studio (KAPOSA FUTEXI booking demo) and have a question.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      data-track="whatsapp_click"
      data-track-props='{"where":"demo_booking_fab"}'
      className="fixed right-4 bottom-4 z-40 inline-flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}

type BtnProps = {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
} & Record<`data-${string}`, string>

export function NovaButton({
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
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background-color,transform] active:scale-[0.98]',
        variant === 'primary'
          ? 'bg-nv-brand hover:bg-nv-brand-ink text-white'
          : 'border-nv-line-strong text-nv-ink hover:bg-nv-surface border',
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
