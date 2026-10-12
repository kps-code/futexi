import type { CollectionConfig } from 'payload'
import { isAdmin, nobody } from '../access'
import { eventNames } from '@/server/analytics/schema'

/** Clicks and actions: CTA, WhatsApp, demo open, form submit. Retention 180 days. */
export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['createdAt', 'name', 'path', 'visitorId', 'props'],
    group: 'Analytics',
    description: 'Tracked interactions. Names are fixed in code.',
    listSearchableFields: ['name', 'path', 'visitorId'],
    pagination: { defaultLimit: 50 },
  },
  access: {
    create: nobody,
    read: isAdmin,
    update: nobody,
    delete: isAdmin,
  },
  defaultSort: '-createdAt',
  indexes: [{ fields: ['name', 'createdAt'] }, { fields: ['visitorId', 'createdAt'] }],
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'visitorId', type: 'text', required: true, index: true },
        { name: 'sessionId', type: 'text', required: true, index: true },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'select',
          required: true,
          index: true,
          options: eventNames.map((v) => ({ label: v, value: v })),
        },
        { name: 'path', type: 'text', required: true },
      ],
    },
    { name: 'props', type: 'json' },
  ],
}
