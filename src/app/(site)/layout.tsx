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
import { getSiteSettings } from '@/server/site-data'
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

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${brand.name} · ${brand.positioning}`,
    template: `%s · ${brand.name}`,
  },
  description: brand.tagline,
  openGraph: {
    siteName: brand.name,
    type: 'website',
    locale: 'en_IN',
  },
  robots: { index: true, follow: true },
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
  const settings = await getSiteSettings()

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sora.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer
            contact={{
              phone: settings.phone,
              whatsappNumber: settings.whatsappNumber,
              email: settings.email,
              linkedin: settings.linkedin,
              instagram: settings.instagram,
              github: settings.github,
            }}
          />
          <RevealObserver />
          <Tracker />
        </ThemeProvider>
        <JsonLd settings={settings} siteUrl={clientEnv.NEXT_PUBLIC_SITE_URL} />
      </body>
    </html>
  )
}
