import { claim, q, type Recipe } from './shared'

/**
 * Nova Studio: slow and soft. Headline words rise out of their own masks while
 * the hero photo breathes (Ken Burns) and the booking bar floats up; treatment
 * cards turn in like pages; the quote reveals line by line under a gold rule;
 * the visit steps stack on top of each other while the section is pinned; the
 * studio photo drifts against its copy.
 */
export const recipe: Recipe = {
  intro({ gsap, add }) {
    const words = q('.v2-hero .dm-word > span')
    const fades = q('.v2-hero .dm-fade-up')
    const bar = document.querySelector<HTMLElement>('[data-testid="booking-bar"]')
    const img = document.querySelector<HTMLElement>('.v2-hero-photo img')
    if (!words.length) return
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.from(words, { yPercent: 110, duration: 1.4, stagger: 0.07 }, 0)
    if (fades.length)
      tl.from(fades, { opacity: 0, y: 20, filter: 'blur(10px)', duration: 1.1, stagger: 0.15 }, 0.5)
    if (bar) tl.from(bar, { y: 48, opacity: 0, duration: 1.1 }, 0.9)
    if (img) tl.fromTo(img, { scale: 1.18 }, { scale: 1.04, duration: 9, ease: 'power2.out' }, 0)
    add(() => tl.kill())
  },

  scroll({ gsap, SplitText, add }) {
    // Hero photo keeps drifting with the scroll.
    const hero = document.querySelector<HTMLElement>('.v2-hero')
    const img = hero?.querySelector<HTMLElement>('.v2-hero-photo img')
    if (hero && img) {
      gsap.to(img, {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      })
    }

    // Treatment cards turn in from the left like pages.
    const cards = claim(q('#services li.reveal'))
    if (cards.length) {
      gsap.from(cards, {
        rotateY: 22,
        x: 80,
        opacity: 0,
        transformPerspective: 1000,
        transformOrigin: 'left center',
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.12,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '#services ul', start: 'top 78%' },
      })
    }

    // Quote: a gold rule draws, then each line rises out of its mask.
    const quote = document.querySelector<HTMLElement>('.v2-quote')
    if (quote) {
      const split = new SplitText(quote, { type: 'lines', linesClass: 'v2-line', mask: 'lines' })
      const tl = gsap.timeline({ scrollTrigger: { trigger: quote, start: 'top 78%' } })
      const rule = document.querySelector<HTMLElement>('.v2-rule')
      if (rule) tl.from(rule, { scaleX: 0, duration: 1, ease: 'power3.inOut' })
      tl.from(split.lines, { yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: 0.14 }, '-=0.5')
      add(() => split.revert())
    }

    // A visit: the steps stack on top of each other while the stage is pinned.
    const stage = document.querySelector<HTMLElement>('.dm-pin-stage')
    const track = stage?.querySelector<HTMLElement>('.dm-pin-track')
    const steps = track ? q(':scope > li', track) : []
    if (stage && steps.length > 1) {
      steps.forEach((step, i) => {
        step.style.zIndex = String(i + 1)
      })
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => `+=${(steps.length - 1) * window.innerHeight * 0.7}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      steps.forEach((step, i) => {
        if (!i) return
        tl.from(step, { yPercent: 120, rotate: 2, duration: 1, ease: 'power2.out' }, i - 1).to(
          steps[i - 1],
          { scale: 0.94, yPercent: -4, duration: 1, ease: 'power2.out' },
          i - 1,
        )
      })
    }

    // Studio: the photo moves slower than the page; the copy slides in beside it.
    const studio = document.querySelector<HTMLElement>('.v2-studio')
    if (studio) {
      const photo = studio.querySelector<HTMLElement>('.v2-studio-photo img')
      if (photo) {
        gsap.fromTo(
          photo,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: { trigger: studio, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      }
      claim(q('.v2-studio-copy', studio))
      const items = q('.v2-studio-copy > *', studio)
      if (items.length) {
        gsap.from(items, {
          x: 48,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: studio, start: 'top 70%' },
        })
      }
    }
  },
}
