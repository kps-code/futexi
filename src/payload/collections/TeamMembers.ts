import type { CollectionConfig } from 'payload'
import { anyone, isAdmin, isLoggedIn } from '../access'
import { revalidateTeamMembers, revalidateTeamMembersOnDelete } from '../hooks/revalidate'

const urlField = (name: string, label: string): CollectionConfig['fields'][number] => ({
  name,
  label,
  type: 'text',
  validate: (value: unknown) => {
    if (!value) return true
    try {
      const u = new URL(String(value))
      return u.protocol === 'https:' || 'Must start with https://'
    } catch {
      return 'Must be a full URL, e.g. https://linkedin.com/in/you'
    }
  },
})

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: { singular: 'Team Member', plural: 'Team Members' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'order', 'visible'],
    group: 'Settings',
    description:
      'The builders shown on the About page and the home page. Untick Visible to hide someone without deleting; Delete is in the record menu.',
  },
  access: {
    read: anyone,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isAdmin,
  },
  defaultSort: 'order',
  hooks: { afterChange: [revalidateTeamMembers], afterDelete: [revalidateTeamMembersOnDelete] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', required: true, admin: { placeholder: 'Software Engineer' } },
      ],
    },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
      maxLength: 240,
      admin: { description: 'One or two sentences. Max 240 characters.' },
    },
    {
      name: 'skills',
      type: 'text',
      hasMany: true,
      admin: { description: 'Press Enter after each skill.' },
    },
    {
      name: 'aiSkills',
      label: 'AI skills',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Square image works best. Leave empty to show initials.' },
    },
    {
      type: 'row',
      fields: [urlField('linkedin', 'LinkedIn URL'), urlField('github', 'GitHub URL')],
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
          defaultValue: true,
        },
      ],
    },
  ],
}
