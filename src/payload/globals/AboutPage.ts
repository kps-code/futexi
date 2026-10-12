import type { GlobalConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { revalidateAboutPage } from '../hooks/revalidate'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page',
  admin: {
    group: 'Content',
    description: 'Heading, intro and values on the About page.',
  },
  access: {
    read: anyone,
    update: isLoggedIn,
  },
  hooks: { afterChange: [revalidateAboutPage] },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Three Builders. One Vision.',
    },
    {
      name: 'intro',
      type: 'textarea',
      required: true,
      maxLength: 600,
      defaultValue:
        'We are a small technology team focused on building modern websites, AI-powered experiences, automation solutions and digital products. We work directly with every client, from the first call to launch and beyond.',
    },
    {
      name: 'values',
      type: 'text',
      hasMany: true,
      defaultValue: ['Custom, Not Cookie-Cutter', 'AI-Ready', 'Mobile First', 'Direct Collaboration'],
      admin: { description: 'Short labels shown as a strip under the team.' },
    },
  ],
}
