import type { CollectionConfig } from 'payload'
import { isAdmin, isLoggedIn, nobody } from '../access'

export const demoLeadStatuses = ['new', 'contacted', 'won', 'lost'] as const

/**
 * Leads and enquiries captured on the demo sites: the AI assistant (Pulse
 * Fitness) and the enquiry forms (Atelier Nila, Vidya Academy). Retention 90 days.
 */
export const DemoLeads: CollectionConfig = {
  slug: 'demo-leads',
  labels: { singular: 'Demo Lead', plural: 'Demo Leads' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['business', 'name', 'interest', 'status', 'createdAt'],
    group: 'Demos',
    description: 'Leads from the demo sites, with the conversation or message that led there.',
    listSearchableFields: ['name', 'phone', 'reference', 'interest'],
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
          index: true,
          options: [
            { label: 'Pulse Fitness (AI)', value: 'ai-business' },
            { label: 'Atelier Nila (Interior)', value: 'interior' },
            { label: 'Vidya Academy (Tuition)', value: 'tuition' },
          ],
        },
        {
          name: 'interest',
          type: 'text',
          required: true,
          admin: { description: 'Course, project type or "Free trial".' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'phone', type: 'text', required: true },
      ],
    },
    { name: 'details', type: 'textarea', admin: { description: 'Message typed in an enquiry form.' } },
    { name: 'transcript', type: 'json', admin: { description: 'Assistant conversation, oldest first.' } },
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
