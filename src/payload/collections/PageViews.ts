import type { CollectionConfig } from 'payload'
import { hiddenUnless, isAdmin, nobody, view } from '../access'

/** One row per page view. `createdAt` is the view time. Retention 180 days. */
export const PageViews: CollectionConfig = {
  slug: 'page-views',
  labels: { singular: 'Page View', plural: 'Page Views' },
  admin: {
    useAsTitle: 'path',
    defaultColumns: ['createdAt', 'path', 'visitorId', 'durationMs', 'maxScrollPct', 'referrer'],
    group: 'Analytics',
    hidden: hiddenUnless('analytics'),
    description: 'Every page view with time on page and scroll depth.',
    listSearchableFields: ['path', 'visitorId', 'sessionId', 'referrer'],
    pagination: { defaultLimit: 50 },
  },
  access: {
    create: nobody,
    read: view('analytics'),
    update: nobody,
    delete: isAdmin,
  },
  defaultSort: '-createdAt',
  indexes: [{ fields: ['visitorId', 'createdAt'] }, { fields: ['path', 'createdAt'] }],
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
        { name: 'path', type: 'text', required: true, index: true },
        { name: 'title', type: 'text' },
      ],
    },
    { name: 'referrer', type: 'text' },
    {
      type: 'row',
      fields: [
        {
          name: 'durationMs',
          type: 'number',
          admin: { description: 'Filled when the visitor leaves the page.' },
        },
        { name: 'maxScrollPct', type: 'number', min: 0, max: 100 },
        {
          name: 'theme',
          type: 'select',
          options: [
            { label: 'dark', value: 'dark' },
            { label: 'light', value: 'light' },
          ],
        },
        { name: 'viewportWidth', type: 'number' },
      ],
    },
  ],
}
