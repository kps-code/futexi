'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'
import { cn } from '@/lib/utils'

const noopSubscribe = () => () => {}

/** True after hydration, false during SSR. Avoids a theme mismatch flash without an effect. */
function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
}

export function ThemeToggle({
  className,
  initialDark = false,
}: {
  className?: string
  initialDark?: boolean
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()

  // Before hydration, assume the site's default theme so the icon does not flip on load.
  const isDark = mounted ? resolvedTheme === 'dark' : initialDark
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      data-track="theme_toggle"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:border-border-strong hover:bg-surface-strong',
        className,
      )}
    >
      <Sun className={cn('absolute h-4 w-4 transition-transform', isDark ? 'scale-100' : 'scale-0')} />
      <Moon className={cn('absolute h-4 w-4 transition-transform', isDark ? 'scale-0' : 'scale-100')} />
    </button>
  )
}
