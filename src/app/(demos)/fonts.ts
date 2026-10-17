import {
  Bebas_Neue,
  Bodoni_Moda,
  Cormorant_Garamond,
  Inter,
  Jost,
  Lexend,
  Montserrat,
  Nunito,
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

// Nova Studio: resort calm.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  preload: false,
  weight: '600',
  style: ['normal', 'italic'],
})
const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
  preload: false,
  weight: '400',
})

// Velvet Salon: fashion editorial.
const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-bodoni',
  display: 'swap',
  preload: false,
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
})
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: false,
  weight: ['300', '400', '500'],
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
  booking: `${base} ${cormorant.variable} ${jost.variable}`,
  salon: `${base} ${bodoni.variable} ${montserrat.variable}`,
  'ai-business': `${base} ${bebas.variable} ${spaceGrotesk.variable}`,
  tuition: `${base} ${lexend.variable} ${nunito.variable}`,
  restaurant: base,
  interior: base,
}
