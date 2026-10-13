import type { GlobalConfig } from 'payload'
import { anyone, edit, hiddenUnless } from '../access'
import { contactDefaults, brand, whatsappDefaultMessage } from '@/content/site'
import { revalidateSiteSettings } from '../hooks/revalidate'

const httpsUrl = (value: unknown) => {
  if (!value) return true
  try {
    return new URL(String(value)).protocol === 'https:' || 'Must start with https://'
  } catch {
    return 'Must be a full URL'
  }
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
    hidden: hiddenUnless('siteSettings'),
    description: 'Contact details and short texts shown across the whole website.',
  },
  access: {
    read: anyone,
    update: edit('siteSettings'),
  },
  hooks: { afterChange: [revalidateSiteSettings] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  required: true,
                  defaultValue: contactDefaults.phoneDisplay,
                  admin: { description: 'Shown as text. Example: +91 88836 73422' },
                },
                {
                  name: 'whatsappNumber',
                  type: 'text',
                  required: true,
                  defaultValue: contactDefaults.whatsappNumber,
                  validate: (value: unknown) =>
                    /^\d{10,15}$/.test(String(value ?? '')) ||
                    'Digits only with country code, e.g. 918883673422',
                  admin: { description: 'Digits only with country code. Used for wa.me links.' },
                },
              ],
            },
            {
              name: 'email',
              type: 'email',
              required: true,
              defaultValue: contactDefaults.email,
            },
            {
              name: 'replyTimeText',
              type: 'text',
              defaultValue: contactDefaults.replyTimeText,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'city',
                  type: 'text',
                  defaultValue: contactDefaults.city,
                  admin: {
                    description: 'Shown in the footer and Contact page, and sent to Google as your location.',
                  },
                },
                {
                  name: 'region',
                  label: 'State',
                  type: 'text',
                  defaultValue: contactDefaults.region,
                },
              ],
            },
            {
              name: 'serviceAreaText',
              label: 'Service area line',
              type: 'text',
              defaultValue: contactDefaults.serviceAreaText,
              admin: { description: 'Short line after the city, e.g. "Serving businesses across India".' },
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'instagram',
              type: 'text',
              validate: httpsUrl,
              admin: { placeholder: 'https://instagram.com/...' },
            },
            { name: 'linkedin', type: 'text', validate: httpsUrl, defaultValue: contactDefaults.linkedin },
            {
              name: 'github',
              type: 'text',
              validate: httpsUrl,
              admin: { placeholder: 'https://github.com/...' },
            },
          ],
        },
        {
          label: 'Texts',
          fields: [
            {
              name: 'tagline',
              type: 'text',
              required: true,
              defaultValue: brand.tagline,
            },
            {
              name: 'startingPriceText',
              type: 'text',
              required: true,
              defaultValue: contactDefaults.startingPriceText,
              admin: { description: 'Shown in the Investment section and FAQ.' },
            },
            {
              name: 'whatsappMessage',
              label: 'WhatsApp message',
              type: 'textarea',
              maxLength: 300,
              defaultValue: whatsappDefaultMessage,
              admin: {
                description:
                  'Pre-filled text when a visitor taps a WhatsApp button. Change it for campaigns, e.g. mention an offer.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seoDescription',
              label: 'Site description',
              type: 'textarea',
              maxLength: 160,
              defaultValue: brand.tagline,
              admin: {
                description:
                  'Shown under the site name in Google results and link previews. Up to 160 characters.',
              },
            },
            {
              name: 'ogImage',
              label: 'Share image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Preview image when the site is shared on WhatsApp, Instagram or LinkedIn. 1200 x 630 PNG or JPG. Leave empty to use the built-in default.',
              },
            },
          ],
        },
      ],
    },
  ],
}
