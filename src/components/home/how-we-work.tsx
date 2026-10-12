import { Reveal } from '@/components/reveal'
import { howWeWork } from '@/content/home'
import { Icon } from './icons'
import { Section, SectionHeading } from './section'

export function HowWeWork() {
  return (
    <Section id="process" tone="surface" className="cv-auto">
      <SectionHeading eyebrow="How we work" title={howWeWork.heading} />
      <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[1.55rem] hidden h-px bg-gradient-to-r from-transparent via-border-strong to-transparent lg:block"
        />
        {howWeWork.steps.map((s, i) => (
          <Reveal
            key={s.n}
            as="li"
            index={i}
            className="relative rounded-2xl border border-border bg-background p-6"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-gradient text-white">
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
