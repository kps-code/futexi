import type { JourneyScreen } from '@/content/home'

/**
 * Phone screens for the showroom, drawn on a 2D canvas (720 × 1480). Used as
 * the texture of the 3D phone on desktop and inside the flat phone elsewhere.
 * Drawing instead of loading screenshots keeps the hero free of image bytes
 * and makes every screen crisp at any size.
 */

export const SCREEN_W = 720
export const SCREEN_H = 1480

export type ScreenFonts = { sans: string; serif: string }

type Ctx = CanvasRenderingContext2D

const rr = (g: Ctx, x: number, y: number, w: number, h: number, r: number) => {
  g.beginPath()
  g.roundRect(x, y, w, h, r)
  g.fill()
}
const dot = (g: Ctx, x: number, y: number, r: number, color: string) => {
  g.fillStyle = color
  g.beginPath()
  g.arc(x, y, r, 0, Math.PI * 2)
  g.fill()
}
const text = (
  g: Ctx,
  t: string,
  x: number,
  y: number,
  font: string,
  color: string,
  align: CanvasTextAlign = 'left',
) => {
  g.font = font
  g.fillStyle = color
  g.textAlign = align
  g.fillText(t, x, y)
  g.textAlign = 'left'
}

const INK = '#e5e9f0'
const MUTE = '#8b94a5'
const CYAN = '#22d3ee'
const GREEN = '#25d366'
const CARD = '#1b2230'
const BG = '#0d1118'

