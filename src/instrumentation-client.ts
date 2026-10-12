/**
 * Browser error reporting. The Sentry SDK is loaded only when a DSN is
 * configured, so sites without Sentry ship none of its code.
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

type SentryModule = typeof import('@sentry/nextjs')

const sentry: Promise<SentryModule> | null = dsn
  ? import('@sentry/nextjs').then((Sentry) => {
      Sentry.init({
        dsn,
        environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
        tracesSampleRate: 0.1,
        replaysOnErrorSampleRate: 0,
        replaysSessionSampleRate: 0,
      })
      return Sentry
    })
  : null

export function onRouterTransitionStart(href: string, navigationType: string) {
  void sentry?.then((Sentry) => Sentry.captureRouterTransitionStart(href, navigationType))
}
