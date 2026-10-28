import { formatIndianPhone, normalizeWhatsappNumber, whatsappLink } from '@/lib/whatsapp'

/**
 * Notification emails sent to the owner: a new lead from the contact form and new feedback
 * from the testimonial form. Table-based HTML with inline styles so Gmail and Outlook render it,
 * plus a plain-text twin. Every user-entered string is escaped before it reaches the HTML.
 */

const BRAND = 'KAPOSA FUTEXI'
const INK = '#111827'
const MUTED = '#6b7280'
const LINE = '#e5e7eb'
const FONT = 'Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif'

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function whenInIndia(date: Date): string {
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function hostOf(url: string | undefined): string | undefined {
  if (!url) return undefined
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url.slice(0, 60)
  }
}

type Chip = { text: string; tone?: 'accent' | 'dark' }
type Row = { label: string; value: string; href?: string; empty?: boolean }
type Button = { text: string; href: string; tone: 'whatsapp' | 'dark' | 'light' }

type Shell = {
  preheader: string
  meta: string
  eyebrow: string
  title: string
  chips: Chip[]
  buttons: Button[]
  messageLabel: string
  message: string
  rows: Row[]
  adminHref: string
  adminText: string
  adminNote: string
  footer: string
}

function chip(c: Chip): string {
  const bg = c.tone === 'accent' ? '#a7f3d0' : '#374151'
  const color = c.tone === 'accent' ? INK : '#ffffff'
  return `<span style="display:inline-block;font-size:12px;font-weight:600;color:${color};background:${bg};border-radius:999px;padding:4px 10px;margin:0 5px 4px 0;">${escapeHtml(c.text)}</span>`
}

function button(b: Button): string {
  const style =
    b.tone === 'whatsapp'
      ? 'background:#25d366;color:#ffffff;padding:9px 14px;'
      : b.tone === 'dark'
        ? `background:${INK};color:#ffffff;padding:9px 14px;`
        : `background:#ffffff;color:${INK};padding:8px 14px;border:1px solid #d1d5db;`
  return `<a href="${escapeHtml(b.href)}" style="display:inline-block;text-decoration:none;font-size:13px;font-weight:600;border-radius:999px;${style}">${escapeHtml(b.text)}</a>`
}

function row(r: Row, last: boolean): string {
  const border = last ? '' : `border-bottom:1px solid #f3f4f6;`
  const value = r.empty
    ? `<span style="color:#9ca3af;">${escapeHtml(r.value)}</span>`
    : r.href
      ? `<a href="${escapeHtml(r.href)}" style="color:${INK};text-decoration:underline;">${escapeHtml(r.value)}</a>`
      : escapeHtml(r.value)
  return `<tr><td style="padding:5px 0;${border}color:${MUTED};width:38%;vertical-align:top;">${escapeHtml(r.label)}</td><td style="padding:5px 0;${border}color:${INK};">${value}</td></tr>`
}

