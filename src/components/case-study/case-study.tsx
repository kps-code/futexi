import Image from 'next/image'
import { ArrowRight, Check, ExternalLink, MessageCircle } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'
import { DemoPreview } from '@/components/demos/demo-preview'
import { Reveal } from '@/components/reveal'
import { screenSizes, screenSrc, type Demo } from '@/content/demos'
import { whatsappLink } from '@/lib/whatsapp'
import type { ReactNode } from 'react'

/**
 * The reusable 10-section case-study template (docs/content-lock.md §5).
 * Screens sections show a placeholder until the demo site is live.
 */
export function CaseStudy({ demo, whatsappNumber }: { demo: Demo; whatsappNumber: string }) {
  const requestHref = `/contact?type=${demo.contactType}`
  const wa = whatsappLink(
    whatsappNumber,
    `Hi KAPOSA FUTEXI, I saw the ${demo.title} demo and want something similar for my business.`,
  )
  const live = demo.status === 'live' && demo.liveHref

  return (
    <article>
      {/* 01 Hero Preview */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_70%)]"
        />
        <div className="container-site grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-muted uppercase">
              Demo {String(demo.post).padStart(2, '0')} · {demo.category}
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {demo.title}
            </h1>
            <p className="mt-5 max-w-xl text-base text-pretty text-muted sm:text-lg">{demo.line}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {demo.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium"
                >
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {live ? (
                <ButtonLink
                  href={demo.liveHref!}
                  prefetch={false}
                  size="lg"
                  data-track="demo_open"
                  data-track-props={`{"slug":"${demo.slug}","where":"live"}`}
                >
                  Open Live Demo <ExternalLink className="h-4 w-4" />
                </ButtonLink>
              ) : (
                <span className="inline-flex h-13 items-center justify-center rounded-full border border-dashed border-border-strong px-6 text-sm text-muted">
                  Live demo coming soon
                </span>
              )}
              <ButtonLink
                href={requestHref}
                variant={live ? 'secondary' : 'primary'}
                size="lg"
                data-track="cta_click"
                data-track-props={`{"cta":"case_study_hero","slug":"${demo.slug}"}`}
              >
                {demo.cta}
              </ButtonLink>
            </div>
          </div>
          <Reveal>
            <DemoPreview
              demo={demo}
              className="mx-auto w-full max-w-xl scale-[1.02]"
              sizes="(min-width: 1024px) 55vw, 100vw"
              priority
            />
          </Reveal>
        </div>
      </section>

      {/* 02 Challenge + 03 Solution */}
      <Block n="02" title="The Challenge" tone="surface">
        <p className="max-w-2xl text-lg text-foreground/90">{demo.challenge}</p>
      </Block>

      <Block n="03" title="Our Solution">
        <ul className="grid gap-3 sm:grid-cols-2">
          {demo.solution.map((s, i) => (
            <Reveal
              key={s}
              as="li"
              index={i}
              className="flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
              <span className="text-sm">{s}</span>
            </Reveal>
          ))}
        </ul>
        {demo.flow && (
          <ol className="mt-10 flex flex-wrap items-center gap-2">
            {demo.flow.map((f, i) => (
              <li key={f} className="flex items-center gap-2">
                <span className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background">
                  {f}
                </span>
                {i < demo.flow!.length - 1 && <ArrowRight className="h-4 w-4 text-muted" />}
              </li>
            ))}
          </ol>
        )}
      </Block>

      {/* 04 Key Features */}
      <Block n="04" title="Key Features" tone="surface">
        <ul className="flex flex-wrap gap-2">
          {demo.features.map((f, i) => (
            <Reveal key={f} as="li" index={i}>
              <span className="inline-block rounded-full border border-border bg-background px-4 py-2 text-sm font-medium">
                {f}
              </span>
            </Reveal>
          ))}
        </ul>
      </Block>

      {/* 05 Website Screens */}
      <Block n="05" title="Website Screens">
        {demo.screens ? (
          <div className="grid gap-6">
            {demo.screens.desktop.map((s, i) => (
              <Reveal key={s.src} index={i} className="overflow-hidden rounded-2xl frame-glass">
                <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-muted/40" />
                  <span className="h-2 w-2 rounded-full bg-muted/40" />
                  <span className="h-2 w-2 rounded-full bg-muted/40" />
                  <span className="ml-2 h-2 flex-1 rounded bg-background/70" />
                </div>
                <Image
                  src={screenSrc(demo, s.src)}
                  alt={s.alt}
                  width={screenSizes.desktop.width}
                  height={screenSizes.desktop.height}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="h-auto w-full"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            <DemoPreview demo={demo} />
            <div className="flex items-center rounded-xl border border-dashed border-border-strong p-6 text-sm text-muted">
              Full-page screens arrive when this demo goes live. The concept above shows the layout direction.
            </div>
          </div>
        )}
      </Block>

      {/* 06 Mobile Experience */}
      <Block n="06" title="Mobile Experience" tone="surface">
        <div className="grid gap-6 sm:grid-cols-3">
          {demo.screens
            ? demo.screens.mobile.map((s, i) => (
                <Reveal
                  key={s.src}
                  index={i}
                  className="mx-auto w-full max-w-[15rem] overflow-hidden rounded-[2rem] border-[6px] border-foreground/80 bg-background shadow-xl"
                >
                  <Image
                    src={screenSrc(demo, s.src)}
                    alt={s.alt}
                    width={screenSizes.mobile.width}
                    height={screenSizes.mobile.height}
                    sizes="240px"
                    className="h-auto w-full"
                    loading="lazy"
                  />
                </Reveal>
              ))
            : [0, 1, 2].map((i) => (
                <Reveal
                  key={i}
                  index={i}
                  className="mx-auto w-full max-w-[13rem] rounded-[1.75rem] border-[6px] border-foreground/80 bg-background p-2 shadow-xl"
                >
                  <DemoPreview demo={demo} className="rounded-[1.1rem]" />
                  <div className="mt-2 space-y-1.5 px-1 pb-2">
                    <span className="block h-2 w-5/6 rounded bg-foreground/60" />
                    <span className="block h-2 w-2/3 rounded bg-muted/50" />
                    <span className="mt-2 block h-6 w-full rounded-full bg-foreground" />
                  </div>
                </Reveal>
              ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          {demo.screens
            ? 'Captured from the live demo on a 390px wide phone viewport.'
            : 'Every demo is built mobile-first. Phone screenshots replace these frames when the demo is live.'}
        </p>
      </Block>

      {/* 07 AI / Automation */}
      <Block n="07" title="AI / Automation">
        <p className="max-w-2xl text-foreground/90">{demo.automation}</p>
      </Block>

      {/* 08 Technology + 09 Outcome */}
      <Block n="08" title="Technology" tone="surface">
        <ul className="flex flex-wrap gap-2">
          {demo.technology.map((t) => (
            <li
              key={t}
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium"
            >
              {t}
            </li>
          ))}
        </ul>
      </Block>

      <Block n="09" title="Expected Outcome">
        <ul className="grid gap-4 sm:grid-cols-3">
          {demo.outcomes.map((o, i) => (
            <Reveal key={o} as="li" index={i} className="rounded-2xl border border-border bg-surface p-6">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground">
                <Check className="h-4 w-4" />
              </span>
              <p className="mt-4 font-medium">{o}</p>
            </Reveal>
          ))}
        </ul>
      </Block>

      {/* 10 Next Step */}
      <section className="relative overflow-hidden py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_100%,color-mix(in_oklab,var(--accent)_26%,transparent),transparent_70%)]"
        />
        <Reveal className="container-site text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-muted uppercase">
            Want this for your business?
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">{demo.cta}</h2>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink
              href={requestHref}
              size="lg"
              data-track="cta_click"
              data-track-props={`{"cta":"case_study_final","slug":"${demo.slug}"}`}
            >
              {demo.cta}
            </ButtonLink>
            <ButtonLink
              href={wa}
              variant="secondary"
              size="lg"
              data-track="whatsapp_click"
              data-track-props={`{"where":"case_study","slug":"${demo.slug}"}`}
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Us
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </article>
  )
}

function Block({
  n,
  title,
  tone = 'default',
  children,
}: {
  n: string
  title: string
  tone?: 'default' | 'surface'
  children: ReactNode
}) {
  return (
    <section
      className={
        tone === 'surface' ? 'border-y border-border bg-surface/50 py-16 sm:py-20' : 'py-16 sm:py-20'
      }
    >
      <div className="container-site grid gap-8 lg:grid-cols-[14rem_1fr]">
        <Reveal>
          <p className="font-display text-sm font-semibold text-muted">{n}</p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        </Reveal>
        <div>{children}</div>
      </div>
    </section>
  )
}
