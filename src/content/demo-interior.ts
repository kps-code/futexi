import type { DemoPhoto } from '@/components/demos-shared/photo'

/**
 * Content for the Interior Designer demo (Atelier Nila). Sample business.
 * Photos: public/demos/interior/photos (Unsplash licence, see CREDITS.md there).
 */

export type InteriorKind = 'home' | 'office' | 'cafe'

export const interiorKinds = [
  { key: 'all', label: 'All work' },
  { key: 'home', label: 'Homes' },
  { key: 'office', label: 'Offices' },
  { key: 'cafe', label: 'Cafes' },
] as const

export type InteriorProject = {
  slug: string
  name: string
  location: string
  kind: InteriorKind
  type: string
  area: string
  year: string
  cover: DemoPhoto
  summary: string
  highlights: readonly string[]
  palette: readonly string[]
  gallery: readonly { photo: DemoPhoto; label: string }[]
}

const P = '/demos/interior/photos'
const photo = (file: string, alt: string): DemoPhoto => ({ src: `${P}/${file}.webp`, alt })

export const interiorProjects: readonly InteriorProject[] = [
  {
    slug: 'sea-breeze-apartment',
    name: 'Sea Breeze Apartment',
    location: 'Besant Nagar, Chennai',
    kind: 'home',
    type: 'Residential · 3 BHK',
    area: '1,850 sq ft',
    year: '2026',
    cover: photo('sea-breeze-cover', 'Ivory living room with a linen sofa, cane mirrors and soft daylight'),
    summary:
      'A coastal three-bedroom home opened up around light. Walls came down, a long oak bench replaced a corridor, and every room borrows a view of the sea.',
    highlights: [
      'Open kitchen with 3.2 m island',
      'Lime-washed walls throughout',
      'Custom teak and cane wardrobes',
      'Hidden study behind the living wall',
    ],
    palette: ['#efe6d8', '#c9a97d', '#8a6a4f', '#3b2a1e'],
    gallery: [
      {
        photo: photo('sea-breeze-living', 'Living room with a grey sofa and a long window'),
        label: 'Living room',
      },
      {
        photo: photo('sea-breeze-kitchen', 'White kitchen with an oak island and stools'),
        label: 'Kitchen island',
      },
      {
        photo: photo('sea-breeze-bedroom', 'Bedroom with linen bedding and hanging plants'),
        label: 'Master bedroom',
      },
      {
        photo: photo('sea-breeze-reading', 'Reading corner with a cream sofa and a palm'),
        label: 'Reading corner',
      },
    ],
  },
  {
    slug: 'courtyard-villa',
    name: 'Courtyard Villa',
    location: 'ECR, Chennai',
    kind: 'home',
    type: 'Residential · Villa',
    area: '4,200 sq ft',
    year: '2025',
    cover: photo('courtyard-cover', 'Villa living room opening onto a wooden deck and garden'),
    summary:
      'A weekend villa built around a brick courtyard. Athangudi tiles, Kota stone and brass details keep it rooted; a cantilevered steel stair keeps it current.',
    highlights: [
      'Central courtyard with rain chain',
      'Athangudi tile flooring',
      'Brass and teak joinery',
      'Outdoor dining pavilion',
    ],
    palette: ['#f1e7d8', '#c49a5a', '#8a5a3c', '#4a3a2e'],
    gallery: [
      {
        photo: photo('courtyard-hall', 'Living hall with arched windows and timber beams'),
        label: 'Living hall',
      },
      {
        photo: photo('courtyard-bedroom', 'Master bedroom with an upholstered headboard'),
        label: 'Master bedroom',
      },
      {
        photo: photo('courtyard-dining', 'Dining table under a round pendant light'),
        label: 'Dining pavilion',
      },
      { photo: photo('courtyard-bath', 'Stone bathtub beside a potted palm'), label: 'Garden bath' },
    ],
  },
  {
    slug: 'studio-loft-office',
    name: 'Studio Loft Office',
    location: 'Guindy, Chennai',
    kind: 'office',
    type: 'Commercial · Office',
    area: '3,100 sq ft',
    year: '2025',
    cover: photo('studio-loft-cover', 'Bright office lounge with glass partitions and pale wood'),
    summary:
      'A 40-seat office for a design agency. Pale ply, glass partitions and acoustic felt pods, planned so no seat is more than six metres from daylight.',
    highlights: [
      'Six acoustic focus pods',
      'Birch ply workstations',
      'Reclaimed wood pantry',
      'Lighting tuned to the workday',
    ],
    palette: ['#ece7df', '#b5a079', '#5c5046', '#2b2420'],
    gallery: [
      {
        photo: photo('studio-loft-open', 'Open studio floor with plants and timber flooring'),
        label: 'Open studio',
      },
      {
        photo: photo('studio-loft-meeting', 'Meeting rooms behind black-framed glass'),
        label: 'Meeting rooms',
      },
      { photo: photo('studio-loft-lounge', 'Lounge with a leather sofa beside the pantry'), label: 'Lounge' },
      { photo: photo('studio-loft-desks', 'Workstation with a city view'), label: 'Workstations' },
    ],
  },
  {
    slug: 'heritage-cafe',
    name: 'Heritage Cafe',
    location: 'Mylapore, Chennai',
    kind: 'cafe',
    type: 'Hospitality · Cafe',
    area: '1,200 sq ft',
    year: '2024',
    cover: photo('heritage-cafe-cover', 'Cafe counter with a chalkboard menu and warm wood'),
    summary:
      'A 1930s house turned 46-cover cafe. We kept the Madras terrace roof and red oxide floor, and added a brass counter that glows at dusk.',
    highlights: [
      'Restored Madras terrace roof',
      'Red oxide flooring',
      'Brass service counter',
      'Street-facing window bar',
    ],
    palette: ['#f3e4cf', '#c9a97d', '#7c4a2d', '#2b1d14'],
    gallery: [
      {
        photo: photo('heritage-cafe-counter', 'Cafe interior with timber tables and pendant lights'),
        label: 'Counter',
      },
      {
        photo: photo('heritage-cafe-street', 'Street-facing seating outside the cafe'),
        label: 'Street seating',
      },
      {
        photo: photo('heritage-cafe-window-bar', 'Long communal tables under string lights'),
        label: 'Window bar',
      },
      {
        photo: photo('heritage-cafe-courtyard', 'Courtyard table with plants and a coffee press'),
        label: 'Courtyard',
      },
    ],
  },
  {
    slug: 'linen-house',
    name: 'Linen House',
    location: 'Adyar, Chennai',
    kind: 'home',
    type: 'Residential · 2 BHK',
    area: '1,150 sq ft',
    year: '2025',
    cover: photo('linen-house-cover', 'Living room with a woven wall hanging, plants and a sage sofa'),
    summary:
      'A compact apartment for a couple who work from home. Linen, cane and lime plaster soften a small plan; a fold-away desk turns the guest room into a studio.',
    highlights: [
      'Fold-away desk in the guest room',
      'Cane-fronted storage wall',
      'Lime plaster in two tones',
      'Full-height linen curtains',
    ],
    palette: ['#f4ede3', '#d8c3a5', '#9a8064', '#3b2a1e'],
    gallery: [
      {
        photo: photo('linen-house-living', 'Cream sofa with wooden stools and a palm'),
        label: 'Living room',
      },
      { photo: photo('linen-house-entry', 'Entry console with a round mirror and plants'), label: 'Entry' },
      {
        photo: photo('linen-house-bedroom', 'Bedroom with white bedding and a side chair'),
        label: 'Bedroom',
      },
      { photo: photo('linen-house-bath', 'White bathroom with hanging plants'), label: 'Bath' },
    ],
  },
  {
    slug: 'palm-court-penthouse',
    name: 'Palm Court Penthouse',
    location: 'Nungambakkam, Chennai',
    kind: 'home',
    type: 'Residential · Penthouse',
    area: '2,600 sq ft',
    year: '2024',
    cover: photo('palm-court-cover', 'Penthouse living room with a timber feature wall and pool view'),
    summary:
      'A top-floor home that wanted to feel like a resort. Teak panelling, a terrace bedroom and a kitchen that opens to the pool deck for weekend lunches.',
    highlights: [
      'Teak-panelled living wall',
      'Bedroom opening onto the terrace',
      'Breakfast counter with brass tap',
      'Dimmable lighting scenes',
    ],
    palette: ['#f0e9df', '#c4a57a', '#7a5a3e', '#2a2420'],
    gallery: [
      {
        photo: photo('palm-court-living', 'Formal living room with white sofas and tall windows'),
        label: 'Living room',
      },
      {
        photo: photo('palm-court-terrace-bedroom', 'Bedroom opening onto a terrace'),
        label: 'Terrace bedroom',
      },
      { photo: photo('palm-court-kitchen', 'White kitchen with a breakfast counter'), label: 'Kitchen' },
      {
        photo: photo('palm-court-counter', 'Kitchen counter with a brass tap and plants'),
        label: 'Breakfast counter',
      },
    ],
  },
]

