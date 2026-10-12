import type { Field, GlobalConfig } from 'payload'
import { privacyDefaults, termsDefaults, type LegalPageContent } from '@/content/legal'
import { anyone, isLoggedIn } from '../access'
import { revalidateLegalPages } from '../hooks/revalidate'

const PLACEHOLDERS =
  'You can write {brand}, {email}, {phone} and {price}; they are filled in from Site Settings.'

function pageFields(defaults: LegalPageContent): Field[] {
  return [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true, maxLength: 60, defaultValue: defaults.title },
        {
          name: 'updatedOn',
          label: 'Last updated',
          type: 'date',
          defaultValue: defaults.updatedOn,
          admin: { date: { displayFormat: 'd MMM yyyy' } },
        },
      ],
    },
    {
      name: 'intro',
      type: 'textarea',
      maxLength: 240,
      defaultValue: defaults.intro,
      admin: { description: `Line under the title. ${PLACEHOLDERS}` },
    },
    {
      name: 'sections',
      type: 'array',
      labels: { singular: 'Section', plural: 'Sections' },
      minRows: 1,
      defaultValue: defaults.sections,
      admin: { initCollapsed: true, description: `Leave a blank line between paragraphs. ${PLACEHOLDERS}` },
      fields: [
        { name: 'title', type: 'text', required: true, maxLength: 80 },
        { name: 'body', type: 'textarea', required: true, maxLength: 3000 },
      ],
    },
  ]
}

/** Privacy Policy and Terms text, editable without code. */
export const LegalPages: GlobalConfig = {
  slug: 'legal-pages',
  label: 'Legal Pages',
  admin: {
    group: 'Content',
    description: 'Privacy Policy and Terms. Each page is a title, an intro line and a list of sections.',
  },
  access: {
    read: anyone,
    update: isLoggedIn,
  },
  hooks: { afterChange: [revalidateLegalPages] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        { label: 'Privacy Policy', name: 'privacy', fields: pageFields(privacyDefaults) },
        { label: 'Terms', name: 'terms', fields: pageFields(termsDefaults) },
      ],
    },
  ],
}
