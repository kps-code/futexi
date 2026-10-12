import type { CollectionConfig } from 'payload'
import { novaServices } from '@/content/demo-booking'
import { isAdmin, isLoggedIn, nobody } from '../access'

export const demoBookingStatuses = ['requested', 'confirmed', 'cancelled'] as const

/**
 * Appointments created through the Booking Website demo. Shows what the
 * owner's view looks like. Retention 90 days.
 */
export const DemoBookings: CollectionConfig = {
  slug: 'demo-bookings',
  labels: { singular: 'Demo Booking', plural: 'Demo Bookings' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['date', 'time', 'service', 'name', 'status', 'createdAt'],
    group: 'Demos',
    description: 'Appointments made on the Booking demo site. Sample business: Nova Studio.',
    listSearchableFields: ['name', 'phone', 'service'],
  },
  access: {
    create: nobody, // server action via Local API
    read: isLoggedIn,
    update: isLoggedIn,
    delete: isAdmin,
  },
  defaultSort: '-createdAt',
  indexes: [{ fields: ['date', 'time'], unique: true }],
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'service',
          type: 'select',
          required: true,
          options: novaServices.map((s) => ({ label: s.name, value: s.slug })),
        },
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
