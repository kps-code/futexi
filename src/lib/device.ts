/** Small, dependency-free user agent classifier. Good enough for a dashboard split. */

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export type DeviceInfo = {
  device: DeviceType
  browser: string
  os: string
}

export function parseDevice(ua: string | null | undefined): DeviceInfo {
  const s = ua ?? ''
  const device: DeviceType = /ipad|tablet|(android(?!.*mobile))/i.test(s)
    ? 'tablet'
    : /mobi|iphone|ipod|android|blackberry|windows phone/i.test(s)
      ? 'mobile'
      : 'desktop'

  const os = /windows nt/i.test(s)
    ? 'Windows'
    : /android/i.test(s)
      ? 'Android'
      : /iphone|ipad|ipod/i.test(s)
        ? 'iOS'
        : /mac os x|macintosh/i.test(s)
          ? 'macOS'
          : /cros/i.test(s)
            ? 'ChromeOS'
            : /linux/i.test(s)
              ? 'Linux'
              : 'Other'

  const browser = /edg\//i.test(s)
    ? 'Edge'
    : /opr\/|opera/i.test(s)
      ? 'Opera'
      : /samsungbrowser/i.test(s)
        ? 'Samsung Internet'
        : /chrome|crios/i.test(s)
          ? 'Chrome'
          : /firefox|fxios/i.test(s)
            ? 'Firefox'
            : /safari/i.test(s)
              ? 'Safari'
              : 'Other'

  return { device, browser, os }
}
