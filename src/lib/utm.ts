export type Utm = { source?: string; medium?: string; campaign?: string }

const MAX = 80

function clean(v: string | null): string | undefined {
  if (!v) return undefined
  const t = v.trim().slice(0, MAX)
  return t || undefined
}

/** Extract utm_* from a query string or full URL. Never throws. */
export function utmFromSearch(search: string | null | undefined): Utm {
  if (!search) return {}
  try {
    const q = search.includes('?')
      ? search.slice(search.indexOf('?'))
      : search.startsWith('?')
        ? search
        : `?${search}`
    const p = new URLSearchParams(q)
    return {
      source: clean(p.get('utm_source')),
      medium: clean(p.get('utm_medium')),
      campaign: clean(p.get('utm_campaign')),
    }
  } catch {
    return {}
  }
}

/** Hostname of a referrer, or undefined for empty/invalid/same-site. */
export function referrerHost(referrer: string | null | undefined, ownHost?: string): string | undefined {
  if (!referrer) return undefined
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '')
    if (ownHost && host === ownHost.replace(/^www\./, '')) return undefined
    return host || undefined
  } catch {
    return undefined
  }
}
