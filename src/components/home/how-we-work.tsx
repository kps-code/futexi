import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'
import type { HowWeWorkContent, TechnologyContent } from '@/server/site-data'
import { Icon } from './icons'
import { cardClasses, Section, SectionHeading } from './section'

/** Six steps from idea to launch, and the stack we build with (both from Content > Home Page). */
export function HowWeWork({
  content,
  technology,
}: {
  content: HowWeWorkContent
  technology?: TechnologyContent
}) {
  if (content.steps.length === 0) return null
  return (
    <Section id="process" tone="surface">
      <SectionHeading
        align="left"
        eyebrow="How it works"
        title={content.heading}
        sub="You talk directly to the people building your project. No account managers, no surprises."
      />
      <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[1.55rem] hidden h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent lg:block"
        />
        {content.steps.map((s, i) => {
          const n = String(i + 1).padStart(2, '0')
          return (
            <Reveal
              key={`${s.title}-${i}`}
              as="li"
              index={i}
              className={cn(cardClasses, 'overflow-hidden bg-background')}
            >
              {/* Watermark step number; the small label below stays for reading order. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-3 right-2 font-display text-7xl font-extrabold tracking-tighter text-foreground/[0.05] transition-colors duration-300 group-hover:text-foreground/10"
              >
                {n}
              </span>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-foreground text-background">
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <span className="font-display text-sm font-semibold text-muted">{n}</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{s.line}</p>
            </Reveal>
          )
        })}
      </ol>
      {technology && technology.items.length > 0 && (
        <Reveal className="mt-12 flex flex-col gap-4 border-t border-border pt-8 lg:flex-row lg:items-center lg:gap-8">
          <p className="max-w-xs text-sm text-muted">{technology.line}</p>
          <ul className="flex flex-wrap gap-2">
            {technology.items.map((t) => (
              <li
                key={t}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/80"
              >
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </Section>
  )
}
