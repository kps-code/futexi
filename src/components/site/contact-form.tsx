'use client'

import { useActionState, useRef } from 'react'
import { budgetOptions, needOptions } from '@/content/contact'
import { cn } from '@/lib/utils'
import { submitContact, type ContactState } from '@/server/actions/submit-contact'
import { Button, ButtonLink } from '@/components/ui/button'

const initial: ContactState = { status: 'idle' }

const inputClass =
  'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring'

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
        {required && <span className="text-accent"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}

export function ContactForm({ defaultNeed }: { defaultNeed?: string }) {
  const [state, action, pending] = useActionState(submitContact, initial)
  const started = useRef(false)
  const errors = state.status === 'error' ? (state.fieldErrors ?? {}) : {}

  if (state.status === 'success') {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Received</p>
        <h2 className="mt-3 font-display text-2xl font-bold">Thanks, {state.name}.</h2>
        <p className="mt-2 text-muted">We&apos;ll reply within one working day. Want a faster answer?</p>
        <ButtonLink
          href={state.whatsappUrl}
          size="lg"
          className="mt-6"
          data-track="whatsapp_click"
          data-track-props='{"where":"contact_success"}'
        >
          Continue on WhatsApp
        </ButtonLink>
      </div>
    )
  }

  return (
    <form
      action={action}
      noValidate
      className="space-y-5 rounded-2xl border border-border bg-surface p-6 sm:p-8"
      onFocusCapture={() => {
        if (started.current) return
        started.current = true
        // Fire a tracked event without a DOM click: dispatch on a hidden marker.
        document.getElementById('contact-form-start')?.click()
      }}
    >
      <button
        type="button"
        id="contact-form-start"
        data-track="form_start"
        className="hidden"
        tabIndex={-1}
        aria-hidden
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required error={errors.name}>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            className={inputClass}
            placeholder="Your name"
          />
        </Field>
        <Field label="Business name" name="businessName" error={errors.businessName}>
          <input
            id="businessName"
            name="businessName"
            autoComplete="organization"
            className={inputClass}
            placeholder="Optional"
          />
        </Field>
        <Field label="Email" name="email" required error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
            placeholder="you@example.com"
          />
        </Field>
        <Field label="WhatsApp number" name="whatsapp" required error={errors.whatsapp}>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            className={inputClass}
            placeholder="98765 43210"
          />
        </Field>
        <Field label="Business type" name="businessType" error={errors.businessType}>
          <input
            id="businessType"
            name="businessType"
            className={inputClass}
            placeholder="Salon, restaurant, clinic…"
          />
        </Field>
        <Field label="What do you need?" name="need" required error={errors.need}>
          <select
            id="need"
            name="need"
            required
            defaultValue={defaultNeed ?? ''}
            className={cn(inputClass, 'appearance-none')}
          >
            <option value="" disabled>
              Choose one
            </option>
            {needOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Budget" name="budget" error={errors.budget}>
          <select id="budget" name="budget" defaultValue="" className={cn(inputClass, 'appearance-none')}>
            <option value="">Not sure yet</option>
            {budgetOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Project details" name="details" error={errors.details}>
        <textarea
          id="details"
          name="details"
          rows={5}
          className={inputClass}
          placeholder="Tell us about your business and what you want the website to do."
        />
      </Field>

      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="absolute top-auto -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === 'error' && (
        <p
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500"
        >
          {state.message}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? 'Sending…' : 'Start a Conversation'}
      </Button>
    </form>
  )
}
