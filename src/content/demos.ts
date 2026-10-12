/** Demo catalogue and case-study content. Source: docs/content-lock.md §4 and §5. */

export const demoCategories = ['All', 'Business', 'Booking', 'Food', 'Creative', 'Education', 'AI'] as const
export type DemoCategory = Exclude<(typeof demoCategories)[number], 'All'>

export type Demo = {
  slug: string
  post: number
  title: string
  category: DemoCategory | 'All'
  line: string
  tags: readonly string[]
  cta: string
  contactType: string
  status: 'live' | 'coming-soon'
  /** Path of the working mini website, when live. */
  liveHref?: string
  challenge: string
  solution: readonly string[]
  features: readonly string[]
  flow?: readonly string[]
  automation: string
  technology: readonly string[]
  outcomes: readonly string[]
  /** Accent used for the CSS preview frame. */
  accent: 'violet' | 'cyan' | 'amber' | 'rose' | 'emerald' | 'sky' | 'indigo'
}

export const demos: readonly Demo[] = [
  {
    slug: 'booking',
    post: 0,
    title: 'Booking Website',
    category: 'Booking',
    line: 'A modern appointment experience that turns visitors into scheduled customers.',
    tags: ['Booking', 'WhatsApp', 'Responsive'],
    cta: 'Request a Similar Website',
    contactType: 'booking',
    status: 'coming-soon',
    challenge:
      'Customers struggle to check availability and book appointments. Calls go unanswered, WhatsApp messages pile up, and bookings get missed.',
    solution: [
      'Online booking in five steps',
      'Live availability',
      'Service selection with duration and price',
      'WhatsApp confirmation',
      'Booking summary for the owner',
      'Fully responsive',
    ],
    features: [
      'Service Selection',
      'Date Picker',
      'Time Slots',
      'Customer Details',
      'WhatsApp Confirmation',
      'Mobile Responsive',
    ],
    flow: ['Choose Service', 'Choose Date', 'Choose Time', 'Enter Details', 'Confirm Booking'],
    automation:
      'Confirmation sent to WhatsApp. Reminder before the appointment. An AI assistant can answer "which service do I need?".',
    technology: ['Next.js', 'TypeScript', 'Tailwind', 'PostgreSQL'],
    outcomes: ['Bookings arrive while you work', 'Fewer missed calls', 'Customers book in under a minute'],
    accent: 'violet',
  },
  {
    slug: 'salon',
    post: 1,
    title: 'Salon Website',
    category: 'Business',
    line: 'A premium salon site with services, gallery, team and online booking.',
    tags: ['Booking', 'Gallery', 'WhatsApp'],
    cta: 'Build My Salon Website',
    contactType: 'website',
    status: 'coming-soon',
    challenge: 'Customers ask the same questions on Instagram every day: price, timing, availability.',
    solution: [
      'Hero',
      'Services',
      'Pricing',
      'Gallery',
      'Team',
      'Testimonials',
      'Booking',
      'WhatsApp',
      'Location',
    ],
    features: [
      'Appointment Booking',
      'Service Showcase',
      'Gallery',
      'WhatsApp',
      'Google Maps',
      'Mobile Responsive',
    ],
    automation: 'Booking confirmations and reminders on WhatsApp. Enquiries land in one inbox.',
    technology: ['Next.js', 'TypeScript', 'Tailwind'],
    outcomes: ['Fewer repeated questions', 'Bookings without phone calls', 'A gallery that sells the work'],
    accent: 'rose',
  },
  {
    slug: 'restaurant',
    post: 2,
    title: 'Restaurant Website',
    category: 'Food',
    line: 'A digital menu, reservations and location in one beautiful site.',
    tags: ['Menu', 'Reservation', 'Maps'],
    cta: 'Build My Restaurant Website',
    contactType: 'website',
    status: 'coming-soon',
    challenge:
      'The menu lives in blurry photos. Reservations happen over calls that get missed during service.',
    solution: [
      'Hero',
      'Menu with categories',
      'Food gallery',
      'About',
      'Offers',
      'Reservation',
      'Location',
      'Contact',
    ],
    features: ['Digital Menu', 'Reservation', 'WhatsApp', 'Google Maps', 'Responsive UI'],
    automation: 'Table reservations confirmed on WhatsApp. Daily offers updated from the admin.',
    technology: ['Next.js', 'TypeScript', 'Tailwind'],
    outcomes: ['Menu visible before guests arrive', 'Reservations without calls', 'Easy to find on Maps'],
    accent: 'amber',
  },
  {
    slug: 'interior',
    post: 3,
    title: 'Interior Designer Website',
    category: 'Creative',
    line: 'A visual-first portfolio that lets the projects speak.',
    tags: ['Portfolio', 'Gallery', 'Enquiry'],
    cta: 'Build My Portfolio Website',
    contactType: 'website',
    status: 'coming-soon',
    challenge:
      'Great work, but no place to show it professionally. Instagram hides the detail that wins clients.',
    solution: [
      'Premium hero',
      'Featured projects',
      'Project gallery with hover preview',
      'Project details',
      'Services',
      'About studio',
      'Testimonials',
      'Contact',
    ],
    features: ['Project Portfolio', 'Gallery', 'Project Pages', 'Enquiry Form', 'WhatsApp', 'Responsive'],
    automation: 'Project enquiries reach WhatsApp with the project name attached.',
    technology: ['Next.js', 'TypeScript', 'Tailwind'],
    outcomes: [
      'Work presented at full quality',
      'Enquiries tied to specific projects',
      'A brand that feels premium',
    ],
    accent: 'emerald',
  },
  {
    slug: 'tuition',
    post: 4,
    title: 'Tuition Centre Website',
    category: 'Education',
    line: 'Courses, faculty, results and student enquiries in one place.',
    tags: ['Courses', 'Enquiry', 'WhatsApp'],
    cta: 'Build My Education Website',
    contactType: 'website',
    status: 'coming-soon',
    challenge:
      'Parents want course details, timings and results before they call. Nobody has time to repeat them.',
    solution: [
      'Hero',
      'Courses',
      'Classes',
      'Faculty',
      'Results',
      'Testimonials',
      'Gallery',
      'Location',
      'Enquiry',
    ],
    features: ['Course Information', 'Student Enquiries', 'WhatsApp', 'Contact Form', 'Responsive'],
    automation: 'Admission enquiries arrive on WhatsApp with the course selected.',
    technology: ['Next.js', 'TypeScript', 'Tailwind'],
    outcomes: [
      'Parents get answers before calling',
      'Results and faculty build trust',
      'More admission enquiries',
    ],
    accent: 'sky',
  },
  {
    slug: 'before-after',
    post: 5,
    title: 'Before and After',
    category: 'All',
    line: 'From no website to a professional online presence.',
    tags: ['Transformation'],
    cta: 'Start a Project',
    contactType: 'website',
    status: 'coming-soon',
    challenge:
      'The business exists only on Instagram and Maps. No trust, no enquiries, no way to be found by search.',
    solution: [
      'One professional website that brings services, gallery, contact, WhatsApp and location together',
    ],
    features: ['Website', 'Services', 'Gallery', 'Contact', 'WhatsApp', 'Location', 'Enquiries'],
    automation: 'Every enquiry reaches WhatsApp and email automatically.',
    technology: ['Next.js', 'TypeScript', 'Tailwind'],
    outcomes: ['Found on Google', 'Trusted at first glance', 'Contacted without friction'],
    accent: 'indigo',
  },
  {
    slug: 'ai-business',
    post: 6,
    title: 'AI-Powered Business Website',
    category: 'AI',
    line: 'A landing page with an AI assistant that captures leads and sends them to WhatsApp.',
    tags: ['AI Chat', 'Lead Capture', 'Automation'],
    cta: 'Build My AI Website',
    contactType: 'ai',
    status: 'coming-soon',
    challenge: 'Visitors leave without asking. The owner answers the same questions all day.',
    solution: ['Landing page', 'AI assistant', 'Lead capture', 'WhatsApp handoff', 'Automation'],
    features: ['AI Chat', 'Lead Capture', 'Smart FAQ', 'WhatsApp', 'Automation'],
    flow: ['Landing Page', 'AI Assistant', 'Lead Capture', 'WhatsApp', 'Automation'],
    automation:
      'The assistant qualifies the visitor, collects contact details and notifies the owner instantly.',
    technology: ['Next.js', 'TypeScript', 'AI APIs', 'PostgreSQL'],
    outcomes: ['Questions answered 24/7', 'Leads captured while you sleep', 'Follow-up without manual work'],
    accent: 'cyan',
  },
]

export const demoBySlug = (slug: string) => demos.find((d) => d.slug === slug)

export const caseStudySections = [
  'Hero Preview',
  'The Challenge',
  'Our Solution',
  'Key Features',
  'Website Screens',
  'Mobile Experience',
  'AI / Automation',
  'Technology',
  'Expected Outcome',
  'Next Step',
] as const
