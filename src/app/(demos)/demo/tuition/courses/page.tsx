import type { Metadata } from 'next'
import { Check, Clock, Users } from 'lucide-react'
import { DemoButton, DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { Photo } from '@/components/demos-shared/photo'
import { CtaBand } from '@/components/demos-shared/sections'
import { Reveal } from '@/components/reveal'
import { vidya } from '@/content/demo-businesses'
import { vidyaCourses, vidyaFaq, vidyaPhotos } from '@/content/demo-vidya'
import { formatInr } from '@/lib/booking'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: `Courses and fees · ${vidya.name}`,
  description: `Class 10, PCM, PCB, NEET, JEE and Spoken English at ${vidya.name}, Chromepet: what each course covers, batch size, timing and monthly fee. Education website concept by KAPOSA FUTEXI.`,
}

const tint = {
  mint: 'bg-[var(--dm-tint-mint)]',
  peach: 'bg-[var(--dm-tint-peach)]',
  sky: 'bg-[var(--dm-tint-sky)]',
} as const

/** Tuition demo: every course in full, the page parents compare before calling. */
export default async function VidyaCoursesPage() {
  const settings = await getSiteSettings()
  return (
    <DemoShell business={vidya} whatsappNumber={settings.whatsappNumber} ctaHref={`${vidya.path}#enquire`}>
      <section className="container-dm grid items-center gap-10 pt-16 sm:pt-20 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-dm-brand text-sm font-bold tracking-wide uppercase">Courses</p>
          <h1 className="mt-4 font-display text-5xl text-balance sm:text-6xl">
            Six courses. <em>One fee, no extras.</em>
          </h1>
          <p className="text-dm-muted mt-6 max-w-xl text-lg">
            Every fee is per month and includes study material, weekly tests and the Saturday doubt hour.
            Nothing is charged separately.
          </p>
        </div>
        <Reveal>
          <Photo
            photo={vidyaPhotos.classroom}
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="aspect-[4/3] rounded-[2rem]"
          />
        </Reveal>
      </section>

      <section className="container-dm space-y-8 py-20 sm:py-24" data-testid="courses">
        {vidya.services.map((s, i) => {
          const c = vidyaCourses.find((x) => x.slug === s.slug)!
          return (
            <Reveal
              key={s.slug}
              as="article"
              id={s.slug}
              className={`grid scroll-mt-24 gap-8 overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:grid-cols-12 lg:items-center ${tint[c.tint]}`}
            >
              <div className={i % 2 === 1 ? 'lg:order-2 lg:col-span-5' : 'lg:col-span-5'}>
                <Photo photo={c.photo} sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/3]" />
              </div>
              <div className={i % 2 === 1 ? 'lg:order-1 lg:col-span-7' : 'lg:col-span-7'}>
                <p className="text-dm-muted text-xs font-bold tracking-wide uppercase">{s.category}</p>
                <h2 className="mt-1 font-display text-3xl sm:text-4xl">{s.name}</h2>
                <p className="text-dm-muted mt-3 text-lg">{s.line}</p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {c.covers.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="text-dm-brand mt-1 h-4 w-4 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="text-dm-brand h-4 w-4" />
                    <dt className="sr-only">Batch size</dt>
                    <dd>{c.batchSize} per batch</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-dm-brand h-4 w-4" />
                    <dt className="sr-only">Timing</dt>
                    <dd>{c.timing}</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Tests</dt>
                    <dd>
                      <b>Tests:</b> {c.tests}
                    </dd>
                  </div>
                </dl>
                <p className="text-dm-muted mt-3 text-sm">
                  <b className="text-dm-ink">Good for:</b> {c.goodFor}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <span className="font-display text-3xl">
                    {formatInr(s.price)}{' '}
                    <span className="text-dm-muted font-sans text-base font-normal">/month</span>
                  </span>
                  <DemoButton
                    href={`${vidya.path}#enquire`}
                    data-cursor="Ask"
                    data-track="cta_click"
                    data-track-props={`{"cta":"demo_course","demo":"tuition","course":"${s.slug}"}`}
                  >
                    Book a free demo class
                  </DemoButton>
                </div>
              </div>
            </Reveal>
          )
        })}
      </section>

      <section className="bg-dm-surface py-20 sm:py-24">
        <div className="container-dm grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionTitle eyebrow="For parents" title="Common questions" />
          <div className="divide-dm-line divide-y" data-testid="faq">
            {vidyaFaq.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    className="bg-dm-brand-soft text-dm-brand inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xl leading-none transition-transform group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <p className="text-dm-muted mt-3 max-w-2xl">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        business={vidya}
        title="Not sure which batch?"
        line="Tell us the class and marks. We suggest one and book a free demo class."
        href={`${vidya.path}#enquire`}
        label="Ask about a seat"
      />
    </DemoShell>
  )
}
