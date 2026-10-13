import type { CollectionConfig } from 'payload'
import { hiddenUnlessAdmin, isAdmin, isAdminField } from '../access'
import { permissionsFromRole, permissionsOf } from '../permissions'
import { ensureDefaultRoles } from '../roles-default'

function relId(v: unknown): number | undefined {
  if (typeof v === 'number') return v
  if (v && typeof v === 'object' && 'id' in v) return Number((v as { id: unknown }).id)
  return undefined
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7, // 7 days
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 minutes
    forgotPassword: {
      generateEmailSubject: () => 'Reset your KAPOSA FUTEXI admin password',
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'assignedRole'],
    group: 'Admin',
    hidden: hiddenUnlessAdmin,
    description: 'People who can log in to this admin. What each person sees is decided by their role.',
  },
  access: {
    // Admins see everyone; everyone else sees only their own account.
    read: ({ req }) =>
      permissionsOf(req.user).admin ? true : req.user ? { id: { equals: req.user.id } } : false,
    create: isAdmin,
    update: ({ req, id }) => permissionsOf(req.user).admin || (Boolean(req.user) && req.user?.id === id),
    delete: isAdmin,
    admin: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeValidate: [
      // The very first user becomes Admin automatically (create-first-user has no roles yet).
      async ({ data, operation, req }) => {
        if (operation !== 'create' || !data || data.assignedRole) return data
        const count = await req.payload.count({ collection: 'users', overrideAccess: true })
        if (count.totalDocs === 0) {
          const { adminId } = await ensureDefaultRoles(req.payload)
          data.assignedRole = adminId
        }
        return data
      },
    ],
    beforeChange: [
      // Copy the role's permissions onto the user so access checks need no extra queries.
      async ({ data, originalDoc, req }) => {
        const roleId = relId(data.assignedRole) ?? relId(originalDoc?.assignedRole)
        if (!roleId) {
          data.permissions = { admin: false, areas: {} }
          return data
        }
        const role = await req.payload.findByID({
          collection: 'roles',
          id: roleId,
          depth: 0,
          overrideAccess: true,
        })
        data.permissions = permissionsFromRole(role)
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'assignedRole',
      label: 'Role',
      type: 'relationship',
      relationTo: 'roles',
      required: true,
      saveToJWT: true,
      access: { update: isAdminField },
      admin: {
        description: 'Decides which menus this person can see and edit. Roles are under Admin > Roles.',
      },
    },
    {
      // The pre-roles "admin | editor" column. Kept in the schema so the roles
      // migration can map existing users; no longer shown or used.
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      admin: { hidden: true },
    },
    {
      // Computed from the role on every save; never edited by hand.
      name: 'permissions',
      type: 'json',
      admin: { hidden: true, readOnly: true },
    },
  ],
}