export const interiorProjectBySlug = (slug: string) => interiorProjects.find((p) => p.slug === slug)

export const studioPhoto = photo('studio-materials', 'Oak shelving holding material samples in the studio')

export const interiorProcess = [
  { title: 'Discover', line: 'A site visit and a long conversation about how you live or work.' },
  { title: 'Design', line: 'Mood boards, 3D views and a material palette you can touch.' },
  { title: 'Build', line: 'Our own carpenters and site team, with a weekly progress report.' },
] as const

export const interiorTestimonials = [
  {
    quote: 'They listened more than they talked, and the home shows it.',
    name: 'Ramya and Vikram, Besant Nagar',
  },
  { quote: 'On budget, on time, and the detailing is better than the renders.', name: 'Suresh K., ECR' },
  { quote: 'Our team actually wants to come to the office now.', name: 'Anjali P., agency founder' },
] as const

/** Services page: packages with indicative Chennai pricing. */
export type InteriorPackage = {
  slug: string
  name: string
  price: string
  priceNote: string
  line: string
  included: readonly string[]
  goodFor: string
  photo: DemoPhoto
}

export const interiorPackages: readonly InteriorPackage[] = [
  {
    slug: 'full-home',
    name: 'Full home',
    price: '₹1,650',
    priceNote: 'per sq ft, design and build',
    line: 'Every room, one team, one handover date.',
    included: [
      'Concept, layouts and 3D views',
      'Modular kitchen and wardrobes',
      'False ceiling, lighting and electrical',
      'Loose furniture and soft furnishing sourcing',
      'Site supervision with weekly reports',
      'One-year workmanship warranty',
    ],
    goodFor: '2 to 4 BHK apartments and villas',
    photo: photo('service-full-home', 'Dining area with a wooden table and warm light'),
  },
  {
    slug: 'kitchen-wardrobes',
    name: 'Kitchen and wardrobes',
    price: '₹2.4 lakh',
    priceNote: 'onwards, per kitchen',
    line: 'The two rooms that work hardest, built in our workshop.',
    included: [
      'Layout and 3D views',
      'BWP plywood carcass, laminate or acrylic shutters',
      'Soft-close hardware with a ten-year warranty',
      'Quartz or granite counter',
      'Installed in five working days',
    ],
    goodFor: 'One-room updates, rentals, resale prep',
    photo: photo('service-kitchen', 'White kitchen with a marble counter and fresh lemons'),
  },
  {
    slug: 'office-cafe',
    name: 'Office and cafe',
    price: '₹1,250',
    priceNote: 'per sq ft, design and build',
    line: 'Spaces that work for staff and look right for customers.',
    included: [
      'Space plan, seating and flow',
      'Acoustic and lighting plan',
      'MEP coordination with your contractor or ours',
      'Brand-matched finishes and signage',
      'Phased handover so you stay open',
    ],
    goodFor: '1,000 to 10,000 sq ft',
    photo: photo('service-office', 'Office floor with plants and timber flooring'),
  },
]

