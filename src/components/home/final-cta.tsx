import { MessageCircle } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'
import { finalCta } from '@/content/home'
import { whatsappLink } from '@/lib/whatsapp'
import type { FinalCtaContent } from '@/server/site-data'

type Props = {
  content: FinalCtaContent
  whatsappNumber: string
  whatsappMessage: string
}

/** Closing call to action, used on Home, Demos and Services. Texts from Content > Home Page. */
export function FinalCta({ content, whatsappNumber, whatsappMessage }: Props) {
  return (
    <section id="start" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid" />
        <div className="glow-blob -bottom-40 left-[8%] h-[30rem] w-[30rem] lg:animate-float" />
        <div className="glow-blob right-[4%] -bottom-32 h-[26rem] w-[26rem] opacity-80 [--float-delay:2s] lg:animate-float" />
      </div>
      <Reveal className="container-site text-center">
        <h2 className="font-display text-4xl font-bold tracking-[-0.02em] text-balance sm:text-5xl lg:text-6xl">
          {content.heading}
          {content.headingAccent && (
            <>
              {' '}
              <span className="sr-accent sm:block">{content.headingAccent}</span>
            </>
          )}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-pretty text-muted sm:text-lg">{content.sub}</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink
            href={finalCta.primary.href}
            size="lg"
            data-track="cta_click"
            data-track-props='{"cta":"final"}'
          >
            {content.primaryLabel}
          </ButtonLink>
          <ButtonLink
            href={whatsappLink(whatsappNumber, whatsappMessage)}
            variant="secondary"
            size="lg"
            data-track="whatsapp_click"
            data-track-props='{"where":"final_cta"}'
          >
            <MessageCircle className="h-4 w-4" />
            {content.whatsappLabel}
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  )
}
