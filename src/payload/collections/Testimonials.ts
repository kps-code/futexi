import { randomBytes } from 'node:crypto'
import type { CollectionConfig, FieldAccess } from 'payload'
import { anyone, edit, hiddenUnless } from '../access'
import { revalidateTestimonials, revalidateTestimonialsOnDelete } from '../hooks/revalidate'

/** Only logged-in users may read the private link parts through the API. */
const staffOnly: FieldAccess = ({ req }) => Boolean(req.user)

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')
}

/**
 * Client feedback for the "What Clients Say" block on the home page.
 *
 * Flow: create a record with the client's name and business, save, copy the
 * feedback link and send it on WhatsApp. The client fills in the rating and
 * quote on that page; the record then shows "Received" and stays hidden until
 * Visible is ticked.
 */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'business', 'rating', 'submittedAt', 'visible', 'order'],
    group: 'Content',
    hidden: hiddenUnless('testimonials'),
    description:
      'Client feedback shown on the home page under "What Clients Say". To collect one: Create New, enter the client name and business, Save, then copy the Feedback link and send it on WhatsApp. When the client submits, the quote appears here; tick Visible to publish it.',
  },
  access: {
    read: anyone,
    create: edit('testimonials'),
    update: edit('testimonials'),
    delete: edit('testimonials'),
  },
  defaultSort: 'order',
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (operation === 'create' && data && !data.token) {
          data.token = randomBytes(9).toString('base64url')
        }
        return data
      },
    ],
    afterChange: [revalidateTestimonials],
    afterDelete: [revalidateTestimonialsOnDelete],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { placeholder: 'Priya' } },
        { name: 'business', type: 'text', admin: { placeholder: 'Velvet Salon, Chennai' } },
      ],
    },
    {
      name: 'feedbackLink',
      label: 'Feedback link',
      type: 'text',
      access: { read: staffOnly },
      admin: {
        readOnly: true,
        description:
          'Private link for this client only. Copy it and send it on WhatsApp. It stops working once feedback is received.',
      },
      hooks: {
        afterRead: [
          ({ siblingData }) => (siblingData?.token ? `${siteUrl()}/feedback/${siblingData.token}` : ''),
        ],
      },
    },
    {
      name: 'token',
      type: 'text',
      unique: true,
      index: true,
      access: { read: staffOnly },
      admin: { hidden: true },
    },
    {
      name: 'quote',
      type: 'textarea',
      maxLength: 400,
      admin: {
        description:
          "In the client's own words. One to three sentences. Filled in by the client through the feedback link, or type it here yourself.",
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          defaultValue: 5,
          admin: { description: '1 to 5 stars. Leave empty to hide the stars.' },
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Optional. Square works best. Without a photo the first letter of the name is shown.',
          },
        },
      ],
    },
    {
      name: 'submittedAt',
      label: 'Received',
      type: 'date',
      access: { read: staffOnly },
      admin: {
        readOnly: true,
        date: { displayFormat: 'd MMM yyyy, h:mm a' },
        description: 'Set automatically when the client submits the feedback form.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'order',
          type: 'number',
          required: true,
          defaultValue: 0,
          admin: { description: 'Lower numbers show first.' },
        },
        {
          name: 'visible',
          type: 'checkbox',
          defaultValue: false,
          validate: (value: unknown, { siblingData }: { siblingData: { quote?: string | null } }) =>
            value && !siblingData?.quote?.trim() ? 'Add the quote before making this visible.' : true,
          admin: { description: 'Shows the testimonial on the home page. Needs a quote.' },
        },
      ],
    },
  ],
}
