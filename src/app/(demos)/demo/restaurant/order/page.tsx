import type { Metadata } from 'next'
import { Clock } from 'lucide-react'
import { DemoShell } from '@/components/demos-shared/chrome'
import { saffron } from '@/content/demo-businesses'
import { saffronMenu, saffronOrder } from '@/content/demo-restaurant'
import { getSiteSettings } from '@/server/site-data'
import { OrderMenu } from './order-menu'

export const metadata: Metadata = {
  title: `Order online · ${saffron.name}`,
  description: `Order ${saffron.name} dishes for delivery or pickup. The order is confirmed on WhatsApp. Restaurant website concept by KAPOSA FUTEXI.`,
}

/** Restaurant demo: online ordering handed to WhatsApp or a phone call. */
export default async function SaffronOrderPage() {
  const settings = await getSiteSettings()
  return (
    <DemoShell business={saffron} whatsappNumber={settings.whatsappNumber}>
      <section className="container-dm pt-12 pb-8 sm:pt-16 sm:pb-10">
        <p className="text-dm-brand text-xs font-semibold tracking-[0.18em] uppercase">Order online</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Dinner at home, from the same fire.
        </h1>
        <p className="text-dm-muted mt-4 max-w-2xl text-pretty sm:text-lg">
          Pick your dishes, choose delivery or pickup, and send the order on WhatsApp. We reply with the time
          and a UPI link. Prefer to talk? Call and we take the order on the phone.
        </p>
        <p className="text-dm-muted mt-4 flex items-center gap-2 text-sm">
          <Clock className="text-dm-brand h-4 w-4" /> {saffronOrder.deliveryRadiusText}
        </p>
      </section>
      <section className="container-dm pb-24 lg:pb-20">
        <OrderMenu
          categories={saffronMenu}
          rules={saffronOrder}
          whatsappNumber={settings.whatsappNumber}
          businessName={saffron.name}
        />
      </section>
    </DemoShell>
  )
}
