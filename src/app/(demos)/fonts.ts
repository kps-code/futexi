import {
  Anton,
  Bebas_Neue,
  DM_Serif_Display,
  Inter,
  Lexend,
  Montserrat,
  Nunito,
  Plus_Jakarta_Sans,
  Sora,
  Space_Grotesk,
} from 'next/font/google'
import type { DemoBusinessId } from '@/content/demo-businesses'

/**
 * Each demo site uses only its own two families (self-hosted by next/font,
 * swap display, used weights only). The class for a business goes on the
 * DemoShell root, where the theme's --dm-font-* tokens pick the variables up.
 * Preload is off on purpose: the shell imports every family, and a preload
 * hint would fetch all of them on every demo page. @font-face alone downloads
 * only the fonts a page renders.
 */

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', preload: false })
const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  preload: false,
  weight: ['500', '600', '700'],
})

// Nova Studio: red and black; one heavy condensed face for uppercase headlines, Inter body.
const anton = Anton({
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
  preload: false,
  weight: '400',
})

// Velvet Salon: a dark barber lounge; one classic serif weight, roman and italic.
const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  variable: '--font-dmserif',
  display: 'swap',
  preload: false,
  weight: '400',
  style: ['normal', 'italic'],
})
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: false,
  weight: ['300', '400', '500'],
})

// Saffron Kitchen: bold, tight headlines like a modern restaurant brand.
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  preload: false,
  weight: ['600', '700'],
})

// Pulse Fitness: loud and sporty.
const bebas = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
  preload: false,
  weight: '400',
})
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
  preload: false,
  weight: ['400', '500', '700'],
})

// Vidya Academy: friendly and readable.
const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
  preload: false,
  weight: ['600', '700'],
})
const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
  preload: false,
  weight: ['400', '600', '700'],
})

const base = `${inter.variable} ${sora.variable}`

export const demoFontClass: Record<DemoBusinessId, string> = {
  booking: `${base} ${anton.variable}`,
  salon: `${base} ${dmSerif.variable} ${montserrat.variable}`,
  'ai-business': `${base} ${bebas.variable} ${spaceGrotesk.variable}`,
  tuition: `${base} ${lexend.variable} ${nunito.variable}`,
  restaurant: `${base} ${jakarta.variable}`,
  interior: base,
}
