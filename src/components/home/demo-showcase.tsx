import Image from 'next/image'
import Link from 'next/link'
import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'
import { screenSrc, type Demo } from '@/content/demos'
import { demoShowcase } from '@/content/home'
import { Section, SectionHeading } from './section'
import { Tilt } from './tilt'

/**
 * Live demos as browser frames showing their real home page. Only demos with
 * captured screens appear; the card opens the case study.
 */
export function DemoShowcase({ demos }: { demos: readonly Demo[] }) {
  const items = demos.filter((d) => d.screens?.desktop[0]).slice(0, 6)
  if (items.length === 0) return null
  return (
    <Section id="demos" tone="surface">
      <SectionHeading
        align="left"
        eyebrow={demoShowcase.eyebrow}
        title={demoShowcase.heading}
        sub={demoShowcase.sub}
      />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((d, i) => {
          const shot = d.screens!.desktop[0]
          return (
            <Reveal key={d.slug} as="li" index={i} className="h-full">
              <Tilt as="article" className="h-full" max={6}>
                <Link
                  href={`/demos/${d.slug}`}
                  className="flex h-full flex-col focus-visible:outline-none"
                  data-track="demo_open"
                  data-track-props={`{"slug":"${d.slug}","where":"home_showcase"}`}
                >
                  <span className="sr-demo-top" aria-hidden>
                    <i />
                    <i />
                    <i />
                    <em>{d.slug}.demo</em>
                    <span>Live</span>
                  </span>
                  <span className="sr-demo-pic">
                    <Image
                      src={screenSrc(d, shot.src)}
                      alt={shot.alt}
                      width={1440}
                      height={900}
                      quality={60}
                      sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 45vw, 92vw"
                    />
                    <span className="sr-demo-open">{demoShowcase.open} ↗</span>
                  </span>
                  <span className="flex items-center justify-between gap-3 px-5 py-4">
                    <span className="font-display font-semibold">{d.title}</span>
                    <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted">
                      {d.category}
                    </span>
                  </span>
                </Link>
              </Tilt>
            </Reveal>
          )
        })}
      </ul>
      <Reveal className="mt-12 text-center">
        <ButtonLink
          href={demoShowcase.cta.href}
          variant="secondary"
          size="lg"
          data-track="cta_click"
          data-track-props='{"cta":"view_all_demos"}'
        >
          {demoShowcase.cta.label}
        </ButtonLink>
      </Reveal>
    </Section>
  )
}
