/**
 * Fictional business used by the Booking Website demo (Post 0).
 * Everything here is sample content; the booking flow itself is real.
 */

export const nova = {
  name: 'Nova Studio',
  tagline: 'Appointments made simple.',
  blurb:
    'A wellness and beauty studio in Chennai. Pick a service, choose a time, and we will see you there. No calls, no waiting.',
  area: 'Anna Nagar, Chennai',
  address: '2nd Floor, 14 Shanthi Colony Main Rd, Anna Nagar, Chennai 600040',
  mapsUrl: 'https://maps.google.com/?q=Anna+Nagar+Chennai',
  rating: '4.9',
  reviews: 212,
  phoneDisplay: '+91 98xxx xxxxx',
  hours: { open: 10, close: 20 }, // 10:00 to 20:00 IST
  slotMinutes: 30,
  closedWeekday: 2, // Tuesday (0 = Sunday)
  bookingWindowDays: 14,
} as const

export type NovaService = {
  slug: string
  name: string
  minutes: number
  price: number
  line: string
  tone: 'teal' | 'rose' | 'amber' | 'violet'
}

export const novaServices: readonly NovaService[] = [
  {
    slug: 'signature-facial',
    name: 'Signature Facial',
    minutes: 60,
    price: 1499,
    line: 'Deep cleanse, exfoliation and a hydrating mask tailored to your skin.',
    tone: 'rose',
  },
  {
    slug: 'deep-tissue-massage',
    name: 'Deep Tissue Massage',
    minutes: 60,
    price: 1999,
    line: 'Firm, focused pressure for tight shoulders, back and legs.',
    tone: 'teal',
  },
  {
    slug: 'hair-spa',
    name: 'Hair Spa',
    minutes: 45,
    price: 999,
    line: 'Scalp massage, nourishing treatment and blow dry.',
    tone: 'amber',
  },
  {
    slug: 'skin-consultation',
    name: 'Skin Consultation',
    minutes: 30,
    price: 499,
    line: 'A one-to-one skin assessment with a personalised care plan.',
    tone: 'violet',
  },
]

export const novaServiceBySlug = (slug: string) => novaServices.find((s) => s.slug === slug)

export const novaSteps = [
  { n: '1', title: 'Choose a service', line: 'Pick what you need and see the duration and price upfront.' },
  { n: '2', title: 'Pick a date and time', line: 'Only free slots are shown, updated live.' },
  {
    n: '3',
    title: 'Confirm on WhatsApp',
    line: 'Your booking summary arrives instantly. The studio gets it too.',
  },
] as const

export const novaTestimonials = [
  { quote: 'Booked at 11 pm from my couch. Slot confirmed before I put the phone down.', name: 'Priya R.' },
  { quote: 'No more calling three times to find a free slot. I just pick one.', name: 'Karthik M.' },
  { quote: 'The reminder on WhatsApp saved me from missing my appointment.', name: 'Divya S.' },
] as const

export const demoNotice = {
  label: 'Concept demo by KAPOSA FUTEXI',
  cta: 'Want a booking website like this?',
  href: '/contact?type=booking',
  caseStudyHref: '/demos/booking',
} as const
