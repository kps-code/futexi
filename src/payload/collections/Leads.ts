import type { CollectionConfig } from 'payload'
import { isAdmin, isLoggedIn, nobody } from '../access'

export const needOptions = [
  'Website',
  'Landing Page',
  'Booking Website',
  'AI Integration',
  'Automation',
  'Web Application',
  'Mobile App',
  'Custom Software',
  'Other',
] as const

export const budgetOptions = [
  'Under ₹10,000',
  '₹10,000 to ₹25,000',
  '₹25,000 to ₹50,000',
  'Above ₹50,000',
  'Not sure yet',
] as const

export const leadStatuses = ['new', 'contacted', 'quoted', 'won', 'lost'] as const

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'need', 'status', 'createdAt'],
    group: 'Sales',
    description: 'Every contact form submission. Created by the website, never by hand.',
    listSearchableFields: ['name', 'businessName', 'email', 'whatsapp'],
  },
  access: {
    // Created only through the server action (Local API, overrideAccess).
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
        { name: 'name', type: 'text', required: true },
        { name: 'businessName', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', required: true },
        { name: 'whatsapp', type: 'text', required: true },
      ],
    },
    { name: 'businessType', type: 'text' },
    {
      type: 'row',
      fields: [
        {
          name: 'need',
          type: 'select',
          required: true,
          options: needOptions.map((v) => ({ label: v, value: v })),
        },
        {
          name: 'budget',
          type: 'select',
          options: budgetOptions.map((v) => ({ label: v, value: v })),
        },
      ],
    },
    { name: 'details', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      index: true,
      options: leadStatuses.map((v) => ({ label: v[0].toUpperCase() + v.slice(1), value: v })),
      admin: { position: 'sidebar' },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { position: 'sidebar', description: 'Internal notes. Never shown to the lead.' },
    },
    {
      name: 'visitorId',
      type: 'text',
      index: true,
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'source',
      type: 'group',
      admin: { readOnly: true },
      fields: [
        { name: 'utmSource', type: 'text' },
        { name: 'utmMedium', type: 'text' },
        { name: 'utmCampaign', type: 'text' },
        { name: 'referrer', type: 'text' },
        { name: 'landingPath', type: 'text' },
      ],
    },
  ],
}
