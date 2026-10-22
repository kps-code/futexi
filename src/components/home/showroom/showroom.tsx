'use client'

import { ArrowDown, MessageCircle } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
} from 'react'
import { ButtonLink } from '@/components/ui/button'
import { brand } from '@/content/site'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import type { HeroContent, JourneyChapter, JourneyContent } from '@/server/site-data'
import { Phone2D } from './phone-2d'
import type { PhoneThreeProps } from './phone-three'
import { createSceneState, type SceneState } from './scene-state'

export type ShowroomProps = {
  hero: HeroContent
  journey: JourneyContent
  /** wa.me link with the admin's default message. */
  whatsappHref: string
  primaryHref: string
  secondaryHref: string
}

type Chapter = JourneyChapter & { isHero?: boolean }

/* Desktops with room for the pinned story; phones, tablets, short windows and reduced
   motion get the stacked layout. The CSS in showroom.css uses the same query, so the
   server HTML is right for both and only the behaviour waits for hydration. */
const PINNED_QUERY = '(min-width: 64rem) and (min-height: 560px) and (prefers-reduced-motion: no-preference)'
function subscribePinned(cb: () => void) {
  const mq = window.matchMedia(PINNED_QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
function usePinnedLayout(): boolean {
  return useSyncExternalStore(
    subscribePinned,
    () => window.matchMedia(PINNED_QUERY).matches,
    () => false,
  )
}

function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}
function lowEndDevice(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  if (nav.connection?.saveData) return true
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4) return true
  return (navigator.hardwareConcurrency || 8) < 4
}

const pad = (n: number) => String(n + 1).padStart(2, '0')

/**
 * The showroom: the hero and the scroll story that follows it. On desktop the
 * stage pins while the chapters change and the phone turns; on phones the same
 * content stacks, with the flat phone cycling through its screens.
 */
