import { describe, expect, it } from 'vitest'
import { brandLogoFrom, logoBox, themeName } from '@/lib/branding'

describe('brandLogoFrom', () => {
  it('ignores ids, nulls and documents without a file', () => {
    expect(brandLogoFrom(null, 'Brand')).toBeUndefined()
    expect(brandLogoFrom(12, 'Brand')).toBeUndefined()
    expect(brandLogoFrom({ alt: 'x' }, 'Brand')).toBeUndefined()
  })

  it('reads url, alt and pixel size from a media document', () => {
    expect(brandLogoFrom({ url: '/media/logo.png', alt: ' Logo ', width: 320, height: 80 }, 'Brand')).toEqual(
      {
        url: '/media/logo.png',
        alt: 'Logo',
        width: 320,
        height: 80,
      },
    )
  })

  it('falls back to the brand name as alt text and drops unknown sizes (SVG)', () => {
    expect(
      brandLogoFrom({ url: '/media/logo.svg', alt: '', width: null, height: undefined }, 'Brand'),
    ).toEqual({
      url: '/media/logo.svg',
      alt: 'Brand',
      width: undefined,
      height: undefined,
    })
  })
})

describe('logoBox', () => {
  it('derives the width from the aspect ratio at the target height', () => {
    expect(logoBox({ url: '/l.png', alt: 'l', width: 320, height: 80 }, 40)).toEqual({
      height: 40,
      width: 160,
    })
  })

  it('leaves the width open when the file size is unknown', () => {
    expect(logoBox({ url: '/l.svg', alt: 'l' }, 40)).toEqual({ height: 40 })
  })
})

describe('themeName', () => {
  it('accepts only light or dark and defaults to light', () => {
    expect(themeName('dark')).toBe('dark')
    expect(themeName('light')).toBe('light')
    expect(themeName('blue')).toBe('light')
    expect(themeName(undefined, 'dark')).toBe('dark')
  })
})
