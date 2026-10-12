/** Services page. Source: docs/content-lock.md §3. */

export const servicesPage = {
  heading: 'Digital Solutions Built Around Your Business',
  sub: 'Pick what you need today. Add more as you grow.',
} as const

export const services = [
  {
    id: 'business-websites',
    icon: 'globe',
    title: 'Business Websites',
    outcome: 'Look professional online and get found on Google.',
    included: [
      'Home, About, Services, Gallery, Contact',
      'WhatsApp button',
      'Google Maps',
      'Mobile-first design',
      'SEO-ready structure',
    ],
    goodFor: 'Salons, clinics, studios, shops, service businesses.',
    contactType: 'website',
  },
  {
    id: 'landing-pages',
    icon: 'megaphone',
    title: 'Landing Pages',
    outcome: 'Turn Instagram and ad traffic into enquiries.',
    included: [
      'One focused page',
      'Strong call to action',
      'Enquiry form to WhatsApp',
      'Fast loading',
      'Campaign tracking',
    ],
    goodFor: 'Offers, launches, lead campaigns.',
    contactType: 'landing',
  },
  {
    id: 'booking-websites',
    icon: 'calendar',
    title: 'Booking Websites',
    outcome: 'Accept bookings online, day and night.',
    included: [
      'Service selection',
      'Date and time picker',
      'Customer details',
      'Confirmation on WhatsApp',
      'Admin view of bookings',
    ],
    goodFor: 'Salons, clinics, tutors, consultants, studios.',
    contactType: 'booking',
  },
  {
    id: 'ai',
    icon: 'bot',
    title: 'AI Solutions',
    outcome: 'Answer customer questions 24/7 and qualify leads automatically.',
    included: [
      'AI chat assistant',
      'Smart FAQ',
      'Lead qualification',
      'Smart recommendations',
      'AI content support',
    ],
    goodFor: 'Any business that gets the same questions every day.',
    contactType: 'ai',
  },
  {
    id: 'automation',
    icon: 'workflow',
    title: 'Automation',
    outcome: 'Stop doing repetitive work by hand.',
    included: [
      'Enquiry to WhatsApp and email',
      'Follow-up reminders',
      'CRM or Google Sheets sync',
      'Notification flows',
    ],
    goodFor: 'Businesses handling many enquiries.',
    contactType: 'automation',
  },
  {
    id: 'custom-software',
    icon: 'code',
    title: 'Custom Software & Apps',
    outcome: 'Software built around how your business runs.',
    included: [
      'Web applications',
      'Dashboards',
      'Mobile apps (React Native)',
      'Internal tools',
      'SaaS products',
    ],
    goodFor: 'Growing businesses and startups.',
    contactType: 'software',
  },
] as const
