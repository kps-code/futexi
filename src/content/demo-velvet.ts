import type { DemoPhoto } from '@/components/demos-shared/photo'

/**
 * Content for the Salon demo (Velvet Salon), a dark, lounge-style unisex
 * salon and barber studio in T. Nagar. Sample business. Photos:
 * public/demos/salon/photos (Unsplash licence, see CREDITS.md there).
 */

const P = '/demos/salon/photos'
const photo = (file: string, alt: string): DemoPhoto => ({ src: `${P}/${file}.webp`, alt })

export const velvetPhotos = {
  heroBarber: photo('hero-barber', 'A barber finishing a cut under warm lights'),
  shopInterior: photo('shop-interior', 'The lounge: brick walls, leather chairs and pendant lights'),
  chairLeather: photo('chair-leather', 'A tufted leather barber chair'),
  shave: photo('shave', 'A hot towel shave with a badger brush'),
  beardScissors: photo('beard-scissors', 'A beard being shaped with scissors'),
  mensCut: photo('mens-cut', 'A textured crop being cut at the chair'),
  manPortrait: photo('man-portrait', 'A man in a black turtleneck, freshly groomed'),
  manPortrait2: photo('man-portrait-2', 'A man in glasses after his cut'),
  shelf: photo('shelf', 'Pomade tins, a brush and combs on the shelf'),
  toolsDark: photo('tools-dark', 'Clippers, scissors and combs on dark slate'),
  dryerWood: photo('dryer-wood', 'A dryer and scissors on a wooden counter'),
  womanPortrait: photo('woman-portrait', 'A woman with freckles and loose waves'),
  womanPortrait2: photo('woman-portrait-2', 'A woman with a cropped cut against a red wall'),
  hairWashDark: photo('hair-wash-dark', 'A hair wash at the backwash in low light'),
  nailsDark: photo('nails-dark', 'Black and gold nail art on a dark sweater'),
  makeupDark: photo('makeup-dark', 'Brushes, lipstick and a compact on black'),
  heroPortrait: photo('hero-portrait', 'A close portrait with soft, even makeup'),
  heroHair: photo('hero-hair', 'Long waved hair seen from behind against a pink wall'),
  salonDark: photo('salon-dark', 'The salon floor with round mirrors and dark walls'),
  salonChairs: photo('salon-chairs', 'A row of salon chairs in black and white'),
  stylist: photo('cut-stylist', 'A stylist finishing a cut by the window'),
  wash: photo('wash', 'A client at the backwash, stylist smiling'),
  barber: photo('barber', 'A beard trim in warm light'),
  barberFade: photo('barber-fade', 'A skin fade on the barber chair'),
  makeupEye: photo('makeup-eye', 'Eye makeup being finished with a fine brush'),
  makeupKit: photo('makeup-kit', 'A makeup kit laid out on a table'),
  brushes: photo('brushes', 'Makeup brushes in a white pot'),
  pedicure: photo('pedicure', 'A pedicure with flowers in the water'),
  facial: photo('facial', 'A clay mask being applied'),
  tools: photo('tools', 'Combs, brushes and a dryer laid out'),
  colourLavender: photo('colour-lavender', 'Lavender global colour on long hair'),
  blowdry: photo('blowdry', 'A blow dry in progress'),
}

export type VelvetIcon = 'scissors' | 'razor' | 'palette' | 'sparkles' | 'hand' | 'gem'

