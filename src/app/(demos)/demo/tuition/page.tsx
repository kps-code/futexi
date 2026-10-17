import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, CalendarCheck, MessageCircle, Users } from 'lucide-react'
import { DemoButton, DemoShell, SectionTitle } from '@/components/demos-shared/chrome'
import { EnquiryForm } from '@/components/demos-shared/enquiry-form'
import { Photo } from '@/components/demos-shared/photo'
import { Testimonials } from '@/components/demos-shared/sections'
import { FadeUp, Words } from '@/components/demos-shared/words'
import { Reveal } from '@/components/reveal'
import { vidya } from '@/content/demo-businesses'
import { studentClasses, tuitionBatches, tuitionFaculty, tuitionTestimonials } from '@/content/demo-tuition'
import { vidyaCourses, vidyaPhotos, vidyaStats, vidyaToppers } from '@/content/demo-vidya'
import { formatInr } from '@/lib/booking'
import { getSiteSettings } from '@/server/site-data'

export const metadata: Metadata = {
  title: `${vidya.name} · ${vidya.tagline}`,
  description: `${vidya.blurb} Education website concept by KAPOSA FUTEXI.`,
}

const tint = {
  mint: 'bg-[var(--dm-tint-mint)]',
  peach: 'bg-[var(--dm-tint-peach)]',
  sky: 'bg-[var(--dm-tint-sky)]',
} as const

