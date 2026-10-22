import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import type { FaqItem } from '@/server/site-data'
import { Section, SectionHeading } from './section'

/** The FAQ entries ticked "Show on home page" (Content > FAQ). */
export function HomeFaq({ faqs, startingPriceText }: { faqs: FaqItem[]; startingPriceText: string }) {
  const items = faqs.filter((f) => f.showOnHome)
  if (items.length === 0) return null
  return (
    <Section id="faq">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <SectionHeading align="left" eyebrow="FAQ" title="Questions Businesses Ask Us" className="mb-0" />
        <Reveal>
          <div className="divide-y divide-border rounded-2xl border border-border bg-surface px-6">
            {items.map((item) => (
              <details key={item.id} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium transition-colors group-open:text-accent hover:text-accent">
                  {item.question}
                  <span
                    aria-hidden
                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-[transform,border-color,color] duration-300 group-open:rotate-45 group-open:border-accent group-open:text-accent"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted">{item.answer.replace('{price}', startingPriceText)}</p>
              </details>
            ))}
          </div>
          <Link
            href="/contact#faq"
            className="mt-4 inline-block text-sm font-medium text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-current"
          >
            See all questions
          </Link>
        </Reveal>
      </div>
    </Section>
  )
}
