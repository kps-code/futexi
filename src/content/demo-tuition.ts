/** Content for the Tuition Centre demo (Vidya Academy). Sample content. */

export const tuitionBatches = [
  {
    course: 'Class 10 · Maths & Science',
    days: 'Mon, Wed, Fri',
    time: '5:00 PM to 7:00 PM',
    seats: 'Seats left: 4',
  },
  { course: 'Class 12 · PCM', days: 'Tue, Thu, Sat', time: '5:30 PM to 8:00 PM', seats: 'Seats left: 6' },
  { course: 'Class 12 · PCB', days: 'Tue, Thu, Sat', time: '5:30 PM to 8:00 PM', seats: 'Waitlist' },
  { course: 'NEET Foundation', days: 'Sat, Sun', time: '9:00 AM to 1:00 PM', seats: 'Seats left: 9' },
  { course: 'JEE Foundation', days: 'Sat, Sun', time: '2:00 PM to 6:00 PM', seats: 'Seats left: 7' },
  { course: 'Spoken English', days: 'Mon to Fri', time: '7:00 AM to 8:00 AM', seats: 'Open' },
] as const

export const tuitionFaculty = [
  {
    name: 'R. Lakshmi',
    subject: 'Mathematics',
    years: 18,
    note: 'Former CBSE examiner. Known for making calculus feel obvious.',
  },
  {
    name: 'S. Prakash',
    subject: 'Physics',
    years: 14,
    note: 'IIT Madras alumnus. Runs the Saturday problem-solving lab.',
  },
  {
    name: 'Dr. Hema Iyer',
    subject: 'Biology',
    years: 11,
    note: 'PhD in Zoology. Her NEET batches average 620+.',
  },
  { name: 'J. Anand', subject: 'Chemistry', years: 9, note: 'Writes the centre’s own practice workbooks.' },
] as const

export const tuitionResults = {
  stats: [
    { value: '96%', label: 'Scored 90+ in Class 10 boards, 2026' },
    { value: '38', label: 'NEET qualifiers in the last two years' },
    { value: '12', label: 'JEE Main qualifiers, 2026' },
    { value: '1:15', label: 'Teacher to student ratio' },
  ],
  toppers: [
    { name: 'Harini S.', score: '98.2%', exam: 'Class 12 CBSE' },
    { name: 'Mohammed A.', score: '648', exam: 'NEET 2026' },
    { name: 'Dev Krishnan', score: '99.1 percentile', exam: 'JEE Main' },
  ],
} as const

export const tuitionTestimonials = [
  {
    quote: 'Weekly test reports on WhatsApp meant I always knew where my son stood.',
    name: 'Parent, Class 10',
  },
  { quote: 'Small batches. Teachers remember what I got wrong last week.', name: 'Harini S., Class 12' },
  { quote: 'The doubt-clearing hour after class made the difference for NEET.', name: 'Mohammed A.' },
] as const

export const tuitionGallery = [
  { tile: 'tile-ocean', label: 'Classroom A' },
  { tile: 'tile-leaf', label: 'Science lab' },
  { tile: 'tile-gold', label: 'Library corner' },
  { tile: 'tile-plum', label: 'Results day' },
] as const

export const studentClasses = ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Other'] as const
