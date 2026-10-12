'use client'

import { Check, ChevronLeft, Clock, Loader2, MessageCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useTransition } from 'react'
import type { NovaService } from '@/content/demo-booking'
import { formatDateLabel, formatDateLong, formatInr, formatTime12, type SlotState } from '@/lib/booking'
import { cn } from '@/lib/utils'
import { createDemoBooking, type BookingResult } from '@/server/actions/create-demo-booking'

const STEPS = ['Service', 'Date', 'Time', 'Details', 'Confirm'] as const
type Step = 1 | 2 | 3 | 4 | 5

type Props = {
  services: readonly NovaService[]
  dates: readonly string[]
  initialService?: string
  requestHref: string
}

const inputClass =
  'w-full rounded-xl border border-nv-line bg-nv-surface px-4 py-3 text-sm text-nv-ink placeholder:text-nv-muted/70 focus:border-nv-brand focus:outline-none focus:ring-2 focus:ring-nv-ring'

/** Five-step appointment booking with live slot availability. */
export function BookingFlow({ services, dates, initialService, requestHref }: Props) {
  const preselected = services.find((s) => s.slug === initialService)
  const [step, setStep] = useState<Step>(preselected ? 2 : 1)
  const [service, setService] = useState<NovaService | null>(preselected ?? null)
  const [date, setDate] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [slots, setSlots] = useState<SlotState[] | null>(null)
  const [slotsError, setSlotsError] = useState<string | null>(null)
  const [details, setDetails] = useState({ name: '', phone: '', notes: '' })
  const [result, setResult] = useState<BookingResult | null>(null)
  const [pending, startTransition] = useTransition()

  // Load live availability whenever the date changes (and after a slot race).
  // State is reset by the event handlers that change `date` or `slotsVersion`,
  // so the effect only talks to the network.
  const [slotsVersion, setSlotsVersion] = useState(0)
  const reloadSlots = () => {
    setSlots(null)
    setSlotsError(null)
    setSlotsVersion((v) => v + 1)
  }
  useEffect(() => {
    if (!date) return
    let cancelled = false
    fetch(`/api/demo/booking/slots?date=${date}`, { cache: 'no-store' })
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
  }, [date, slotsVersion])

  const fieldErrors = result?.status === 'error' ? (result.fieldErrors ?? {}) : {}

  const submit = () => {
    if (!service || !date || !time) return
    startTransition(async () => {
      const res = await createDemoBooking({
        service: service.slug,
        date,
        time,
        name: details.name,
        phone: details.phone,
        notes: details.notes,
        website: (document.getElementById('nv-website') as HTMLInputElement | null)?.value ?? '',
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
    return <Confirmation result={result} requestHref={requestHref} />
  }

  return (
    <div className="nv-card p-5 sm:p-8">
      <ol className="mb-8 flex items-center gap-2" aria-label="Booking steps">
        {STEPS.map((label, i) => {
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
                  active && 'bg-nv-brand text-white',
                  done && 'bg-nv-brand-soft text-nv-brand-ink',
                  !active && !done && 'bg-nv-surface-2 text-nv-muted',
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : n}
              </button>
              <span
                className={cn(
                  'hidden text-xs font-medium sm:inline',
                  active ? 'text-nv-ink' : 'text-nv-muted',
                )}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && <span className="bg-nv-line h-px flex-1" />}
            </li>
          )
        })}
      </ol>

      {step === 1 && (
        <section aria-labelledby="step-service">
          <h2 id="step-service" className="font-display text-xl font-semibold">
            Choose a service
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
                  data-track-props={`{"demo":"booking","service":"${s.slug}"}`}
                  className={cn(
                    'hover:border-nv-brand w-full rounded-2xl border p-4 text-left transition-colors',
                    service?.slug === s.slug
                      ? 'border-nv-brand bg-nv-brand-soft/40'
                      : 'border-nv-line bg-nv-surface',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-display font-semibold">{s.name}</span>
                    <span className="text-nv-brand-ink font-semibold">{formatInr(s.price)}</span>
                  </div>
                  <p className="text-nv-muted mt-1 text-sm">{s.line}</p>
                  <p className="text-nv-muted mt-2 flex items-center gap-1 text-xs">
                    <Clock className="h-3.5 w-3.5" /> {s.minutes} min
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {step === 2 && service && (
        <section aria-labelledby="step-date">
          <StepHeader
            id="step-date"
            title="Pick a date"
            sub={`${service.name} · ${service.minutes} min · ${formatInr(service.price)}`}
            onBack={() => setStep(1)}
          />
          <ul className="mt-5 flex gap-2 overflow-x-auto pb-2">
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
                      'hover:border-nv-brand flex w-[4.5rem] flex-col items-center rounded-2xl border px-2 py-3 transition-colors',
                      selected ? 'border-nv-brand bg-nv-brand text-white' : 'border-nv-line bg-nv-surface',
                    )}
                  >
                    <span
                      className={cn(
                        'text-[11px] font-medium uppercase',
                        selected ? 'text-white/80' : 'text-nv-muted',
                      )}
                    >
                      {l.weekday}
                    </span>
                    <span className="font-display text-xl font-semibold">{l.day}</span>
                    <span className={cn('text-[11px]', selected ? 'text-white/80' : 'text-nv-muted')}>
                      {l.month}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="text-nv-muted mt-3 text-xs">Open daily 10:00 AM to 8:00 PM. Closed on Tuesdays.</p>
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
          <div className="text-nv-muted mt-2 flex items-center gap-2 text-xs">
            <span className="bg-nv-brand-soft text-nv-brand-ink inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium">
              <span className="bg-nv-brand h-1.5 w-1.5 animate-pulse rounded-full" /> Live availability
            </span>
            <button
              type="button"
              onClick={reloadSlots}
              className="hover:text-nv-ink inline-flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
          </div>
          {result?.status === 'error' && result.slotTaken && (
            <p
              role="alert"
              className="mt-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800"
            >
              {result.message}
            </p>
          )}
          {slotsError && <p className="mt-4 text-sm text-red-600">{slotsError}</p>}
          {!slots && !slotsError && (
            <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5" aria-busy>
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className="bg-nv-surface-2 h-11 animate-pulse rounded-xl" />
              ))}
            </div>
          )}
          {slots && (
            <ul className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5">
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
                        ? 'border-nv-line bg-nv-surface hover:border-nv-brand hover:bg-nv-brand-soft/40'
                        : 'bg-nv-surface-2 text-nv-muted/60 cursor-not-allowed border-transparent line-through',
                      time === s.time && 'border-nv-brand bg-nv-brand text-white',
                    )}
                  >
                    {formatTime12(s.time)}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {slots && slots.every((s) => !s.available) && (
            <p className="text-nv-muted mt-4 text-sm">No free slots left on this day. Try another date.</p>
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
              <Field label="Name" name="nv-name" error={fieldErrors.name} required>
                <input
                  id="nv-name"
                  required
                  autoComplete="name"
                  className={inputClass}
                  placeholder="Your name"
                  value={details.name}
                  onChange={(e) => setDetails({ ...details, name: e.target.value })}
                />
              </Field>
              <Field label="WhatsApp number" name="nv-phone" error={fieldErrors.phone} required>
                <input
                  id="nv-phone"
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
            <Field label="Notes" name="nv-notes" error={fieldErrors.notes}>
              <textarea
                id="nv-notes"
                rows={3}
                className={inputClass}
                placeholder="Anything we should know? Optional."
                value={details.notes}
                onChange={(e) => setDetails({ ...details, notes: e.target.value })}
              />
            </Field>
            <div className="absolute top-auto -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
              <label htmlFor="nv-website">Website</label>
              <input id="nv-website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <button
              type="submit"
              className="bg-nv-brand hover:bg-nv-brand-ink inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-sm font-medium text-white sm:w-auto"
            >
              Review booking
            </button>
          </form>
        </section>
      )}

      {step === 5 && service && date && time && (
        <section aria-labelledby="step-confirm">
          <StepHeader id="step-confirm" title="Confirm your booking" onBack={() => setStep(4)} />
          <dl className="bg-nv-surface-2 mt-5 grid gap-3 rounded-2xl p-5 text-sm sm:grid-cols-2">
            <Row k="Service" v={`${service.name} · ${service.minutes} min`} />
            <Row k="Price" v={formatInr(service.price)} />
            <Row k="Date" v={formatDateLong(date)} />
            <Row k="Time" v={formatTime12(time)} />
            <Row k="Name" v={details.name} />
            <Row k="WhatsApp" v={details.phone} />
            {details.notes && <Row k="Notes" v={details.notes} wide />}
          </dl>
          {result?.status === 'error' && !result.slotTaken && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
            >
              {result.message}
            </p>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className="bg-nv-brand hover:bg-nv-brand-ink mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-8 text-sm font-medium text-white disabled:opacity-60 sm:w-auto"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {pending ? 'Confirming…' : 'Confirm booking'}
          </button>
          <p className="text-nv-muted mt-3 text-xs">
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
        {sub && <p className="text-nv-muted mt-1 text-sm">{sub}</p>}
      </div>
      <button
        type="button"
        onClick={onBack}
        className="text-nv-muted hover:text-nv-ink inline-flex items-center gap-1 text-sm"
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
        {required && <span className="text-nv-brand"> *</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

function Row({ k, v, wide }: { k: string; v: string; wide?: boolean }) {
  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <dt className="text-nv-muted text-xs font-medium tracking-wide uppercase">{k}</dt>
      <dd className="mt-0.5 font-medium">{v}</dd>
    </div>
  )
}

function Confirmation({
  result,
  requestHref,
}: {
  result: Extract<BookingResult, { status: 'success' }>
  requestHref: string
}) {
  const s = result.summary
  return (
    <div className="nv-card p-6 text-center sm:p-10">
      <span className="bg-nv-brand-soft text-nv-brand-ink inline-flex h-14 w-14 items-center justify-center rounded-full">
        <Check className="h-6 w-6" />
      </span>
      <p className="text-nv-muted mt-5 text-xs font-semibold tracking-[0.2em] uppercase">Booking requested</p>
      <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
        See you soon, {s.name.split(' ')[0]}.
      </h2>
      <p className="text-nv-muted mt-2">
        Reference <strong className="text-nv-ink font-mono">{result.reference}</strong>
      </p>
      <dl className="bg-nv-surface-2 mx-auto mt-6 grid max-w-md gap-3 rounded-2xl p-5 text-left text-sm sm:grid-cols-2">
        <Row k="Service" v={`${s.service} · ${s.minutes} min`} />
        <Row k="Price" v={s.price} />
        <Row k="Date" v={s.date} />
        <Row k="Time" v={s.time} />
      </dl>
      <a
        href={result.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-track="whatsapp_click"
        data-track-props='{"where":"demo_booking_confirm"}'
        className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-medium text-white hover:brightness-95"
      >
        <MessageCircle className="h-4 w-4" /> Send confirmation on WhatsApp
      </a>
      <p className="text-nv-muted mx-auto mt-6 max-w-md text-xs">
        In a real deployment this confirmation reaches the customer and the studio owner automatically, with a
        reminder before the appointment. This is a concept demo: the WhatsApp message goes to KAPOSA FUTEXI.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/demo/booking/book"
          className="border-nv-line-strong hover:bg-nv-surface inline-flex h-11 items-center justify-center rounded-full border px-6 text-sm font-medium"
        >
          Book another
        </Link>
        <Link
          href={requestHref}
          data-track="cta_click"
          data-track-props='{"cta":"demo_booking_success","demo":"booking"}'
          className="bg-nv-ink inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium text-white hover:bg-black"
        >
          Want this for your business?
        </Link>
      </div>
    </div>
  )
}
