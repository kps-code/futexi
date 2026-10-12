import type { Metadata } from 'next'
import { BookOpen, GraduationCap, MapPin, Trophy } from 'lucide-react'
import { DemoButton, DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { EnquiryForm } from '@/components/demos-shared/enquiry-form'
import { RatingPill, ServicesGrid, Testimonials, Tile } from '@/components/demos-shared/sections'
import { Reveal } from '@/components/reveal'
import { vidya } from '@/content/demo-businesses'
import {
  studentClasses,
  tuitionBatches,
  tuitionFaculty,
  tuitionGallery,
  tuitionResults,
  tuitionTestimonials,
} from '@/content/demo-tuition'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: `${vidya.name} · ${vidya.tagline}`,
  description: `${vidya.blurb} Education website concept by KAPOSA FUTEXI.`,
}

/** Tuition Centre Website demo (Post 4): Vidya Academy home. */
export default async function VidyaHomePage() {
  const settings = await getSiteSettings()
  return (
    <DemoShell business={vidya} whatsappNumber={settings.whatsappNumber} ctaHref="#enquire">
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_85%_0%,var(--dm-brand-soft)_0%,transparent_60%)]"
        />
        <div className="container-dm grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <RatingPill business={vidya} />
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Small batches. <span className="text-dm-brand">Big results.</span>
            </h1>
            <p className="text-dm-muted mt-5 max-w-xl text-base text-pretty sm:text-lg">{vidya.blurb}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <DemoButton
                href="#enquire"
                size="lg"
                data-track="cta_click"
                data-track-props='{"cta":"demo_hero","demo":"tuition"}'
              >
                <GraduationCap className="h-4 w-4" /> Enquire about admission
              </DemoButton>
              <DemoButton href="#services" variant="secondary" size="lg">
                See courses and fees
              </DemoButton>
            </div>
            <ul className="text-dm-muted mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <li className="flex items-center gap-2">
                <BookOpen className="text-dm-brand h-4 w-4" /> CBSE, State board, NEET, JEE
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="text-dm-brand h-4 w-4" /> {vidya.area}
              </li>
            </ul>
          </div>
          <Reveal className="grid grid-cols-2 gap-3">
            {tuitionResults.stats.map((s) => (
              <div key={s.label} className="dm-card p-5">
                <p className="text-dm-brand font-display text-3xl font-bold">{s.value}</p>
                <p className="text-dm-muted mt-1 text-xs">{s.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <ServicesGrid
        business={vidya}
        eyebrow="Courses"
        title="Courses and fees"
        sub="Fees are per month and include study material and weekly tests."
        cols={3}
        itemCta={{ label: 'Enquire', href: '#enquire' }}
        priceSuffix="/month"
      />

      <section id="batches" className="scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm">
          <SectionTitle
            eyebrow="Batches"
            title="This term's timetable"
            sub="Fifteen students per batch. Seats update as admissions close."
          />
          <Reveal className="border-dm-line mt-10 overflow-x-auto rounded-2xl border">
            <table className="w-full min-w-[40rem] text-sm">
              <thead className="bg-dm-surface-2 text-dm-muted text-left text-xs tracking-wide uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Days</th>
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3 font-semibold">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-dm-line bg-dm-surface divide-y">
                {tuitionBatches.map((b) => (
                  <tr key={b.course}>
                    <td className="px-4 py-3 font-medium">{b.course}</td>
                    <td className="text-dm-muted px-4 py-3">{b.days}</td>
                    <td className="text-dm-muted px-4 py-3">{b.time}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          b.seats.startsWith('Waitlist')
                            ? 'bg-dm-surface-2 text-dm-muted rounded-full px-2 py-0.5 text-xs'
                            : 'bg-dm-brand-soft text-dm-brand-ink rounded-full px-2 py-0.5 text-xs font-medium'
                        }
                      >
                        {b.seats}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      <section id="faculty" className="bg-dm-surface scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm">
          <SectionTitle eyebrow="Faculty" title="Teachers who stay for the doubt-clearing hour" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tuitionFaculty.map((f, i) => (
              <Reveal key={f.name} as="li" index={i} className="dm-card bg-dm-bg p-5">
                <span className="bg-dm-brand text-dm-on-brand inline-flex h-12 w-12 items-center justify-center rounded-full font-display font-bold">
                  {f.name
                    .split(' ')
                    .map((p) => p[0])
                    .join('')
                    .replace('.', '')
                    .slice(0, 2)}
                </span>
                <p className="mt-4 font-display font-semibold">{f.name}</p>
                <p className="text-dm-brand text-sm">
                  {f.subject} · {f.years} yrs
                </p>
                <p className="text-dm-muted mt-2 text-sm">{f.note}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="results" className="scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm">
          <SectionTitle eyebrow="Results" title="2026 toppers" />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {tuitionResults.toppers.map((t, i) => (
              <Reveal key={t.name} as="li" index={i} className="dm-card flex items-center gap-4 p-5">
                <span className="bg-dm-accent/15 text-dm-accent inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                  <Trophy className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-xl font-bold">{t.score}</p>
                  <p className="text-sm">
                    {t.name} <span className="text-dm-muted">· {t.exam}</span>
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Testimonials items={tuitionTestimonials} />

      <section className="py-16 sm:py-20">
        <div className="container-dm">
          <SectionTitle eyebrow="Gallery" title="Inside the centre" />
          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {tuitionGallery.map((g, i) => (
              <Reveal key={g.label} as="li" index={i}>
                <Tile tile={g.tile} label={g.label} className="aspect-square" />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="enquire" className="bg-dm-surface scroll-mt-20 py-16 sm:py-20">
        <div className="container-dm grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <SectionTitle
            eyebrow="Admissions"
            title="Ask about a seat"
            sub="Tell us the class and course. We call back the same day with batch options and a free demo class."
          />
          <EnquiryForm
            business={vidya}
            interestLabel="Course"
            interests={vidya.services.map((s) => s.name)}
            extraField={{ label: 'Student is in', name: 'studentClass', options: studentClasses }}
            detailsLabel="Anything else"
            detailsPlaceholder="Preferred timing, board, current marks, questions."
            submitLabel="Request a callback"
            successTitle="Thanks, we will call you back."
            successLine="Same day, between 10 AM and 7 PM."
          />
        </div>
      </section>
    </DemoShell>
  )
}