/** The six services on the home page, each a photo card with an icon square. */
export const velvetHighlights = [
  {
    slug: 'velvet-haircut',
    title: 'Cuts and styling',
    for: 'Her',
    icon: 'scissors' as VelvetIcon,
    line: 'Consultation, wash, precision cut and a blow dry that lasts.',
    photo: velvetPhotos.hairWashDark,
  },
  {
    slug: 'velvet-mens-cut',
    title: 'Cuts and fades',
    for: 'Him',
    icon: 'scissors' as VelvetIcon,
    line: 'Scissor cuts, skin fades and textured crops, finished with a hot towel.',
    photo: velvetPhotos.mensCut,
  },
  {
    slug: 'velvet-beard',
    title: 'Beard and hot towel shave',
    for: 'Him',
    icon: 'razor' as VelvetIcon,
    line: 'Shaping, line-up, straight-razor shave and a cold towel to finish.',
    photo: velvetPhotos.shave,
  },
  {
    slug: 'velvet-colour',
    title: 'Colour and highlights',
    for: 'Everyone',
    icon: 'palette' as VelvetIcon,
    line: 'Global colour, balayage and grey blending with ammonia-free options.',
    photo: velvetPhotos.colourLavender,
  },
  {
    slug: 'velvet-facial',
    title: 'Skin and facials',
    for: 'Everyone',
    icon: 'sparkles' as VelvetIcon,
    line: 'Cleanse, exfoliate, massage and mask. Beard-safe for him.',
    photo: velvetPhotos.facial,
  },
  {
    slug: 'velvet-mani-pedi',
    title: 'Nails and makeup',
    for: 'Her',
    icon: 'hand' as VelvetIcon,
    line: 'Manicure, pedicure, nail art and HD makeup for the evening.',
    photo: velvetPhotos.nailsDark,
  },
] as const

/** Eight prices at a glance on the home page; the full list lives on /services. */
export const velvetQuickPrices = [
  { name: "Women's cut and style", price: '₹599', slug: 'velvet-haircut', icon: 'scissors' as VelvetIcon },
  { name: "Men's cut and style", price: '₹499', slug: 'velvet-mens-cut', icon: 'scissors' as VelvetIcon },
  { name: 'Beard trim and shave', price: '₹349', slug: 'velvet-beard', icon: 'razor' as VelvetIcon },
  { name: 'Global colour', price: '₹2,499', slug: 'velvet-colour', icon: 'palette' as VelvetIcon },
  { name: 'Keratin treatment', price: '₹4,999', slug: 'velvet-keratin', icon: 'palette' as VelvetIcon },
  { name: 'Glow facial', price: '₹1,299', slug: 'velvet-facial', icon: 'sparkles' as VelvetIcon },
  { name: 'Manicure and pedicure', price: '₹1,099', slug: 'velvet-mani-pedi', icon: 'hand' as VelvetIcon },
  { name: 'Bridal makeup trial', price: '₹2,999', slug: 'velvet-bridal', icon: 'gem' as VelvetIcon },
] as const

/** The lounge: three things that make the wait part of the visit. */
export const velvetLounge = [
  {
    title: 'Signature cuts',
    line: 'Every cut starts with a conversation and ends with a hot towel, for him and for her.',
    photo: velvetPhotos.beardScissors,
  },
  {
    title: 'Espresso lounge',
    line: 'Leather chairs, a good espresso and no clock on the wall while your colour sets.',
    photo: velvetPhotos.chairLeather,
  },
  {
    title: 'Bridal and groom suite',
    line: 'A private room upstairs for wedding mornings, trials and the family.',
    photo: velvetPhotos.makeupEye,
  },
] as const

/** Things on the shelf that customers ask for; sold over the counter or on WhatsApp. */
export const velvetProducts = [
  {
    name: 'Matte clay pomade',
    price: '₹650',
    line: 'Medium hold, no shine, washes out clean.',
    photo: velvetPhotos.shelf,
  },
  {
    name: 'Home clipper kit',
    price: '₹2,100',
    line: 'For the fortnight between visits.',
    photo: velvetPhotos.toolsDark,
  },
  {
    name: 'Salon dryer and shears',
    price: '₹4,200',
    line: 'The dryer we use at the chair.',
    photo: velvetPhotos.dryerWood,
  },
  {
    name: 'Evening makeup kit',
    price: '₹1,450',
    line: 'Lip, brow and a compact that lasts the night.',
    photo: velvetPhotos.makeupDark,
  },
] as const

export const velvetGallery = [
  { photo: velvetPhotos.colourLavender, label: 'Global colour', tall: true },
  { photo: velvetPhotos.barberFade, label: 'Skin fade', tall: false },
  { photo: velvetPhotos.blowdry, label: 'Blow dry', tall: false },
  { photo: velvetPhotos.barber, label: 'Beard trim', tall: true },
  { photo: velvetPhotos.makeupEye, label: 'Bridal eye', tall: false },
  { photo: velvetPhotos.shave, label: 'Hot towel shave', tall: false },
  { photo: velvetPhotos.nailsDark, label: 'Nail art', tall: false },
  { photo: velvetPhotos.mensCut, label: 'Textured crop', tall: false },
] as const

