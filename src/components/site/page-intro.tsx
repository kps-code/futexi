import type { ReactNode } from 'react'

/** Shared page heading block used by inner pages. */
export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string
  title: string
  children?: ReactNode
}) {
  return (
    <section className="container-site pt-16 pb-10 sm:pt-24 sm:pb-14">
      {eyebrow && (
        <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-muted uppercase">{eyebrow}</p>
      )}
      <h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
      {children && <div className="mt-5 max-w-2xl text-base text-muted sm:text-lg">{children}</div>}
    </section>
  )
}
