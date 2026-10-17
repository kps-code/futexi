import type { Metadata } from 'next'
import { Trophy } from 'lucide-react'
import { DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { Photo } from '@/components/demos-shared/photo'
import { CtaBand } from '@/components/demos-shared/sections'
import { Reveal } from '@/components/reveal'
import { vidya } from '@/content/demo-businesses'
import { vidyaParentVoices, vidyaPhotos, vidyaStats, vidyaToppers, vidyaYears } from '@/content/demo-vidya'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: `Results and toppers · ${vidya.name}`,
  description: `Board, NEET and JEE results at ${vidya.name}, Chromepet, year by year, with the toppers and what they are doing now. Education website concept by KAPOSA FUTEXI.`,
}

/** Tuition demo: results year by year, toppers, and parent voices. */
export default async function VidyaResultsPage() {
  const settings = await getSiteSettings()
  const max = Math.max(...vidyaYears.map((y) => y.neet))
  return (
    <DemoShell business={vidya} whatsappNumber={settings.whatsappNumber} ctaHref={`${vidya.path}#enquire`}>
      <section className="container-dm grid items-center gap-10 pt-16 sm:pt-20 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-dm-brand text-sm font-bold tracking-wide uppercase">Results</p>
          <h1 className="mt-4 font-display text-5xl text-balance sm:text-6xl">
            Three years, <em>one direction.</em>
          </h1>
          <p className="text-dm-muted mt-6 max-w-xl text-lg">
            We publish every year, including the years that were only okay. Parents deserve the whole picture.
          </p>
        </div>
        <Reveal>
          <Photo
            photo={vidyaPhotos.graduation}
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="aspect-[4/3] rounded-[2rem]"
          />
        </Reveal>
      </section>

      <section className="bg-[var(--dm-tint-sky)] py-14">
        <div className="container-dm grid grid-cols-2 gap-6 md:grid-cols-4">
          {vidyaStats.map((st, i) => (
            <Reveal key={st.label} index={i} className="dm-card p-5 text-center">
              <p className="text-dm-brand font-display text-5xl">
                <span data-count={st.value} data-count-suffix={st.suffix}>
                  {st.value}
                  {st.suffix}
                </span>
              </p>
              <p className="text-dm-muted mt-2 text-sm">{st.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-dm py-20 sm:py-24">
        <SectionTitle
          eyebrow="Year by year"
          title="The trend"
          sub="Share of Class 10 students scoring 90+, and entrance qualifiers."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3" data-testid="years">
          {vidyaYears.map((y, i) => (
            <Reveal key={y.year} index={i} className="dm-card dm-lift p-6">
              <p className="font-display text-4xl">{y.year}</p>
              <div className="mt-5 space-y-4">
                <Bar label="Scored 90+ in boards" value={y.boards90} max={100} suffix="%" />
                <Bar label="NEET qualifiers" value={y.neet} max={max} />
                <Bar label="JEE Main qualifiers" value={y.jee} max={max} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-[var(--dm-tint-peach)] py-20 sm:py-24">
        <div className="container-dm">
          <SectionTitle eyebrow="Toppers" title="Where they are now" />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-testid="toppers">
            {vidyaToppers.map((t, i) => (
              <Reveal key={t.name} as="li" index={i}>
                <article data-tilt="4" className="dm-card dm-lift h-full overflow-hidden">
                  <Photo
                    photo={t.photo}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="aspect-[4/3] rounded-none"
                  />
                  <div className="p-5">
                    <p className="text-dm-brand flex items-center gap-2 font-display text-3xl">
                      <Trophy className="h-5 w-5" /> {t.score}
                    </p>
                    <p className="mt-1 font-bold">{t.name}</p>
                    <p className="text-dm-muted text-sm">{t.exam}</p>
                    <p className="mt-3 rounded-full bg-[var(--dm-tint-mint)] px-3 py-1 text-sm font-bold text-emerald-800">
                      Now: {t.now}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-dm py-20 sm:py-24">
        <SectionTitle eyebrow="Parents" title="In their words" />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {vidyaParentVoices.map((v, i) => (
            <Reveal key={v.name} as="li" index={i} className="dm-card dm-lift p-6">
              <p className="text-lg">“{v.quote}”</p>
              <p className="text-dm-muted mt-4 text-sm font-bold">{v.name}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <CtaBand
        business={vidya}
        title="Admissions open for 2026-27."
        line="Fifteen seats per batch. A free demo class first, always."
        href={`${vidya.path}#enquire`}
        label="Ask about a seat"
      />
    </DemoShell>
  )
}

function Bar({
  label,
  value,
  max,
  suffix = '',
}: {
  label: string
  value: number
  max: number
  suffix?: string
}) {
  const pct = Math.round((value / max) * 100)
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-dm-muted">{label}</span>
        <span className="font-display text-lg">
          <span data-count={value} data-count-suffix={suffix}>
            {value}
            {suffix}
          </span>
        </span>
      </div>
      <div className="bg-dm-surface-2 mt-1.5 h-2.5 overflow-hidden rounded-full">
        <span
          className="dm-bar bg-dm-brand block h-full rounded-full"
          style={{ ['--dm-bar' as string]: `${pct}%` }}
        />
      </div>
    </div>
  )
}
