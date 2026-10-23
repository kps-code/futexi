import { q, type Recipe } from './shared'

/**
 * Pulse Fitness: hard and fast. Character slam on the headline, manifesto words
 * lighting up, the class strip pinned and sliding sideways with per-card
 * parallax, the coach photo wiping in.
 */
export const recipe: Recipe = {
  intro({ gsap, SplitText, add }) {
    const words = q('.v2-hero .dm-word > span')
    const fades = q('.v2-hero .dm-fade-up')
    if (!words.length) return
    const split = new SplitText(words, { type: 'chars', charsClass: 'v2-ch' })
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } }).from(split.chars, {
      yPercent: 110,
      rotateX: -40,
      opacity: 0,
      duration: 0.9,
      stagger: { each: 0.025, from: 'start' },
    })
    if (fades.length) tl.from(fades, { y: 24, opacity: 0, duration: 0.7, stagger: 0.12 }, '-=0.4')
    add(() => {
      tl.kill()
      split.revert()
    })
  },

  scroll({ gsap, SplitText, add }) {
    // Manifesto: words light up one by one while the block scrolls through.
    const manifesto = document.querySelector<HTMLElement>('.v2-manifesto')
    if (manifesto) {
      const ms = new SplitText(manifesto, { type: 'words', wordsClass: 'v2-w' })
      gsap.to(ms.words, {
        color: 'var(--dm-ink)',
        stagger: 0.08,
        ease: 'none',
        scrollTrigger: { trigger: manifesto, start: 'top 75%', end: 'bottom 45%', scrub: true },
      })
      add(() => ms.revert())
    }

    // Pinned class strip: slides until the last card sits inside the same inset the first one started at.
    const stage = document.querySelector<HTMLElement>('.dm-pin-stage')
    const track = stage?.querySelector<HTMLElement>('.dm-pin-track')
    if (stage && track) {
      const inset = () => {
        const parent = track.parentElement as HTMLElement
        return parent.getBoundingClientRect().left + parseFloat(getComputedStyle(parent).paddingLeft)
      }
      const shift = () => Math.max(0, inset() * 2 + track.scrollWidth - window.innerWidth)
      const slide = gsap.to(track, {
        x: () => -shift(),
        ease: 'none',
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => `+=${shift()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
      q('li', track).forEach((card) => {
        const img = card.querySelector('img')
        if (!img) return
        gsap.fromTo(
          img,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: slide,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        )
      })
    }

    // Coach photo wipes in, the copy beside it follows.
    const block = document.querySelector<HTMLElement>('.v2-reveal')
    const wipe = block?.querySelector<HTMLElement>('.v2-wipe')
    if (block && wipe) {
      gsap
        .timeline({ scrollTrigger: { trigger: block, start: 'top 70%' } })
        .to(wipe, { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power4.inOut' })
        .to(wipe.querySelector('img'), { scale: 1, duration: 1.6, ease: 'power3.out' }, 0)
        .from(
          q('.v2-reveal-copy > *', block),
          { y: 24, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out' },
          '-=1',
        )
    }
  },
}
