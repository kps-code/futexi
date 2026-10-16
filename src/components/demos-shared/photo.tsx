import Image from 'next/image'
import { cn } from '@/lib/utils'

export type DemoPhoto = {
  /** Site-relative path under /demos/<slug>/photos. */
  src: string
  alt: string
}

/**
 * Photo tile for demo galleries. Fills its box (set an aspect ratio on the
 * wrapper), with an optional caption pill like the abstract Tile.
 */
export function Photo({
  photo,
  label,
  className,
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  priority = false,
  imgClassName,
  zoom = true,
}: {
  photo: DemoPhoto
  label?: string
  className?: string
  sizes?: string
  priority?: boolean
  imgClassName?: string
  /** Zoom the image slightly while the cursor is over it. */
  zoom?: boolean
}) {
  return (
    <figure
      className={cn('bg-dm-surface-2 relative overflow-hidden rounded-2xl', zoom && 'dm-zoom', className)}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn('object-cover', imgClassName)}
      />
      {label && (
        <figcaption className="absolute bottom-3 left-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
          {label}
        </figcaption>
      )}
    </figure>
  )
}
