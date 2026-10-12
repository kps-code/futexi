import type { CollectionConfig } from 'payload'
import { isAdmin, isLoggedIn, nobody } from '../access'

export const demoLeadStatuses = ['new', 'contacted', 'won', 'lost'] as const

/** Leads captured by the AI assistant on the AI-Powered Business demo. Retention 90 days. */
export const DemoLeads: CollectionConfig = {
  slug: 'demo-leads',
  labels: { singular: 'Demo Lead', plural: 'Demo Leads' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'interest', 'status', 'business', 'createdAt'],
    group: 'Demos',
    description: 'Leads the AI assistant captured on demo sites, with the conversation that led there.',
    listSearchableFields: ['name', 'phone', 'reference'],
  },
  access: {
    create: nobody,
    read: isLoggedIn,
    update: isLoggedIn,
    delete: isAdmin,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'business',
          type: 'select',
          required: true,
          defaultValue: 'ai-business',
          options: [{ label: 'Pulse Fitness', value: 'ai-business' }],
        },
        { name: 'interest', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'phone', type: 'text', required: true },
      ],
    },
    { name: 'transcript', type: 'json', admin: { description: 'The conversation, oldest first.' } },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: demoLeadStatuses.map((v) => ({ label: v[0].toUpperCase() + v.slice(1), value: v })),
      admin: { position: 'sidebar' },
    },
    {
      name: 'reference',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar', readOnly: true },
    },
    { name: 'visitorId', type: 'text', index: true, admin: { position: 'sidebar', readOnly: true } },
  ],
}
