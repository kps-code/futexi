import { claim, q, type Recipe } from './shared'

/**
 * Saffron Kitchen: slow and ceremonial. Hero characters come in from a blur
 * while the fire photo breathes; the statement sharpens character by
 * character on scroll; six signature dishes sit on a 3D ring that turns as
 * the section is pinned; menu rows, the story and the occasion rows settle
 * in with hairline calm.
 */
export const recipe: Recipe = {
  intro({ gsap, SplitText, add }) {
    const words = q('.v2-hero .dm-word > span')
    const fades = q('.v2-hero .dm-fade-up')
    const img = document.querySelector<HTMLElement>('.v2-hero-photo img')
    if (!words.length) return
    const split = new SplitText(words, { type: 'chars', charsClass: 'v2-ch' })
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from(split.chars, { opacity: 0, filter: 'blur(12px)', y: 24, duration: 1.3, stagger: 0.03 }, 0)
    if (fades.length) tl.from(fades, { opacity: 0, y: 16, duration: 1, stagger: 0.18 }, 0.8)
    if (img) tl.fromTo(img, { scale: 1.16 }, { scale: 1.02, duration: 12, ease: 'power1.out' }, 0)
    add(() => {
      tl.kill()
      split.revert()
    })
  },

  scroll({ gsap, SplitText, ScrollTrigger, add }) {
    // Hero photo drifts with the scroll.
    const hero = document.querySelector<HTMLElement>('.v2-hero')
    const img = hero?.querySelector<HTMLElement>('.v2-hero-photo img')
    if (hero && img) {
      gsap.to(img, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      })
    }

    // Statement: characters sharpen from a blur while the line scrolls through.
    const statement = document.querySelector<HTMLElement>('.rs-statement')
    if (statement) {
      const split = new SplitText(statement, { type: 'chars,words', charsClass: 'v2-sc' })
      gsap.fromTo(
        split.chars,
        { opacity: 0.15, filter: 'blur(6px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.02,
          ease: 'none',
          scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      )
      add(() => split.revert())
    }

    // Signature ring: pinned, the ring turns one dish per step; the caption follows the front dish.
    const stage = document.querySelector<HTMLElement>('.rs-stage')
    const ring = stage?.querySelector<HTMLElement>('.rs-ring')
    const dishes = ring ? q('.rs-dish', ring) : []
    const caption = stage?.querySelector<HTMLElement>('.rs-ring-caption')
    if (stage && ring && dishes.length > 1) {
      const step = 360 / dishes.length
      const radius = () => Math.min(520, Math.max(360, window.innerWidth * 0.3))
      // Rotate first, then push out: GSAP would translate before rotating, which stacks the cards.
      const place = () =>
        dishes.forEach(
          (d, i) =>
            (d.style.transform = `translate(-50%, -50%) rotateY(${i * step}deg) translateZ(${radius()}px)`),
        )
      place()
      const names = dishes.map((d) => {
        const n = d.querySelector('.font-display')?.textContent?.trim() ?? ''
        const p = d.querySelector('.text-dm-brand')?.textContent?.trim() ?? ''
        return `${n} · ${p}`
      })
      let front = -1
      const setFront = (i: number) => {
        if (i === front) return
        front = i
        dishes.forEach((d, k) => d.classList.toggle('is-front', k === i))
        if (caption) caption.textContent = names[i]
      }
      setFront(0)
      gsap.to(ring, {
        rotateY: -step * (dishes.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => `+=${(dishes.length - 1) * 520}`,
          pin: true,
          scrub: 0.6,
          snap: { snapTo: 1 / (dishes.length - 1), duration: 0.4, ease: 'power2.out' },
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setFront(Math.round(self.progress * (dishes.length - 1))),
          onRefresh: place,
        },
      })
    }

    // Menu rows settle in once the menu scrolls into view.
    const menu = document.querySelector<HTMLElement>('.rs-menu')
    if (menu) {
      gsap.from(q('[role="tabpanel"] li', menu), {
        opacity: 0,
        y: 16,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.05,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: menu, start: 'top 80%' },
      })
    }

    // Story: the room drifts against the copy; the facts count in.
    const story = document.querySelector<HTMLElement>('.rs-story-photo')
    if (story) {
      claim([story])
      const photo = story.querySelector('img')
      if (photo) {
        gsap.fromTo(
          photo,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: story, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      }
      gsap.from(q('.rs-story-copy > *'), {
        opacity: 0,
        y: 28,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.rs-story-copy', start: 'top 78%' },
      })
    }

    // Occasion rows: the photo slides in from its side, the copy from the other.
    q('.rs-row').forEach((row, i) => {
      const photo = row.querySelector('.rs-row-photo')
      const copy = row.querySelector('.rs-row-copy')
      const dir = i % 2 ? 1 : -1
      gsap
        .timeline({ scrollTrigger: { trigger: row, start: 'top 78%' } })
        .from(photo, {
          x: 60 * dir,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        })
        .from(
          copy,
          { x: -40 * dir, opacity: 0, duration: 1, ease: 'power3.out', clearProps: 'transform,opacity' },
          0.15,
        )
    })

    // Offers and gallery rise and settle.
    gsap.from(q('.rs-offers li'), {
      opacity: 0,
      y: 20,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: '.rs-offers', start: 'top 82%' },
    })
    const tiles = q('.rs-gallery li')
    if (tiles.length) {
      gsap.set(q('.rs-gallery img'), { scale: 1.15 })
      ScrollTrigger.batch(tiles, {
        start: 'top 88%',
        once: true,
        onEnter: (els) => {
          gsap.from(els, {
            opacity: 0,
            y: 24,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.08,
            clearProps: 'transform,opacity',
          })
          gsap.to(
            (els as Element[]).map((el) => el.querySelector('img')),
            { scale: 1, duration: 1.6, ease: 'power3.out', stagger: 0.08 },
          )
        },
      })
    }
  },
}
