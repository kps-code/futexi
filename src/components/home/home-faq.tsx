import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { faq, homeFaqCount } from '@/content/faq'
import { Section, SectionHeading } from './section'

export function HomeFaq({ startingPriceText }: { startingPriceText: string }) {
  return (
    <Section id="faq" className="cv-auto">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <SectionHeading align="left" eyebrow="FAQ" title="Questions Businesses Ask Us" className="mb-0" />
        <Reveal>
          <div className="divide-y divide-border rounded-2xl border border-border bg-surface px-6">
            {faq.slice(0, homeFaqCount).map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {item.q}
                  <span aria-hidden className="text-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted">{item.a.replace('{price}', startingPriceText)}</p>
              </details>
            ))}
          </div>
          <Link
            href="/contact#faq"
            className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
          >
            See all questions
          </Link>
        </Reveal>
      </div>
    </Section>
  )
}
