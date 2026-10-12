/**
 * Sliding-window rate limiter.
 *
 * In-memory implementation: correct per server instance, which is enough to
 * stop a single abusive client on a small site. Swap `createLimiter` for an
 * Upstash-backed one when traffic justifies it; callers only use `check()`.
 */

export type RateLimitResult = { ok: boolean; remaining: number; resetAt: number }

export type Limiter = {
  check(key: string): RateLimitResult
}

export function createLimiter(max: number, windowMs: number): Limiter {
  const hits = new Map<string, number[]>()
  let lastSweep = Date.now()

  function sweep(now: number) {
    if (now - lastSweep < windowMs) return
    lastSweep = now
    for (const [key, times] of hits) {
      const kept = times.filter((t) => now - t < windowMs)
      if (kept.length) hits.set(key, kept)
      else hits.delete(key)
    }
  }

  return {
    check(key) {
      const now = Date.now()
      sweep(now)
      const times = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
      if (times.length >= max) {
        return { ok: false, remaining: 0, resetAt: times[0] + windowMs }
      }
      times.push(now)
      hits.set(key, times)
      return { ok: true, remaining: max - times.length, resetAt: now + windowMs }
    },
  }
}

// Shared limiters (module singletons survive across requests within an instance).
export const trackLimiterByVisitor = createLimiter(60, 60_000)
export const trackLimiterByIp = createLimiter(600, 60_000)
export const contactLimiterByIp = createLimiter(5, 10 * 60_000)
export const feedbackLimiterByIp = createLimiter(5, 10 * 60_000)
