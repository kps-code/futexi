import type { CollectionConfig } from 'payload'
import { isAdmin, nobody } from '../access'
import { deviceOptions, utmGroup } from './Visitors'

/** One visit: 30 minutes idle or 4 hours max. Written by the ingest route only. */
export const Sessions: CollectionConfig = {
  slug: 'sessions',
  admin: {
    useAsTitle: 'sessionId',
    defaultColumns: ['startedAt', 'visitorId', 'landingPath', 'pageCount', 'referrer', 'country'],
    group: 'Analytics',
    description: 'One row per visit. Retention 180 days.',
    listSearchableFields: ['sessionId', 'visitorId', 'landingPath', 'referrer'],
    pagination: { defaultLimit: 50 },
  },
  access: {
    create: nobody,
    read: isAdmin,
    update: nobody,
    delete: isAdmin,
  },
  defaultSort: '-startedAt',
  indexes: [{ fields: ['visitorId', 'startedAt'] }],
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'sessionId', type: 'text', required: true, unique: true, index: true },
        { name: 'visitorId', type: 'text', required: true, index: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'startedAt', type: 'date', required: true, index: true },
        { name: 'endedAt', type: 'date', required: true },
        { name: 'durationMs', type: 'number', required: true, defaultValue: 0 },
        { name: 'pageCount', type: 'number', required: true, defaultValue: 0 },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'landingPath', type: 'text', required: true },
        { name: 'exitPath', type: 'text' },
        { name: 'referrer', type: 'text' },
      ],
    },
    utmGroup('utm'),
    {
      type: 'row',
      fields: [
        {
          name: 'device',
          type: 'select',
          options: deviceOptions.map((v) => ({ label: v, value: v })),
        },
        { name: 'country', type: 'text' },
      ],
    },
  ],
}
