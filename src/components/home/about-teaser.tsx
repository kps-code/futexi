import Image from 'next/image'
import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'
import { aboutTeaser } from '@/content/home'
import type { TeamMemberView } from '@/server/site-data'
import { Section, SectionHeading } from './section'

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

export function AboutTeaser({ team, intro }: { team: TeamMemberView[]; intro: string }) {
  return (
    <Section id="team" className="cv-auto">
      <SectionHeading eyebrow="About" title={aboutTeaser.heading} sub={intro} />
      {team.length > 0 && (
        <ul className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
          {team.slice(0, 3).map((m, i) => (
            <Reveal
              key={m.id}
              as="li"
              index={i}
              className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5"
            >
              {m.photoUrl ? (
                <Image
                  src={m.photoUrl}
                  alt={m.photoAlt ?? m.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-gradient font-display font-bold text-white">
                  {initials(m.name)}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate font-display font-semibold">{m.name}</p>
                <p className="truncate text-sm text-muted">{m.role}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      )}
      <Reveal className="mt-10 text-center">
        <ButtonLink
          href={aboutTeaser.cta.href}
          variant="secondary"
          data-track="cta_click"
          data-track-props='{"cta":"meet_team"}'
        >
          {aboutTeaser.cta.label}
        </ButtonLink>
      </Reveal>
    </Section>
  )
}
