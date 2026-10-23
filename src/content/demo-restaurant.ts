import type { DemoPhoto } from '@/components/demos-shared/photo'
import type { MenuCategory } from '@/components/demos-shared/menu-tabs'

/**
 * Content for the Restaurant demo (Saffron Kitchen). Sample business.
 * Photos: public/demos/restaurant/photos (Unsplash licence, see CREDITS.md there).
 */

const P = '/demos/restaurant/photos'
const photo = (file: string, alt: string): DemoPhoto => ({ src: `${P}/${file}.webp`, alt })

export const saffronPhotos = {
  heroFire: photo('hero-fire', 'Tandoori chicken over the open fire'),
  heroCandle: photo('hero-candle', 'Candle-lit dinner table with a plated main course'),
  about: photo('about-dining', 'The dining room with the open kitchen at the back'),
  diningRoom: photo('dining-room', 'Dim dining room with warm lamps and set tables'),
  candleTable: photo('candle-table', 'A candle-lit table laid for two'),
  celebration: photo('celebration-table', 'A long table dressed with flowers for a celebration'),
  privateHall: photo('private-hall', 'The private hall set for a corporate dinner'),
}

export const saffronMenu: readonly MenuCategory[] = [
  {
    name: 'Starters',
    items: [
      {
        name: 'Chettinad Pepper Chicken',
        line: 'Slow-fried with black pepper, curry leaf and fennel.',
        price: 349,
        spicy: true,
        popular: true,
        photo: photo('hero-fire', 'Chettinad pepper chicken'),
      },
      {
        name: 'Banana Flower Vadai',
        line: 'Crisp lentil fritters, coconut chutney.',
        price: 199,
        veg: true,
        photo: photo('vadai', 'Golden banana flower vadai with chutney'),
      },
      {
        name: 'Karaikudi Prawn Fry',
        line: 'Tiger prawns, roasted spice crust, lime.',
        price: 429,
        spicy: true,
        photo: photo('prawn-fry', 'Karaikudi prawn fry with rice'),
      },
      {
        name: 'Paniyaram Trio',
        line: 'Sweet, savoury and herb, with podi.',
        price: 179,
        veg: true,
        photo: photo('paniyaram', 'Paniyaram trio on small plates'),
      },
    ],
  },
  {
    name: 'Mains',
    items: [
      {
        name: 'Mutton Kuzhambu',
        line: 'Shoulder cut, tamarind, shallots. Served with idiyappam.',
        price: 549,
        spicy: true,
        popular: true,
        photo: photo('mutton-kuzhambu', 'Mutton kuzhambu in a dark gravy'),
      },
      {
        name: 'Kathirikai Kara Kuzhambu',
        line: 'Baby brinjal in a smoky tamarind gravy.',
        price: 299,
        veg: true,
        spicy: true,
        photo: photo('copper-curries', 'Kara kuzhambu served in copper bowls'),
      },
      {
        name: 'Meen Varuval Thali',
        line: 'Seer fish fry, rasam, poriyal, rice, appalam.',
        price: 599,
        photo: photo('thali', 'Meen varuval thali with rice and appalam'),
      },
      {
        name: 'Vegetable Biryani',
        line: 'Seeraga samba rice, seasonal vegetables, raita.',
        price: 329,
        veg: true,
        photo: photo('biryani', 'Vegetable biryani with fried onions and mint'),
      },
    ],
  },
  {
    name: 'Breads & Rice',
    items: [
      {
        name: 'Malabar Parotta (2)',
        line: 'Layered and flaky, griddled to order.',
        price: 99,
        veg: true,
        photo: photo('parotta', 'Malabar parotta with a bowl of gravy'),
      },
      {
        name: 'Ghee Rice',
        line: 'Short-grain rice, cashew, clove.',
        price: 179,
        veg: true,
        photo: photo('ghee-rice', 'Ghee rice in a brass bowl'),
      },
      { name: 'Idiyappam (4)', line: 'Steamed rice noodles.', price: 119, veg: true },
    ],
  },
  {
    name: 'Desserts & Drinks',
    items: [
      {
        name: 'Filter Coffee Panna Cotta',
        line: 'Our signature. Strong, silky, not too sweet.',
        price: 229,
        veg: true,
        popular: true,
        photo: photo('panna-cotta', 'Filter coffee panna cotta with orange and chocolate'),
      },
      { name: 'Elaneer Payasam', line: 'Tender coconut, jaggery, cardamom.', price: 199, veg: true },
      {
        name: 'Nannari Sherbet',
        line: 'Sarsaparilla root, lime, soda.',
        price: 129,
        veg: true,
        photo: photo('drinks', 'Three sherbets and coolers on the bar'),
      },
    ],
  },
]

export const saffronGallery = [
  { photo: photo('biryani', 'Biryani with fried onions'), label: 'Seeraga samba biryani' },
  { photo: photo('thali', 'Thali with rice and appalam'), label: 'Meen varuval thali' },
  {
    photo: photo('mutton-kuzhambu', 'Mutton kuzhambu simmering in a dark tamarind gravy'),
    label: 'Mutton kuzhambu',
  },
  { photo: photo('copper-curries', 'Curries in copper bowls'), label: 'From the pass' },
  { photo: photo('ghee-rice', 'Ghee rice in brass'), label: 'Ghee rice' },
  { photo: photo('drinks', 'Sherbets on the bar'), label: 'Nannari sherbet' },
  { photo: photo('dining-room', 'Dim dining room with lamps'), label: 'Dining room' },
  { photo: photo('candle-table', 'Candle-lit table for two'), label: 'Candle-light dinner' },
] as const

