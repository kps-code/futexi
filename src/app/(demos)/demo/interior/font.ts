import { Playfair_Display } from 'next/font/google'

/** Editorial serif for Atelier Nila headings. One weight keeps the font budget small. */
export const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-playfair',
  display: 'swap',
})
