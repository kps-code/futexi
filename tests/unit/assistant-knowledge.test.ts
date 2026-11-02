import { describe, expect, it } from 'vitest'
import {
  ASSISTANT_DEFAULT_NAME,
  buildKnowledge,
  defaultKnowledgeInput,
  QUOTE_FORM_TOKEN,
} from '@/server/assistant/knowledge'

describe('assistant knowledge sheet', () => {
  const base = defaultKnowledgeInput()

  it('is built from the site content with the starting price filled in', () => {
    const sheet = buildKnowledge(base)
    expect(sheet).toContain('Projects start from ₹5,000')
    expect(sheet).not.toContain('{price}')
    expect(sheet).toContain('## Business Websites')
    expect(sheet).toContain('Q: How long does a website take?')
    expect(sheet).toContain('https://wa.me/918883673422')
    expect(sheet).toContain('+91 88836 73422')
    expect(sheet).toContain(`You are ${ASSISTANT_DEFAULT_NAME}`)
    expect(sheet).toContain(QUOTE_FORM_TOKEN)
  })

  it('lists live demos with their links and names the coming-soon ones separately', () => {
    const sheet = buildKnowledge(base)
    expect(sheet).toContain('Live demo: /demo/salon. Case study: /demos/salon.')
    expect(sheet).toContain('Coming soon: Before and After.')
    expect(sheet).not.toContain('Live demo: /demos/before-after')
  })

  it('honours the admin values: price text, name, FAQ, hidden demos and extra notes', () => {
    const sheet = buildKnowledge({
      ...base,
      assistantName: 'Futexi Guide',
      settings: { ...base.settings, startingPriceText: 'Websites from ₹9,999' },
      faqs: [{ question: 'Do you work on weekends?', answer: 'Yes, by appointment. {price}.' }],
      demos: base.demos.filter((d) => d.slug !== 'salon'),
      extraNotes: 'Diwali offer: 10% off until 5 Nov.',
    })
    expect(sheet).toContain('You are Futexi Guide')
    expect(sheet).toContain('A: Yes, by appointment. Websites from ₹9,999.')
    expect(sheet).not.toContain('How long does a website take?')
    expect(sheet).not.toContain('/demo/salon')
    expect(sheet).toContain('# Notes from the team')
    expect(sheet).toContain('Diwali offer: 10% off until 5 Nov.')
  })

  it('leaves out the notes section when the admin wrote nothing', () => {
    expect(buildKnowledge({ ...base, extraNotes: '   ' })).not.toContain('# Notes from the team')
  })

  it('stays small enough to send with every message', () => {
    expect(buildKnowledge(base).length).toBeLessThan(10_000)
  })
})

describe('assistant knowledge sheet: who we are', () => {
  const base = defaultKnowledgeInput()

  it('describes what the company does without names or a head count', () => {
    const sheet = buildKnowledge(base)
    expect(sheet).toContain('is a web and AI agency in Chennai, Tamil Nadu. ')
    expect(sheet).not.toMatch(/-person/)
    expect(sheet).not.toContain('run by')
    expect(sheet).not.toContain('Sankar')
    expect(sheet).toContain('never give names or a head count')
    expect(sheet).toContain('process, timelines and contact.')
  })
})
