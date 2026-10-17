'use client'

import { Check, ChevronLeft, Clock, Loader2, MessageCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useTransition } from 'react'
import type { DemoBusiness, DemoService } from '@/content/demo-businesses'
import { formatDateLabel, formatDateLong, formatInr, formatTime12, type SlotState } from '@/lib/booking'
import { cn } from '@/lib/utils'
import { createDemoBooking, type BookingResult } from '@/server/actions/create-demo-booking'

type Step = 1 | 2 | 3 | 4 | 5

type Props = {
  business: DemoBusiness
  dates: readonly string[]
  initialService?: string
  /** ISO date from the query string; with a service it opens the time step. */
  initialDate?: string
  requestHref: string
}

const inputClass =
  'w-full rounded-xl border border-dm-line bg-dm-surface px-4 py-3 text-sm text-dm-ink placeholder:text-dm-muted/70 focus:border-dm-brand focus:outline-none focus:ring-2 focus:ring-dm-ring'

/** Five-step booking with live slot availability, shared by every bookable demo. */
export function BookingFlow({ business, dates, initialService, initialDate, requestHref }: Props) {
  const services = business.services
  const steps = [business.showPrice ? 'Service' : 'Table', 'Date', 'Time', 'Details', 'Confirm'] as const
  const preselected = services.find((s) => s.slug === initialService)
  const presetDate = preselected && initialDate && dates.includes(initialDate) ? initialDate : null
  const [step, setStep] = useState<Step>(presetDate ? 3 : preselected ? 2 : 1)
  const [service, setService] = useState<DemoService | null>(preselected ?? null)
  const [date, setDate] = useState<string | null>(presetDate)
  const [time, setTime] = useState<string | null>(null)
  const [slots, setSlots] = useState<SlotState[] | null>(null)
  const [slotsError, setSlotsError] = useState<string | null>(null)
  const [details, setDetails] = useState({ name: '', phone: '', notes: '' })
  const [result, setResult] = useState<BookingResult | null>(null)
  const [pending, startTransition] = useTransition()

  // Live availability loads whenever the date (or a manual refresh) changes.
  // Handlers reset state before changing these; the effect only talks to the network.
  const [slotsVersion, setSlotsVersion] = useState(0)
  const reloadSlots = () => {
    setSlots(null)
    setSlotsError(null)
    setSlotsVersion((v) => v + 1)
  }
  useEffect(() => {
    if (!date) return
    let cancelled = false
    fetch(`/api/demo/booking/slots?business=${business.id}&date=${date}`, { cache: 'no-store' })
      .then(async (r) => {
        if (!r.ok) throw new Error('Could not load availability')
        return (await r.json()) as { slots: SlotState[] }
      })
      .then((j) => {
        if (!cancelled) setSlots(j.slots)
      })
      .catch(() => {
        if (!cancelled) setSlotsError('Could not load availability. Please try again.')
      })
    return () => {
      cancelled = true
    }
  }, [date, slotsVersion, business.id])

  const fieldErrors = result?.status === 'error' ? (result.fieldErrors ?? {}) : {}

  const submit = () => {
    if (!service || !date || !time) return
    startTransition(async () => {
      const res = await createDemoBooking({
        business: business.id,
        service: service.slug,
        date,
        time,
        name: details.name,
        phone: details.phone,
        notes: details.notes,
        website: (document.getElementById('dm-website') as HTMLInputElement | null)?.value ?? '',
      })
      setResult(res)
      if (res.status === 'error' && res.slotTaken) {
        setTime(null)
        setStep(3)
        reloadSlots()
      }
      if (res.status === 'error' && res.fieldErrors) setStep(4)
    })
  }

  if (result?.status === 'success') {
    return <Confirmation business={business} result={result} requestHref={requestHref} />
  }

  const serviceLine = service
    ? [
        service.name,
        service.minutes ? `${service.minutes} min` : null,
        business.showPrice ? formatInr(service.price) : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : ''

  return (
    <div className="dm-card p-5 sm:p-8">
      <ol className="mb-8 flex items-center gap-2" aria-label="Booking steps">
        {steps.map((label, i) => {
          const n = (i + 1) as Step
          const done = n < step
          const active = n === step
          return (
            <li key={label} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => done && setStep(n)}
                disabled={!done}
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                  active && 'bg-dm-brand text-dm-on-brand',
                  done && 'bg-dm-brand-soft text-dm-brand-ink',
                  !active && !done && 'bg-dm-surface-2 text-dm-muted',
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : n}
              </button>
              <span
                className={cn(
                  'hidden text-xs font-medium sm:inline',
                  active ? 'text-dm-ink' : 'text-dm-muted',
                )}
              >
                {label}
              </span>
              {i < steps.length - 1 && <span className="bg-dm-line h-px flex-1" />}
            </li>
          )
        })}
      </ol>

      {step === 1 && (
        <section aria-labelledby="step-service">
          <h2 id="step-service" className="font-display text-xl font-semibold">
            {business.showPrice ? 'Choose a service' : 'How many guests?'}
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <li key={s.slug}>
                <button
                  type="button"
                  onClick={() => {
                    setService(s)
                    setStep(2)
                  }}
                  data-track="form_start"
                  data-track-props={`{"demo":"${business.id}","service":"${s.slug}"}`}
                  className={cn(
                    'hover:border-dm-brand w-full rounded-2xl border p-4 text-left transition-colors',
                    service?.slug === s.slug
                      ? 'border-dm-brand bg-dm-brand-soft/40'
                      : 'border-dm-line bg-dm-surface',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-display font-semibold">{s.name}</span>
                    {business.showPrice && (
                      <span className="text-dm-brand-ink font-semibold">{formatInr(s.price)}</span>
                    )}
                  </div>
                  <p className="text-dm-muted mt-1 text-sm">{s.line}</p>
                  {s.minutes > 0 && (
                    <p className="text-dm-muted mt-2 flex items-center gap-1 text-xs">
                      <Clock className="h-3.5 w-3.5" /> {s.minutes} min
                    </p>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {step === 2 && service && (
        <section aria-labelledby="step-date">
          <StepHeader id="step-date" title="Pick a date" sub={serviceLine} onBack={() => setStep(1)} />
          <ul className="mt-5 flex gap-2 overflow-x-auto pb-2" data-testid="date-list">
            {dates.map((d) => {
              const l = formatDateLabel(d)
              const selected = d === date
              return (
                <li key={d} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setDate(d)
                      setTime(null)
                      setSlots(null)
                      setSlotsError(null)
                      setStep(3)
                    }}
                    aria-pressed={selected}
                    className={cn(
                      'hover:border-dm-brand flex w-[4.5rem] flex-col items-center rounded-2xl border px-2 py-3 transition-colors',
                      selected
                        ? 'border-dm-brand bg-dm-brand text-dm-on-brand'
                        : 'border-dm-line bg-dm-surface',
                    )}
                  >
                    <span
                      className={cn(
                        'text-[11px] font-medium uppercase',
                        selected ? 'opacity-80' : 'text-dm-muted',
                      )}
                    >
                      {l.weekday}
                    </span>
                    <span className="font-display text-xl font-semibold">{l.day}</span>
                    <span className={cn('text-[11px]', selected ? 'opacity-80' : 'text-dm-muted')}>
                      {l.month}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="text-dm-muted mt-3 text-xs">{business.hoursText.join(' · ')}</p>
        </section>
      )}

      {step === 3 && service && date && (
        <section aria-labelledby="step-time">
          <StepHeader
            id="step-time"
            title="Pick a time"
            sub={formatDateLong(date)}
            onBack={() => setStep(2)}
          />
          <div className="text-dm-muted mt-2 flex items-center gap-2 text-xs">
            <span className="bg-dm-brand-soft text-dm-brand-ink inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium">
              <span className="bg-dm-brand h-1.5 w-1.5 animate-pulse rounded-full" /> Live availability
            </span>
            <button
              type="button"
              onClick={reloadSlots}
              className="hover:text-dm-ink inline-flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
          </div>
          {result?.status === 'error' && result.slotTaken && (
            <p
              role="alert"
              className="mt-3 rounded-xl border border-amber-400/50 bg-amber-400/10 px-4 py-2 text-sm"
            >
              {result.message}
            </p>
          )}
          {slotsError && <p className="mt-4 text-sm text-red-500">{slotsError}</p>}
          {!slots && !slotsError && (
            <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5" aria-busy>
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className="bg-dm-surface-2 h-11 animate-pulse rounded-xl" />
              ))}
            </div>
          )}
          {slots && (
            <ul className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5" data-testid="slot-list">
              {slots.map((s) => (
                <li key={s.time}>
                  <button
                    type="button"
                    disabled={!s.available}
                    onClick={() => {
                      setTime(s.time)
                      setStep(4)
                    }}
                    title={
                      s.reason === 'booked'
                        ? 'Already booked'
                        : s.reason === 'past'
                          ? 'Too soon'
                          : s.reason === 'closed'
                            ? 'Closed'
                            : undefined
                    }
                    className={cn(
                      'h-11 w-full rounded-xl border text-sm font-medium transition-colors',
                      s.available
                        ? 'border-dm-line bg-dm-surface hover:border-dm-brand hover:bg-dm-brand-soft/40'
                        : 'bg-dm-surface-2 text-dm-muted/60 cursor-not-allowed border-transparent line-through',
                      time === s.time && 'border-dm-brand bg-dm-brand text-dm-on-brand',
                    )}
                  >
                    {formatTime12(s.time)}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {slots && slots.every((s) => !s.available) && (
            <p className="text-dm-muted mt-4 text-sm">Nothing free on this day. Try another date.</p>
          )}
        </section>
      )}

      {step === 4 && service && date && time && (
        <section aria-labelledby="step-details">
          <StepHeader
            id="step-details"
            title="Your details"
            sub={`${formatDateLong(date)} at ${formatTime12(time)}`}
            onBack={() => setStep(3)}
          />
          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              setResult(null)
              setStep(5)
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" name="dm-name" error={fieldErrors.name} required>
                <input
                  id="dm-name"
                  required
                  autoComplete="name"
                  className={inputClass}
                  placeholder="Your name"
                  value={details.name}
                  onChange={(e) => setDetails({ ...details, name: e.target.value })}
                />
              </Field>
              <Field label="WhatsApp number" name="dm-phone" error={fieldErrors.phone} required>
                <input
                  id="dm-phone"
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  className={inputClass}
                  placeholder="98765 43210"
                  value={details.phone}
                  onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Notes" name="dm-notes" error={fieldErrors.notes}>
              <textarea
                id="dm-notes"
                rows={3}
                className={inputClass}
                placeholder="Anything we should know? Optional."
                value={details.notes}
                onChange={(e) => setDetails({ ...details, notes: e.target.value })}
              />
            </Field>
            <div className="absolute top-auto -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
              <label htmlFor="dm-website">Website</label>
              <input id="dm-website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <button
              type="submit"
              className="bg-dm-brand text-dm-on-brand inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-sm font-medium hover:brightness-110 sm:w-auto"
            >
              Review {business.bookingNoun}
            </button>
          </form>
        </section>
      )}

      {step === 5 && service && date && time && (
        <section aria-labelledby="step-confirm">
          <StepHeader
            id="step-confirm"
            title={`Confirm your ${business.bookingNoun}`}
            onBack={() => setStep(4)}
          />
          <dl className="bg-dm-surface-2 mt-5 grid gap-3 rounded-2xl p-5 text-sm sm:grid-cols-2">
            <Row
              k={business.showPrice ? 'Service' : 'Table'}
              v={service.minutes ? `${service.name} · ${service.minutes} min` : service.name}
            />
            {business.showPrice && <Row k="Price" v={formatInr(service.price)} />}
            <Row k="Date" v={formatDateLong(date)} />
            <Row k="Time" v={formatTime12(time)} />
            <Row k="Name" v={details.name} />
            <Row k="WhatsApp" v={details.phone} />
            {details.notes && <Row k="Notes" v={details.notes} wide />}
          </dl>
          {result?.status === 'error' && !result.slotTaken && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-400/50 bg-red-400/10 px-4 py-2 text-sm"
            >
              {result.message}
            </p>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className="bg-dm-brand text-dm-on-brand mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-8 text-sm font-medium hover:brightness-110 disabled:opacity-60 sm:w-auto"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {pending ? 'Confirming…' : `Confirm ${business.bookingNoun}`}
          </button>
          <p className="text-dm-muted mt-3 text-xs">
            A confirmation with your reference arrives on WhatsApp. No payment is taken.
          </p>
        </section>
      )}
    </div>
  )
}

function StepHeader({
  id,
  title,
  sub,
  onBack,
}: {
  id: string
  title: string
  sub?: string
  onBack: () => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 id={id} className="font-display text-xl font-semibold">
          {title}
        </h2>
        {sub && <p className="text-dm-muted mt-1 text-sm">{sub}</p>}
      </div>
      <button
        type="button"
        onClick={onBack}
        className="text-dm-muted hover:text-dm-ink inline-flex items-center gap-1 text-sm"
      >
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
    </div>
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

function Row({ k, v, wide }: { k: string; v: string; wide?: boolean }) {
  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <dt className="text-dm-muted text-xs font-medium tracking-wide uppercase">{k}</dt>
      <dd className="mt-0.5 font-medium">{v}</dd>
    </div>
  )
}

function Confirmation({
  business,
  result,
  requestHref,
}: {
  business: DemoBusiness
  result: Extract<BookingResult, { status: 'success' }>
  requestHref: string
}) {
  const s = result.summary
  return (
    <div className="dm-card p-6 text-center sm:p-10">
      <span className="bg-dm-brand-soft text-dm-brand-ink inline-flex h-14 w-14 items-center justify-center rounded-full">
        <Check className="h-6 w-6" />
      </span>
      <p className="text-dm-muted mt-5 text-xs font-semibold tracking-[0.2em] uppercase">
        {business.bookingNoun} requested
      </p>
      <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
        See you soon, {s.name.split(' ')[0]}.
      </h2>
      <p className="text-dm-muted mt-2">
        Reference <strong className="text-dm-ink font-mono">{result.reference}</strong>
      </p>
      <dl className="bg-dm-surface-2 mx-auto mt-6 grid max-w-md gap-3 rounded-2xl p-5 text-left text-sm sm:grid-cols-2">
        <Row
          k={business.showPrice ? 'Service' : 'Table'}
          v={s.minutes ? `${s.service} · ${s.minutes} min` : s.service}
        />
        {s.price && <Row k="Price" v={s.price} />}
        <Row k="Date" v={s.date} />
        <Row k="Time" v={s.time} />
      </dl>
      <a
        href={result.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-track="whatsapp_click"
        data-track-props={`{"where":"demo_confirm","demo":"${business.id}"}`}
        className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-medium text-white hover:brightness-95"
      >
        <MessageCircle className="h-4 w-4" /> Send confirmation on WhatsApp
      </a>
      <p className="text-dm-muted mx-auto mt-6 max-w-md text-xs">
        In a real deployment this confirmation reaches the customer and the owner automatically, with a
        reminder before the visit. This is a concept demo: the WhatsApp message goes to KAPOSA FUTEXI.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href={business.bookPath ?? business.path}
          className="border-dm-line-strong hover:bg-dm-surface inline-flex h-11 items-center justify-center rounded-full border px-6 text-sm font-medium"
        >
          Book another
        </Link>
        <Link
          href={requestHref}
          prefetch={false}
          data-track="cta_click"
          data-track-props={`{"cta":"demo_success","demo":"${business.id}"}`}
          className="bg-dm-ink text-dm-bg inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium hover:brightness-110"
        >
          Want this for your business?
        </Link>
      </div>
    </div>
  )
}
