import type { CollectionConfig } from 'payload'
import { isAdmin, nobody } from '../access'

export const apiLogKinds = ['route', 'action', 'payload'] as const

/**
 * One row per API call. Written by src/server/logging/with-logging.ts
 * after the response is sent. Read-only in the admin. Retention: 90 days.
 */
export const ApiLogs: CollectionConfig = {
  slug: 'api-logs',
  labels: { singular: 'API Log', plural: 'API Logs' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['createdAt', 'name', 'status', 'durationMs', 'path', 'country'],
    group: 'System',
    description: 'Every API call. Read-only. Rows older than 90 days are removed daily.',
    listSearchableFields: ['requestId', 'name', 'path', 'visitorId'],
    pagination: { defaultLimit: 50 },
  },
  access: {
    create: nobody, // written via Local API with overrideAccess
    read: isAdmin,
    update: nobody,
    delete: isAdmin,
  },
  defaultSort: '-createdAt',
  indexes: [{ fields: ['name', 'createdAt'] }, { fields: ['status', 'createdAt'] }],
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'requestId', type: 'text', required: true, index: true },
        {
          name: 'kind',
          type: 'select',
          required: true,
          options: apiLogKinds.map((v) => ({ label: v, value: v })),
        },
        { name: 'name', type: 'text', required: true, index: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'method', type: 'text', required: true },
        { name: 'path', type: 'text', required: true, index: true },
        { name: 'status', type: 'number', required: true, index: true },
        { name: 'durationMs', type: 'number', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'visitorId', type: 'text', index: true },
        { name: 'user', type: 'relationship', relationTo: 'users' },
        { name: 'ipHash', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'country', type: 'text' },
        { name: 'city', type: 'text' },
      ],
    },
    { name: 'userAgent', type: 'text' },
    { name: 'referer', type: 'text' },
    { name: 'inputSummary', type: 'json' },
    {
      type: 'row',
      fields: [
        { name: 'errorCode', type: 'text' },
        { name: 'errorMessage', type: 'text' },
      ],
    },
  ],
}