export const velvetTeam = [
  {
    name: 'Meera Nair',
    role: 'Creative Director',
    years: 14,
    focus: 'Colour and bridal',
    photo: velvetPhotos.womanPortrait2,
  },
  {
    name: 'Faisal Rahman',
    role: 'Master Barber',
    years: 11,
    focus: 'Fades, beards and straight-razor shaves',
    photo: velvetPhotos.manPortrait,
  },
  {
    name: 'Shalini K.',
    role: 'Skin and Nails',
    years: 6,
    focus: 'Facials and nail art',
    photo: velvetPhotos.wash,
  },
  {
    name: 'Arjun Das',
    role: 'Senior Stylist',
    years: 9,
    focus: 'Cuts, keratin and grooms',
    photo: velvetPhotos.manPortrait2,
  },
] as const

export const velvetStats = [
  { value: 486, suffix: '+', label: 'Five-star reviews' },
  { value: 12, suffix: '', label: 'Years in T. Nagar' },
  { value: 60, suffix: '+', label: 'Weddings this season' },
  { value: 9, suffix: ' to 9', label: 'Open, Tue to Sun' },
] as const

export const velvetTestimonials = [
  { quote: 'Walked in for a trim, walked out with the best balayage I have ever had.', name: 'Anitha V.' },
  { quote: 'Best fade in T. Nagar, and the hot towel shave is worth the trip alone.', name: 'Rahul S.' },
  {
    quote: 'My bridal trial felt like a conversation, not a sales pitch. The groom went too.',
    name: 'Keerthana M.',
  },
] as const

export type VelvetMenuItem = { name: string; price: string; line?: string; slug?: string }
export type VelvetMenuGroup = {
  category: string
  photo: DemoPhoto
  note: string
  items: readonly VelvetMenuItem[]
}

/** Price list grouped by category, with a photo per group. */
export const velvetMenu: readonly VelvetMenuGroup[] = [
  {
    category: 'Hair',
    photo: velvetPhotos.blowdry,
    note: 'For her and for him. Consultation is always free. Prices include wash and finish.',
    items: [
      {
        name: "Women's haircut and style",
        price: '₹599',
        line: 'Consultation, wash, precision cut, blow dry',
        slug: 'velvet-haircut',
      },
      {
        name: "Men's haircut and style",
        price: '₹499',
        line: 'Scissor or clipper cut, wash, hot towel, styling',
        slug: 'velvet-mens-cut',
      },
      {
        name: 'Hair colour',
        price: '₹2,499',
        line: 'Global colour, highlights, balayage or grey blending',
        slug: 'velvet-colour',
      },
      {
        name: 'Keratin treatment',
        price: '₹4,999',
        line: 'Frizz-free for up to four months',
        slug: 'velvet-keratin',
      },
      { name: 'Hair spa', price: '₹1,199', line: 'Scalp massage, mask, blow dry' },
      { name: 'Kids cut (under 12)', price: '₹349' },
    ],
  },
  {
    category: 'Barber',
    photo: velvetPhotos.beardScissors,
    note: 'Straight razors, hot towels and a cold one to finish. Walk-ins welcome at the barber chairs.',
    items: [
      {
        name: 'Beard trim and shape',
        price: '₹349',
        line: 'Line-up, scissor shaping, oil',
        slug: 'velvet-beard',
      },
      { name: 'Hot towel shave', price: '₹449', line: 'Straight razor, two passes, balm' },
      { name: 'Head shave', price: '₹399' },
      { name: 'Cut and beard', price: '₹749', line: 'Haircut with beard trim and hot towel' },
      { name: 'Grey coverage', price: '₹899', line: 'Natural-looking, ten minutes' },
    ],
  },
  {
    category: 'Skin',
    photo: velvetPhotos.facial,
    note: 'Skin reading first, then the treatment. Beard-safe options for him.',
    items: [
      {
        name: 'Glow facial',
        price: '₹1,299',
        line: 'Cleanse, exfoliate, massage, mask',
        slug: 'velvet-facial',
      },
      { name: 'Clean-up', price: '₹699' },
      { name: 'De-tan', price: '₹899', line: 'Face and neck' },
      { name: 'Waxing (full arms)', price: '₹499' },
      { name: 'Threading', price: '₹99', line: 'Eyebrows or upper lip' },
    ],
  },
  {
    category: 'Nails and makeup',
    photo: velvetPhotos.nailsDark,
    note: 'Nail art by appointment. Evening and bridal makeup with a trial.',
    items: [
      {
        name: 'Manicure and pedicure',
        price: '₹1,099',
        line: 'Shaping, cuticle care, scrub, polish',
        slug: 'velvet-mani-pedi',
      },
      { name: 'Gel polish', price: '₹799' },
      { name: 'Nail art (per set)', price: '₹1,499' },
      { name: 'Party makeup', price: '₹2,499', line: 'HD makeup with hairstyle' },
      {
        name: 'Bridal makeup trial',
        price: '₹2,999',
        line: 'Credited when you book a package',
        slug: 'velvet-bridal',
      },
    ],
  },
]