const screens: Record<JourneyScreen, (g: Ctx, f: ScreenFonts) => void> = {
  site(g, f) {
    text(g, 'Nova Studio', 48, 170, `600 34px ${f.sans}`, '#fff')
    g.fillStyle = CYAN
    rr(g, 496, 128, 176, 58, 29)
    text(g, 'Book now', 584, 167, `600 24px ${f.sans}`, '#07131a', 'center')
    const lg = g.createLinearGradient(0, 240, 0, 780)
    lg.addColorStop(0, '#1e3448')
    lg.addColorStop(1, '#0f1a26')
    g.fillStyle = lg
    rr(g, 48, 240, 624, 540, 34)
    dot(g, 520, 420, 150, 'rgba(34,211,238,.25)')
    dot(g, 200, 620, 110, 'rgba(255,255,255,.08)')
    text(g, 'Your Chennai', 48, 900, `300 76px ${f.sans}`, '#fff')
    text(g, 'studio, booked', 48, 982, `300 76px ${f.sans}`, '#fff')
    text(g, 'in a minute.', 48, 1064, `italic 76px ${f.serif}`, CYAN)
    text(g, 'A wellness and beauty studio in Anna Nagar.', 48, 1140, `27px ${f.sans}`, MUTE)
    g.fillStyle = '#fff'
    rr(g, 48, 1200, 624, 98, 49)
    text(g, 'Book a treatment', 360, 1262, `600 30px ${f.sans}`, '#0b0f1a', 'center')
  },
  salon(g, f) {
    g.fillStyle = '#14100c'
    g.fillRect(0, 100, SCREEN_W, SCREEN_H - 100)
    text(g, 'VELVET SALON', 48, 170, `600 26px ${f.sans}`, '#c9a44c')
    text(g, 'Book', 672, 170, `500 26px ${f.sans}`, '#fff', 'right')
    const lg = g.createLinearGradient(0, 240, 0, 820)
    lg.addColorStop(0, '#3a2a1e')
    lg.addColorStop(1, '#1a130e')
    g.fillStyle = lg
    rr(g, 48, 240, 624, 580, 20)
    dot(g, 360, 520, 170, 'rgba(201,164,76,.35)')
    text(g, 'Beauty,', 48, 950, `italic 110px ${f.serif}`, '#fff')
    text(g, 'redefined.', 48, 1060, `italic 110px ${f.serif}`, '#c9a44c')
    text(g, 'T. Nagar · Est. 2016 · ★ 4.9', 48, 1130, `24px ${f.sans}`, '#9c8f7c')
    g.fillStyle = '#c9a44c'
    rr(g, 48, 1190, 624, 96, 8)
    text(g, 'BOOK AN APPOINTMENT', 360, 1250, `600 24px ${f.sans}`, '#14100c', 'center')
  },
  chat(g, f) {
    g.fillStyle = '#121722'
    g.fillRect(0, 100, SCREEN_W, 120)
    dot(g, 70, 160, 10, '#34d399')
    text(g, 'Nova AI assistant', 100, 172, `600 30px ${f.sans}`, '#fff')
    text(g, 'online · replies in seconds', 100, 206, `20px ${f.sans}`, MUTE)
    const bubble = (t: string, y: number, me: boolean, w: number) => {
      g.fillStyle = me ? CYAN : CARD
      rr(g, me ? 672 - w : 48, y, w, 92, 26)
      text(g, t, me ? 672 - w + 30 : 78, y + 56, `26px ${f.sans}`, me ? '#06202a' : INK)
    }
    bubble('Hi, any slots tomorrow at 6 pm?', 300, true, 470)
    bubble('Yes! 6:00 and 6:30 pm are free for a', 430, false, 560)
    bubble('Signature Facial. Shall I book 6:00?', 500, false, 560)
    bubble('6:00 please', 650, true, 230)
    bubble('Done ✓ Confirmation sent on WhatsApp.', 780, false, 560)
    g.fillStyle = CARD
    rr(g, 48, 910, 120, 70, 22)
    for (let i = 0; i < 3; i++) dot(g, 84 + i * 26, 945, 7, i === 1 ? '#fff' : '#6b7483')
    g.fillStyle = CARD
    rr(g, 48, 1340, 624, 90, 45)
    text(g, 'Type a message…', 90, 1396, `26px ${f.sans}`, '#6b7483')
    dot(g, 626, 1385, 30, CYAN)
  },
  whatsapp(g, f) {
    g.fillStyle = '#0b141a'
    g.fillRect(0, 100, SCREEN_W, SCREEN_H - 100)
    g.fillStyle = '#1f2c34'
    g.fillRect(0, 100, SCREEN_W, 130)
    dot(g, 80, 165, 34, GREEN)
    text(g, 'KF', 80, 176, `700 26px ${f.sans}`, '#0b141a', 'center')
    text(g, 'KAPOSA FUTEXI · Leads', 140, 160, `600 30px ${f.sans}`, '#fff')
    text(g, 'business account', 140, 196, `20px ${f.sans}`, '#8696a0')
    g.fillStyle = '#fff'
    rr(g, 40, 260, 640, 130, 26)
    dot(g, 90, 325, 26, GREEN)
    text(g, 'New enquiry', 140, 312, `600 26px ${f.sans}`, '#111')
    text(g, 'Priya · Signature Facial · Tomorrow 6:00 PM', 140, 352, `22px ${f.sans}`, '#444')
    const inbound = (lines: string[], y: number) => {
      g.fillStyle = '#202c33'
      rr(g, 48, y, 560, 60 + lines.length * 40, 22)
      lines.forEach((t, i) => text(g, t, 78, y + 50 + i * 40, `25px ${f.sans}`, '#e9edef'))
      text(g, '6:02 PM', 580, y + 36 + lines.length * 40, `18px ${f.sans}`, '#8696a0', 'right')
    }
    inbound(
      ['Name: Priya S', 'Service: Signature Facial', 'Time: Tomorrow 6:00 PM', 'Phone: 98xxx xxx12'],
      460,
    )
    inbound(['Source: Website · AI assistant', 'Booking ID: NV-1082'], 760)
    g.fillStyle = '#005c4b'
    rr(g, 112, 960, 560, 100, 22)
    text(g, '📞  Call Priya back', 392, 1022, `600 28px ${f.sans}`, '#fff', 'center')
    text(g, '6:03 PM ✓✓', 650, 1050, `18px ${f.sans}`, '#8696a0', 'right')
    g.fillStyle = '#1f2c34'
    rr(g, 48, 1340, 624, 90, 45)
    text(g, 'Message', 90, 1396, `26px ${f.sans}`, '#8696a0')
  },
  booking(g, f) {
    text(g, 'Pick a date', 48, 180, `300 56px ${f.sans}`, '#fff')
    text(g, 'Signature Facial · 60 min · ₹1,800', 48, 230, `24px ${f.sans}`, MUTE)
    text(g, 'October 2026', 48, 330, `600 28px ${f.sans}`, '#fff')
    ;['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach((d, i) =>
      text(g, d, 90 + i * 90, 390, `22px ${f.sans}`, '#6b7483', 'center'),
    )
    let n = 1
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 7; c++) {
        if ((r === 0 && c < 4) || n > 31) continue
        const x = 90 + c * 90
        const y = 460 + r * 86
        if (n === 22) dot(g, x, y - 10, 34, CYAN)
        text(
          g,
          String(n),
          x,
          y,
          `${n === 22 ? '600 ' : ''}26px ${f.sans}`,
          n === 22 ? '#06202a' : n < 21 ? '#4b5563' : INK,
          'center',
        )
        n++
      }
    }
    text(g, 'Available times', 48, 960, `600 26px ${f.sans}`, '#fff')
    ;['10:00', '11:30', '4:00', '6:00', '7:30'].forEach((t, i) => {
      const x = 48 + (i % 3) * 210
      const y = 1000 + Math.floor(i / 3) * 80
      const on = t === '6:00'
      g.fillStyle = on ? CYAN : CARD
      rr(g, x, y, 190, 64, 32)
      text(
        g,
        `${t} PM${on ? ' ✓' : ''}`,
        x + 95,
        y + 41,
        `600 24px ${f.sans}`,
        on ? '#06202a' : INK,
        'center',
      )
    })
    g.fillStyle = '#fff'
    rr(g, 48, 1250, 624, 98, 49)
    text(g, 'Confirm 6:00 PM', 360, 1312, `600 30px ${f.sans}`, '#0b0f1a', 'center')
  },
  stats(g, f) {
    text(g, 'This month', 48, 180, `300 56px ${f.sans}`, '#fff')
    text(g, 'Nova Studio · October', 48, 230, `24px ${f.sans}`, MUTE)
    text(g, '128', 48, 400, `300 150px ${f.sans}`, '#fff')
    text(g, 'enquiries', 48, 450, `26px ${f.sans}`, MUTE)
    g.fillStyle = 'rgba(52,211,153,.18)'
    rr(g, 420, 320, 200, 64, 32)
    text(g, '▲ +38%', 520, 362, `600 28px ${f.sans}`, '#34d399', 'center')
    ;[38, 52, 44, 70, 64, 92, 100].forEach((h, i) => {
      const x = 48 + i * 90
      const hh = h * 3.6
      const lg = g.createLinearGradient(0, 900 - hh, 0, 900)
      lg.addColorStop(0, i === 6 ? CYAN : '#6366f1')
      lg.addColorStop(1, 'rgba(99,102,241,.1)')
      g.fillStyle = lg
      rr(g, x, 900 - hh, 60, hh, 14)
      text(g, 'AMJJASO'[i], x + 30, 950, `20px ${f.sans}`, '#6b7483', 'center')
    })
    ;(
      [
        ['Bookings', '74', CYAN],
        ['WhatsApp replies', '2 min', '#34d399'],
        ['Site visitors', '3,920', '#fff'],
      ] as const
    ).forEach(([k, v, c], i) => {
      const y = 1040 + i * 110
      g.fillStyle = '#121722'
      rr(g, 48, y, 624, 90, 20)
      text(g, k, 80, y + 56, `26px ${f.sans}`, MUTE)
      text(g, v, 640, y + 58, `600 30px ${f.sans}`, c, 'right')
    })
  },
  start(g, f) {
    const lg = g.createRadialGradient(360, 700, 50, 360, 700, 700)
    lg.addColorStop(0, '#1b2a3a')
    lg.addColorStop(1, BG)
    g.fillStyle = lg
    g.fillRect(0, 100, SCREEN_W, SCREEN_H - 100)
    text(g, "Let's build", 360, 640, `300 96px ${f.sans}`, '#fff', 'center')
    text(g, 'yours.', 360, 750, `italic 110px ${f.serif}`, CYAN, 'center')
    text(g, 'First concept in 7 days.', 360, 830, `26px ${f.sans}`, MUTE, 'center')
    g.fillStyle = GREEN
    rr(g, 110, 920, 500, 98, 49)
    text(g, 'WhatsApp us', 360, 982, `600 30px ${f.sans}`, '#06202a', 'center')
  },
}

/** Draws one screen into a fresh canvas. Call after `document.fonts.ready`. */
export function drawScreen(kind: JourneyScreen, fonts: ScreenFonts): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = SCREEN_W
  c.height = SCREEN_H
  const g = c.getContext('2d')
  if (!g) return c
  g.fillStyle = BG
  g.fillRect(0, 0, SCREEN_W, SCREEN_H)
  screens[kind](g, fonts)
  // Status bar and notch, drawn last so they sit above every screen.
  text(g, '9:41', 48, 66, `600 28px ${fonts.sans}`, '#fff')
  text(g, '●●●  ▮', 672, 66, `600 22px ${fonts.sans}`, '#fff', 'right')
  g.fillStyle = BG
  rr(g, 260, 20, 200, 44, 22)
  return c
}

/** Font family strings for the canvas, read from the page's font variables. */
export function screenFonts(scope?: Element): ScreenFonts {
  const css = getComputedStyle(scope ?? document.documentElement)
  const sans = css.getPropertyValue('--font-inter').trim() || 'system-ui, sans-serif'
  const serif = css.getPropertyValue('--font-serif-accent').trim() || 'Georgia, serif'
  return { sans, serif }
}