export const interiorStages = [
  {
    title: 'Site visit and brief',
    when: 'Week 1',
    line: 'We measure, photograph and talk through how the space is used.',
  },
  {
    title: 'Concept and 3D views',
    when: 'Weeks 2 to 3',
    line: 'Two directions, then one, with views you can walk through on a phone.',
  },
  {
    title: 'Materials and one quote',
    when: 'Week 4',
    line: 'Samples on the table. A single written quote, no line-item surprises later.',
  },
  {
    title: 'Workshop and site',
    when: 'Weeks 5 to 10',
    line: 'Joinery built in Ambattur while the site is prepared. Weekly photo report.',
  },
  {
    title: 'Handover and care',
    when: 'Week 11',
    line: 'A snag walk together, then a year of free adjustments.',
  },
] as const

export const interiorFaq = [
  {
    q: 'How long does a full home take?',
    a: 'Eight to twelve weeks for a three-bedroom apartment, from approved design to handover. Kitchens and wardrobes alone take about three weeks including workshop time.',
  },
  {
    q: 'Do you design only, or build as well?',
    a: 'Both. Design-only is ₹60 per sq ft and is adjusted against the build if you continue with us. Our carpentry workshop is in Ambattur.',
  },
  {
    q: 'What is the payment schedule?',
    a: '10% to start design, 40% when materials are ordered, 40% at mid-build, 10% at handover.',
  },
  {
    q: 'Can we live at home during the work?',
    a: 'For kitchens and wardrobes, yes. For a full home we recommend moving out for the first four weeks, when the civil and electrical work happens.',
  },
  {
    q: 'What warranty do you give?',
    a: 'One year on workmanship, ten years on hardware from the manufacturer, and we come back for free adjustments in the first year.',
  },
  {
    q: 'Do you work outside Chennai?',
    a: 'Yes, within about 150 km: Pondicherry, Vellore, Kanchipuram. Site visits beyond that are quoted separately.',
  },
] as const

