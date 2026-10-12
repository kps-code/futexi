/**
 * Static site content. Source of truth: docs/content-lock.md.
 * Contact details here are build-time defaults; the SiteSettings global
 * in the admin overrides them at runtime once the database is connected.
 */

export const brand = {
  name: 'KAPOSA FUTEXI',
  positioning: 'AI • Web • Automation • Future Technology',
  shortLine: 'AI • Web • Future Tech',
  tagline: 'We Build Digital Experiences That Move Businesses Forward.',
  footerLine: "Building What's Next.",
  domain: 'kaposafutexi.com',
} as const

export const contactDefaults = {
  phoneDisplay: '+91 88836 73422',
  whatsappNumber: '918883673422',
  email: 'kpsankar1398kp@gmail.com',
  linkedin: 'https://www.linkedin.com/in/sankaralingamk1398',
  instagram: '',
  github: '',
  startingPriceText: 'Projects start from ₹5,000',
  replyTimeText: 'We reply within one working day.',
} as const

export const whatsappDefaultMessage =
  "Hi KAPOSA FUTEXI, I'm interested in building a website for my business."

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Demos', href: '/demos' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const

export const primaryCta = { label: 'Start a Project', href: '/contact' } as const

export const footerColumns = [
  {
    title: 'Company',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Demos', href: '/demos' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Websites', href: '/services#business-websites' },
      { label: 'Landing Pages', href: '/services#landing-pages' },
      { label: 'Booking Websites', href: '/services#booking-websites' },
      { label: 'AI Solutions', href: '/services#ai' },
      { label: 'Automation', href: '/services#automation' },
      { label: 'Custom Software', href: '/services#custom-software' },
    ],
  },
] as const

export const hero = {
  eyebrow: brand.positioning,
  heading: "Your Ideas. Our Technology. Built for What's Next.",
  sub: 'We design and build modern websites, AI-powered experiences, automation solutions and digital products for businesses ready for the next generation.',
  primary: { label: 'Explore Our Work', href: '/demos' },
  secondary: { label: 'Start Your Project', href: '/contact' },
  trustLine: ['AI Integration', 'Responsive Design', 'Fast Performance', 'Custom Development'],
} as const

export const legal = {
  copyright: `© ${new Date().getFullYear()} ${brand.name}`,
  links: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
} as const
