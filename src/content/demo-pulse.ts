import type { DemoPhoto } from '@/components/demos-shared/photo'

/**
 * Content for the AI-powered business demo (Pulse Fitness). Sample business.
 * Photos: public/demos/ai-business/photos (Unsplash licence, see CREDITS.md).
 * Class names and timings match the assistant's knowledge base (src/lib/ai-demo.ts).
 */

const P = '/demos/ai-business/photos'
const photo = (file: string, alt: string): DemoPhoto => ({ src: `${P}/${file}.webp`, alt })

export const pulsePhotos = {
  hero: photo('hero-squat', 'A lifter under the bar, mid back squat'),
  heroAlt: photo('hero-deadlift', 'A deadlift setup in low light'),
  floorDark: photo('floor-dark', 'The gym floor at night'),
  floorBright: photo('floor-bright', 'Machines on the training floor in daylight'),
  floorWide: photo('floor-wide', 'The open training floor'),
  dumbbells: photo('dumbbells', 'A rack of dumbbells'),
  press: photo('press', 'A chest press on the machine'),
}

export type PulseClassType = 'hiit' | 'strength' | 'yoga' | 'zumba' | 'spin' | 'boxing'

export const pulseClasses: readonly {
  key: PulseClassType
  name: string
  line: string
  minutes: number
  level: string
  photo: DemoPhoto
}[] = [
  {
    key: 'hiit',
    name: 'HIIT',
    line: 'Forty-five minutes, intervals, no machines.',
    minutes: 45,
    level: 'All levels',
    photo: photo('class-hiit', 'Battle ropes on the turf'),
  },
  {
    key: 'strength',
    name: 'Strength',
    line: 'Coached barbell work in groups of six.',
    minutes: 60,
    level: 'Beginner to advanced',
    photo: photo('class-strength', 'A deadlift from the floor'),
  },
  {
    key: 'yoga',
    name: 'Yoga',
    line: 'Mobility first, breath second, sweat third.',
    minutes: 60,
    level: 'All levels',
    photo: photo('class-yoga', 'A yoga pose at sunset'),
  },
  {
    key: 'zumba',
    name: 'Zumba',
    line: 'Dance cardio. Loud, fast, fun.',
    minutes: 45,
    level: 'All levels',
    photo: photo('class-zumba', 'A floor class on mats'),
  },
  {
    key: 'spin',
    name: 'Spin',
    line: 'Thirty bikes, one playlist, hills and sprints.',
    minutes: 45,
    level: 'All levels',
    photo: photo('class-spin', 'A spin class in progress'),
  },
  {
    key: 'boxing',
    name: 'Boxing',
    line: 'Pads, bags, footwork. Gloves provided.',
    minutes: 60,
    level: 'Intermediate',
    photo: photo('class-boxing', 'A boxer between rounds'),
  },
]

/** Weekly timetable. Days: 0 = Monday. */
export type PulseSlot = { day: number; time: string; cls: PulseClassType; coach: string; spots: number }

const everyDay = (
  time: string,
  cls: PulseClassType,
  coach: string,
  spots: number,
  days = [0, 1, 2, 3, 4, 5],
) => days.map((day) => ({ day, time, cls, coach, spots }))

export const pulseSchedule: readonly PulseSlot[] = [
  ...everyDay('6:00 AM', 'hiit', 'Arun', 12),
  ...everyDay('6:00 AM', 'spin', 'Divya', 30),
  ...everyDay('6:30 AM', 'yoga', 'Meenakshi', 20),
  ...everyDay('7:00 AM', 'hiit', 'Arun', 12),
  ...everyDay('8:00 AM', 'strength', 'Karthik', 6),
  ...everyDay('10:00 AM', 'strength', 'Karthik', 6),
  ...everyDay('11:00 AM', 'strength', 'Priya', 6, [0, 1, 2, 3, 4]),
  ...everyDay('5:00 PM', 'strength', 'Priya', 6),
  ...everyDay('6:00 PM', 'yoga', 'Meenakshi', 20),
  ...everyDay('7:00 PM', 'hiit', 'Arun', 12),
  ...everyDay('7:00 PM', 'boxing', 'Sam', 10, [1, 3, 5]),
  ...everyDay('7:30 PM', 'zumba', 'Divya', 25),
  ...everyDay('8:00 PM', 'spin', 'Divya', 30),
  ...everyDay('8:00 PM', 'strength', 'Karthik', 6),
  { day: 6, time: '7:00 AM', cls: 'yoga', coach: 'Meenakshi', spots: 20 },
  { day: 6, time: '8:00 AM', cls: 'hiit', coach: 'Arun', spots: 12 },
  { day: 6, time: '9:00 AM', cls: 'strength', coach: 'Karthik', spots: 6 },
  { day: 6, time: '11:00 AM', cls: 'zumba', coach: 'Divya', spots: 25 },
]

