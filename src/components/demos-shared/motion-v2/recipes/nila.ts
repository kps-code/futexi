import { claim, q, type Recipe } from './shared'

/**
 * Atelier Nila: measured and architectural. Headline words settle in from wide
 * tracking while five blinds open on the kitchen photo; project frames open
 * from the bottom as their photo settles; the plan-to-room section pins while
 * a blueprint erases to a material study and then to the finished room; service
 * rows slide in; the process line draws itself; the studio photo drifts.
 */
export const recipe: Recipe = {
  intro({ gsap, add }) {
    const words = q('.v2-hero .dm-word > span')
    const fades = q('.v2-hero .dm-fade-up')
    const blinds = q('.in-blinds span')
    const caption = document.querySelector<HTMLElement>('.in-hero-frame + p')
    if (!words.length) return
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.from(words, { letterSpacing: '0.22em', opacity: 0, y: 12, duration: 1.5, stagger: 0.09 }, 0)
    if (blinds.length) {
      tl.to(blinds, { scaleY: 0, duration: 1.1, ease: 'power4.inOut', stagger: 0.08 }, 0.25)
    }
    if (fades.length) tl.from(fades, { opacity: 0, y: 18, duration: 1, stagger: 0.14 }, 0.7)
    if (caption) tl.from(caption, { opacity: 0, duration: 1 }, 1.3)
    add(() => tl.kill())
  },

  scroll({ gsap, ScrollTrigger }) {
    // Project frames open from the bottom while the photo inside settles.
    const frames = q('.in-frame')
    if (frames.length) {
      gsap.set(frames, { clipPath: 'inset(100% 0 0 0)' })
      gsap.set(q('.in-frame img'), { scale: 1.15 })
      ScrollTrigger.batch(frames, {
        start: 'top 85%',
        once: true,
        onEnter: (els) => {
          gsap.to(els, { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power4.inOut', stagger: 0.12 })
          gsap.to(
            (els as Element[]).map((el) => el.querySelector('img')),
            { scale: 1, duration: 1.8, ease: 'power3.out', stagger: 0.12 },
          )
        },
      })
    }

    // Plan to room: pinned; the blueprint erases in a circle, then the grey study takes colour.
    const plan = document.querySelector<HTMLElement>('.in-plan')
    const blueprint = plan?.querySelector<HTMLElement>('.in-blueprint')
    const photo = plan?.querySelector<HTMLElement>('.in-plan-photo img')
    const steps = plan ? q('.in-plan-step', plan) : []
    if (plan && blueprint && photo && steps.length) {
      gsap.set(photo, { filter: 'grayscale(1) contrast(1.05)' })
      const setStep = (i: number) => steps.forEach((s, k) => s.classList.toggle('is-on', k === i))
      gsap
        .timeline({
          scrollTrigger: {
            trigger: plan,
            start: 'top top',
            end: '+=1800',
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            onUpdate: (self) => setStep(self.progress < 0.33 ? 0 : self.progress < 0.7 ? 1 : 2),
          },
        })
        .to(blueprint, { clipPath: 'circle(0% at 62% 48%)', duration: 1, ease: 'power2.inOut' }, 0)
        .to(photo, { filter: 'grayscale(0) contrast(1)', duration: 0.9, ease: 'power2.inOut' }, 0.9)
    }

    // Service rows slide in from the left, one after another.
    const rows = q('.in-rows li')
    if (rows.length) {
      gsap.from(rows, {
        x: -40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.in-rows', start: 'top 80%' },
      })
    }

    // Process: the line draws across, the stages rise along it.
    const line = document.querySelector<SVGPathElement>('.in-process-line path')
    const stages = q('.in-process-step')
    if (line && stages.length) {
      const len = line.getTotalLength()
      gsap
        .timeline({ scrollTrigger: { trigger: '.in-process', start: 'top 78%' } })
        .fromTo(
          line,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' },
        )
        .from(
          stages,
          {
            y: 30,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.25,
            clearProps: 'transform,opacity',
          },
          0.3,
        )
    }

    // Studio photo drifts against its copy.
    const studio = document.querySelector<HTMLElement>('.in-studio-photo')
    if (studio) {
      claim([studio])
      const img = studio.querySelector('img')
      if (img) {
        gsap.fromTo(
          img,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: studio, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      }
      gsap.from(q('.in-studio-copy > *'), {
        opacity: 0,
        y: 24,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.in-studio-copy', start: 'top 80%' },
      })
    }
  },
}
