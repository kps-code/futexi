'use client'

import { useEffect } from 'react'
import { Button, ButtonLink } from '@/components/ui/button'

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Reported to Sentry by instrumentation-client.ts when a DSN is configured.
    console.error(error)
  }, [error])

  return (
    <section className="container-site flex min-h-[60dvh] flex-col items-center justify-center py-20 text-center">
      <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-muted uppercase">
        Something went wrong
      </p>
      <h1 className="font-display text-3xl font-bold sm:text-5xl">We hit an unexpected error.</h1>
      {error.digest && (
        <p className="mt-4 text-sm text-muted">
          Reference: <code className="rounded bg-surface px-1.5 py-0.5">{error.digest}</code>
        </p>
      )}
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <ButtonLink href="/" variant="secondary">
          Back to home
        </ButtonLink>
      </div>
    </section>
  )
}
