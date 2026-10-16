'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ReactNode } from 'react'
import type { ThemeName } from '@/lib/branding'

/** `defaultTheme` comes from Site Settings > Branding; a visitor's own toggle choice wins. */
export function ThemeProvider({
  children,
  defaultTheme = 'light',
}: {
  children: ReactNode
  defaultTheme?: ThemeName
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem
      disableTransitionOnChange
      storageKey="kf-theme"
    >
      {children}
    </NextThemesProvider>
  )
}