/** Four numbers under the hero. */
export const interiorNumbers = [
  { value: 60, suffix: '+', label: 'Homes and workplaces' },
  { value: 6, suffix: '', label: 'Years, one site crew' },
  { value: 11, suffix: '', label: 'People in the studio' },
  { value: 1, suffix: '', label: 'Quote, in writing' },
] as const

/** Plan to room: the pinned reveal on the home page. */
export const interiorPlan = {
  photo: photo('courtyard-hall', 'A villa hall with a long sofa, timber ceiling and garden light'),
  steps: [
    { title: 'Plan', line: 'A measured drawing of your rooms, with every wall, window and socket in place.' },
    { title: 'Material', line: 'Oak, stone, linen and paint chosen on a board you can hold in your hand.' },
    { title: 'Room', line: 'Built by our own carpenters and handed over clean, with the drawings to keep.' },
  ],
} as const

/** Numbered service rows on the home page; packages and prices live on /services. */
export const interiorRows = [
  {
    slug: 'nila-residential',
    photo: photo('service-full-home', 'Dining area with a wooden table and warm light'),
  },
  {
    slug: 'nila-kitchen',
    photo: photo('service-kitchen', 'White kitchen with a marble counter and fresh lemons'),
  },
  { slug: 'nila-office', photo: photo('service-office', 'Office floor with plants and timber flooring') },
  {
    slug: 'nila-turnkey',
    photo: photo('courtyard-cover', 'Villa living room opening onto a wooden deck and garden'),
  },
] as const

/** The hero photo on the home page: the reference look, a white kitchen with an oak island. */
export const interiorHeroPhoto = photo('sea-breeze-kitchen', 'White kitchen with an oak island and stools')
