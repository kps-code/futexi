import { trustStrip } from '@/content/home'
import { Icon } from './icons'

export function TrustStrip() {
  const items = [...trustStrip, ...trustStrip]
  return (
    <section aria-label="Capabilities" className="border-y border-border bg-surface/40 py-4">
      <div className="overflow-hidden mask-fade-x">
        <ul className="flex w-max animate-marquee gap-3 pr-3">
          {items.map((item, i) => (
            <li
              key={`${item.label}-${i}`}
              aria-hidden={i >= trustStrip.length}
              className="flex items-center gap-2.5 rounded-full border border-border bg-background/70 px-4 py-2 text-sm font-medium text-foreground/85"
            >
              <Icon name={item.icon} className="h-4 w-4 text-accent" />
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
