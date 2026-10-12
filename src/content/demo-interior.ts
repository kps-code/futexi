/** Projects shown by the Interior Designer demo (Atelier Nila). Sample content. */

export type InteriorProject = {
  slug: string
  name: string
  location: string
  type: string
  area: string
  year: string
  tile: string
  summary: string
  highlights: readonly string[]
  palette: readonly string[]
  gallery: readonly { tile: string; label: string }[]
}

export const interiorProjects: readonly InteriorProject[] = [
  {
    slug: 'sea-breeze-apartment',
    name: 'Sea Breeze Apartment',
    location: 'Besant Nagar, Chennai',
    type: 'Residential · 3 BHK',
    area: '1,850 sq ft',
    year: '2026',
    tile: 'tile-ocean',
    summary:
      'A coastal three-bedroom home opened up around light. Walls came down, a long oak bench replaced a corridor, and every room borrows a view of the sea.',
    highlights: [
      'Open kitchen with 3.2 m island',
      'Lime-washed walls throughout',
      'Custom teak and cane wardrobes',
      'Hidden study behind the living wall',
    ],
    palette: ['#e8e2d6', '#9fb3c8', '#5b4a3a', '#2f3e46'],
    gallery: [
      { tile: 'tile-ocean', label: 'Living room' },
      { tile: 'tile-sand', label: 'Kitchen island' },
      { tile: 'tile-coal', label: 'Master bedroom' },
      { tile: 'tile-leaf', label: 'Balcony garden' },
    ],
  },
  {
    slug: 'courtyard-villa',
    name: 'Courtyard Villa',
    location: 'ECR, Chennai',
    type: 'Residential · Villa',
    area: '4,200 sq ft',
    year: '2025',
    tile: 'tile-sand',
    summary:
      'A weekend villa built around a brick courtyard. Athangudi tiles, Kota stone and brass details keep it rooted; a cantilevered steel stair keeps it current.',
    highlights: [
      'Central courtyard with rain chain',
      'Athangudi tile flooring',
      'Brass and teak joinery',
      'Outdoor dining pavilion',
    ],
    palette: ['#f1e7d8', '#c49a5a', '#8a5a3c', '#3f5a4a'],
    gallery: [
      { tile: 'tile-sand', label: 'Courtyard' },
      { tile: 'tile-ember', label: 'Dining pavilion' },
      { tile: 'tile-gold', label: 'Stairwell' },
      { tile: 'tile-leaf', label: 'Verandah' },
    ],
  },
  {
    slug: 'studio-loft-office',
    name: 'Studio Loft Office',
    location: 'Guindy, Chennai',
    type: 'Commercial · Office',
    area: '3,100 sq ft',
    year: '2025',
    tile: 'tile-coal',
    summary:
      'A 40-seat office for a design agency. Exposed concrete, birch ply desks and acoustic felt pods, planned so no seat is more than six metres from daylight.',
    highlights: [
      'Six acoustic focus pods',
      'Birch ply workstations',
      'Reclaimed wood pantry',
      'Lighting tuned to the workday',
    ],
    palette: ['#d9d9d9', '#b5a079', '#3a3a3a', '#6b8e23'],
    gallery: [
      { tile: 'tile-coal', label: 'Open studio' },
      { tile: 'tile-leaf', label: 'Focus pods' },
      { tile: 'tile-sand', label: 'Pantry' },
      { tile: 'tile-plum', label: 'Meeting room' },
    ],
  },
  {
    slug: 'heritage-cafe',
    name: 'Heritage Cafe',
    location: 'Mylapore, Chennai',
    type: 'Hospitality · Cafe',
    area: '1,200 sq ft',
    year: '2024',
    tile: 'tile-ember',
    summary:
      'A 1930s house turned 46-cover cafe. We kept the Madras terrace roof and red oxide floor, and added a brass counter that glows at dusk.',
    highlights: [
      'Restored Madras terrace roof',
      'Red oxide flooring',
      'Brass service counter',
      'Street-facing window bar',
    ],
    palette: ['#f3e4cf', '#c2410c', '#7c2d12', '#1c1917'],
    gallery: [
      { tile: 'tile-ember', label: 'Counter' },
      { tile: 'tile-gold', label: 'Window bar' },
      { tile: 'tile-sand', label: 'Courtyard seating' },
      { tile: 'tile-rose', label: 'Dessert corner' },
    ],
  },
]

export const interiorProjectBySlug = (slug: string) => interiorProjects.find((p) => p.slug === slug)

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
