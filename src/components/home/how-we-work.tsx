import { Reveal } from '@/components/reveal'
import { howWeWork } from '@/content/home'
import { cn } from '@/lib/utils'
import { Icon } from './icons'
import { cardClasses, Section, SectionHeading } from './section'

export function HowWeWork() {
  return (
    <Section id="process" tone="surface" className="cv-auto">
      <SectionHeading eyebrow="How we work" title={howWeWork.heading} />
      <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[1.55rem] hidden h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent lg:block"
        />
        {howWeWork.steps.map((s, i) => (
          <Reveal key={s.n} as="li" index={i} className={cn(cardClasses, 'overflow-hidden bg-background')}>
            {/* Watermark step number; the small label below stays for reading order. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-3 right-2 font-display text-7xl font-extrabold tracking-tighter text-foreground/[0.05] transition-colors duration-300 group-hover:text-accent/15"
            >
              {s.n}
            </span>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-gradient text-white shadow-[0_10px_24px_-10px_rgba(139,92,246,0.7)]">
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <span className="font-display text-sm font-semibold text-muted">{s.n}</span>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
            <p className="mt-1.5 text-sm text-muted">{s.line}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
