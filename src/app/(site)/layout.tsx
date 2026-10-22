import type { Metadata, Viewport } from 'next'
import { Inter, Sora } from 'next/font/google'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'
import { CardMotion } from '@/components/home/card-motion'
import { RevealObserver } from '@/components/reveal-observer'
import { Footer } from '@/components/site/footer'
import { Header } from '@/components/site/header'
import { JsonLd } from '@/components/site/json-ld'
import { ThemeProvider } from '@/components/site/theme-provider'
import { Tracker } from '@/components/tracking/tracker'
import { brand } from '@/content/site'
import { whatsappLink } from '@/lib/whatsapp'
import { clientEnv } from '@/server/env'
import { getServices, getSiteSettings } from '@/server/site-data'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

/**
 * Italic accent for the hero's second line, the final call to action and the showroom
 * taglines. Instrument Serif Italic (SIL OFL), subset to ASCII by scripts/subset-serif-font.mjs
 * so the home page stays inside the font budget. Fetched only on pages that use it.
 */
const serifAccent = localFont({
  src: './fonts/instrument-serif-italic.woff2',
  weight: '400',
  style: 'italic',
  variable: '--font-serif-accent',
  display: 'swap',
  preload: false,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})

/** Built-in share image, used until an image is uploaded in Site Settings > SEO. */
const DEFAULT_OG_IMAGE = '/og-default.png'
/** Built-in browser-tab icon, used until one is uploaded in Site Settings > Branding. */
const DEFAULT_ICON = { url: '/icon.svg', type: 'image/svg+xml' }

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const image = settings.ogImageUrl ?? DEFAULT_OG_IMAGE
  const icon = settings.siteIcon
    ? { url: settings.siteIcon.url, type: settings.siteIcon.mimeType }
    : DEFAULT_ICON
  return {
    icons: {
      icon: [icon],
      // Apple ignores SVG; only offer a raster upload as the home-screen icon.
      ...(settings.siteIcon && settings.siteIcon.mimeType !== 'image/svg+xml' ? { apple: [icon] } : {}),
    },
    metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
    title: {
      default: `${brand.name} · ${brand.positioning}`,
      template: `%s · ${brand.name}`,
    },
    description: settings.seoDescription,
    openGraph: {
      siteName: brand.name,
      type: 'website',
      locale: 'en_IN',
      description: settings.seoDescription,
      images: [{ url: image, width: 1200, height: 630, alt: `${brand.name} · ${brand.positioning}` }],
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0b0f1a' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [settings, services] = await Promise.all([getSiteSettings(), getServices()])

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${sora.variable} ${serifAccent.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider defaultTheme={settings.defaultTheme}>
          <Header
            logo={settings.logo}
            logoDark={settings.logoDark}
            defaultDark={settings.defaultTheme === 'dark'}
            services={services.map((s) => ({
              slug: s.slug,
              title: s.title,
              outcome: s.outcome,
              icon: s.icon,
            }))}
            whatsappHref={whatsappLink(settings.whatsappNumber, settings.whatsappMessage)}
          />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer
            contact={{
              phone: settings.phone,
              whatsappNumber: settings.whatsappNumber,
              whatsappMessage: settings.whatsappMessage,
              email: settings.email,
              city: settings.city,
              region: settings.region,
              serviceAreaText: settings.serviceAreaText,
              linkedin: settings.linkedin,
              instagram: settings.instagram,
              github: settings.github,
            }}
            solutions={services.map((s) => ({ label: s.title, href: `/services#${s.slug}` }))}
            logo={settings.logo}
            logoDark={settings.logoDark}
          />
          <RevealObserver />
          <CardMotion />
          <Tracker />
        </ThemeProvider>
        <JsonLd settings={settings} siteUrl={clientEnv.NEXT_PUBLIC_SITE_URL} />
      </body>
    </html>
  )
}