export const pulseDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export type PulseCoach = {
  name: string
  role: string
  certs: readonly string[]
  focus: string
  years: number
  photo: DemoPhoto
}

export const pulseCoaches: readonly PulseCoach[] = [
  {
    name: 'Karthik R.',
    role: 'Head coach · Strength',
    certs: ['ACE CPT', 'K11 Level 2'],
    focus: 'Barbell basics, powerlifting, injury-safe progressions.',
    years: 11,
    photo: photo('coach-curl', 'Karthik mid set'),
  },
  {
    name: 'Priya S.',
    role: 'Strength and conditioning',
    certs: ['K11 CPT', 'Precision Nutrition L1'],
    focus: 'Women’s strength, postpartum return, nutrition plans.',
    years: 7,
    photo: photo('coach-back', 'Priya on the floor'),
  },
  {
    name: 'Arun M.',
    role: 'HIIT and conditioning',
    certs: ['ACE GFI', 'CrossFit L1'],
    focus: 'Intervals, running form, fat loss blocks.',
    years: 8,
    photo: photo('coach-session', 'Arun coaching a push-up'),
  },
  {
    name: 'Sam D.',
    role: 'Boxing',
    certs: ['AIBA 1-star'],
    focus: 'Pads, footwork, confidence for beginners.',
    years: 9,
    photo: photo('coach-focus', 'Sam between rounds'),
  },
]

export type PulseTransformation = {
  name: string
  age: number
  weeks: number
  before: string
  after: string
  metric: string
  quote: string
  photo: DemoPhoto
}

export const pulseTransformations: readonly PulseTransformation[] = [
  {
    name: 'Vignesh',
    age: 31,
    weeks: 12,
    before: '92 kg',
    after: '81 kg',
    metric: 'Body weight',
    quote: 'The assistant booked my trial at midnight. Karthik did the rest.',
    photo: photo('member-pushup', 'A member doing push-ups with dumbbells'),
  },
  {
    name: 'Lakshmi',
    age: 38,
    weeks: 16,
    before: '40 kg',
    after: '85 kg',
    metric: 'Deadlift',
    quote: 'Priya built the plan around school pickups. It worked.',
    photo: photo('member-core', 'A member doing sit-ups'),
  },
  {
    name: 'Rahul',
    age: 26,
    weeks: 10,
    before: '31:40',
    after: '24:05',
    metric: '5 km time',
    quote: 'HIIT at 6 AM, three days a week. That is all it took.',
    photo: photo('member-run', 'A member on a stair run'),
  },
]

export const pulseStats = [
  { value: 1240, suffix: '+', label: 'Active members' },
  { value: 96, suffix: '', label: 'Classes a week' },
  { value: 8, suffix: '', label: 'Certified coaches' },
  { value: 24, suffix: '/7', label: 'Questions answered by AI' },
] as const

export const pulseAiCards = [
  {
    title: 'Weekly goal',
    value: 82,
    unit: '%',
    line: '4 of 5 sessions done. One more and the streak holds.',
  },
  {
    title: 'Resting heart rate',
    value: 58,
    unit: 'bpm',
    line: 'Down from 67 since January. Keep the zone-2 work.',
  },
  { title: 'Next session', value: 0, unit: '', line: 'Strength · Thu 8 PM · Coach Karthik · Spot held' },
] as const
