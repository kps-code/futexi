import { describe, expect, it } from 'vitest'
import { escapeHtml, feedbackEmail, leadEmail } from '@/server/email/notify'

const lead = {
  id: 2,
  createdAt: new Date('2026-10-27T10:12:00Z'),
  siteUrl: 'https://futexi.vercel.app',
  name: 'Ramajeyam',
  email: 'kpram@gmail.com',
  whatsapp: '7373359557',
  businessType: 'Interior',
  need: 'Landing Page',
  budget: '₹10,000 to ₹25,000',
  details: 'I want a instant demo',
  source: { referrer: 'https://www.google.com/', landingPath: '/demos/interior' },
}

describe('lead notification email', () => {
  it('carries the lead, the quick actions and the admin link', () => {
    const mail = leadEmail(lead)
    expect(mail.subject).toBe('New lead: Ramajeyam · Landing Page')
    expect(mail.html).toContain('https://wa.me/917373359557?text=')
    expect(mail.html).toContain('tel:+917373359557')
    expect(mail.html).toContain('mailto:kpram@gmail.com')
    expect(mail.html).toContain('+91 73733 59557')
    expect(mail.html).toContain('google.com → /demos/interior → Contact')
    expect(mail.html).toContain('https://futexi.vercel.app/admin/collections/leads/2')
    expect(mail.html).toContain('Lead #2 · 27 Oct 2026')
    expect(mail.text).toContain('Need: Landing Page')
    expect(mail.text).toContain('Open in admin →: https://futexi.vercel.app/admin/collections/leads/2')
  })

  it('marks missing fields instead of printing a dash', () => {
    const mail = leadEmail({
      ...lead,
      businessType: undefined,
      budget: undefined,
      details: undefined,
      source: undefined,
    })
    expect(mail.html).toContain('Not given')
    expect(mail.html).toContain('No message left.')
    expect(mail.html).toContain('Direct → Contact')
  })

  it('escapes user text so markup never reaches the HTML', () => {
    const mail = leadEmail({ ...lead, name: '<b>Bad</b>', details: '<script>alert(1)</script> & "quotes"' })
    expect(mail.html).not.toContain('<script>')
    expect(mail.html).not.toContain('<b>Bad</b>')
    expect(mail.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt; &amp; &quot;quotes&quot;')
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;')
  })
})

describe('feedback notification email', () => {
  it('shows the stars, the quote and the review link', () => {
    const mail = feedbackEmail({
      id: 7,
      siteUrl: 'https://futexi.vercel.app',
      name: 'Priya',
      business: 'Velvet Salon',
      rating: 4,
      quote: 'Great work.',
    })
    expect(mail.subject).toBe('New feedback: Priya · Velvet Salon · 4/5')
    expect(mail.html).toContain('★★★★☆ 4/5')
    expect(mail.html).toContain('Great work.')
    expect(mail.html).toContain('https://futexi.vercel.app/admin/collections/testimonials/7')
    expect(mail.text).toContain('Rating: 4 / 5')
  })
})
