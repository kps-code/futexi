/**
 * Fictional businesses behind the live demos. Sample content only; the
 * booking flow, leads and admin views are real.
 */

export type DemoService = {
  slug: string
  name: string
  minutes: number
  /** 0 hides the price (restaurant tables). */
  price: number
  line: string
  tone: 'teal' | 'rose' | 'amber' | 'violet' | 'lime' | 'sky'
  category?: string
}

export type DemoBusinessId = 'booking' | 'salon' | 'restaurant' | 'ai-business' | 'interior' | 'tuition'

export type DemoBusiness = {
  id: DemoBusinessId
  path: string
  bookPath?: string
  theme: string
  name: string
  logoLetter: string
  tagline: string
  blurb: string
  area: string
  address: string
  mapsUrl: string
  rating: string
  reviews: number
  hours: { open: number; close: number }
  hoursText: readonly string[]
  slotMinutes: number
  closedWeekday?: number
  windowDays: number
  services: readonly DemoService[]
  nav: readonly { label: string; href: string }[]
  ctaLabel: string
  bookingNoun: string
  showPrice: boolean
  contactType: string
  whatsappIntro: string
}

export const demoNotice = {
  label: 'Concept demo by KAPOSA FUTEXI',
  cta: 'Want a website like this?',
} as const

export const nova: DemoBusiness = {
  id: 'booking',
  path: '/demo/booking',
  bookPath: '/demo/booking/book',
  theme: 'theme-nova',
  name: 'Nova Studio',
  logoLetter: 'N',
  tagline: 'Appointments made simple.',
  blurb:
    'A wellness and beauty studio in Chennai. Pick a service, choose a time, and we will see you there. No calls, no waiting.',
  area: 'Anna Nagar, Chennai',
  address: '2nd Floor, 14 Shanthi Colony Main Rd, Anna Nagar, Chennai 600040',
  mapsUrl: 'https://maps.google.com/?q=Anna+Nagar+Chennai',
  rating: '4.9',
  reviews: 212,
  hours: { open: 10, close: 20 },
  hoursText: ['Mon, Wed to Sun · 10:00 AM to 8:00 PM', 'Tuesday · Closed'],
  slotMinutes: 30,
  closedWeekday: 2,
  windowDays: 14,
  services: [
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
  ],
  nav: [
    { label: 'Services', href: '/demo/booking#services' },
    { label: 'How it works', href: '/demo/booking#how' },
    { label: 'Visit', href: '/demo/booking#visit' },
  ],
  ctaLabel: 'Book now',
  bookingNoun: 'appointment',
  showPrice: true,
  contactType: 'booking',
  whatsappIntro: 'Booking request (Nova Studio demo)',
}

