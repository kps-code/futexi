'use client'

import { ArrowRight, ChevronDown, Menu, MessageCircle, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Icon } from '@/components/home/icons'
import type { IconName } from '@/content/icon-names'
import { nav, primaryCta, servicesMenu } from '@/content/site'
import type { BrandLogo } from '@/lib/branding'
import { cn } from '@/lib/utils'
import { ButtonLink } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import { Wordmark } from './wordmark'

export type HeaderService = { slug: string; title: string; outcome: string; icon: IconName }

export type HeaderProps = {
  logo?: BrandLogo | null
  logoDark?: BrandLogo | null
  /** Theme first-time visitors get; keeps the toggle icon right before hydration. */
  defaultDark?: boolean
  /** Visible services for the Services menu (Content > Services). */
  services?: HeaderService[]
  /** wa.me link with the admin's default message. */
  whatsappHref: string
}

export function Header({ logo, logoDark, defaultDark = false, services = [], whatsappHref }: HeaderProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  // Services accordion inside the mobile drawer; starts closed and resets with the drawer.
  const [subOpen, setSubOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // A tap-opened services menu closes on Escape or a click anywhere outside it.
  useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element | null)?.closest('.sr-dd')) setMenu(false)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [menu])

  const isActive = (href: string) => {
    if (href.includes('#')) return false
    return href === '/' ? pathname === '/' : pathname.startsWith(href)
  }
  const closeMenu = () => {
    setOpen(false)
    setSubOpen(false)
  }
  const linkClass = (active: boolean) =>
    cn(
      'inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors',
      active ? 'bg-surface text-foreground' : 'text-muted hover:bg-surface/60 hover:text-foreground',
    )

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-[background-color,border-color,backdrop-filter] duration-300',
          scrolled || open || menu
            ? 'border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="container-site flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
          <Wordmark logo={logo} logoDark={logoDark} />

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) =>
              'menu' in item && services.length > 0 ? (
                <div key={item.href} className={cn('sr-dd relative', menu && 'is-open')}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    aria-haspopup="true"
                    aria-expanded={menu}
                    className={linkClass(isActive(item.href))}
                    onClick={(e) => {
                      // Touch screens have no hover: the first tap opens the menu.
                      if (window.matchMedia('(hover: none)').matches && !menu) {
                        e.preventDefault()
                        setMenu(true)
                      }
                    }}
                  >
                    {item.label}
                    <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', menu && 'rotate-180')} />
                  </Link>
                  <div className="sr-menu" role="group" aria-label="Services">
                    <ul className="grid gap-1 sm:grid-cols-2">
                      {services.map((s) => (
                        <li key={s.slug}>
                          <Link
                            href={`/services#${s.slug}`}
                            className="sr-menu-item"
                            onClick={() => setMenu(false)}
                          >
                            <span className="sr-ico h-10 w-10 rounded-xl">
                              <Icon name={s.icon} className="h-5 w-5" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[15px] font-medium">{s.title}</span>
                              <span className="mt-0.5 block text-[13px] leading-snug text-muted">
                                {s.outcome}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={servicesMenu.all.href}
                      className="mt-2 flex items-center justify-between gap-4 border-t border-border px-4 py-3 text-sm text-muted hover:text-foreground"
                      onClick={() => setMenu(false)}
                    >
                      <span>
                        {servicesMenu.all.lead}{' '}
                        <strong className="font-medium text-foreground">{servicesMenu.all.label}</strong>
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={linkClass(isActive(item.href))}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle initialDark={defaultDark} />
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-9 items-center gap-2 rounded-full bg-[#25d366] px-4 text-sm font-semibold text-[#06281a] transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-105 sm:inline-flex"
              data-track="whatsapp_click"
              data-track-props='{"where":"header"}'
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp us
            </a>
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => (open ? closeMenu() : setOpen(true))}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Rendered outside the header: its backdrop blur would otherwise trap this
          fixed panel inside the 64px bar (filters create a containing block). */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-border bg-background sm:top-[4.5rem] lg:hidden"
      >
        <nav aria-label="Mobile" className="container-site flex flex-col gap-0.5 py-4">
          {nav.map((item) => {
            const hasMenu = 'menu' in item && services.length > 0
            return (
              <div key={item.href}>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cn(
                      'block flex-1 rounded-xl px-4 py-2.5 font-display text-lg font-semibold transition-colors',
                      isActive(item.href) ? 'text-foreground' : 'text-muted hover:text-foreground',
                    )}
                  >
                    {item.label}
                  </Link>
                  {hasMenu && (
                    <button
                      type="button"
                      aria-label={subOpen ? 'Hide services' : 'Show services'}
                      aria-expanded={subOpen}
                      aria-controls="mobile-services"
                      onClick={() => setSubOpen((v) => !v)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-foreground"
                    >
                      <ChevronDown className={cn('h-4 w-4 transition-transform', subOpen && 'rotate-180')} />
                    </button>
                  )}
                </div>
                {hasMenu && (
                  <ul
                    id="mobile-services"
                    hidden={!subOpen}
                    className="mb-2 ml-4 grid gap-0.5 border-l border-border pl-4"
                  >
                    {services.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/services#${s.slug}`}
                          onClick={closeMenu}
                          className="block px-2 py-1.5 text-[15px] text-muted hover:text-foreground"
                        >
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
          <Link
            href="/about"
            onClick={closeMenu}
            className="block rounded-xl px-4 py-2.5 font-display text-lg font-semibold text-muted transition-colors hover:text-foreground"
          >
            About
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25d366] px-8 text-base font-semibold text-[#06281a]"
            data-track="whatsapp_click"
            data-track-props='{"where":"mobile_menu"}'
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp us
          </a>
          <ButtonLink
            href={primaryCta.href}
            variant="secondary"
            size="lg"
            className="mt-2"
            onClick={closeMenu}
            data-track="cta_click"
            data-track-props='{"cta":"mobile_menu"}'
          >
            {primaryCta.label}
          </ButtonLink>
        </nav>
      </div>
    </>
  )
}
