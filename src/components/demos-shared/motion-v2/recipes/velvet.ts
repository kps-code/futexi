import { claim, q, type Recipe } from './shared'

/**
 * Velvet Salon: a dark barber lounge. Headline words slide in from alternating
 * sides with a skew while the two portraits uncover; a two-row type band moves
 * with the scroll and skews with its speed; service cards rise as their gold
 * icon squares pop; price cards and shelf products stagger in; gallery tiles
 * cut in from the bottom; the wedding story pins with one image crossfading
 * as the steps scroll; team cards tip up into place.
 */
export const recipe: Recipe = {
  intro({ gsap, add }) {
    const words = q('.v2-hero .dm-word > span')
    const fades = q('.v2-hero .dm-fade-up')
    const her = document.querySelector<HTMLElement>('.v2-portrait')
    const him = document.querySelector<HTMLElement>('.v2-portrait-sm')
    const label = document.querySelector<HTMLElement>('.v2-hero-label')
    if (!words.length) return
    claim([her, him].filter((el): el is HTMLElement => Boolean(el)))
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.from(
      words,
      {
        xPercent: (i: number) => (i % 2 ? 60 : -60),
        skewX: (i: number) => (i % 2 ? -14 : 14),
        opacity: 0,
        duration: 1.4,
        stagger: 0.12,
      },
      0,
    )
    ;[her, him].forEach((card, i) => {
      if (!card) return
      tl.fromTo(
        card,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'power4.inOut' },
        0.3 + i * 0.25,
      )
      const img = card.querySelector('img')
      if (img)
        tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 2.2, ease: 'power3.out' }, 0.3 + i * 0.25)
    })
    if (fades.length) tl.from(fades, { y: 24, opacity: 0, duration: 0.9, stagger: 0.12 }, 0.7)
    if (label) tl.from(label, { opacity: 0, y: 30, duration: 1 }, 1.2)
    add(() => tl.kill())
  },

  scroll({ gsap, ScrollTrigger, add }) {
    const rise = (els: Element[], trigger: string, extra: gsap.TweenVars = {}) => {
      if (!els.length) return
      gsap.from(els, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        clearProps: 'transform,opacity',
        ...extra,
        scrollTrigger: { trigger, start: 'top 80%' },
      })
    }

    // Type band: rows move against each other with the scroll and skew with its speed.
    const band = document.querySelector<HTMLElement>('.v2-band')
    if (band) {
      const rows = q('.v2-band-row', band)
      rows.forEach((row, i) => {
        gsap.fromTo(
          row,
          { xPercent: i % 2 ? -25 : 0 },
          {
            xPercent: i % 2 ? 0 : -25,
            ease: 'none',
            scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: 0.4 },
          },
        )
      })
      const skewTo = gsap.quickTo(rows, 'skewX', { duration: 0.5, ease: 'power3' })
      let settle: gsap.core.Tween | undefined
      ScrollTrigger.create({
        trigger: band,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          skewTo(gsap.utils.clamp(-12, 12, self.getVelocity() / -140))
          settle?.kill()
          settle = gsap.delayedCall(0.15, () => skewTo(0))
        },
      })
      add(() => settle?.kill())
    }

    // Service cards rise; their gold icon squares pop a beat later.
    const services = claim(q('#services li.reveal'))
    if (services.length) {
      const icons = q('.vb-icon', document.querySelector('#services') as HTMLElement)
      gsap
        .timeline({ scrollTrigger: { trigger: '#services ul', start: 'top 80%' } })
        .from(services, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.1,
          clearProps: 'transform,opacity',
        })
        .from(
          icons,
          {
            scale: 0,
            rotation: -45,
            duration: 0.6,
            ease: 'back.out(2)',
            stagger: 0.1,
            clearProps: 'transform',
          },
          0.5,
        )
    }

    // Price cards and shelf products stagger in.
    rise(claim(q('.v2-prices li.reveal')), '.v2-prices', { y: 40, stagger: 0.06 })
    rise(claim(q('.v2-shelf li.reveal')), '.v2-shelf', { stagger: 0.12 })

    // The lounge photo drifts against the copy.
    const lounge = document.querySelector<HTMLElement>('.v2-lounge-photo')
    if (lounge) {
      const img = lounge.querySelector('img')
      if (img) {
        gsap.fromTo(
          img,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: lounge, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      }
      rise(q('.v2-lounge-copy > *'), '.v2-lounge-copy', { x: 40, y: 0, stagger: 0.12 })
    }

    // Gallery: each tile uncovers from the bottom while its photo settles.
    const tiles = claim(q('#gallery li.reveal'))
    if (tiles.length) {
      gsap.set(tiles, { clipPath: 'inset(100% 0 0 0)' })
      gsap.set(q('img', document.querySelector('#gallery') as HTMLElement), { scale: 1.3 })
      ScrollTrigger.batch(tiles, {
        start: 'top 88%',
        once: true,
        onEnter: (els) => {
          gsap.to(els, { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power4.inOut', stagger: 0.1 })
          gsap.to(
            (els as Element[]).map((el) => el.querySelector('img')),
            { scale: 1, duration: 1.6, ease: 'power3.out', stagger: 0.1 },
          )
        },
      })
    }

    // Weddings: pinned; the step copy brightens in turn while one image crossfades to the next.
    const stage = document.querySelector<HTMLElement>('.dm-pin-stage')
    const track = stage?.querySelector<HTMLElement>('.dm-pin-track')
    const steps = track ? q(':scope > li', track) : []
    if (stage && steps.length > 1) {
      const photos = steps.map((s) => s.querySelector('figure'))
      const copies = steps.map((s) => s.querySelector('.v2-step-copy'))
      gsap.set(photos.slice(1), { opacity: 0 })
      gsap.set(copies.slice(1), { opacity: 0.35 })
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => `+=${(steps.length - 1) * window.innerHeight * 0.6}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      steps.forEach((_, i) => {
        if (!i) return
        tl.to(photos[i - 1], { opacity: 0, scale: 1.05, duration: 1 }, i - 1)
          .to(photos[i], { opacity: 1, duration: 1 }, i - 1)
          .to(copies[i - 1], { opacity: 0.35, duration: 1 }, i - 1)
          .to(copies[i], { opacity: 1, duration: 1 }, i - 1)
      })
    }

    // Team cards tip up into place.
    const team = claim(q('#team li.reveal'))
    if (team.length) {
      gsap.from(team, {
        y: 60,
        rotateX: -14,
        transformPerspective: 900,
        transformOrigin: 'top center',
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '#team ul', start: 'top 80%' },
      })
    }
  },
}
