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
          label: 'Branding',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Replaces the "KAPOSA FUTEXI" text in the header and footer. SVG or transparent PNG about 40 px tall, under 20 KB. Leave empty to keep the text.',
              },
            },
            {
              name: 'logoDark',
              label: 'Logo for dark theme',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Optional. Used when a visitor is in the dark theme, for example a white version. Leave empty to use the same logo.',
                condition: (data) => Boolean(data?.logo),
              },
            },
            {
              name: 'siteIcon',
              label: 'Site icon (browser tab)',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'The small icon in the browser tab and bookmarks. Square PNG or SVG, 512 x 512 recommended. Leave empty to use the built-in icon.',
              },
            },
            {
              name: 'defaultTheme',
              label: 'Default theme',
              type: 'radio',
              options: [
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
              ],
              defaultValue: 'light',
              admin: {
                layout: 'horizontal',
                description:
                  'What first-time visitors see. A visitor who presses the sun / moon button keeps their own choice on that device.',
              },
            },
          ],
        },
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
