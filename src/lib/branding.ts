/**
 * Branding chosen in Site Settings > Branding: an uploaded logo that replaces
 * the text wordmark, and the theme first-time visitors get.
 */

export type BrandLogo = {
  url: string
  alt: string
  /** Pixel size of the uploaded file when known (PNG, JPG). SVG uploads carry none. */
  width?: number
  height?: number
}

export type ThemeName = 'light' | 'dark'

/** Reads an uploaded media document into a logo; nothing when there is no usable file. */
export function brandLogoFrom(media: unknown, fallbackAlt: string): BrandLogo | undefined {
  if (!media || typeof media !== 'object') return undefined
  const m = media as { url?: unknown; alt?: unknown; width?: unknown; height?: unknown }
  if (typeof m.url !== 'string' || !m.url) return undefined
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : undefined)
  return {
    url: m.url,
    alt: typeof m.alt === 'string' && m.alt.trim() ? m.alt.trim() : fallbackAlt,
    width: num(m.width),
    height: num(m.height),
  }
}

/**
 * Box for rendering a logo at a fixed height. The width comes from the file's
 * aspect ratio so the browser reserves the space before the image loads (no
 * layout shift). Unknown for SVG, which the browser sizes on load.
 */
export function logoBox(logo: BrandLogo, height: number): { height: number; width?: number } {
  if (!logo.width || !logo.height) return { height }
  return { height, width: Math.max(1, Math.round((height * logo.width) / logo.height)) }
}

export function themeName(v: unknown, fallback: ThemeName = 'light'): ThemeName {
  return v === 'dark' || v === 'light' ? v : fallback
}