export type VelvetBridalPackage = {
  slug: string
  name: string
  price: string
  priceNote: string
  line: string
  included: readonly string[]
  photo: DemoPhoto
}

export const velvetBridal: readonly VelvetBridalPackage[] = [
  {
    slug: 'engagement',
    name: 'Engagement',
    price: '₹8,500',
    priceNote: 'one look, at the salon or at home',
    line: 'HD makeup, hairstyle and draping for the engagement evening.',
    included: ['Trial credited', 'HD makeup and hairstyle', 'Saree or lehenga draping', 'Touch-up kit'],
    photo: velvetPhotos.makeupEye,
  },
  {
    slug: 'muhurtham',
    name: 'Muhurtham',
    price: '₹18,000',
    priceNote: 'two looks, two artists, at the venue',
    line: 'The wedding morning, handled. We arrive before you wake.',
    included: [
      'Two artists at the venue',
      'Muhurtham and reception looks',
      'Hair, draping, jewellery setting',
      'Mother and sister, 20% off',
    ],
    photo: velvetPhotos.heroPortrait,
  },
  {
    slug: 'reception',
    name: 'Reception only',
    price: '₹9,500',
    priceNote: 'one look, at the venue',
    line: 'A dramatic evening look that lasts until the last photo.',
    included: [
      'Airbrush option',
      'Hairstyle with extensions',
      'Lash application',
      'On-site touch-up for 2 hours',
    ],
    photo: velvetPhotos.brushes,
  },
]

/** The groom's side of the wedding morning, added to any package or booked alone. */
export const velvetGroom = {
  name: "Groom's morning",
  price: '₹4,500',
  priceNote: 'at the venue, with any package, or alone',
  line: 'Haircut, beard shaping, hot towel shave and a de-tan facial the day before; styling at the venue on the morning.',
  included: [
    'Cut and beard the day before',
    'De-tan facial and hand care',
    'Venue styling on the morning',
    'Groomsmen, 20% off',
  ],
  photo: velvetPhotos.barber,
} as const

export const velvetBridalSteps = [
  {
    title: 'Consultation',
    line: 'Thirty minutes with Meera. Photos of your outfit, jewellery and the venue light.',
  },
  { title: 'Trial', line: 'A full look, photographed in daylight and tungsten. Adjust anything.' },
  { title: 'Lock the date', line: '50% advance on WhatsApp. We block the morning for you alone.' },
  { title: 'The day', line: 'We arrive two hours before. Touch-up kit stays with you.' },
] as const

export const velvetBridalFaq = [
  {
    q: 'How early should I book?',
    a: 'Three months for the wedding season (November to February), six weeks otherwise. Trials happen two to four weeks before.',
  },
  {
    q: 'Do you travel to the venue?',
    a: 'Yes, anywhere in Chennai at no charge. Outside the city, travel is added at cost.',
  },
  {
    q: 'What if I want to change the look after the trial?',
    a: 'That is what the trial is for. One more session is free if the change is big.',
  },
  {
    q: 'Which products do you use?',
    a: 'MAC, Bobbi Brown, Huda Beauty and Forest Essentials for skin prep. Tell us about allergies at the consultation.',
  },
] as const

/** Extra items after the service categories in the type band under the stats. */
export const velvetMarqueeExtras = ['For him', 'For her', 'T. Nagar', 'Est. 2014'] as const
