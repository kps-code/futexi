import type { CollectionConfig } from 'payload'
import { budgetOptions, leadStatuses, needOptions } from '@/content/contact'
import { edit, hiddenUnless, nobody, view } from '../access'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'need', 'status', 'createdAt'],
    group: 'Sales',
    hidden: hiddenUnless('leads'),
    description: 'Every contact form submission. Created by the website, never by hand.',
    listSearchableFields: ['name', 'businessName', 'email', 'whatsapp'],
  },
  access: {
    // Created only through the server action (Local API, overrideAccess).
    create: nobody,
    read: view('leads'),
    update: edit('leads'),
    delete: edit('leads'),
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
      name: 'journey',
      type: 'ui',
      admin: {
        components: { Field: '/payload/admin/fields/LeadJourney#LeadJourney' },
      },
    },
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
      admin: { position: 'sidebar', readOnly: true },
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
