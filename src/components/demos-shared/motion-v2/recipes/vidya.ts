import { claim, q, type Recipe } from './shared'

/**
 * Vidya Academy: playful. Characters bounce in, badges pop, a marker draws
 * under the accent line, the hero photo and its stat card spring into place;
 * stat and course cards pop like stickers; the promise is typed onto a board;
 * batch cards land like sticky notes; faculty cards swing in like polaroids.
 */
export const recipe: Recipe = {
  intro({ gsap, SplitText, add }) {
    const words = q('.v2-hero .dm-word > span')
    const fades = q('.v2-hero .dm-fade-up').filter((el) => !el.classList.contains('v2-badges'))
    const badges = q('.v2-badges > span')
    const marker = document.querySelector<SVGPathElement>('.v2-marker path')
    const figure = document.querySelector<HTMLElement>('.v2-hero-figure')
    const card = document.querySelector<HTMLElement>('.v2-hero-card')
    if (!words.length) return
    claim([figure, card].filter((el): el is HTMLElement => Boolean(el)))
    const split = new SplitText(words, { type: 'chars', charsClass: 'v2-ch' })
    const tl = gsap.timeline()
    tl.from(
      split.chars,
      { yPercent: 100, opacity: 0, duration: 0.8, ease: 'back.out(1.7)', stagger: 0.03 },
      0,
    )
    if (badges.length)
      tl.from(
        badges,
        { scale: 0, rotation: -8, opacity: 0, duration: 0.6, ease: 'back.out(2)', stagger: 0.12 },
        0.2,
      )
    if (figure)
      tl.from(figure, { scale: 0.9, rotation: 3, opacity: 0, duration: 1, ease: 'back.out(1.5)' }, 0.3)
    if (fades.length)
      tl.from(fades, { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12 }, 0.8)
    if (marker) {
      const len = marker.getTotalLength()
      tl.fromTo(
        marker,
        { strokeDasharray: len, strokeDashoffset: len },
        { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' },
        1.1,
      )
    }
    if (card) tl.from(card, { scale: 0, rotation: -10, opacity: 0, duration: 0.7, ease: 'back.out(2)' }, 1.2)
    add(() => {
      tl.kill()
      split.revert()
    })
  },

  async scroll({ gsap }) {
    const pop = (els: Element[], trigger: string, vars: gsap.TweenVars) => {
      if (!els.length) return
      gsap.from(els, {
        ...vars,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger, start: 'top 80%' },
      })
    }

    // Stat cards pop; course cards drop in like stickers.
    pop(claim(q('.v2-stats .reveal')), '.v2-stats', {
      scale: 0.6,
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: 'back.out(1.8)',
      stagger: 0.1,
    })
    pop(claim(q('#services li.reveal')), '#services ul', {
      y: 90,
      rotation: (i: number) => (i % 2 ? 5 : -5),
      opacity: 0,
      duration: 0.9,
      ease: 'back.out(1.4)',
      stagger: 0.1,
    })

    // The promise is typed onto the board.
    const type = document.querySelector<HTMLElement>('.v2-type')
    if (type) {
      const { TextPlugin } = await import('gsap/TextPlugin')
      gsap.registerPlugin(TextPlugin)
      const full = type.textContent || ''
      type.textContent = ''
      type.classList.add('v2-typing')
      gsap.to(type, {
        text: { value: full },
        duration: Math.min(4, full.length * 0.035),
        ease: 'none',
        scrollTrigger: { trigger: type, start: 'top 75%' },
        onComplete: () => type.classList.remove('v2-typing'),
      })
    }

    // Batch cards land like sticky notes and keep a slight tilt.
    const notes = q('.dm-pin-track > li')
    if (notes.length) {
      gsap.fromTo(
        notes,
        { y: 70, rotation: (i: number) => [-6, 5, -5, 6][i % 4], opacity: 0 },
        {
          y: 0,
          rotation: (i: number) => [-1.5, 1, -1, 1.5][i % 4],
          opacity: 1,
          duration: 0.9,
          ease: 'back.out(1.6)',
          stagger: 0.12,
          scrollTrigger: { trigger: '.dm-pin-track', start: 'top 80%' },
        },
      )
    }

    // Faculty cards swing in like polaroids; toppers pop.
    pop(claim(q('#faculty li.reveal')), '#faculty ul', {
      rotation: (i: number) => (i % 2 ? 7 : -7),
      y: 70,
      opacity: 0,
      duration: 1.2,
      ease: 'elastic.out(1, 0.6)',
      stagger: 0.12,
    })
    pop(claim(q('#results li.reveal')), '#results ul', {
      scale: 0.7,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(2)',
      stagger: 0.1,
    })
  },
}
