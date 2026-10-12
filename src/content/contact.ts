/** Contact form options. Source: docs/content-lock.md §7. Shared by the form, the server action and the Leads collection. */

export const needOptions = [
  'Website',
  'Landing Page',
  'Booking Website',
  'AI Integration',
  'Automation',
  'Web Application',
  'Mobile App',
  'Custom Software',
  'Other',
] as const

export const budgetOptions = [
  'Under ₹10,000',
  '₹10,000 to ₹25,000',
  '₹25,000 to ₹50,000',
  'Above ₹50,000',
  'Not sure yet',
] as const

export const leadStatuses = ['new', 'contacted', 'quoted', 'won', 'lost'] as const

/** `?type=` values the contact form understands; each pre-selects a "What do you need?" option. */
export const contactTypes = [
  { value: 'website', label: 'Website' },
  { value: 'landing', label: 'Landing Page' },
  { value: 'booking', label: 'Booking Website' },
  { value: 'ai', label: 'AI Integration' },
  { value: 'automation', label: 'Automation' },
  { value: 'app', label: 'Mobile App' },
  { value: 'software', label: 'Custom Software' },
] as const

export type ContactType = (typeof contactTypes)[number]['value']

export type NeedOption = (typeof needOptions)[number]
export type BudgetOption = (typeof budgetOptions)[number]
