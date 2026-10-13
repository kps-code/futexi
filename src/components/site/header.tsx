'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { nav, primaryCta } from '@/content/site'
import { cn } from '@/lib/utils'
import { ButtonLink } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import { Wordmark } from './wordmark'

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))
  const closeMenu = () => setOpen(false)

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-[background-color,border-color,backdrop-filter] duration-300',
          scrolled || open
            ? 'border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="container-site flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
          <Wordmark />

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-surface text-foreground'
                    : 'text-muted hover:bg-surface/60 hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <ButtonLink
              href={primaryCta.href}
              size="sm"
              className="hidden sm:inline-flex"
              data-track="cta_click"
              data-track-props='{"cta":"header"}'
            >
              {primaryCta.label}
            </ButtonLink>
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
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
        <nav aria-label="Mobile" className="container-site flex flex-col gap-1 py-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'rounded-xl px-4 py-3 font-display text-2xl font-semibold transition-colors',
                isActive(item.href) ? 'text-foreground' : 'text-muted hover:text-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
          <ButtonLink
            href={primaryCta.href}
            size="lg"
            className="mt-6"
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
