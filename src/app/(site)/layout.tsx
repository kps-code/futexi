import type { Metadata, Viewport } from 'next'
import { Inter, Sora } from 'next/font/google'
import type { ReactNode } from 'react'
import { RevealObserver } from '@/components/reveal-observer'
import { Footer } from '@/components/site/footer'
import { Header } from '@/components/site/header'
import { JsonLd } from '@/components/site/json-ld'
import { ThemeProvider } from '@/components/site/theme-provider'
import { Tracker } from '@/components/tracking/tracker'
import { brand } from '@/content/site'
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sora.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider defaultTheme={settings.defaultTheme}>
          <Header
            logo={settings.logo}
            logoDark={settings.logoDark}
            defaultDark={settings.defaultTheme === 'dark'}
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
          <Tracker />
        </ThemeProvider>
        <JsonLd settings={settings} siteUrl={clientEnv.NEXT_PUBLIC_SITE_URL} />
      </body>
    </html>
  )
}
