/**
 * Source: docs/content-lock.md §9. `{price}` is replaced with the admin-editable starting price text.
 * Seed and fallback values; the admin's FAQ collection overrides them once it has entries.
 */
export const faq = [
  {
    q: 'How much does a website cost?',
    a: '{price}. A simple landing page costs less than a full business website with booking and AI. We send a clear quote after a short call.',
  },
  {
    q: 'How long does a website take?',
    a: 'A landing page in about a week. A business website in two to three weeks. Larger projects depend on scope.',
  },
  {
    q: 'Do you provide domain and hosting?',
    a: 'Yes. We can register your domain, set up hosting and handle deployment. You own everything.',
  },
  {
    q: 'Can you add WhatsApp?',
    a: 'Yes. WhatsApp buttons, enquiry forms that open WhatsApp, and automated notifications.',
  },
  {
    q: 'Can you integrate AI?',
    a: 'Yes. AI chat assistants, smart FAQ, lead qualification and content help, added when it makes sense for your business.',
  },
  {
    q: 'Can you redesign my existing website?',
    a: 'Yes. We rebuild it with a modern design, faster loading and a mobile-first layout.',
  },
  {
    q: 'Do you build custom software and apps?',
    a: 'Yes. Web applications, dashboards, mobile apps and internal tools.',
  },
  {
    q: 'Can you maintain the website after launch?',
    a: 'Yes. We offer updates, content changes and technical support after launch.',
  },
] as const

export const homeFaqCount = 5
