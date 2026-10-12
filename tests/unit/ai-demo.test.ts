import { describe, expect, it } from 'vitest'
import { detectIntent, initialState, isValidName, isValidPhone, respond } from '@/lib/ai-demo'

describe('detectIntent', () => {
  it('maps common questions to intents', () => {
    expect(detectIntent('How much is the monthly plan?')).toBe('plans')
    expect(detectIntent('what time do you open on sunday')).toBe('timings')
    expect(detectIntent('Do you have zumba?')).toBe('classes')
    expect(detectIntent('Where are you located')).toBe('location')
    expect(detectIntent('I want a free trial')).toBe('trial')
    expect(detectIntent('is there parking for my bike')).toBe('parking')
    expect(detectIntent('women only hours?')).toBe('women')
    expect(detectIntent('can I cancel anytime')).toBe('cancel')
    expect(detectIntent('hello')).toBe('greeting')
    expect(detectIntent('???')).toBe('unknown')
  })
  it('prefers trial over plans when both appear', () => {
    expect(detectIntent('what is the price and can I try a free day')).toBe('trial')
  })
})

describe('validators', () => {
  it('accepts real names and rejects junk', () => {
    expect(isValidName('Sankar K')).toBe(true)
    expect(isValidName('Priya')).toBe(true)
    expect(isValidName('9876543210')).toBe(false)
    expect(isValidName('x')).toBe(false)
  })
  it('accepts Indian phone formats', () => {
    expect(isValidPhone('98765 43210')).toBe(true)
    expect(isValidPhone('+91 98765 43210')).toBe(true)
    expect(isValidPhone('12345')).toBe(false)
  })
})

describe('lead capture conversation', () => {
  it('answers, then captures name and phone, then relaxes', () => {
    let r = respond(initialState, 'What are your timings?')
    expect(r.state.stage).toBe('chat')
    expect(r.messages[1].text).toMatch(/5:30 AM/)
    expect(r.captured).toBeUndefined()

    r = respond(r.state, 'Book a free trial')
    expect(r.state.stage).toBe('ask-name')
    expect(r.messages[1].text).toMatch(/What is your name/)

    r = respond(r.state, 'where is the gym?')
    expect(r.state.stage).toBe('ask-name')
    expect(r.messages[1].text).toMatch(/Velachery/)
    expect(r.messages[1].text).toMatch(/your name/)

    r = respond(r.state, 'Priya Raman')
    expect(r.state.stage).toBe('ask-phone')
    expect(r.messages[1].text).toMatch(/Priya/)

    r = respond(r.state, 'abc')
    expect(r.state.stage).toBe('ask-phone')

    r = respond(r.state, '98765 43210')
    expect(r.state.stage).toBe('done')
    expect(r.captured).toEqual({ name: 'Priya Raman', phone: '98765 43210', interest: 'Free trial' })

    const after = respond(r.state, 'book a free trial')
    expect(after.state.stage).toBe('done')
    expect(after.captured).toBeUndefined()
  })
})
