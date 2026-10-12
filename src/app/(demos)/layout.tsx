import type { Metadata, Viewport } from 'next'
import { Inter, Sora } from 'next/font/google'
import type { ReactNode } from 'react'
import { RevealObserver } from '@/components/reveal-observer'
import { Tracker } from '@/components/tracking/tracker'
import { clientEnv } from '@/server/env'
import './demo.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['500', '600', '700'],
})

/**
 * Root layout for the live demo mini-sites. Separate from the main site so
 * each demo can look like a real client website. Demos are concept projects,
 * so search engines are asked not to index them.
 */
export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
  robots: { index: false, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#fbfaf7',
  width: 'device-width',
  initialScale: 1,
}

export default function DemosLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="flex min-h-dvh flex-col">
        {children}
        <RevealObserver />
        <Tracker />
      </body>
    </html>
  )
}
