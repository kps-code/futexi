import type { Metadata } from 'next'
import { Avatar } from '@/components/site/avatar'
import { PageIntro } from '@/components/site/page-intro'
import { GithubIcon, LinkedinIcon } from '@/components/site/social-icons'
import { ButtonLink } from '@/components/ui/button'
import { getAboutPage, getTeamMembers } from '@/server/site-data'

export const metadata: Metadata = { title: 'About' }

const audiences = [
  'Local Businesses',
  'Startups',
  'Creators & Professionals',
  'Education',
  'Restaurants',
  'Service Businesses',
  'Growing Brands',
  'Small & Medium Businesses',
]

export default async function AboutPage() {
  const [about, team] = await Promise.all([getAboutPage(), getTeamMembers()])

  return (
    <>
      <PageIntro eyebrow="About" title={about.heading}>
        {about.intro}
      </PageIntro>

      <section className="container-site pb-16">
        {team.length === 0 ? (
          <p className="text-sm text-muted">Team profiles are being added. Check back soon.</p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-3">
            {team.map((m) => (
              <li key={m.id} className="rounded-2xl border border-border bg-surface p-6">
                <div className="flex items-center gap-4">
                  <Avatar name={m.name} photoUrl={m.photoUrl} photoAlt={m.photoAlt} size={72} />
                  <div>
                    <h2 className="font-display text-lg font-semibold">{m.name}</h2>
                    <p className="text-sm text-muted">{m.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-foreground/90">{m.bio}</p>
                {m.skills.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {m.skills.map((s) => (
                      <li
                        key={s}
                        className="rounded-full border border-border px-2.5 py-1 text-xs text-muted"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
                {m.aiSkills.length > 0 && (
                  <p className="mt-3 text-xs text-muted">
                    <span className="font-semibold text-foreground/80">AI: </span>
                    {m.aiSkills.join(' · ')}
                  </p>
                )}
                {(m.linkedin || m.github) && (
                  <div className="mt-4 flex gap-3">
                    {m.linkedin && (
                      <a
                        href={m.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${m.name} on LinkedIn`}
                        className="text-muted hover:text-foreground"
                        data-track="outbound_click"
                        data-track-props='{"where":"about","label":"LinkedIn"}'
                      >
                        <LinkedinIcon className="h-4 w-4" />
                      </a>
                    )}
                    {m.github && (
                      <a
                        href={m.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${m.name} on GitHub`}
                        className="text-muted hover:text-foreground"
                        data-track="outbound_click"
                        data-track-props='{"where":"about","label":"GitHub"}'
                      >
                        <GithubIcon className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <ul className="mt-10 flex flex-wrap gap-2">
          {about.values.map((v) => (
            <li key={v} className="rounded-full bg-surface px-4 py-2 text-sm font-medium">
              {v}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border bg-surface/50">
        <div className="container-site py-16 sm:py-20">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Who We Build For</h2>
          <ul className="mt-8 flex flex-wrap gap-2">
            {audiences.map((a) => (
              <li key={a} className="rounded-full border border-border bg-background px-4 py-2 text-sm">
                {a}
              </li>
            ))}
          </ul>
          <ButtonLink
            href="/contact"
            size="lg"
            className="mt-10"
            data-track="cta_click"
            data-track-props='{"cta":"about"}'
          >
            Start a Project
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