function shellHtml(s: Shell): string {
  const label = (text: string) =>
    `<div style="font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:${MUTED};margin-bottom:5px;">${escapeHtml(text)}</div>`
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(s.title)}</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:${FONT};color:${INK};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(s.preheader)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:18px 12px;"><tr><td align="center">
<table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;">
<tr><td style="padding:0 4px 10px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>
<td style="font-size:13px;font-weight:700;letter-spacing:.18em;color:${INK};">KAPOSA <span style="color:${MUTED};">FUTEXI</span></td>
<td align="right" style="font-size:12px;color:${MUTED};">${escapeHtml(s.meta)}</td>
</tr></table></td></tr>
<tr><td style="background:#ffffff;border:1px solid ${LINE};border-radius:14px;overflow:hidden;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0">
<tr><td style="background:${INK};padding:16px 22px;">
<div style="font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#9ca3af;">${escapeHtml(s.eyebrow)}</div>
<div style="font-size:22px;font-weight:700;line-height:1.2;color:#ffffff;margin-top:4px;">${escapeHtml(s.title)}</div>
<div style="margin-top:8px;">${s.chips.map(chip).join('')}</div>
</td></tr>
${s.buttons.length ? `<tr><td style="padding:14px 22px 0;"><table role="presentation" cellspacing="0" cellpadding="0"><tr>${s.buttons.map((b) => `<td style="padding:0 8px 6px 0;">${button(b)}</td>`).join('')}</tr></table></td></tr>` : ''}
<tr><td style="padding:12px 22px 0;">${label(s.messageLabel)}<div style="background:#f9fafb;border-left:3px solid ${INK};border-radius:0 10px 10px 0;padding:10px 14px;font-size:14px;line-height:1.5;color:${INK};white-space:pre-wrap;">${escapeHtml(s.message)}</div></td></tr>
<tr><td style="padding:14px 22px 2px;">${label('Details')}<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:13px;line-height:1.45;">${s.rows.map((r, i) => row(r, i === s.rows.length - 1)).join('')}</table></td></tr>
<tr><td style="padding:12px 22px 18px;">${button({ text: s.adminText, href: s.adminHref, tone: 'dark' })}<span style="display:inline-block;margin-left:10px;font-size:12px;color:${MUTED};">${escapeHtml(s.adminNote)}</span></td></tr>
</table></td></tr>
<tr><td style="padding:12px 8px 0;font-size:12px;line-height:1.6;color:#9ca3af;text-align:center;">${escapeHtml(s.footer)}</td></tr>
</table></td></tr></table>
</body></html>`
}

function shellText(s: Shell): string {
  return [
    `${s.eyebrow}: ${s.title}`,
    s.chips.map((c) => c.text).join(' · '),
    '',
    ...s.rows.map((r) => `${r.label}: ${r.value}`),
    '',
    `${s.messageLabel}:`,
    s.message,
    '',
    `${s.adminText}: ${s.adminHref}`,
    s.adminNote,
  ].join('\n')
}

export type LeadEmailInput = {
  id: string | number
  createdAt?: Date
  siteUrl: string
  name: string
  businessName?: string
  email: string
  whatsapp: string
  businessType?: string
  need: string
  budget?: string
  details?: string
  source?: { utmSource?: string; referrer?: string; landingPath?: string }
}

export function leadEmail(lead: LeadEmailInput): { subject: string; html: string; text: string } {
  const phone = normalizeWhatsappNumber(lead.whatsapp)
  const from = lead.source?.utmSource || hostOf(lead.source?.referrer) || 'Direct'
  const cameFrom = [from, lead.source?.landingPath, 'Contact'].filter(Boolean).join(' → ')
  const greeting = `Hi ${lead.name}, this is ${BRAND}. Thanks for your enquiry about a ${lead.need}.`
  const shell: Shell = {
    preheader: `${lead.name} wants a ${lead.need}${lead.businessType ? ` for a ${lead.businessType} business` : ''}${lead.budget ? `, budget ${lead.budget}` : ''}. Reply within the hour.`,
    meta: `Lead #${lead.id} · ${whenInIndia(lead.createdAt ?? new Date())}`,
    eyebrow: 'New lead',
    title: lead.name,
    chips: [
      { text: lead.need, tone: 'accent' },
      ...(lead.businessType ? [{ text: lead.businessType }] : []),
      ...(lead.budget ? [{ text: lead.budget }] : []),
    ],
    buttons: [
      {
        text: `WhatsApp ${lead.name.split(' ')[0]}`,
        href: whatsappLink(lead.whatsapp, greeting),
        tone: 'whatsapp',
      },
      { text: 'Call', href: `tel:+${phone}`, tone: 'light' },
      { text: 'Email', href: `mailto:${lead.email}`, tone: 'light' },
    ],
    messageLabel: 'Message',
    message: lead.details?.trim() || 'No message left.',
    rows: [
      { label: 'Email', value: lead.email, href: `mailto:${lead.email}` },
      { label: 'WhatsApp', value: formatIndianPhone(lead.whatsapp), href: whatsappLink(lead.whatsapp) },
      lead.businessName
        ? { label: 'Business', value: lead.businessName }
        : { label: 'Business', value: 'Not given', empty: true },
      lead.businessType
        ? { label: 'Business type', value: lead.businessType }
        : { label: 'Business type', value: 'Not given', empty: true },
      { label: 'Need', value: lead.need },
      lead.budget
        ? { label: 'Budget', value: lead.budget }
        : { label: 'Budget', value: 'Not given', empty: true },
      { label: 'Came from', value: cameFrom },
    ],
    adminHref: `${lead.siteUrl}/admin/collections/leads/${lead.id}`,
    adminText: 'Open in admin →',
    adminNote: `Reply to this email goes straight to ${lead.name}.`,
    footer: `Sent by the ${BRAND} website when someone submits the contact form.`,
  }
  return { subject: `New lead: ${lead.name} · ${lead.need}`, html: shellHtml(shell), text: shellText(shell) }
}

export type FeedbackEmailInput = {
  id: string | number
  createdAt?: Date
  siteUrl: string
  name: string
  business?: string
  rating: number
  quote: string
}

export function feedbackEmail(f: FeedbackEmailInput): { subject: string; html: string; text: string } {
  const stars = '★'.repeat(f.rating) + '☆'.repeat(Math.max(0, 5 - f.rating))
  const shell: Shell = {
    preheader: `${f.name} left ${f.rating}/5: ${f.quote.slice(0, 90)}`,
    meta: `Feedback #${f.id} · ${whenInIndia(f.createdAt ?? new Date())}`,
    eyebrow: 'New feedback',
    title: f.name,
    chips: [
      { text: `${stars} ${f.rating}/5`, tone: 'accent' },
      ...(f.business ? [{ text: f.business }] : []),
    ],
    buttons: [],
    messageLabel: 'What they wrote',
    message: f.quote,
    rows: [
      { label: 'Name', value: f.name },
      f.business
        ? { label: 'Business', value: f.business }
        : { label: 'Business', value: 'Not given', empty: true },
      { label: 'Rating', value: `${f.rating} / 5` },
      { label: 'Shown on site', value: 'Not yet. It stays hidden until you tick Visible in the admin.' },
    ],
    adminHref: `${f.siteUrl}/admin/collections/testimonials/${f.id}`,
    adminText: 'Review in admin →',
    adminNote: 'Tick Visible to publish it on the site.',
    footer: `Sent by the ${BRAND} website when someone submits the feedback form.`,
  }
  return {
    subject: `New feedback: ${f.name}${f.business ? ` · ${f.business}` : ''} · ${f.rating}/5`,
    html: shellHtml(shell),
    text: shellText(shell),
  }
}
