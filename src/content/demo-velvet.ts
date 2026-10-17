import type { DemoPhoto } from '@/components/demos-shared/photo'

/**
 * Content for the Salon demo (Velvet Salon), styled like a fashion editorial.
 * Sample business. Photos: public/demos/salon/photos (Unsplash licence, see
 * CREDITS.md there).
 */

const P = '/demos/salon/photos'
const photo = (file: string, alt: string): DemoPhoto => ({ src: `${P}/${file}.webp`, alt })

export const velvetPhotos = {
  heroPortrait: photo('hero-portrait', 'A close portrait with soft, even makeup'),
  heroHair: photo('hero-hair', 'Long waved hair seen from behind against a pink wall'),
  salonDark: photo('salon-dark', 'The salon floor with round mirrors and dark walls'),
  salonChairs: photo('salon-chairs', 'A row of salon chairs in black and white'),
  stylist: photo('cut-stylist', 'A stylist finishing a cut by the window'),
  wash: photo('wash', 'A client at the backwash, stylist smiling'),
  barber: photo('barber', 'A beard trim in warm light'),
  makeupEye: photo('makeup-eye', 'Eye makeup being finished with a fine brush'),
  makeupKit: photo('makeup-kit', 'A makeup kit laid out on a table'),
  brushes: photo('brushes', 'Makeup brushes in a white pot'),
  pedicure: photo('pedicure', 'A pedicure with flowers in the water'),
  facial: photo('facial', 'A clay mask being applied'),
  tools: photo('tools', 'Combs, brushes and a dryer laid out'),
}

export const velvetGallery = [
  {
    photo: photo('colour-lavender', 'Lavender global colour on long hair'),
    label: 'Global colour',
    tall: true,
  },
  { photo: photo('blowdry', 'A blow dry in progress'), label: 'Blow dry', tall: false },
  { photo: photo('client-curls', 'A client with defined curls'), label: 'Curl definition', tall: false },
  { photo: photo('makeup-eye', 'Winged eyeliner close up'), label: 'Bridal eye', tall: true },
  { photo: photo('barber-fade', 'A skin fade on the barber chair'), label: 'Skin fade', tall: false },
  { photo: photo('pedicure', 'A pedicure with flowers'), label: 'Spa pedicure', tall: false },
] as const

export const velvetTeam = [
  {
    name: 'Meera Nair',
    role: 'Creative Director',
    years: 14,
    focus: 'Colour and bridal',
    photo: photo('cut-stylist', 'Meera at the chair'),
  },
  {
    name: 'Arjun Das',
    role: 'Senior Stylist',
    years: 9,
    focus: 'Cuts, fades and keratin',
    photo: photo('beard-dryer', 'Arjun finishing a cut'),
  },
  {
    name: 'Shalini K.',
    role: 'Skin and Nails',
    years: 6,
    focus: 'Facials and nail art',
    photo: photo('wash', 'Shalini with a client'),
  },
] as const

export const velvetStats = [
  { value: 486, suffix: '+', label: 'Five-star reviews' },
  { value: 12, suffix: '', label: 'Years in T. Nagar' },
  { value: 40, suffix: '+', label: 'Brides this season' },
  { value: 9, suffix: ' to 9', label: 'Open, Tue to Sun' },
] as const

export const velvetTestimonials = [
  { quote: 'Walked in for a trim, walked out with the best balayage I have ever had.', name: 'Anitha V.' },
  { quote: 'Booked online, chair ready the moment I arrived. Zero waiting.', name: 'Rahul S.' },
  { quote: 'My bridal trial felt like a conversation, not a sales pitch.', name: 'Keerthana M.' },
] as const

/** Price list grouped by category, with a photo per group. */
export type VelvetMenuItem = { name: string; price: string; line?: string; slug?: string }
export type VelvetMenuGroup = {
  category: string
  photo: DemoPhoto
  note: string
  items: readonly VelvetMenuItem[]
}

export const velvetMenu: readonly VelvetMenuGroup[] = [
  {
    category: 'Hair',
    photo: photo('blowdry', 'A blow dry in progress'),
    note: 'Consultation is always free. Prices include wash and finish.',
    items: [
      {
        name: 'Haircut and style',
        price: '₹599',
        line: 'Consultation, wash, precision cut, blow dry',
        slug: 'velvet-haircut',
      },
      {
        name: 'Hair colour',
        price: '₹2,499',
        line: 'Global, highlights or balayage, ammonia-free available',
        slug: 'velvet-colour',
      },
      {
        name: 'Keratin treatment',
        price: '₹4,999',
        line: 'Frizz-free for up to four months',
        slug: 'velvet-keratin',
      },
      { name: 'Hair spa', price: '₹999', line: 'Scalp massage, mask, blow dry' },
      { name: 'Beard trim and shape', price: '₹299', line: 'Hot towel, trim, line-up' },
    ],
  },
  {
    category: 'Skin',
    photo: photo('facial', 'A clay mask being applied'),
    note: 'Every facial starts with a skin reading.',
    items: [
      {
        name: 'Glow facial',
        price: '₹1,299',
        line: 'Cleanse, exfoliate, massage, mask',
        slug: 'velvet-facial',
      },
      { name: 'Hydra facial', price: '₹2,499', line: 'Deep hydration for dull or dry skin' },
      { name: 'Clean-up', price: '₹699', line: 'Thirty minutes, before an event' },
      { name: 'Threading', price: '₹149', line: 'Brows, upper lip, full face from ₹349' },
    ],
  },
  {
    category: 'Nails',
    photo: photo('pedicure', 'A pedicure with flowers'),
    note: 'Gel and extensions on request.',
    items: [
      {
        name: 'Manicure and pedicure',
        price: '₹1,099',
        line: 'Shape, cuticle care, scrub, polish',
        slug: 'velvet-mani-pedi',
      },
      { name: 'Gel polish', price: '₹799', line: 'Lasts three weeks' },
      { name: 'Nail art', price: '₹99', line: 'Per nail, from' },
    ],
  },
  {
    category: 'Makeup',
    photo: photo('makeup-kit', 'A makeup kit laid out'),
    note: 'HD and airbrush. Trials are credited against the booking.',
    items: [
      { name: 'Party makeup', price: '₹2,499', line: 'With hairstyle' },
      { name: 'Bridal trial', price: '₹2,999', line: 'HD makeup with hairstyle', slug: 'velvet-bridal' },
      { name: 'Bridal, full day', price: '₹18,000', line: 'Muhurtham and reception looks, two artists' },
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
    photo: photo('makeup-eye', 'Eye makeup being finished'),
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
    photo: photo('hero-portrait', 'A soft bridal portrait'),
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
    photo: photo('brushes', 'Makeup brushes in a pot'),
  },
]

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
