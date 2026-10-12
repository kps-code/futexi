/** Home page copy. Source: docs/content-lock.md §2. Icons are lucide names resolved in components. */

export const trustStrip = [
  { label: 'AI Integration', icon: 'bot' },
  { label: 'Responsive Websites', icon: 'smartphone' },
  { label: 'Fast Performance', icon: 'zap' },
  { label: 'Modern UI/UX', icon: 'layout' },
  { label: 'WhatsApp Integration', icon: 'message' },
  { label: 'Automation', icon: 'workflow' },
  { label: 'SEO-Ready', icon: 'search' },
  { label: 'Custom Development', icon: 'code' },
] as const

export const whatWeBuild = {
  heading: 'More Than Just Websites. We Build Digital Solutions.',
  sub: 'Every project starts with your business goal, not with a template.',
  cards: [
    {
      id: 'business-websites',
      icon: 'globe',
      title: 'Business Websites',
      outcome: 'Look professional online and get found.',
      what: 'Websites for salons, clinics, studios, shops and service businesses.',
    },
    {
      id: 'landing-pages',
      icon: 'megaphone',
      title: 'Landing Pages',
      outcome: 'Turn Instagram and ad traffic into enquiries.',
      what: 'Campaign, product and lead-generation pages.',
    },
    {
      id: 'booking-websites',
      icon: 'calendar',
      title: 'Booking Websites',
      outcome: 'Accept bookings online, day and night.',
      what: 'Service selection, date and time, confirmation on WhatsApp.',
    },
    {
      id: 'ai',
      icon: 'bot',
      title: 'AI Solutions',
      outcome: 'Answer customer questions 24/7.',
      what: 'AI chat assistants, smart FAQ and AI-powered workflows.',
    },
    {
      id: 'automation',
      icon: 'workflow',
      title: 'Automation',
      outcome: 'Stop doing repetitive work by hand.',
      what: 'Enquiry to WhatsApp, email and follow-up flows that run on their own.',
    },
    {
      id: 'custom-software',
      icon: 'code',
      title: 'Custom Software & Apps',
      outcome: 'Software built around how your business runs.',
      what: 'Web apps, dashboards, mobile apps and SaaS products.',
    },
  ],
} as const

export const featuredDemos = {
  heading: 'See What We Can Build',
  sub: 'Explore interactive website concepts created for different business needs.',
  slugs: ['booking', 'salon', 'restaurant', 'ai-business'],
  cta: { label: 'View All Demos', href: '/demos' },
} as const

export const aiSection = {
  heading: 'Make Your Website Smarter With AI',
  sub: 'Turn a traditional website into an intelligent digital experience.',
  features: [
    {
      icon: 'message',
      title: 'AI Chat Assistant',
      line: 'Answers customer questions instantly, at any hour.',
    },
    { icon: 'users', title: 'Lead Qualification', line: 'Learns what the visitor needs before you reply.' },
    {
      icon: 'sparkles',
      title: 'Smart Recommendations',
      line: 'Suggests the right service based on what the visitor asks.',
    },
    { icon: 'lightbulb', title: 'AI FAQ', line: 'Handles common questions automatically.' },
    {
      icon: 'pen',
      title: 'AI Content',
      line: 'Helps create pages, descriptions and posts for your business.',
    },
    {
      icon: 'workflow',
      title: 'Workflow Automation',
      line: 'Enquiry to notification to follow-up, with no manual steps.',
    },
  ],
  demoTitle: 'Ask our AI Assistant',
  demoLabel: 'Sample conversation',
  demoCta: { label: 'Build This For My Business', href: '/contact?type=ai' },
  cta: { label: 'Explore AI Solutions', href: '/services#ai' },
} as const

export const beforeAfter = {
  heading: 'From Invisible Online to a Professional Online Presence',
  line: 'Your customers are already searching. A website makes sure they find you, trust you and contact you.',
  before: ['Instagram', 'WhatsApp', 'Google Maps', 'No Website'],
  after: ['Professional Website', 'Services', 'Gallery', 'Contact', 'WhatsApp', 'Location', 'Enquiries'],
} as const

export const everyScreen = {
  heading: 'Designed for Every Screen. Built to Be Fast.',
  sub: 'From desktop screens to smartphones, every experience is carefully designed to look and work beautifully.',
  chips: [
    'Fast Loading',
    'Mobile-First',
    'Optimized Assets',
    'Clean Development',
    'SEO-Ready Structure',
    'Production Deployment',
  ],
} as const

export const howWeWork = {
  heading: 'From Idea to Launch',
  steps: [
    { n: '01', title: 'Discover', line: 'We understand your business and goals.', icon: 'search' },
    { n: '02', title: 'Design', line: 'We create a modern visual direction.', icon: 'pen' },
    { n: '03', title: 'Build', line: 'We develop the website or product.', icon: 'hammer' },
    {
      n: '04',
      title: 'Integrate',
      line: 'We add forms, WhatsApp, AI, APIs and automation where needed.',
      icon: 'plug',
    },
    { n: '05', title: 'Test', line: 'We test on every screen and every flow.', icon: 'check' },
    { n: '06', title: 'Launch', line: 'We deploy, hand over and support.', icon: 'rocket' },
  ],
} as const

export const whyUs = {
  heading: 'Why Build With Us?',
  cards: [
    {
      title: 'Custom, Not Cookie-Cutter',
      line: 'Every project is designed for your business, not copied from a template.',
    },
    { title: 'AI-Ready', line: 'Intelligent features added when they make sense for you.' },
    { title: 'Mobile First', line: 'Built for the phones your customers actually use.' },
    { title: 'Future Ready', line: 'Architecture that can grow as your business grows.' },
    { title: 'Business Focused', line: 'We build experiences around your goals, not just pages.' },
    { title: 'Direct Collaboration', line: 'You talk directly to the people building your project.' },
  ],
} as const

export const investment = {
  heading: 'Simple, Honest Pricing',
  // {price} is replaced with the admin-editable starting price text.
  line: '{price}. The final price depends on pages, features and integrations. Tell us what you need and we will send a clear quote.',
  cta: { label: 'Discuss Your Project', href: '/contact' },
} as const

export const aboutTeaser = {
  heading: 'Three Builders. One Vision.',
  cta: { label: 'Meet the Team', href: '/about' },
} as const

export const technology = {
  heading: 'Modern Technology. Built for Tomorrow.',
  line: 'You do not need to know the stack. You just need it to work. This is what we build with.',
  items: [
    'React',
    'Next.js',
    'React Native',
    'TypeScript',
    'Python',
    'Django',
    'Flask',
    'PostgreSQL',
    'REST APIs',
    'AI APIs / LLM integrations',
  ],
} as const

export const finalCta = {
  heading: 'Have an Idea?',
  headingAccent: "Let's Build It.",
  sub: "Tell us what you're trying to build. We'll help you find the right digital solution.",
  primary: { label: 'Start a Project', href: '/contact' },
  whatsapp: 'WhatsApp Us',
} as const
