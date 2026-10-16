import type { CollectionConfig } from 'payload'
import { anyone, edit, hiddenUnless } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    hidden: hiddenUnless('media'),
    description: 'Images used on the website. Team photos, demo screenshots.',
  },
  access: {
    read: anyone,
    create: edit('media'),
    update: edit('media'),
    delete: edit('media'),
  },
  upload: {
    mimeTypes: ['image/*'],
    // SVG uploads get no resized versions, so fall back to the file itself (logos, icons).
    adminThumbnail: ({ doc }) =>
      ((doc.sizes as { thumbnail?: { url?: string } } | undefined)?.thumbnail?.url as string | undefined) ||
      (doc.url as string | undefined) ||
      null,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 320,
        height: 320,
        // Fit inside the box instead of cropping, so logos and wide images preview whole.
        fit: 'inside',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'card',
        width: 768,
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
      {
        name: 'large',
        width: 1600,
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describe the image for accessibility and SEO.' },
    },
  ],
}
