import { MessageCircle } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'
import { finalCta } from '@/content/home'
import { whatsappDefaultMessage } from '@/content/site'
import { whatsappLink } from '@/lib/whatsapp'

export function FinalCta({ whatsappNumber }: { whatsappNumber: string }) {
  // "Have an Idea? Let's Build It." → question stays plain, the answer gets the gradient.
  const q = finalCta.heading.indexOf('? ')
  const lead = q === -1 ? finalCta.heading : finalCta.heading.slice(0, q + 1)
  const rest = q === -1 ? '' : finalCta.heading.slice(q + 2)

  return (
    <section id="start" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid" />
        <div className="glow-blob -bottom-40 left-[8%] h-[30rem] w-[30rem] lg:animate-float" />
        <div className="glow-blob right-[4%] -bottom-32 h-[26rem] w-[26rem] opacity-80 [--float-delay:2s] lg:animate-float" />
      </div>
      <Reveal className="container-site text-center">
        <h2 className="font-display text-4xl font-bold tracking-[-0.02em] text-balance sm:text-5xl lg:text-6xl">
          {lead}
          {rest && (
            <>
              {' '}
              <span className="text-gradient sm:block">{rest}</span>
            </>
          )}
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