export function Showroom({ hero, journey, whatsappHref, primaryHref, secondaryHref }: ShowroomProps) {
  const chapters = useMemo<Chapter[]>(
    () => [
      {
        isHero: true,
        label: journey.heroLabel,
        eyebrow: hero.eyebrow,
        headingLine1: hero.headingLine1,
        headingLine2: hero.headingLine2,
        line: hero.sub,
        tagline: '',
        screen: 'site',
      },
      ...journey.chapters,
    ],
    [hero, journey],
  )
  const n = chapters.length
  const journeyMode = usePinnedLayout()
  const reduce = usePrefersReducedMotion()

  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  // Mutable scene state lives in a ref: the 3D loop reads it every frame without renders.
  const stateRef = useRef<SceneState>(createSceneState())
  const [chapter, setChapter] = useState(0)
  const [screens, setScreens] = useState<HTMLCanvasElement[]>([])
  const [Three, setThree] = useState<ComponentType<PhoneThreeProps> | null>(null)
  const [threeReady, setThreeReady] = useState(false)
  const { resolvedTheme } = useTheme()
  const light = resolvedTheme !== 'dark'

  /* Desktop only: fetch the 3D phone after the page has loaded and the browser is idle. */
  useEffect(() => {
    if (!journeyMode || Three || !webglAvailable() || lowEndDevice()) return
    let cancelled = false
    let idle = 0
    const section = sectionRef.current
    const load = () => {
      idle = window.setTimeout(async () => {
        const [three, screensMod] = await Promise.all([
          import('./phone-three'),
          import('./phone-screens'),
          document.fonts.ready,
        ])
        if (cancelled) return
        const fonts = screensMod.screenFonts(section ?? undefined)
        setScreens(chapters.map((c) => screensMod.drawScreen(c.screen, fonts)))
        setThree(() => three.PhoneThree)
      }, 400)
    }
    if (document.readyState === 'complete') load()
    else window.addEventListener('load', load, { once: true })
    return () => {
      cancelled = true
      window.clearTimeout(idle)
      window.removeEventListener('load', load)
    }
  }, [journeyMode, Three, chapters])

  /* Scroll progress drives the chapter and the phone pose while pinned. */
  useEffect(() => {
    const s = stateRef.current
    if (!s) return
    if (!journeyMode) {
      s.progress = 0
      return
    }
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = section.getBoundingClientRect()
      const stageTop = stage.getBoundingClientRect().top
      const travel = section.offsetHeight - stage.offsetHeight
      const p = travel > 0 ? Math.min(1, Math.max(0, (stageTop - rect.top) / travel)) : 0
      s.progress = p
      stage.style.setProperty('--sr-progress', p.toFixed(4))
      setChapter(Math.round(p * (n - 1)))
    }
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [journeyMode, n])

  /* Pointer parallax and drag, desktop only. */
  useEffect(() => {
    const s = stateRef.current
    if (!journeyMode || !s) return
    const stage = stageRef.current
    if (!stage) return
    const layout = () => {
      const narrow = window.innerWidth < 1200
      s.shiftX = narrow ? 3.1 : 0
      s.shiftY = narrow ? -0.7 : 0
      s.scale = narrow ? 0.86 : 1
    }
    layout()
    let lastX = 0
    const onMove = (e: PointerEvent) => {
      s.pointer.x = (e.clientX / window.innerWidth - 0.5) * 2
      s.pointer.y = (e.clientY / window.innerHeight - 0.5) * 2
      if (s.dragging) {
        const dx = e.clientX - lastX
        lastX = e.clientX
        s.dragVelocity = dx * 0.006
        s.drag += s.dragVelocity
      }
    }
    const onDown = (e: PointerEvent) => {
      s.dragging = true
      lastX = e.clientX
    }
    const onUp = () => {
      s.dragging = false
    }
    const hit = stage.querySelector<HTMLElement>('[data-sr-drag]')
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('resize', layout)
    hit?.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('resize', layout)
      hit?.removeEventListener('pointerdown', onDown)
    }
  }, [journeyMode])

  /* Stacked layout: the flat phone cycles through the screens on its own. */
  const [cycle, setCycle] = useState(0)
  useEffect(() => {
    if (journeyMode || reduce || n < 2) return
    const id = window.setInterval(() => setCycle((c) => (c + 1) % n), 3000)
    return () => window.clearInterval(id)
  }, [journeyMode, reduce, n])

  const goTo = useCallback(
    (i: number) => {
      const section = sectionRef.current
      const stage = stageRef.current
      if (!section || !stage) return
      const travel = section.offsetHeight - stage.offsetHeight
      const stickyTop = parseFloat(getComputedStyle(stage).top) || 0
      const top =
        window.scrollY + section.getBoundingClientRect().top - stickyTop + (travel * i) / Math.max(1, n - 1)
      window.scrollTo({ top, behavior: 'smooth' })
    },
    [n],
  )

  const active = journeyMode ? chapter : cycle
  const onThreeReady = useCallback(() => setThreeReady(true), [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="sr"
      style={{ '--sr-n': n } as React.CSSProperties}
      data-chapter={active}
    >
      <div ref={stageRef} className="sr-stage">
        <div aria-hidden className="sr-bg">
          <div className="absolute inset-0 bg-grid" />
          <div className="sr-beam" />
          <div className="sr-floor" />
        </div>

        {/* Giant wordmark behind the phone. Decorative: the header carries the accessible name. */}
        <div aria-hidden className="sr-words">
          <div className={cn('sr-word sr-word-l', active > 0 && 'sr-word-dim')}>KAPOSA</div>
          <div className={cn('sr-word sr-word-r', active > 0 && 'sr-word-dim')}>FUTEXI</div>
        </div>

        <div className="sr-phone" data-sr-drag="">
          {journeyMode && Three && screens.length > 0 && (
            <div
              className={cn(
                'absolute inset-0 transition-opacity duration-700',
                threeReady ? 'opacity-100' : 'opacity-0',
              )}
            >
              <Three
                state={stateRef}
                screens={screens}
                chapter={chapter}
                light={light}
                onReady={onThreeReady}
              />
            </div>
          )}
          <Phone2D
            kinds={chapters.map((c) => c.screen)}
            index={active}
            float
            className={cn('sr-p2d-pos transition-opacity duration-700', threeReady && 'opacity-0')}
          />
        </div>

        <div className="sr-rail" aria-hidden>
          <div className="sr-rail-num">
            {pad(active)}
            <small>/ {pad(n - 1)}</small>
          </div>
          <div className="sr-ticks">
            <b style={{ top: `${(active / Math.max(1, n - 1)) * 100}%` }} />
            {chapters.map((c, i) => (
              <button
                key={c.label + i}
                type="button"
                tabIndex={-1}
                title={c.label}
                onClick={() => goTo(i)}
                style={{ top: `${(i / Math.max(1, n - 1)) * 100}%` }}
              />
            ))}
            <span className="sr-chip" style={{ top: `${(active / Math.max(1, n - 1)) * 100}%` }}>
              {chapters[active]?.label}
            </span>
          </div>
        </div>

        <div className="sr-chapters">
          {chapters.map((c, i) => {
            const on = i === active
            return (
              <div
                key={c.label + i}
                className={cn('sr-ch', on && 'sr-ch-on', c.isHero && 'sr-ch-hero')}
                aria-hidden={!on}
                inert={!on ? true : undefined}
              >
                <div className="sr-ch-l">
                  <p className="sr-eyebrow">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-foreground" />
                    {c.eyebrow}
                  </p>
                  {c.isHero ? (
                    <h1 className="sr-h">
                      <span className="sr-ln">
                        <span>{c.headingLine1} </span>
                      </span>
                      <span className="sr-ln">
                        <span className="sr-accent">{c.headingLine2}</span>
                      </span>
                    </h1>
                  ) : (
                    <h2 className="sr-h">
                      <span className="sr-ln">
                        <span>{c.headingLine1} </span>
                      </span>
                      {c.headingLine2 && (
                        <span className="sr-ln">
                          <span>{c.headingLine2}</span>
                        </span>
                      )}
                    </h2>
                  )}
                  <p className="sr-p">{c.line}</p>
                  {c.isHero && (
                    <>
                      <div className="sr-ctas">
                        <ButtonLink
                          href={primaryHref}
                          size="lg"
                          data-track="cta_click"
                          data-track-props='{"cta":"hero_primary"}'
                        >
                          {hero.primaryLabel}
                        </ButtonLink>
                        <ButtonLink
                          href={secondaryHref}
                          variant="secondary"
                          size="lg"
                          data-track="cta_click"
                          data-track-props='{"cta":"hero_secondary"}'
                        >
                          {hero.secondaryLabel}
                        </ButtonLink>
                      </div>
                      <ul className="sr-trust">
                        {hero.trustLine.map((item, k) => (
                          <li key={item} className="flex items-center gap-3">
                            {k > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-muted/60" />}
                            {item}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {i === n - 1 && !c.isHero && (
                    <div className="sr-ctas">
                      <ButtonLink
                        href={whatsappHref}
                        size="lg"
                        className="bg-[#25d366] text-[#06281a] shadow-none hover:brightness-105"
                        data-track="whatsapp_click"
                        data-track-props='{"where":"journey_end"}'
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp us
                      </ButtonLink>
                      <ButtonLink
                        href={primaryHref}
                        variant="secondary"
                        size="lg"
                        data-track="cta_click"
                        data-track-props='{"cta":"journey_demos"}'
                      >
                        Explore live demos
                      </ButtonLink>
                    </div>
                  )}
                </div>
                {c.tagline && (
                  <div className="sr-ch-r">
                    <em className="sr-tag">{c.tagline}</em>
                    <small>{brand.positioning}</small>
                    <small>Chennai, Tamil Nadu</small>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="sr-bar" aria-hidden>
          <span className="sr-bar-hint">
            <ArrowDown className="h-3.5 w-3.5" />
            Scroll to explore
          </span>
          <span className="sr-bar-idx">
            {pad(active)}
            <i />
            {chapters[active]?.label}
          </span>
        </div>
      </div>

      {/* Stacked layout: the chapters after the hero as short cards (hidden on desktop by CSS). */}
      {n > 1 && (
        <ol className="sr-mini container-site">
          {chapters.slice(1).map((c, i) => (
            <li key={c.label + i} className={cn('sr-mini-item', active === i + 1 && 'sr-mini-on')}>
              <button type="button" onClick={() => setCycle(i + 1)} className="text-left">
                <span className="sr-mini-n">{pad(i + 1)}</span>
                <span className="sr-mini-t">
                  {c.headingLine1} {c.headingLine2}
                </span>
                <span className="sr-mini-l">{c.line}</span>
              </button>
            </li>
          ))}
          <li className="sr-mini-item">
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="sr-mini-wa"
              data-track="whatsapp_click"
              data-track-props='{"where":"journey_end"}'
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp us
            </Link>
          </li>
        </ol>
      )}
    </section>
  )
}
