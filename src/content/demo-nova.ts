import type { DemoPhoto } from '@/components/demos-shared/photo'

/**
 * Content for the Booking demo (Nova Studio), a wellness studio presented
 * like a boutique resort. Sample business. Photos: public/demos/booking/photos
 * (Unsplash licence, see CREDITS.md there).
 */

const P = '/demos/booking/photos'
const photo = (file: string, alt: string): DemoPhoto => ({ src: `${P}/${file}.webp`, alt })

export const novaPhotos = {
  hero: photo('hero-deck', 'A wooden deck with loungers facing the sea at sunset'),
  bath: photo('hero-bath', 'A stone bath beside a palm in a sunlit room'),
  pool: photo('pool', 'A resort pool lined with palms and terracotta urns'),
  sunset: photo('resort-sunset', 'A resort terrace at sunset above the sea'),
  candles: photo('candles', 'Candles and incense sticks on a towel'),
  sauna: photo('sauna', 'A wooden sauna lit by a single lamp'),
  towel: photo('towel', 'A rolled towel, lotion and tulips on a white table'),
  sea: photo('sea', 'Sea water catching the light'),
  yoga: photo('yoga-beach', 'A yoga class on the beach at dawn'),
  dropper: photo('oil-dropper', 'A hand holding a dropper of aromatic oil'),
}

/** Room-style detail per bookable service (slugs match the business config). */
export type NovaTreatment = {
  slug: string
  photo: DemoPhoto
  label: string
  room: string
  included: readonly string[]
  goodFor: string
  rating: string
}

export const novaTreatments: readonly NovaTreatment[] = [
  {
    slug: 'signature-facial',
    photo: photo('facial', 'A facial treatment in a calm, bright room'),
    label: 'Skin · 60 min',
    room: 'Garden room',
    included: ['Skin reading', 'Steam and cleanse', 'Hydrating mask', 'Herbal tea after'],
    goodFor: 'A monthly reset, or the week before an event.',
    rating: '4.9',
  },
  {
    slug: 'deep-tissue-massage',
    photo: photo('massage-stones', 'Warm stones laid out for a treatment'),
    label: 'Body · 60 min',
    room: 'Sea room',
    included: ['Warm towels', 'Aromatic oil of your choice', 'Quiet rest after', 'Herbal tea'],
    goodFor: 'Desk shoulders, long weeks, post-travel.',
    rating: '4.8',
  },
  {
    slug: 'hair-spa',
    photo: photo('hair-mask', 'Hair care products on a pale shelf'),
    label: 'Hair · 45 min',
    room: 'Salon room',
    included: ['Scalp care', 'Nourishing mask', 'Blow dry', 'Product note to take home'],
    goodFor: 'Dry or coloured hair, humid-season frizz.',
    rating: '4.9',
  },
  {
    slug: 'skin-consultation',
    photo: photo('skin-portrait', 'A calm portrait in soft light'),
    label: 'Consult · 30 min',
    room: 'Studio',
    included: ['One-to-one skin assessment', 'Written care plan', 'Product suggestions, no selling'],
    goodFor: 'Before you spend on anything else.',
    rating: '5.0',
  },
]

export const novaTreatmentBySlug = (slug: string) => novaTreatments.find((t) => t.slug === slug)

/** Pinned horizontal story on the home page: a visit, step by step. */
export const novaVisit = [
  {
    photo: photo('towel', 'A rolled towel and tulips'),
    title: 'Arrive',
    line: 'Fifteen minutes early, phone away, a cool towel and a glass of water.',
  },
  {
    photo: photo('candles', 'Candles on a towel'),
    title: 'Settle',
    line: 'A quiet room, your name on the door, the lights already low.',
  },
  {
    photo: photo('hero-bath', 'A stone bath beside a palm'),
    title: 'Treatment',
    line: 'Sixty minutes that are only about you. No clock on the wall.',
  },
  {
    photo: photo('resort-sunset', 'A terrace at sunset'),
    title: 'Rest',
    line: 'Tea on the terrace. Leave when you are ready, not when we are.',
  },
] as const

export const novaStats = [
  { value: 4.9, decimals: 1, suffix: '', label: 'Average rating' },
  { value: 212, decimals: 0, suffix: '+', label: 'Reviews on Google' },
  { value: 98, decimals: 0, suffix: '%', label: 'Appointments on time' },
  { value: 6, decimals: 0, suffix: '', label: 'Years in Anna Nagar' },
] as const

export const novaPerks = [
  { title: 'Free rescheduling', line: 'Move your slot up to two hours before, on WhatsApp.' },
  { title: 'Member price', line: 'Monthly members save 15% on every visit.' },
  { title: 'Reminder the evening before', line: 'A short WhatsApp with directions and parking.' },
] as const

export type NovaPlan = {
  slug: string
  name: string
  price: string
  priceNote: string
  line: string
  included: readonly string[]
  photo: DemoPhoto
}

export const novaPlans: readonly NovaPlan[] = [
  {
    slug: 'monthly',
    name: 'Monthly',
    price: '₹2,999',
    priceNote: 'per month, two sessions',
    line: 'Two treatments a month, any room.',
    included: ['Two 60-minute sessions', 'Priority slots on weekends', '15% off extras', 'Pause any month'],
    photo: photo('yoga-beach', 'A class on the beach at dawn'),
  },
  {
    slug: 'five-pack',
    name: 'Five sessions',
    price: '₹7,999',
    priceNote: 'valid for six months',
    line: 'Five visits, used whenever you like.',
    included: ['Any five treatments', 'Share with family', 'Free rescheduling', 'Six-month validity'],
    photo: photo('pool', 'A resort pool lined with palms'),
  },
  {
    slug: 'gift',
    name: 'Gift card',
    price: '₹1,500 to ₹10,000',
    priceNote: 'any amount, sent on WhatsApp',
    line: 'A card with their name and a date of their choosing.',
    included: ['Delivered as a WhatsApp card', 'Valid for a year', 'Any treatment', 'Add a message'],
    photo: photo('candles', 'Candles and incense on a towel'),
  },
]

export const novaFaq = [
  { q: 'What should I bring?', a: 'Nothing. Robes, towels and slippers are ready in your room.' },
  { q: 'Can I come with a friend?', a: 'Yes. Book two slots at the same time and we open the double room.' },
  { q: 'Is parking available?', a: 'Two spots behind the building, and a public lot one street away.' },
  { q: 'How do I pay?', a: 'UPI or card at the studio. Members and gift cards are prepaid.' },
] as const

/** The promise: revealed line by line under a gold rule on desktop (Motion v2). */
export const novaManifesto =
  'An hour that is only about you. No clock on the wall, no phone in your hand, no one waiting at the desk.'
