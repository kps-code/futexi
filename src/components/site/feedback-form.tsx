'use client'

import { Star } from 'lucide-react'
import { useActionState, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { submitFeedback, type FeedbackState } from '@/server/actions/submit-feedback'

const initial: FeedbackState = { status: 'idle' }

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

const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent']

export function FeedbackForm({ token, name, business }: { token: string; name: string; business?: string }) {
  const [state, action, pending] = useActionState(submitFeedback, initial)
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const errors = state.status === 'error' ? (state.fieldErrors ?? {}) : {}

  if (state.status === 'success') {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Received</p>
        <h2 className="mt-3 font-display text-2xl font-bold">Thank you, {state.name}.</h2>
        <p className="mt-2 text-muted">Your feedback means a lot to us. We may feature it on our website.</p>
      </div>
    )
  }

  const shown = hover || rating

  return (
    <form
      action={action}
      noValidate
      className="space-y-5 rounded-2xl border border-border bg-surface p-6 sm:p-8"
    >
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="rating" value={rating} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required error={errors.name}>
          <input
            id="name"
            name="name"
            defaultValue={name}
            required
            className={inputClass}
            autoComplete="name"
          />
        </Field>
        <Field label="Business" name="business" error={errors.business}>
          <input
            id="business"
            name="business"
            defaultValue={business ?? ''}
            className={inputClass}
            autoComplete="organization"
            placeholder="Optional"
          />
        </Field>
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-medium">
          Rating <span className="text-accent">*</span>
        </p>
        <div className="flex items-center gap-3" role="radiogroup" aria-label="Rating">
          <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                className="rounded-md p-0.5 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <Star
                  className={cn(
                    'h-8 w-8 transition-colors',
                    n <= shown ? 'fill-amber-400 text-amber-400' : 'text-border-strong',
                  )}
                />
              </button>
            ))}
          </div>
          <span className="text-sm text-muted">{ratingLabels[shown]}</span>
        </div>
        {errors.rating && <p className="text-xs text-red-500">{errors.rating}</p>}
      </div>

      <Field label="Your feedback" name="quote" required error={errors.quote}>
        <textarea
          id="quote"
          name="quote"
          rows={5}
          required
          maxLength={400}
          className={inputClass}
          placeholder="What did we build for you, and what changed for your business?"
        />
      </Field>

      <label className="flex items-start gap-3 text-sm">
        <input id="consent" name="consent" type="checkbox" required className="mt-1 h-4 w-4 accent-accent" />
        <span>
          KAPOSA FUTEXI may show this feedback on its website with my name and business.
          {errors.consent && <span className="block text-xs text-red-500">{errors.consent}</span>}
        </span>
      </label>

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
        {pending ? 'Sending…' : 'Send Feedback'}
      </Button>
    </form>
  )
}
