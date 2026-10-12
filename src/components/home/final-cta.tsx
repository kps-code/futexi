import { MessageCircle } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'
import { finalCta } from '@/content/home'
import { whatsappDefaultMessage } from '@/content/site'
import { whatsappLink } from '@/lib/whatsapp'

export function FinalCta({ whatsappNumber }: { whatsappNumber: string }) {
  return (
    <section id="start" className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_100%,color-mix(in_oklab,var(--accent)_28%,transparent),transparent_70%)]"
      />
      <Reveal className="container-site text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {finalCta.heading}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-pretty text-muted sm:text-lg">{finalCta.sub}</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink
            href={finalCta.primary.href}
            size="lg"
            data-track="cta_click"
            data-track-props='{"cta":"final"}'
          >
            {finalCta.primary.label}
          </ButtonLink>
          <ButtonLink
            href={whatsappLink(whatsappNumber, whatsappDefaultMessage)}
            variant="secondary"
            size="lg"
            data-track="whatsapp_click"
            data-track-props='{"where":"final_cta"}'
          >
            <MessageCircle className="h-4 w-4" />
            {finalCta.whatsapp}
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  )
}
