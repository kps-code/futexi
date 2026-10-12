/**
 * Scripted AI demo. Source: docs/content-lock.md §10. No live model at launch.
 * These are the seed and fallback values; the admin's "AI Assistant Demo" global overrides them.
 */

export type AiScriptItem = { chip: string; question: string; answer: string }

export const aiScript: readonly AiScriptItem[] = [
  {
    chip: 'Salon',
    question: 'I run a salon. What website do I need?',
    answer:
      'For a salon, we recommend a booking-focused website: services with prices, a gallery, your team, online appointment booking and a WhatsApp button. Customers can book in under a minute, even after hours.',
  },
  {
    chip: 'Restaurant',
    question: 'I have a restaurant. What should my website have?',
    answer:
      'A restaurant website should have a digital menu with categories, food photos, offers, a reservation form, Google Maps and WhatsApp. Customers see the menu and book a table without calling.',
  },
  {
    chip: 'Tuition Centre',
    question: 'I run a tuition centre. How can a website help?',
    answer:
      'A tuition centre website should list courses, class timings, faculty, results and student testimonials, with an enquiry form that reaches you on WhatsApp. Parents get answers before they call.',
  },
  {
    chip: 'Interior Designer',
    question: "I'm an interior designer. What do I need?",
    answer:
      'A portfolio website: a premium hero, featured projects, a project gallery with detail pages, your services and a contact form. Your work does the selling.',
  },
  {
    chip: 'Clinic',
    question: 'I have a clinic. What website works best?',
    answer:
      'A clinic website should show doctors, services, timings, location and an appointment booking form with WhatsApp confirmation. Patients book without waiting on a call.',
  },
]
