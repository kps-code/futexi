import { describe, expect, it } from 'vitest'
import { bestFaq, scriptedReply } from '@/server/assistant/fallback'
import { defaultKnowledgeInput } from '@/server/assistant/knowledge'

describe('assistant scripted fallback', () => {
  const input = defaultKnowledgeInput()

  it('answers price questions with the admin price text and a WhatsApp link', () => {
    const reply = scriptedReply(input, 'How much does a website cost?')
    expect(reply.intent).toBe('price')
    expect(reply.text).toContain('Projects start from ₹5,000')
    expect(reply.text).not.toContain('{price}')
    expect(reply.text).toContain('https://wa.me/918883673422')
    expect(scriptedReply(input, 'evlo aagum?').intent).toBe('price')
  })

  it('answers timeline questions from the FAQ', () => {
    const reply = scriptedReply(input, 'How long will it take?')
    expect(reply.intent).toBe('timeline')
    const faq = input.faqs.find((f) => /long/i.test(f.question))
    expect(faq).toBeDefined()
    expect(reply.text).toContain(faq!.answer.slice(0, 30))
  })

  it('gives contact details when asked how to reach us', () => {
    const reply = scriptedReply(input, 'Can I call you?')
    expect(reply.intent).toBe('contact')
    expect(reply.text).toContain('+91 88836 73422')
    expect(reply.text).toContain(input.settings.email)
  })

  it('matches the closest FAQ when the words overlap enough', () => {
    const faqs = [
      { question: 'Do you build mobile apps?', answer: 'Not yet, web only.' },
      { question: 'Can you redesign my existing website?', answer: 'Yes, we redesign.' },
    ]
    expect(bestFaq(faqs, 'can you redesign my old website')?.answer).toBe('Yes, we redesign.')
    expect(bestFaq(faqs, 'do you build apps')?.answer).toBe('Not yet, web only.')
    expect(bestFaq(faqs, 'tell me a joke')).toBeUndefined()
  })

  it('falls back to a WhatsApp nudge when nothing matches', () => {
    const reply = scriptedReply(input, 'xyzzy plugh')
    expect(reply.intent).toBe('none')
    expect(reply.text).toContain('/contact')
    expect(reply.text).toContain(input.settings.replyTimeText)
  })
})
