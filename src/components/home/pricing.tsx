import { MessageCircle } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'
import { pricing } from '@/content/home'
import type { PricingContent } from '@/server/site-data'
import { Section, SectionHeading } from './section'
import { Tilt } from './tilt'

/**
 * How quotes work plus the typical setups, without amounts. Texts come from
 * Content > Home Page > Pricing; the starting price text from Site Settings.
 */
export function Pricing({
  content,
  startingPriceText,
  whatsappHref,
}: {
  content: PricingContent
  startingPriceText: string
  whatsappHref: string
}) {
  const [before, after] = content.line.split('{price}')
  return (
    <Section id="pricing" tone="surface">
      <SectionHeading
        align="left"
        eyebrow={pricing.eyebrow}
        title={content.heading}
        sub={
          <>
            {before}
            <strong className="font-semibold text-foreground">{startingPriceText}</strong>
            {after}
          </>
        }
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-[1.15fr_1fr_1fr_1fr]">
        <Reveal className="h-full">
          <Tilt className="h-full bg-surface-strong p-7">
            <span className="mb-4 inline-flex w-fit rounded-full border border-border bg-background/70 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-muted uppercase">
              {content.note.tag}
            </span>
            <h3 className="font-display text-xl font-semibold">{content.note.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{content.note.body}</p>
          </Tilt>
        </Reveal>
        {content.setups.map((s, i) => (
          <Reveal key={s.title} index={i + 1} className="h-full">
            <Tilt className="h-full p-7">
              <span className="mb-4 inline-flex w-fit rounded-full border border-border bg-background px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-muted uppercase">
                {s.tag}
              </span>
              <h3 className="font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-[11px] font-medium tracking-[0.12em] text-muted uppercase">
                Best for: {s.bestFor}
              </p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {s.items.map((item) => (
                  <li key={item} className="sr-check flex items-center gap-2.5">
                    {item}
                  </li>
                ))}
              </ul>
            </Tilt>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink
          href={whatsappHref}
          size="lg"
          className="bg-[#25d366] text-[#06281a] shadow-none hover:brightness-105"
          data-track="whatsapp_click"
          data-track-props='{"where":"pricing"}'
        >
          <MessageCircle className="h-4 w-4" />
          {content.whatsappLabel}
        </ButtonLink>
        <ButtonLink
          href={pricing.secondary.href}
          variant="secondary"
          size="lg"
          data-track="cta_click"
          data-track-props='{"cta":"pricing"}'
        >
          {content.secondaryLabel}
        </ButtonLink>
      </Reveal>
    </Section>
  )
}
