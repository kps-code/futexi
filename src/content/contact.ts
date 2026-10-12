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

export type NeedOption = (typeof needOptions)[number]
export type BudgetOption = (typeof budgetOptions)[number]
