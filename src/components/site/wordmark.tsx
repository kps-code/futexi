import Link from 'next/link'
import { brand } from '@/content/site'
import { logoBox, type BrandLogo } from '@/lib/branding'
import { cn } from '@/lib/utils'

export type WordmarkProps = {
  className?: string
  withSubline?: boolean
  /** Uploaded logo from Site Settings > Branding; the text wordmark renders when absent. */
  logo?: BrandLogo | null
  /** Variant for the dark theme; the main logo is used when absent. */
  logoDark?: BrandLogo | null
}

const LOGO_HEIGHT = 40

function LogoImage({ logo, className }: { logo: BrandLogo; className?: string }) {
  const box = logoBox(logo, LOGO_HEIGHT)
  return (
    // Plain <img>: logos are tiny SVG or PNG files, the optimisation pipeline adds nothing.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo.url}
      alt={logo.alt}
      height={box.height}
      width={box.width}
      decoding="async"
      className={cn('h-9 w-auto sm:h-10', className)}
    />
  )
}

export function Wordmark({ className, withSubline = true, logo, logoDark }: WordmarkProps) {
  if (logo) {
    return (
      <Link href="/" aria-label={`${brand.name} home`} className={cn('inline-flex items-center', className)}>
        <LogoImage logo={logo} className={logoDark ? 'dark:hidden' : undefined} />
        {logoDark && <LogoImage logo={logoDark} className="hidden dark:block" />}
      </Link>
    )
  }
  return (
    <Link href="/" className={cn('group inline-flex flex-col leading-none', className)}>
      <span className="font-display text-[1.05rem] font-bold tracking-[0.18em] text-foreground sm:text-lg">
        KAPOSA <span className="text-muted">FUTEXI</span>
      </span>
      {withSubline && (
        <span className="mt-1 text-[0.62rem] font-medium tracking-[0.22em] text-muted uppercase">
          {brand.shortLine}
        </span>
      )}
    </Link>
  )
}
