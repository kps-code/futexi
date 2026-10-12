/**
 * Build wa.me links. Number must be digits only with country code (e.g. 918883673422).
 */
export function normalizeWhatsappNumber(input: string): string {
  const digits = input.replace(/\D/g, '')
  // Indian 10-digit numbers get the 91 prefix.
  if (digits.length === 10) return `91${digits}`
  return digits
}

export function whatsappLink(number: string, message?: string): string {
  const n = normalizeWhatsappNumber(number)
  const base = `https://wa.me/${n}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

/** Display form: +91 88836 73422 */
export function formatIndianPhone(number: string): string {
  const n = normalizeWhatsappNumber(number)
  if (n.length === 12 && n.startsWith('91')) {
    return `+91 ${n.slice(2, 7)} ${n.slice(7)}`
  }
  return `+${n}`
}
