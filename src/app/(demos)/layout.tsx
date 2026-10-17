import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { DemoMotion } from '@/components/demos-shared/motion'
import { Tracker } from '@/components/tracking/tracker'
import { clientEnv } from '@/server/env'
import './demo.css'

/**
 * Root layout for the live demo mini-sites. Separate from the main site so
 * each demo can look like a real client website. Demos are concept projects,
 * so search engines are asked not to index them.
 */
export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
  robots: { index: false, follow: true },
  icons: { icon: [{ url: '/icon.svg', type: 'image/svg+xml' }] },
}

export const viewport: Viewport = {
  themeColor: '#fbfaf7',
  width: 'device-width',
  initialScale: 1,
}

export default function DemosLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col">
        {children}
        <DemoMotion />
        <Tracker />
      </body>
    </html>
  )
}
