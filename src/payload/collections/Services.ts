import type { CollectionConfig } from 'payload'
import { contactTypes } from '@/content/contact'
import { iconNames } from '@/content/icon-names'
import { anyone, edit, hiddenUnless } from '../access'
import { revalidateServices, revalidateServicesOnDelete } from '../hooks/revalidate'

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Services shown on the Services page, as home "What We Build" cards and as footer links. */
export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Service', plural: 'Services' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order', 'visible'],
    group: 'Content',
    hidden: hiddenUnless('services'),
    description:
      'What you offer. Each service is a card on the Services page, a card in the home "What We Build" section and a link in the footer. Untick Visible to hide one without deleting it. Changes go live within seconds.',
  },
  access: {
    read: anyone,
    create: edit('services'),
    update: edit('services'),
    delete: edit('services'),
  },
  defaultSort: 'order',
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && !data.slug && data.title) data.slug = slugify(String(data.title))
        return data
      },
    ],
    afterChange: [revalidateServices],
    afterDelete: [revalidateServicesOnDelete],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true, maxLength: 60 },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          validate: (value: unknown) =>
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(value ?? '')) ||
            'Lowercase letters, numbers and hyphens only',
          admin: {
            description:
              'Link anchor, e.g. /services#booking-websites. Filled from the title; do not change after launch.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          defaultValue: 'globe',
          options: iconNames.map((n) => ({ label: n, value: n })),
        },
        {
          name: 'contactType',
          label: 'Contact form pre-selects',
          type: 'select',
          required: true,
          defaultValue: 'website',
          options: contactTypes.map((t) => ({ label: t.label, value: t.value })),
          admin: { description: 'What the "Start a Project" button pre-selects on the contact form.' },
        },
      ],
    },
    {
      name: 'outcome',
      label: 'Outcome line',
      type: 'text',
      required: true,
      maxLength: 120,
      admin: { description: 'One sentence on the result, e.g. "Accept bookings online, day and night."' },
    },
    {
      name: 'homeLine',
      label: 'Home card line',
      type: 'text',
      maxLength: 120,
      admin: { description: 'Short description under the outcome on the home page card.' },
    },
    {
      name: 'included',
      label: 'What is included',
      type: 'text',
      hasMany: true,
      admin: { description: 'Press Enter after each item.' },
    },
    { name: 'goodFor', label: 'Good for', type: 'text', maxLength: 120 },
    {
      type: 'row',
      fields: [
        {
          name: 'order',
          type: 'number',
          required: true,
          defaultValue: 0,
          admin: { description: 'Lower numbers show first.' },
        },
        { name: 'visible', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
