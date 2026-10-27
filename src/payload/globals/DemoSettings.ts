import type { GlobalConfig } from 'payload'
import { demos } from '@/content/demos'
import { anyone, edit, hiddenUnless } from '../access'
import { revalidateDemoSettings } from '../hooks/revalidate'

const options = demos.map((d) => ({ label: `${d.title} (${d.slug})`, value: d.slug }))

/** Show or hide demos on the public site without touching code. */
export const DemoSettings: GlobalConfig = {
  slug: 'demo-settings',
  label: 'Demos',
  admin: {
    group: 'Settings',
    hidden: hiddenUnless('demoSettings'),
    description: 'Control which demos appear on the website. Changes go live within seconds.',
  },
  access: {
    read: anyone,
    update: edit('demoSettings'),
  },
  hooks: { afterChange: [revalidateDemoSettings] },
  fields: [
    {
      name: 'hidden',
      label: 'Hidden demos',
      type: 'select',
      hasMany: true,
      options,
      admin: {
        description:
          'Selected demos disappear from Home, the Demos page, case studies and the sitemap. Their live mini-site still opens by direct link, so you can share one privately.',
      },
    },
    {
      name: 'featured',
      label: 'Featured on Home',
      type: 'array',
      labels: { singular: 'Demo', plural: 'Demos' },
      maxRows: 6,
      defaultValue: ['booking', 'salon', 'restaurant', 'ai-business'].map((demo) => ({ demo })),
      admin: {
        initCollapsed: false,
        description:
          'The "Live demos" section of the home page shows these, top to bottom. Drag the handle to reorder, up to six. Hidden demos and demos marked coming soon are skipped.',
      },
      fields: [{ name: 'demo', label: 'Demo', type: 'select', options, required: true }],
    },
  ],
}
