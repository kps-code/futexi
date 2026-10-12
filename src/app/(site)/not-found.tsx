import { ButtonLink } from '@/components/ui/button'

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[60dvh] flex-col items-center justify-center py-20 text-center">
      <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-muted uppercase">404</p>
      <h1 className="font-display text-3xl font-bold sm:text-5xl">This page doesn&apos;t exist.</h1>
      <p className="mt-4 max-w-md text-muted">The link may be old, or the page has moved.</p>
      <ButtonLink href="/" className="mt-8">
        Back to home
      </ButtonLink>
    </section>
  )
}