export const velvet: DemoBusiness = {
  id: 'salon',
  path: '/demo/salon',
  bookPath: '/demo/salon/book',
  theme: 'theme-velvet',
  name: 'Velvet Salon',
  logoLetter: 'V',
  tagline: 'Hair, skin and nails. Done beautifully.',
  blurb:
    'A boutique unisex salon in T. Nagar. Expert stylists, honest prices, and online booking so you never wait for a chair.',
  area: 'T. Nagar, Chennai',
  address: '27 Usman Road, T. Nagar, Chennai 600017',
  mapsUrl: 'https://maps.google.com/?q=T+Nagar+Chennai',
  rating: '4.8',
  reviews: 486,
  hours: { open: 9, close: 21 },
  hoursText: ['Tue to Sun · 9:00 AM to 9:00 PM', 'Monday · Closed'],
  slotMinutes: 30,
  closedWeekday: 1,
  windowDays: 14,
  services: [
    {
      slug: 'velvet-haircut',
      name: 'Haircut & Style',
      minutes: 45,
      price: 599,
      line: 'Consultation, wash, precision cut and blow dry.',
      tone: 'rose',
      category: 'Hair',
    },
    {
      slug: 'velvet-colour',
      name: 'Hair Colour',
      minutes: 120,
      price: 2499,
      line: 'Global colour, highlights or balayage with ammonia-free options.',
      tone: 'violet',
      category: 'Hair',
    },
    {
      slug: 'velvet-keratin',
      name: 'Keratin Treatment',
      minutes: 150,
      price: 4999,
      line: 'Smooth, frizz-free hair for up to four months.',
      tone: 'amber',
      category: 'Hair',
    },
    {
      slug: 'velvet-facial',
      name: 'Glow Facial',
      minutes: 60,
      price: 1299,
      line: 'Cleanse, exfoliate, massage and mask for an instant glow.',
      tone: 'teal',
      category: 'Skin',
    },
    {
      slug: 'velvet-mani-pedi',
      name: 'Manicure & Pedicure',
      minutes: 75,
      price: 1099,
      line: 'Shaping, cuticle care, scrub and polish.',
      tone: 'sky',
      category: 'Nails',
    },
    {
      slug: 'velvet-bridal',
      name: 'Bridal Makeup Trial',
      minutes: 90,
      price: 2999,
      line: 'HD makeup trial with hairstyle to lock your bridal look.',
      tone: 'rose',
      category: 'Makeup',
    },
  ],
  nav: [
    { label: 'Services', href: '/demo/salon#services' },
    { label: 'Gallery', href: '/demo/salon#gallery' },
    { label: 'Team', href: '/demo/salon#team' },
    { label: 'Visit', href: '/demo/salon#visit' },
  ],
  ctaLabel: 'Book an appointment',
  bookingNoun: 'appointment',
  showPrice: true,
  contactType: 'website',
  whatsappIntro: 'Appointment request (Velvet Salon demo)',
}

export const saffron: DemoBusiness = {
  id: 'restaurant',
  path: '/demo/restaurant',
  bookPath: '/demo/restaurant/reserve',
  theme: 'theme-saffron',
  name: 'Saffron Kitchen',
  logoLetter: 'S',
  tagline: 'Modern South Indian, cooked over fire.',
  blurb:
    'Family recipes from the Chettinad coast, plated for today. Reserve a table online and skip the wait at the door.',
  area: 'Adyar, Chennai',
  address: '8 Lattice Bridge Road, Adyar, Chennai 600020',
  mapsUrl: 'https://maps.google.com/?q=Adyar+Chennai',
  rating: '4.7',
  reviews: 1320,
  hours: { open: 12, close: 23 },
  hoursText: ['Every day · 12:00 PM to 11:00 PM', 'Kitchen closes 10:30 PM'],
  slotMinutes: 30,
  windowDays: 14,
  services: [
    {
      slug: 'table-2',
      name: 'Table for 2',
      minutes: 90,
      price: 0,
      line: 'Window or courtyard seating.',
      tone: 'amber',
    },
    {
      slug: 'table-4',
      name: 'Table for 4',
      minutes: 90,
      price: 0,
      line: 'Our most popular table.',
      tone: 'amber',
    },
    {
      slug: 'table-6',
      name: 'Table for 6',
      minutes: 120,
      price: 0,
      line: 'Family table near the open kitchen.',
      tone: 'amber',
    },
    {
      slug: 'table-8',
      name: 'Table for 8 or more',
      minutes: 120,
      price: 0,
      line: 'Private alcove. We will call to confirm.',
      tone: 'amber',
    },
  ],
  nav: [
    { label: 'Menu', href: '/demo/restaurant#menu' },
    { label: 'Offers', href: '/demo/restaurant#offers' },
    { label: 'About', href: '/demo/restaurant#about' },
    { label: 'Visit', href: '/demo/restaurant#visit' },
  ],
  ctaLabel: 'Reserve a table',
  bookingNoun: 'reservation',
  showPrice: false,
  contactType: 'website',
  whatsappIntro: 'Table reservation (Saffron Kitchen demo)',
}

