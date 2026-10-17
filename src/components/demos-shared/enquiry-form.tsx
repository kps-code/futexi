'use client'

import { Check, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useActionState } from 'react'
import type { DemoBusiness } from '@/content/demo-businesses'
import { cn } from '@/lib/utils'
import { submitDemoEnquiry, type DemoLeadResult } from '@/server/actions/create-demo-lead'

const inputClass =
  'w-full rounded-xl border border-dm-line bg-dm-surface px-4 py-3 text-sm text-dm-ink placeholder:text-dm-muted/70 focus:border-dm-brand focus:outline-none focus:ring-2 focus:ring-dm-ring'

type Props = {
  business: DemoBusiness
  interestLabel: string
  interests: readonly string[]
  defaultInterest?: string
  detailsLabel?: string
  detailsPlaceholder?: string
  submitLabel?: string
  successTitle?: string
  successLine?: string
  extraField?: { label: string; name: string; options: readonly string[] }
}

/** Enquiry form shared by the interior and tuition demos. Creates a Demo Lead. */
export function EnquiryForm({
  business,
  interestLabel,
  interests,
  defaultInterest,
  detailsLabel = 'Message',
  detailsPlaceholder = 'Tell us a little about what you need.',
  submitLabel = 'Send enquiry',
  successTitle = 'Thanks, we will be in touch.',
  successLine = 'Expect a reply on WhatsApp within one working day.',
  extraField,
}: Props) {
  const [state, action, pending] = useActionState<DemoLeadResult | null, FormData>(submitDemoEnquiry, null)
  const errors = state?.status === 'error' ? (state.fieldErrors ?? {}) : {}

  if (state?.status === 'success') {
    return (
      <div className="dm-card p-6 text-center sm:p-8" data-testid="enquiry-success">
        <span className="bg-dm-brand-soft text-dm-brand-ink inline-flex h-12 w-12 items-center justify-center rounded-full">
          <Check className="h-5 w-5" />
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold">{successTitle}</h3>
        <p className="text-dm-muted mt-1 text-sm">
          {successLine} Reference <strong className="text-dm-ink font-mono">{state.reference}</strong>
        </p>
        <a
          href={state.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-track="whatsapp_click"
          data-track-props={`{"where":"demo_enquiry","demo":"${business.id}"}`}
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-medium text-white hover:brightness-95"
        >
          <MessageCircle className="h-4 w-4" /> Continue on WhatsApp
        </a>
        <p className="text-dm-muted mt-4 text-[11px]">
          Concept demo: this enquiry is stored in the KAPOSA FUTEXI admin and the WhatsApp message goes to
          KAPOSA.{' '}
          <Link
            href={`/contact?type=${business.contactType}`}
            prefetch={false}
            className="underline underline-offset-2"
          >
            Want this on your website?
          </Link>
        </p>
      </div>
    )
  }

  return (
    <form action={action} noValidate className="dm-card space-y-4 p-6 sm:p-8" data-testid="enquiry-form">
      <input type="hidden" name="business" value={business.id} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required error={errors.name}>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            className={inputClass}
            placeholder="Your name"
          />
        </Field>
        <Field label="WhatsApp number" name="phone" required error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            className={inputClass}
            placeholder="98765 43210"
          />
        </Field>
        <Field label={interestLabel} name="interest" required error={errors.interest}>
          <select
            id="interest"
            name="interest"
            required
            defaultValue={defaultInterest ?? ''}
            className={cn(inputClass, 'appearance-none')}
          >
            <option value="" disabled>
              Choose one
            </option>
            {interests.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
        {extraField && (
          <Field label={extraField.label} name={extraField.name}>
            <select
              id={extraField.name}
              name={extraField.name}
              defaultValue=""
              className={cn(inputClass, 'appearance-none')}
            >
              <option value="">Choose one</option>
              {extraField.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>
      <Field label={detailsLabel} name="details" error={errors.details}>
        <textarea
          id="details"
          name="details"
          rows={4}
          className={inputClass}
          placeholder={detailsPlaceholder}
        />
      </Field>
      <div className="absolute top-auto -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {state?.status === 'error' && (
        <p role="alert" className="rounded-xl border border-red-400/50 bg-red-400/10 px-4 py-2 text-sm">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        data-track="form_start"
        data-track-props={`{"demo":"${business.id}"}`}
        className="bg-dm-brand text-dm-on-brand inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-sm font-medium hover:brightness-110 disabled:opacity-60 sm:w-auto"
      >
        {pending ? 'Sending…' : submitLabel}
      </button>
    </form>
  )
}

function Field({
  label,
  name,
  error,
  required,
  children,
}: {
  label: string
  name: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
        {required && <span className="text-dm-brand"> *</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
