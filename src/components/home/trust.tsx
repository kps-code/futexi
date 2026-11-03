import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, Quote, Star } from 'lucide-react'
import { Avatar } from '@/components/site/avatar'
import { Reveal } from '@/components/reveal'
import { trust } from '@/content/home'
import { firstName } from '@/lib/initials'
import { cn } from '@/lib/utils'
import type { TeamMemberView, TestimonialView, WhyUsContent } from '@/server/site-data'
import { Section, SectionHeading } from './section'
import { Tilt } from './tilt'

export type TrustStats = { demos: number; city: string; replyTime: string }

/**
 * Why businesses choose us: three facts, the "Why Build With Us?" reasons
 * (Content > Home Page), client testimonials when there are any, and the
 * person visitors will talk to (Content > Team Members > Point of contact).
 */
export function Trust({
  whyUs,
  testimonials,
  team,
  stats,
  whatsappHref,
}: {
  whyUs: WhyUsContent
  testimonials: TestimonialView[]
  team: TeamMemberView[]
  stats: TrustStats
  whatsappHref: string
}) {
  const contact = team.find((m) => m.pointOfContact) ?? team[0]
  const facts = [
    { k: `${stats.demos}`, v: 'live demos you can try' },
    { k: stats.city, v: 'based, working across India' },
    { k: 'Direct', v: stats.replyTime },
  ]
  return (
    <Section id="trust">
      <SectionHeading
        align="left"
        eyebrow={trust.eyebrow}
        title={whyUs.heading || trust.heading}
        sub={trust.sub}
      />

      <Reveal>
        <dl className="grid gap-4 sm:grid-cols-3">
          {facts.map((f) => (
            <div key={f.v} className="rounded-2xl border border-border bg-surface px-6 py-5">
              <dt className="font-display text-3xl font-bold tracking-[-0.02em]">{f.k}</dt>
              <dd className="mt-1 text-sm text-muted">{f.v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {whyUs.cards.length > 0 && (
        <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.cards.map((c, i) => (
            <Reveal key={c.title} as="li" index={i} className="flex gap-3">
              <span className="sr-check mt-0.5" aria-hidden />
              <div>
                <h3 className="font-display font-semibold">{c.title}</h3>
                <p className="mt-1 text-sm text-muted">{c.line}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      )}

      {testimonials.length > 0 && (
        <div className="mt-16">
          <h3 className="mb-6 font-display text-2xl font-bold tracking-[-0.02em]">
            {trust.testimonials.heading}
          </h3>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 6).map((t, i) => (
              <Reveal key={t.id} as="li" index={i} className="h-full">
                <Tilt as="article" className="h-full p-6">
                  <Quote aria-hidden className="h-6 w-6 text-muted/70" />
                  {t.rating && (
                    <div className="mt-3 flex gap-0.5" role="img" aria-label={`${t.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }, (_, k) => (
                        <Star
                          key={k}
                          aria-hidden
                          className={cn(
                            'h-4 w-4',
                            k < t.rating! ? 'fill-amber-400 text-amber-400' : 'text-border-strong',
                          )}
                        />
                      ))}
                    </div>
                  )}
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mt-5 flex items-center gap-3">
                    {t.photoUrl ? (
                      <Image
                        src={t.photoUrl}
                        alt={t.photoAlt ?? t.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-foreground font-display text-sm font-bold text-background"
                      >
                        {t.name.trim().charAt(0).toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm font-semibold">{t.name}</p>
                      {t.business && <p className="truncate text-xs text-muted">{t.business}</p>}
                    </div>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </ul>
        </div>
      )}

      {contact && (
        <Reveal className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex items-start gap-5 sm:items-center">
            <span className="shrink-0 rounded-full bg-border-strong p-0.5">
              <Avatar
                name={contact.name}
                photoUrl={contact.photoUrl}
                photoAlt={contact.photoAlt}
                size={72}
                className="block"
              />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">
                {trust.team.heading}
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold">{contact.name}</h3>
              <p className="text-sm text-muted">
                {contact.role} · {trust.team.contact}
              </p>
              <p className="mt-2 max-w-xl text-sm text-muted">
                {stats.replyTime} {trust.team.line}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#25d366] px-5 text-sm font-semibold text-[#06281a] transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-105"
              data-track="whatsapp_click"
              data-track-props='{"where":"home_contact"}'
            >
              <MessageCircle className="h-4 w-4" />
              {trust.team.whatsapp} {firstName(contact.name)}
            </a>
            <Link
              href={trust.team.cta.href}
              className="text-sm font-medium text-muted underline underline-offset-4 hover:text-foreground"
              data-track="cta_click"
              data-track-props='{"cta":"meet_team"}'
            >
              {trust.team.cta.label} →
            </Link>
          </div>
        </Reveal>
      )}
    </Section>
  )
}