/** Tuition Centre Website demo (Post 4): Vidya Academy home, warm and readable. */
export default async function VidyaHomePage() {
  const settings = await getSiteSettings()
  const facultyPhotos = [
    vidyaPhotos.teacherDesk,
    vidyaPhotos.board,
    vidyaPhotos.classroom,
    vidyaPhotos.groupStudy,
  ]
  return (
    <DemoShell business={vidya} whatsappNumber={settings.whatsappNumber} ctaHref="#enquire">
      {/* Hero: friendly photo, rounded everything, badges. */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="dm-blob -top-24 -right-24 h-[28rem] w-[28rem] bg-[#f59e0b]/20" />
        <div
          aria-hidden
          className="dm-blob top-40 -left-32 h-[24rem] w-[24rem] bg-[#3730a3]/12 [animation-delay:-6s]"
        />
        <div className="container-dm grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <FadeUp index={0} className="flex flex-wrap gap-2">
              <span className="bg-dm-brand-soft text-dm-brand-ink rounded-full px-3 py-1 text-sm font-bold">
                ★ {vidya.rating} · {vidya.reviews} parent reviews
              </span>
              <span className="text-dm-accent-ink rounded-full bg-[var(--dm-tint-peach)] px-3 py-1 text-sm font-bold">
                Admissions open · 2026-27
              </span>
            </FadeUp>
            <h1 className="mt-6 font-display text-5xl text-balance sm:text-6xl lg:text-7xl">
              <Words text="Small batches." />
              <br />
              <Words text="Big results." accent={['big', 'results.']} startIndex={2} />
            </h1>
            <FadeUp index={1} as="p" className="text-dm-muted mt-6 max-w-xl text-lg">
              {vidya.blurb}
            </FadeUp>
            <FadeUp index={2} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <DemoButton
                href="#enquire"
                size="lg"
                className="dm-shimmer"
                data-magnetic
                data-cursor="Ask"
                data-track="cta_click"
                data-track-props='{"cta":"demo_hero","demo":"tuition"}'
              >
                <CalendarCheck className="h-4 w-4" /> Book a free demo class
              </DemoButton>
              <DemoButton href={`${vidya.path}/courses`} variant="secondary" size="lg">
                Courses and fees
              </DemoButton>
            </FadeUp>
            <FadeUp index={3} as="ul" className="text-dm-muted mt-8 flex flex-wrap gap-x-6 gap-y-2 text-base">
              <li className="flex items-center gap-2">
                <BookOpen className="text-dm-brand h-5 w-5" /> CBSE, State board, NEET, JEE
              </li>
              <li className="flex items-center gap-2">
                <Users className="text-dm-brand h-5 w-5" /> 15 students per batch
              </li>
            </FadeUp>
          </div>
          <div className="relative">
            <Reveal className="dm-parallax relative aspect-[4/3] overflow-hidden rounded-[2rem]">
              <Photo
                photo={vidyaPhotos.hero}
                priority
                quality={60}
                zoom={false}
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="dm-settle absolute inset-0 h-full w-full rounded-none"
              />
            </Reveal>
            <Reveal
              index={2}
              className="dm-card absolute -bottom-6 left-4 flex items-center gap-3 p-4 shadow-xl sm:left-8"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--dm-tint-mint)] font-display text-xl text-emerald-700">
                96%
              </span>
              <span className="text-sm">
                <b className="block font-display">scored 90+</b>
                <span className="text-dm-muted">Class 10 boards, 2026</span>
              </span>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats with counters on a pastel tint. */}
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

      {/* Courses as friendly cards. */}
      <section id="services" className="scroll-mt-20 py-20 sm:py-24">
        <div className="container-dm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              eyebrow="Courses"
              title="Courses and fees"
              sub="Fees are per month and include study material and weekly tests."
            />
            <Link href={`${vidya.path}/courses`} className="dm-underline text-dm-brand font-bold">
              All course details <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vidya.services.map((s, i) => {
              const c = vidyaCourses.find((x) => x.slug === s.slug)
              return (
                <Reveal key={s.slug} as="li" index={i} className="dm-scale-in">
                  <article
                    data-tilt="4"
                    data-cursor="View"
                    className={`dm-card dm-lift flex h-full flex-col overflow-hidden ${c ? tint[c.tint] : ''}`}
                  >
                    {c && (
                      <Photo
                        photo={c.photo}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="aspect-[16/9] rounded-none"
                      />
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-dm-muted text-xs font-bold tracking-wide uppercase">{s.category}</p>
                      <h3 className="mt-1 font-display text-2xl">{s.name}</h3>
                      <p className="text-dm-muted mt-2 flex-1">{s.line}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-display text-2xl">
                          {formatInr(s.price)}{' '}
                          <span className="text-dm-muted font-sans text-sm font-normal">/month</span>
                        </span>
                        <DemoButton
                          href={`${vidya.path}/courses#${s.slug}`}
                          size="sm"
                          variant="secondary"
                          className="bg-white"
                        >
                          Details
                        </DemoButton>
                      </div>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Batches: pinned horizontal story. */}
      <section id="batches" className="dm-pin scroll-mt-20" style={{ ['--dm-track-shift' as string]: '52%' }}>
        <div className="dm-pin-stage bg-[var(--dm-tint-mint)]">
          <div className="container-dm w-full">
            <SectionTitle
              eyebrow="Batches"
              title="This term's timetable"
              sub="Seats update as admissions close."
            />
            <ol className="dm-pin-track mt-8">
              {tuitionBatches.map((b, i) => (
                <li key={b.course} className="w-[76vw] shrink-0 sm:w-[44vw] lg:w-[28vw]">
                  <div className="dm-card h-full p-6">
                    <p className="text-dm-muted text-xs font-bold tracking-wide uppercase">Batch {i + 1}</p>
                    <h3 className="mt-2 font-display text-2xl">{b.course}</h3>
                    <p className="text-dm-muted mt-3">{b.days}</p>
                    <p className="text-dm-muted">{b.time}</p>
                    <span
                      className={
                        b.seats.startsWith('Waitlist')
                          ? 'bg-dm-surface-2 text-dm-muted mt-4 inline-block rounded-full px-3 py-1 text-sm font-bold'
                          : 'text-dm-accent-ink mt-4 inline-block rounded-full bg-[var(--dm-tint-peach)] px-3 py-1 text-sm font-bold'
                      }
                    >
                      {b.seats}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Faculty. */}
      <section id="faculty" className="scroll-mt-20 py-20 sm:py-24">
        <div className="container-dm">
          <SectionTitle eyebrow="Faculty" title="Teachers who stay for the doubt-clearing hour" />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tuitionFaculty.map((f, i) => (
              <Reveal key={f.name} as="li" index={i}>
                <article data-tilt="4" className="dm-card dm-lift h-full overflow-hidden">
                  <Photo
                    photo={facultyPhotos[i]}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="aspect-[4/3] rounded-none"
                  />
                  <div className="p-5">
                    <p className="font-display text-xl">{f.name}</p>
                    <p className="text-dm-brand font-bold">
                      {f.subject} · {f.years} yrs
                    </p>
                    <p className="text-dm-muted mt-2 text-sm">{f.note}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Results teaser. */}
      <section id="results" className="scroll-mt-20 bg-[var(--dm-tint-peach)] py-20 sm:py-24">
        <div className="container-dm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle eyebrow="Results" title="2026 toppers" />
            <Link href={`${vidya.path}/results`} className="dm-underline text-dm-brand font-bold">
              All results <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {vidyaToppers.map((t, i) => (
              <Reveal key={t.name} as="li" index={i}>
                <article className="dm-card dm-lift flex h-full items-center gap-4 p-4">
                  <Photo photo={t.photo} sizes="72px" className="h-18 w-18 shrink-0 rounded-full" />
                  <div>
                    <p className="text-dm-brand font-display text-2xl">{t.score}</p>
                    <p className="font-bold">{t.name}</p>
                    <p className="text-dm-muted text-sm">{t.exam}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Testimonials items={tuitionTestimonials} tone="bg" />

      <section id="enquire" className="bg-dm-surface scroll-mt-20 py-20 sm:py-24">
        <div className="container-dm grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionTitle
              eyebrow="Admissions"
              title="Ask about a seat"
              sub="Tell us the class and course. We call back the same day with batch options and a free demo class."
            />
            <p className="text-dm-muted mt-6 flex items-center gap-2">
              <MessageCircle className="text-dm-brand h-5 w-5" /> Or message us on WhatsApp, 10 AM to 7 PM.
            </p>
          </div>
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
