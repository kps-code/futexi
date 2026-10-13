import type { Payload } from 'payload'
import { EDITOR_AREAS } from './permissions'

/**
 * The two built-in roles. Created on first use (first admin user, seed), so a
 * fresh database always has an Admin role to assign.
 */
export const DEFAULT_ROLES = {
  admin: {
    name: 'Admin',
    description: 'Full access to everything, including Users and Roles.',
    isAdmin: true,
  },
  editor: {
    name: 'Editor',
    description: 'Edits content, team, leads and demo enquiries. No access to users, roles or logs.',
    isAdmin: false,
    areas: EDITOR_AREAS,
  },
} as const

export async function ensureDefaultRoles(payload: Payload): Promise<{ adminId: number; editorId: number }> {
  const find = async (name: string) =>
    (
      await payload.find({
        collection: 'roles',
        where: { name: { equals: name } },
        limit: 1,
        overrideAccess: true,
      })
    ).docs[0]

  let admin = await find(DEFAULT_ROLES.admin.name)
  if (!admin) {
    admin = await payload.create({
      collection: 'roles',
      data: { ...DEFAULT_ROLES.admin },
      overrideAccess: true,
    })
  }
  let editor = await find(DEFAULT_ROLES.editor.name)
  if (!editor) {
    editor = await payload.create({
      collection: 'roles',
      data: { ...DEFAULT_ROLES.editor, areas: { ...DEFAULT_ROLES.editor.areas } },
      overrideAccess: true,
    })
  }
  return { adminId: admin.id, editorId: editor.id }
}
