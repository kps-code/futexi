import { describe, expect, it } from 'vitest'
import {
  canEdit,
  canView,
  EDITOR_AREAS,
  PERMISSION_AREAS,
  permissionsFromRole,
  permissionsOf,
} from '@/payload/permissions'

describe('permissions', () => {
  it('admin can view and edit everything', () => {
    const p = permissionsOf({ permissions: { admin: true, areas: {} } })
    for (const a of PERMISSION_AREAS) {
      expect(canView(p, a.key)).toBe(true)
      expect(canEdit(p, a.key)).toBe(true)
    }
  })

  it('levels are ordered none < view < edit', () => {
    const p = permissionsOf({ permissions: { admin: false, areas: { faqs: 'view', leads: 'edit' } } })
    expect(canView(p, 'faqs')).toBe(true)
    expect(canEdit(p, 'faqs')).toBe(false)
    expect(canView(p, 'leads')).toBe(true)
    expect(canEdit(p, 'leads')).toBe(true)
    expect(canView(p, 'apiLogs')).toBe(false)
  })

  it('missing, malformed or foreign values mean no access', () => {
    expect(canView(permissionsOf(undefined), 'faqs')).toBe(false)
    expect(canView(permissionsOf({ permissions: 'nope' }), 'faqs')).toBe(false)
    const p = permissionsOf({ permissions: { admin: 'yes', areas: { faqs: 'owner', leads: 'edit' } } })
    expect(p.admin).toBe(false)
    expect(canView(p, 'faqs')).toBe(false)
    expect(canEdit(p, 'leads')).toBe(true)
  })

  it('builds the copy from a role document', () => {
    const editor = permissionsFromRole({ isAdmin: false, areas: EDITOR_AREAS })
    expect(canEdit(editor, 'faqs')).toBe(true)
    expect(canEdit(editor, 'siteSettings')).toBe(false)
    expect(canView(editor, 'siteSettings')).toBe(true)
    expect(canView(editor, 'apiLogs')).toBe(false)
    expect(permissionsFromRole({ isAdmin: true }).admin).toBe(true)
    expect(permissionsFromRole(null).admin).toBe(false)
  })
})
