import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[transform,background-color,border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]'

const variants: Record<Variant, string> = {
  primary:
    'btn-shine bg-foreground text-background shadow-lg shadow-foreground/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-foreground/25',
  secondary:
    'border border-border-strong bg-transparent text-foreground hover:border-foreground/50 hover:bg-surface',
  ghost: 'text-foreground hover:bg-surface',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-13 px-8 text-base',
}

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}

type CommonProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </button>
  )
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  href,
  prefetch,
  ...props
}: CommonProps & { href: string; prefetch?: boolean } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'href'
  >) {
  const external = /^https?:\/\//.test(href)
  if (external) {
    return (
      <a
        href={href}
        className={buttonClasses(variant, size, className)}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    )
  }
  return (
    <Link href={href} prefetch={prefetch} className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </Link>
  )
}
