import type { CollectionConfig } from 'payload'
import { hiddenUnless, isAdmin, nobody, view } from '../access'

export const deviceOptions = ['desktop', 'mobile', 'tablet'] as const

const utmGroup = (name: string) => ({
  name,
  type: 'group' as const,
  fields: [
    { name: 'source', type: 'text' as const },
    { name: 'medium', type: 'text' as const },
    { name: 'campaign', type: 'text' as const },
  ],
})

export { utmGroup }

/** One row per browser (first-party cookie). Written by the ingest route only. */
export const Visitors: CollectionConfig = {
  slug: 'visitors',
  admin: {
    useAsTitle: 'visitorId',
    defaultColumns: ['visitorId', 'lastSeen', 'visitsCount', 'country', 'device', 'lead'],
    group: 'Analytics',
    hidden: hiddenUnless('analytics'),
    description: 'One row per browser. Anonymous until the visitor submits the contact form.',
    listSearchableFields: ['visitorId', 'firstReferrer', 'city'],
    pagination: { defaultLimit: 50 },
  },
  access: {
    create: nobody,
    read: view('analytics'),
    update: nobody,
    delete: isAdmin,
  },
  defaultSort: '-lastSeen',
  fields: [
    { name: 'visitorId', type: 'text', required: true, unique: true, index: true },
    {
      type: 'row',
      fields: [
        { name: 'firstSeen', type: 'date', required: true },
        { name: 'lastSeen', type: 'date', required: true, index: true },
        { name: 'visitsCount', type: 'number', required: true, defaultValue: 1 },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'firstReferrer', type: 'text' },
        { name: 'firstLandingPath', type: 'text' },
      ],
    },
    utmGroup('firstUtm'),
    {
      type: 'row',
      fields: [
        {
          name: 'device',
          type: 'select',
          options: deviceOptions.map((v) => ({ label: v, value: v })),
        },
        { name: 'browser', type: 'text' },
        { name: 'os', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'country', type: 'text', index: true },
        { name: 'city', type: 'text' },
      ],
    },
    {
      name: 'lead',
      type: 'relationship',
      relationTo: 'leads',
      index: true,
      admin: { description: 'Set when this visitor submits the contact form.' },
    },
  ],
}
