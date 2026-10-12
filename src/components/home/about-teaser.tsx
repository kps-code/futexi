import { Avatar } from '@/components/site/avatar'
import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'
import { aboutTeaser } from '@/content/home'
import type { TeamMemberView } from '@/server/site-data'
import { Section, SectionHeading } from './section'

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
              <Avatar name={m.name} photoUrl={m.photoUrl} photoAlt={m.photoAlt} size={56} />
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
