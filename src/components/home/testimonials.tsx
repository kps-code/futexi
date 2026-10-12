import Image from 'next/image'
import { Quote, Star } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'
import type { TestimonialView } from '@/server/site-data'
import { cardClasses, Section, SectionHeading } from './section'

/**
 * "What Clients Say" (Content > Testimonials). Renders nothing until the
 * admin has at least one visible testimonial, so the launch page never shows
 * an empty block.
 */
export function Testimonials({ items }: { items: TestimonialView[] }) {
  if (items.length === 0) return null
  return (
    <Section id="testimonials" tone="surface" className="cv-auto">
      <SectionHeading
        eyebrow="Client stories"
        title="What Clients Say"
        sub="Feedback from businesses we have built for."
      />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <Reveal key={t.id} as="li" index={i} className={cn(cardClasses, 'flex')}>
            <figure className="flex flex-1 flex-col">
              <Quote aria-hidden className="h-6 w-6 text-accent/70" />
              {t.rating && (
                <div className="mt-3 flex gap-0.5" role="img" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, k) => (
                    <Star
                      key={k}
                      aria-hidden
                      className={cn(
                        'h-4 w-4',
                        k < t.rating! ? 'fill-amber-400 text-amber-400' : 'text-border-strong',
                      )}
                    />
                  ))}
                </div>
              )}
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                {t.photoUrl ? (
                  <Image
                    src={t.photoUrl}
                    alt={t.photoAlt ?? t.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-gradient font-display text-sm font-bold text-white"
                  >
                    {t.name.trim().charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold">{t.name}</p>
                  {t.business && <p className="truncate text-xs text-muted">{t.business}</p>}
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
