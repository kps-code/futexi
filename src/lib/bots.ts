/** Shared crawler detection. Used by the proxy (request flag) and the ingest route. */
export const BOT_UA_RE =
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegrambot|preview|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|curl|wget|python-requests|go-http-client|java\/|libwww|httpclient|scrapy|phantom|selenium/i

export function isBotUserAgent(ua: string | null | undefined): boolean {
  if (!ua) return true // no UA at all is never a real browser
  return BOT_UA_RE.test(ua)
}
