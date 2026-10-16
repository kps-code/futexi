'use client'

import { Bike, Minus, Phone, Plus, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { VegMark, type MenuCategory, type MenuItem } from '@/components/demos-shared/menu-tabs'
import { Photo } from '@/components/demos-shared/photo'
import { formatInr } from '@/lib/booking'
import { whatsappLink } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'

type Mode = 'delivery' | 'pickup'
type OrderRules = { deliveryFee: number; freeDeliveryAbove: number; minimumOrder: number }

const btn =
  'inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-[filter,opacity] hover:brightness-110'
const sectionId = (name: string) => `order-${name.replace(/\W+/g, '-').toLowerCase()}`

function Stepper({ item, n, onChange }: { item: MenuItem; n: number; onChange: (delta: number) => void }) {
  if (n === 0) {
    return (
      <button
        type="button"
        onClick={() => onChange(1)}
        aria-label={`Add ${item.name}`}
        className="border-dm-line-strong text-dm-ink hover:bg-dm-surface-2 inline-flex h-9 shrink-0 items-center gap-1 rounded-full border px-4 text-sm font-medium"
      >
        <Plus className="h-4 w-4" /> Add
      </button>
    )
  }
  return (
    <span className="bg-dm-brand text-dm-on-brand inline-flex h-9 shrink-0 items-center rounded-full text-sm font-semibold">
      <button
        type="button"
        onClick={() => onChange(-1)}
        aria-label={`Remove one ${item.name}`}
        className="px-3"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-5 text-center" aria-live="polite">
        {n}
      </span>
      <button
        type="button"
        onClick={() => onChange(1)}
        aria-label={`Add one more ${item.name}`}
        className="px-3"
      >
        <Plus className="h-4 w-4" />
      </button>
    </span>
  )
}

/** Menu with quantity steppers and an order summary that hands the order to WhatsApp (or a call). */
export function OrderMenu({
  categories,
  rules,
  whatsappNumber,
  businessName,
}: {
  categories: readonly MenuCategory[]
  rules: OrderRules
  whatsappNumber: string
  businessName: string
}) {
  const [qty, setQty] = useState<Record<string, number>>({})
  const [mode, setMode] = useState<Mode>('delivery')
  const lines = categories
    .flatMap((c) => c.items)
    .filter((i) => (qty[i.name] ?? 0) > 0)
    .map((item) => ({ item, n: qty[item.name] }))
  const count = lines.reduce((s, l) => s + l.n, 0)
  const subtotal = lines.reduce((s, l) => s + l.item.price * l.n, 0)
  const fee =
    mode === 'delivery' && lines.length > 0 && subtotal < rules.freeDeliveryAbove ? rules.deliveryFee : 0
  const total = subtotal + fee
  const belowMinimum = mode === 'delivery' && lines.length > 0 && subtotal < rules.minimumOrder
  const ready = lines.length > 0 && !belowMinimum
  const change = (name: string, delta: number) =>
    setQty((q) => ({ ...q, [name]: Math.max(0, (q[name] ?? 0) + delta) }))

  const message = [
    `Order from ${businessName} website`,
    ...lines.map((l) => `${l.n} x ${l.item.name} - ${formatInr(l.item.price * l.n)}`),
    fee ? `Delivery - ${formatInr(fee)}` : '',
    `Total ${formatInr(total)} (${mode})`,
    'Name:',
    mode === 'delivery' ? 'Address:' : 'Pickup time:',
  ]
    .filter(Boolean)
    .join('\n')
  const wa = whatsappLink(whatsappNumber, message)
  const tel = `tel:+${whatsappNumber}`

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div>
        <nav aria-label="Menu sections" className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((c) => (
            <a
              key={c.name}
              href={`#${sectionId(c.name)}`}
              className="border-dm-line bg-dm-surface text-dm-muted hover:text-dm-ink shrink-0 rounded-full border px-4 py-2 text-sm font-medium"
            >
              {c.name}
            </a>
          ))}
        </nav>
        {categories.map((c) => (
          <section key={c.name} id={sectionId(c.name)} className="mt-8 scroll-mt-24">
            <h2 className="font-display text-xl font-semibold">{c.name}</h2>
            <ul className="mt-4 grid gap-3">
              {c.items.map((m) => (
                <li key={m.name} className="dm-card dm-lift flex items-center gap-4 p-3 sm:p-4">
                  {m.photo ? (
                    <Photo photo={m.photo} className="h-20 w-20 shrink-0 rounded-xl" sizes="80px" />
                  ) : (
                    <span className="bg-dm-surface-2 text-dm-muted inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-xl font-display text-xl font-bold">
                      {m.name[0]}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-display font-semibold">
                      <VegMark veg={m.veg} /> {m.name}
                    </p>
                    <p className="text-dm-muted mt-0.5 line-clamp-2 text-sm">{m.line}</p>
                    <p className="mt-1 text-sm font-semibold">{formatInr(m.price)}</p>
                  </div>
                  <Stepper item={m} n={qty[m.name] ?? 0} onChange={(d) => change(m.name, d)} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <aside
        id="order-summary"
        className="dm-card p-5 lg:sticky lg:top-24"
        data-testid="order-summary"
        aria-label="Your order"
      >
        <h2 className="font-display text-lg font-semibold">Your order</h2>
        <div
          className="bg-dm-surface-2 mt-4 grid grid-cols-2 rounded-full p-1 text-sm font-medium"
          role="group"
          aria-label="Delivery or pickup"
        >
          {(['delivery', 'pickup'] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={cn(
                'inline-flex h-9 items-center justify-center gap-1.5 rounded-full capitalize',
                mode === m ? 'bg-dm-brand text-dm-on-brand' : 'text-dm-muted',
              )}
            >
              {m === 'delivery' ? <Bike className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />} {m}
            </button>
          ))}
        </div>
        {lines.length === 0 ? (
          <p className="text-dm-muted mt-5 text-sm">
            Add dishes from the menu. We confirm on WhatsApp within two minutes.
          </p>
        ) : (
          <ul className="divide-dm-line mt-4 divide-y text-sm">
            {lines.map((l) => (
              <li key={l.item.name} className="flex items-center justify-between gap-3 py-2.5">
                <span className="min-w-0 flex-1 truncate">
                  {l.n} × {l.item.name}
                </span>
                <span className="font-medium">{formatInr(l.item.price * l.n)}</span>
              </li>
            ))}
          </ul>
        )}
        <dl className="border-dm-line mt-4 space-y-1.5 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-dm-muted">Subtotal</dt>
            <dd>{formatInr(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-dm-muted">Delivery</dt>
            <dd>{mode === 'pickup' ? 'Pickup' : fee ? formatInr(fee) : lines.length ? 'Free' : '—'}</dd>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <dt>Total</dt>
            <dd data-testid="order-total">{formatInr(total)}</dd>
          </div>
        </dl>
        {belowMinimum && (
          <p className="text-dm-accent mt-3 text-xs">
            Minimum {formatInr(rules.minimumOrder)} for delivery. Add a little more, or switch to pickup.
          </p>
        )}
        <a
          href={ready ? wa : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!ready}
          data-testid="order-whatsapp"
          data-track="whatsapp_click"
          data-track-props='{"where":"demo_order","demo":"restaurant"}'
          className={cn(
            btn,
            'mt-5 w-full bg-[#25D366] text-white',
            !ready && 'pointer-events-none opacity-50',
          )}
        >
          Order on WhatsApp
        </a>
        <a
          href={tel}
          data-testid="order-call"
          data-track="cta_click"
          data-track-props='{"cta":"demo_order_call","demo":"restaurant"}'
          className={cn(btn, 'border-dm-line-strong text-dm-ink hover:bg-dm-surface-2 mt-2 w-full border')}
        >
          <Phone className="h-4 w-4" /> Call to order
        </a>
        <p className="text-dm-muted mt-3 text-xs">
          Pay on delivery or by UPI. Free delivery above {formatInr(rules.freeDeliveryAbove)}.
        </p>
      </aside>

      {lines.length > 0 && (
        <div className="border-dm-line bg-dm-surface fixed inset-x-0 bottom-0 z-30 border-t p-3 pr-20 lg:hidden">
          <a
            href={ready ? wa : '#order-summary'}
            target={ready ? '_blank' : undefined}
            rel="noopener noreferrer"
            className={cn(btn, 'w-full bg-[#25D366] text-white')}
          >
            {count} {count === 1 ? 'item' : 'items'} · {formatInr(total)} ·{' '}
            {ready ? 'Order on WhatsApp' : 'Review order'}
          </a>
        </div>
      )}
    </div>
  )
}