export const saffronOffers = [
  { title: 'Weekday lunch thali', line: 'Unlimited thali, 12 to 3 PM, Monday to Friday.', price: '₹349' },
  {
    title: 'Family Sunday',
    line: 'Tables of 6 or more get a complimentary dessert platter.',
    price: 'Free dessert',
  },
] as const

export const saffronTestimonials = [
  { quote: 'The pepper chicken alone is worth the drive across the city.', name: 'Vignesh R.' },
  { quote: 'Reserved online, table ready at 8 sharp on a Saturday. Unheard of.', name: 'Lakshmi N.' },
  { quote: 'Menu on the website meant no squinting at a blurry photo on Instagram.', name: 'Jonathan P.' },
] as const

/** Online ordering: pickup or delivery, settled on WhatsApp. */
export const saffronOrder = {
  deliveryFee: 40,
  freeDeliveryAbove: 999,
  minimumOrder: 300,
  deliveryRadiusText: 'Delivery within 5 km of Adyar, 35 to 45 minutes. Pickup in 20 minutes.',
} as const

export type PrivatePackage = {
  slug: string
  name: string
  guests: string
  price: string
  priceNote: string
  line: string
  included: readonly string[]
  photo: DemoPhoto
}

export const saffronPrivate: readonly PrivatePackage[] = [
  {
    slug: 'candle-light-dinner',
    name: 'Candle-light dinner for two',
    guests: '2 guests',
    price: '₹2,999',
    priceNote: 'per couple',
    line: 'The courtyard alcove, candles, flowers and a five-course set menu.',
    included: [
      'Private alcove for 2.5 hours',
      'Five-course Chettinad set menu',
      'Candle and flower setup',
      'Dessert plate with your message',
      'Photos by our team, sent on WhatsApp',
    ],
    photo: photo('candle-table', 'Candle-lit table for two'),
  },
  {
    slug: 'celebration-table',
    name: 'Celebration table',
    guests: '8 to 12 guests',
    price: '₹899',
    priceNote: 'per guest',
    line: 'Birthdays and anniversaries, family-style thali on one long table.',
    included: [
      'Long table by the open kitchen',
      'Family-style thali, unlimited',
      'Cake cutting with sparklers',
      'Balloon and flower decor',
      'Outside cake welcome',
    ],
    photo: photo('celebration-table', 'Long table dressed with flowers'),
  },
  {
    slug: 'private-hall',
    name: 'Private hall',
    guests: '20 to 40 guests',
    price: '₹1,199',
    priceNote: 'per guest',
    line: 'Corporate dinners and receptions, the whole hall to yourselves.',
    included: [
      'Private hall, 4 hours',
      'Custom menu with the chef',
      'Screen, mic and playlist',
      'Welcome drinks and canapes',
      'Dedicated service team',
    ],
    photo: photo('private-hall', 'Private hall set for dinner'),
  },
]

export const saffronPrivateFaq = [
  {
    q: 'How far ahead should we book?',
    a: 'Three days for the candle-light dinner, a week for the celebration table and two weeks for the hall. Weekends go first.',
  },
  {
    q: 'Can we change the menu?',
    a: 'Yes. Every package has a vegetarian version, and the chef will swap courses for allergies or favourites.',
  },
  {
    q: 'Can we bring a cake or decorations?',
    a: 'Cakes, yes, no charge. Decorations we set up for you; send a reference photo and we match it.',
  },
  {
    q: 'Is there an advance?',
    a: '50% on confirmation on WhatsApp, the rest on the day. Full refund up to 48 hours before.',
  },
] as const

/** Six signature dishes on the home page ring; photos from the gallery set. */
export const saffronSignature = [
  {
    name: 'Seeraga samba biryani',
    line: 'Small-grain rice, slow dum, fried onions',
    price: '₹449',
    photo: photo('biryani', 'Biryani with fried onions'),
  },
  {
    name: 'Mutton kuzhambu',
    line: 'Tamarind, pepper, the brass vessel',
    price: '₹499',
    photo: photo('mutton-kuzhambu', 'Mutton kuzhambu in a dark tamarind gravy'),
  },
  {
    name: 'Karaikudi prawn fry',
    line: 'Dry-roasted with curry leaf',
    price: '₹429',
    photo: photo('prawn-fry', 'Prawn fry with curry leaves'),
  },
  {
    name: 'Meen varuval thali',
    line: 'Fish fry, rice, three curries',
    price: '₹399',
    photo: photo('thali', 'Thali with rice and appalam'),
  },
  {
    name: 'Paniyaram trio',
    line: 'Sweet, spicy and herb',
    price: '₹199',
    photo: photo('paniyaram', 'Paniyaram on a banana leaf'),
  },
  {
    name: 'Palm jaggery panna cotta',
    line: 'Set with coconut cream',
    price: '₹249',
    photo: photo('panna-cotta', 'Panna cotta with palm jaggery'),
  },
] as const

/** The one-line statement under the hero, sharpened character by character on desktop. */
export const saffronStatement =
  'Every masala ground this morning. Every kuzhambu in the same brass vessel since 2018.'

/** Three facts beside the dining room photo. */
export const saffronStory = [
  { value: '2018', label: 'Wood-fired since' },
  { value: '40', label: 'Seats, plus the private hall' },
  { value: '11', label: 'Masalas ground in house' },
] as const