export const pulse: DemoBusiness = {
  id: 'ai-business',
  path: '/demo/ai-business',
  theme: 'theme-pulse',
  name: 'Pulse Fitness',
  logoLetter: 'P',
  tagline: 'Train smarter. Ask anything, any time.',
  blurb:
    'A modern fitness studio in Velachery with an AI assistant that answers questions, books free trials and hands you to a coach on WhatsApp.',
  area: 'Velachery, Chennai',
  address: '3rd Floor, Phoenix Mall Road, Velachery, Chennai 600042',
  mapsUrl: 'https://maps.google.com/?q=Velachery+Chennai',
  rating: '4.9',
  reviews: 640,
  hours: { open: 5, close: 23 },
  hoursText: ['Mon to Sat · 5:30 AM to 10:30 PM', 'Sunday · 7:00 AM to 1:00 PM'],
  slotMinutes: 60,
  windowDays: 14,
  services: [
    {
      slug: 'pulse-monthly',
      name: 'Monthly',
      minutes: 0,
      price: 1999,
      line: 'All classes, all equipment, no lock-in.',
      tone: 'lime',
    },
    {
      slug: 'pulse-quarterly',
      name: 'Quarterly',
      minutes: 0,
      price: 4999,
      line: 'Save 17%. Includes one coach session.',
      tone: 'lime',
    },
    {
      slug: 'pulse-annual',
      name: 'Annual',
      minutes: 0,
      price: 14999,
      line: 'Best value. Four coach sessions and a body scan.',
      tone: 'lime',
    },
  ],
  nav: [
    { label: 'Plans', href: '/demo/ai-business#plans' },
    { label: 'Classes', href: '/demo/ai-business#classes' },
    { label: 'FAQ', href: '/demo/ai-business#faq' },
    { label: 'Visit', href: '/demo/ai-business#visit' },
  ],
  ctaLabel: 'Book a free trial',
  bookingNoun: 'trial',
  showPrice: true,
  contactType: 'ai',
  whatsappIntro: 'Free trial request (Pulse Fitness demo)',
}

export const nila: DemoBusiness = {
  id: 'interior',
  path: '/demo/interior',
  theme: 'theme-nila',
  name: 'Atelier Nila',
  logoLetter: 'A',
  tagline: 'Interiors that feel like you.',
  blurb:
    'A Chennai interior design studio for homes, offices and cafes. We design, we build with our own team, and we hand over on the date we promised.',
  area: 'Nungambakkam, Chennai',
  address: '11 Khader Nawaz Khan Road, Nungambakkam, Chennai 600006',
  mapsUrl: 'https://maps.google.com/?q=Nungambakkam+Chennai',
  rating: '4.9',
  reviews: 87,
  hours: { open: 10, close: 19 },
  hoursText: ['Mon to Sat · 10:00 AM to 7:00 PM', 'Studio visits by appointment'],
  slotMinutes: 60,
  windowDays: 14,
  services: [
    {
      slug: 'nila-residential',
      name: 'Residential Interiors',
      minutes: 0,
      price: 0,
      line: 'Apartments and villas, from a single room to a full home.',
      tone: 'teal',
    },
    {
      slug: 'nila-kitchen',
      name: 'Modular Kitchens',
      minutes: 0,
      price: 0,
      line: 'Designed around how you cook, built in our own workshop.',
      tone: 'amber',
    },
    {
      slug: 'nila-office',
      name: 'Office Interiors',
      minutes: 0,
      price: 0,
      line: 'Workplaces that people want to show up to.',
      tone: 'sky',
    },
    {
      slug: 'nila-turnkey',
      name: 'Turnkey Renovation',
      minutes: 0,
      price: 0,
      line: 'Civil, electrical, carpentry and styling under one contract.',
      tone: 'rose',
    },
  ],
  nav: [
    { label: 'Projects', href: '/demo/interior#projects' },
    { label: 'Services', href: '/demo/interior#services' },
    { label: 'Studio', href: '/demo/interior#studio' },
    { label: 'Contact', href: '/demo/interior#enquire' },
  ],
  ctaLabel: 'Start a project',
  bookingNoun: 'enquiry',
  showPrice: false,
  contactType: 'website',
  whatsappIntro: 'Project enquiry (Atelier Nila demo)',
}

