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
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 320,
        height: 320,
        position: 'centre',
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
