import type { DemoPhoto } from '@/components/demos-shared/photo'

/**
 * Photos and extra content for the Tuition Centre demo (Vidya Academy).
 * Sample business. Photos: public/demos/tuition/photos (Unsplash licence,
 * see CREDITS.md there). Fees and batches stay in demo-businesses.ts and
 * demo-tuition.ts.
 */

const P = '/demos/tuition/photos'
const photo = (file: string, alt: string): DemoPhoto => ({ src: `${P}/${file}.webp`, alt })

export const vidyaPhotos = {
  hero: photo('hero-students', 'Students in class, one standing with a notebook'),
  heroSmile: photo('hero-smile', 'A student smiling at her desk'),
  classroom: photo('classroom', 'A teacher at the board with a full class'),
  board: photo('board', 'A teacher solving a problem on the chalkboard'),
  groupStudy: photo('group-study', 'Students around a laptop'),
  notes: photo('notes', 'A student writing in a notebook'),
  library: photo('library', 'A library aisle'),
  books: photo('books', 'A stack of notebooks'),
  writing: photo('writing', 'Writing notes beside a cup of tea'),
  studyGroup: photo('study-group', 'Three students studying together'),
  graduation: photo('graduation', 'Graduates throwing their caps'),
  friends: photo('friends', 'A group of students outside'),
  teacherDesk: photo('teacher-desk', 'A teacher with students at a desk'),
  classroomEmpty: photo('classroom-empty', 'An empty classroom'),
  kids: photo('kids', 'Younger students smiling'),
  laptop: photo('laptop', 'A student with headphones at a laptop'),
}

/** Course detail per fee card (slugs match the business config). */
export type VidyaCourse = {
  slug: string
  photo: DemoPhoto
  tint: 'mint' | 'peach' | 'sky'
  covers: readonly string[]
  batchSize: number
  timing: string
  tests: string
  goodFor: string
}

export const vidyaCourses: readonly VidyaCourse[] = [
  {
    slug: 'vidya-class10',
    photo: photo('notes', 'Notes'),
    tint: 'sky',
    covers: [
      'Full CBSE and State syllabus',
      'Chapter tests every Saturday',
      'Board paper practice from January',
    ],
    batchSize: 15,
    timing: 'Mon, Wed, Fri · 5 to 7 PM',
    tests: 'Weekly',
    goodFor: 'Students aiming for 90+ in boards',
  },
  {
    slug: 'vidya-pcm',
    photo: photo('board', 'Board'),
    tint: 'mint',
    covers: ['Physics, Chemistry, Maths', 'NCERT first, then reference books', 'Lab practicals support'],
    batchSize: 15,
    timing: 'Tue, Thu, Sat · 5:30 to 8 PM',
    tests: 'Weekly + monthly cumulative',
    goodFor: 'Class 11 and 12, engineering track',
  },
  {
    slug: 'vidya-pcb',
    photo: photo('classroom', 'Classroom'),
    tint: 'peach',
    covers: ['Physics, Chemistry, Biology', 'Diagram and definition drills', 'Board plus NEET bridge'],
    batchSize: 15,
    timing: 'Tue, Thu, Sat · 5:30 to 8 PM',
    tests: 'Weekly + monthly cumulative',
    goodFor: 'Class 11 and 12, medical track',
  },
  {
    slug: 'vidya-neet',
    photo: photo('study-group', 'Study group'),
    tint: 'mint',
    covers: ['Full NEET syllabus in two years', 'Twenty full-length mocks', 'OMR practice and time strategy'],
    batchSize: 20,
    timing: 'Sat, Sun · 9 AM to 1 PM',
    tests: 'Weekly + mock every fortnight',
    goodFor: 'Class 11 onwards',
  },
  {
    slug: 'vidya-jee',
    photo: photo('writing', 'Writing'),
    tint: 'sky',
    covers: ['JEE Main pattern, PCM', 'Problem-solving lab on Saturdays', 'Previous ten years solved'],
    batchSize: 20,
    timing: 'Sat, Sun · 2 to 6 PM',
    tests: 'Weekly + mock every fortnight',
    goodFor: 'Class 11 onwards',
  },
  {
    slug: 'vidya-english',
    photo: photo('laptop', 'Laptop'),
    tint: 'peach',
    covers: ['Speaking from day one', 'Interview and presentation practice', 'Small conversation circles'],
    batchSize: 10,
    timing: 'Mon to Fri · 7 to 8 AM',
    tests: 'Monthly speaking assessment',
    goodFor: 'Class 8 upwards, and parents',
  },
]

export const vidyaStats = [
  { value: 96, suffix: '%', label: 'Scored 90+ in Class 10 boards, 2026' },
  { value: 38, suffix: '', label: 'NEET qualifiers in two years' },
  { value: 12, suffix: '', label: 'JEE Main qualifiers, 2026' },
  { value: 15, suffix: '', label: 'Students per batch, maximum' },
] as const

export const vidyaYears = [
  { year: 2024, boards90: 88, neet: 11, jee: 4 },
  { year: 2025, boards90: 93, neet: 15, jee: 7 },
  { year: 2026, boards90: 96, neet: 23, jee: 12 },
] as const

export type VidyaTopper = { name: string; score: string; exam: string; now: string; photo: DemoPhoto }

export const vidyaToppers: readonly VidyaTopper[] = [
  {
    name: 'Harini S.',
    score: '98.2%',
    exam: 'Class 12 CBSE, 2026',
    now: 'B.Com, Loyola College',
    photo: photo('hero-smile', 'Harini'),
  },
  {
    name: 'Mohammed A.',
    score: '648',
    exam: 'NEET 2026',
    now: 'MBBS, Stanley Medical College',
    photo: photo('friends', 'Mohammed with friends'),
  },
  {
    name: 'Dev Krishnan',
    score: '99.1 percentile',
    exam: 'JEE Main 2026',
    now: 'B.Tech CSE, NIT Trichy',
    photo: photo('graduation', 'Graduation day'),
  },
  {
    name: 'Ananya R.',
    score: '97.4%',
    exam: 'Class 10 CBSE, 2026',
    now: 'Class 11 PCB batch',
    photo: photo('kids', 'Ananya'),
  },
]

export const vidyaParentVoices = [
  {
    quote: 'Weekly test reports on WhatsApp meant I always knew where my son stood.',
    name: 'Parent of a Class 10 student',
  },
  {
    quote: 'Fees were the same every month, no surprise charges for material or tests.',
    name: 'Parent of a NEET student',
  },
  {
    quote: 'The doubt-clearing hour after class is the reason we stayed three years.',
    name: 'Parent of a Class 12 student',
  },
] as const

export const vidyaFaq = [
  {
    q: 'Is there a demo class?',
    a: 'Yes, one free class in any batch. Come with your notebook; no registration needed.',
  },
  {
    q: 'How are fees paid?',
    a: 'Monthly, by UPI or cash, on or before the 5th. Material and tests are included; nothing is charged separately.',
  },
  {
    q: 'What if my child misses a class?',
    a: 'Every class is summarised on WhatsApp the same evening, and the Saturday doubt hour covers missed topics.',
  },
  {
    q: 'Do you share progress with parents?',
    a: 'A test report every week on WhatsApp, and a ten-minute parent call every month.',
  },
] as const

/** The promise, typed onto the board on desktop (Motion v2). */
export const vidyaManifesto =
  'Fifteen students in a room. One teacher who knows every name, and which chapter each of them is stuck on.'