export const vidya: DemoBusiness = {
  id: 'tuition',
  path: '/demo/tuition',
  theme: 'theme-vidya',
  name: 'Vidya Academy',
  logoLetter: 'V',
  tagline: 'Small batches. Big results.',
  blurb:
    'Coaching for Classes 8 to 12, NEET and JEE foundation in Chromepet. Fifteen students per batch, weekly tests, and progress reports parents actually read.',
  area: 'Chromepet, Chennai',
  address: '45 GST Road, Chromepet, Chennai 600044',
  mapsUrl: 'https://maps.google.com/?q=Chromepet+Chennai',
  rating: '4.8',
  reviews: 312,
  hours: { open: 7, close: 20 },
  hoursText: ['Mon to Sat · 7:00 AM to 8:00 PM', 'Sunday · 9:00 AM to 6:00 PM (foundation batches)'],
  slotMinutes: 60,
  windowDays: 14,
  services: [
    {
      slug: 'vidya-class10',
      name: 'Class 10 · Maths & Science',
      minutes: 0,
      price: 2500,
      line: 'CBSE and State board. Board exam pattern from day one.',
      tone: 'sky',
      category: 'School',
    },
    {
      slug: 'vidya-pcm',
      name: 'Class 11 & 12 · PCM',
      minutes: 0,
      price: 3500,
      line: 'Physics, Chemistry, Maths with JEE-level problem sets.',
      tone: 'violet',
      category: 'School',
    },
    {
      slug: 'vidya-pcb',
      name: 'Class 11 & 12 · PCB',
      minutes: 0,
      price: 3500,
      line: 'Physics, Chemistry, Biology with NEET-style tests.',
      tone: 'teal',
      category: 'School',
    },
    {
      slug: 'vidya-neet',
      name: 'NEET Foundation',
      minutes: 0,
      price: 4500,
      line: 'Weekend batch. Full syllabus, 40 mock tests a year.',
      tone: 'rose',
      category: 'Entrance',
    },
    {
      slug: 'vidya-jee',
      name: 'JEE Foundation',
      minutes: 0,
      price: 4500,
      line: 'Weekend batch. Concepts first, then speed.',
      tone: 'amber',
      category: 'Entrance',
    },
    {
      slug: 'vidya-english',
      name: 'Spoken English',
      minutes: 0,
      price: 1500,
      line: 'Early morning batch for students and working adults.',
      tone: 'lime',
      category: 'Skills',
    },
  ],
  nav: [
    { label: 'Courses', href: '/demo/tuition#services' },
    { label: 'Batches', href: '/demo/tuition#batches' },
    { label: 'Faculty', href: '/demo/tuition#faculty' },
    { label: 'Results', href: '/demo/tuition#results' },
    { label: 'Enquire', href: '/demo/tuition#enquire' },
  ],
  ctaLabel: 'Enquire now',
  bookingNoun: 'enquiry',
  showPrice: true,
  contactType: 'website',
  whatsappIntro: 'Admission enquiry (Vidya Academy demo)',
}

export const demoBusinesses: readonly DemoBusiness[] = [nova, velvet, saffron, pulse, nila, vidya]

/** Businesses whose forms create leads (enquiries) rather than bookings. */
export const enquiryBusinessIds = ['ai-business', 'interior', 'tuition'] as const
export type EnquiryBusinessId = (typeof enquiryBusinessIds)[number]
export const bookableBusinesses = demoBusinesses.filter((b) => b.bookPath)

export const businessById = (id: string) => demoBusinesses.find((b) => b.id === id)
export const serviceOf = (b: DemoBusiness, slug: string) => b.services.find((s) => s.slug === slug)

/** Every bookable service slug across businesses, for the admin select. */
export const allBookableServices = bookableBusinesses.flatMap((b) =>
  b.services.map((s) => ({ label: `${b.name} · ${s.name}`, value: s.slug })),
)
