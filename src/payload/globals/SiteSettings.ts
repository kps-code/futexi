import type { GlobalConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { contactDefaults, brand } from '@/content/site'
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
    description: 'Contact details and short texts shown across the whole website.',
  },
  access: {
    read: anyone,
    update: isLoggedIn,
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
          ],
        },
      ],
    },
  ],
}
