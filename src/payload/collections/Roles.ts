import type { CollectionConfig, Field } from 'payload'
import { hiddenUnlessAdmin, isAdmin, isLoggedIn } from '../access'
import { PERMISSION_AREAS } from '../permissions'

const GROUPS = ['Content', 'Settings', 'Sales', 'Demos', 'Analytics', 'System'] as const

/** One select per area, grouped like the sidebar. */
function areaFields(): Field[] {
  return GROUPS.map((group) => ({
    type: 'collapsible',
    label: group,
    admin: { initCollapsed: false },
    fields: PERMISSION_AREAS.filter((a) => a.group === group).map((a): Field => ({
      name: a.key,
      label: a.max === 'view' ? `${a.label} (view only)` : a.label,
      type: 'select',
      defaultValue: 'none',
      // One shared Postgres enum for every level select.
      enumName: 'enum_roles_level',
      options: [
        { label: 'No access', value: 'none' },
        { label: 'View only', value: 'view' },
        { label: 'View and edit', value: 'edit' },
      ],
      admin: { condition: (data) => !data?.isAdmin },
    })),
  }))
}

/** Roles decide which admin menus a user can see and change. */
export const Roles: CollectionConfig = {
  slug: 'roles',
  labels: { singular: 'Role', plural: 'Roles' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'description', 'isAdmin'],
    group: 'Admin',
    hidden: hiddenUnlessAdmin,
    description:
      'A role is a set of permissions. Create a role, choose what it can see and edit, then assign it to users under Admin > Users. Changes apply to those users immediately.',
  },
  access: {
    read: isLoggedIn,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [
      // Users carry a copy of their role's permissions; refresh it when the role changes.
      async ({ doc, operation, req }) => {
        if (operation !== 'update') return doc
        const users = await req.payload.find({
          collection: 'users',
          where: { assignedRole: { equals: doc.id } },
          limit: 200,
          depth: 0,
          overrideAccess: true,
        })
        for (const u of users.docs) {
          await req.payload.update({
            collection: 'users',
            id: u.id,
            data: {},
            depth: 0,
            overrideAccess: true,
          })
        }
        return doc
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        const inUse = await req.payload.count({
          collection: 'users',
          where: { assignedRole: { equals: id } },
          overrideAccess: true,
        })
        if (inUse.totalDocs > 0) {
          throw new Error(`This role is assigned to ${inUse.totalDocs} user(s). Change their role first.`)
        }
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, unique: true, maxLength: 40 },
        { name: 'description', type: 'text', maxLength: 140 },
      ],
    },
    {
      name: 'isAdmin',
      label: 'Full access',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Everything, including Users, Roles and API logs. Tick this only for owners.' },
    },
    {
      name: 'areas',
      label: 'What this role can see and edit',
      type: 'group',
      admin: { condition: (data) => !data?.isAdmin },
      fields: areaFields(),
    },
  ],
}
