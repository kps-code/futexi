import type { Metadata } from 'next'
import { DemoButton, DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { Photo } from '@/components/demos-shared/photo'
import { CtaBand } from '@/components/demos-shared/sections'
import { Reveal } from '@/components/reveal'
import { pulse } from '@/content/demo-businesses'
import { pulseClasses, pulsePhotos, pulseSchedule } from '@/content/demo-pulse'
import { getSiteSettings } from '@/server/site-data'
import { Timetable } from './timetable'

export const metadata: Metadata = {
  title: `Class schedule · ${pulse.name}`,
  description: `The weekly class timetable at ${pulse.name}, Velachery: HIIT, strength, yoga, Zumba, spin and boxing. AI-powered website concept by KAPOSA FUTEXI.`,
}

/** AI demo: the weekly timetable, filterable by class. */
export default async function PulseSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ class?: string }>
}) {
  const { class: initial } = await searchParams
  const settings = await getSiteSettings()
  return (
    <DemoShell business={pulse} whatsappNumber={settings.whatsappNumber} ctaHref={`${pulse.path}#assistant`}>
      <section className="relative overflow-hidden">
        <div className="dm-parallax absolute inset-0 -z-10">
          <Photo
            photo={pulsePhotos.floorDark}
            priority
            zoom={false}
            sizes="100vw"
            className="dm-grit absolute inset-0 h-full w-full rounded-none"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,16,32,0.7),rgba(11,16,32,0.96))]"
          />
        </div>
        <div className="container-dm pt-16 pb-12 sm:pt-20">
          <p className="dm-label text-dm-brand">Schedule</p>
          <h1 className="mt-4 font-display text-7xl sm:text-8xl lg:text-9xl">
            96 classes. <em>One week.</em>
          </h1>
          <p className="text-dm-muted mt-5 max-w-xl text-lg">
            Filter by class, pick a slot, ask the assistant to hold it. Spots update live.
          </p>
        </div>
      </section>

      <section className="container-dm py-12 sm:py-16">
        <Timetable schedule={pulseSchedule} initial={initial} />
      </section>

      <section className="bg-dm-surface dm-diagonal py-20 sm:py-24">
        <div className="container-dm">
          <SectionTitle eyebrow="The classes" title="Pick your poison" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pulseClasses.map((c, i) => (
              <Reveal key={c.key} as="li" index={i}>
                <article data-tilt="5" className="dm-card dm-lift flex h-full flex-col overflow-hidden">
                  <Photo
                    photo={c.photo}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="dm-grit aspect-[16/10] rounded-none"
                  />
                  <div className="p-5">
                    <p className="font-display text-4xl">{c.name}</p>
                    <p className="text-dm-muted mt-1 text-sm">{c.line}</p>
                    <p className="text-dm-brand mt-3 text-xs font-bold uppercase">
                      {c.minutes} min · {c.level}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
          <div className="mt-10">
            <DemoButton href={`${pulse.path}#assistant`} size="lg" data-magnetic data-cursor="Ask">
              Book a free trial class
            </DemoButton>
          </div>
        </div>
      </section>

      <CtaBand
        business={pulse}
        title="First class free."
        line="Tell the assistant which one. It holds the spot and sends directions."
        href={`${pulse.path}#assistant`}
        label="Ask the assistant"
      />
    </DemoShell>
  )
}
