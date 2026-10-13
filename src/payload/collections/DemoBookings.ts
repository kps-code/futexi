import type { CollectionConfig } from 'payload'
import { allBookableServices, bookableBusinesses } from '@/content/demo-businesses'
import { edit, hiddenUnless, nobody, view } from '../access'

export const demoBookingStatuses = ['requested', 'confirmed', 'cancelled'] as const

/**
 * Appointments and reservations created through the live demos. Shows what
 * the owner's view looks like. One row per (business, date, time). Retention 90 days.
 */
export const DemoBookings: CollectionConfig = {
  slug: 'demo-bookings',
  labels: { singular: 'Demo Booking', plural: 'Demo Bookings' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['business', 'date', 'time', 'service', 'name', 'status', 'createdAt'],
    group: 'Demos',
    hidden: hiddenUnless('demoBookings'),
    description: 'Appointments and table reservations made on the demo sites.',
    listSearchableFields: ['name', 'phone', 'service', 'reference'],
  },
  access: {
    create: nobody, // server action via Local API
    read: view('demoBookings'),
    update: edit('demoBookings'),
    delete: edit('demoBookings'),
  },
  defaultSort: '-createdAt',
  indexes: [{ fields: ['business', 'date', 'time'], unique: true }],
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'business',
          type: 'select',
          required: true,
          defaultValue: 'booking',
          index: true,
          options: bookableBusinesses.map((b) => ({ label: b.name, value: b.id })),
        },
        {
          name: 'service',
          type: 'select',
          required: true,
          options: allBookableServices,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'date',
          type: 'text',
          required: true,
          index: true,
          admin: { description: 'YYYY-MM-DD (IST)' },
        },
        { name: 'time', type: 'text', required: true, admin: { description: 'HH:MM, 24 hour' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'phone', type: 'text', required: true },
      ],
    },
    { name: 'notes', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'requested',
      options: demoBookingStatuses.map((v) => ({ label: v[0].toUpperCase() + v.slice(1), value: v })),
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
