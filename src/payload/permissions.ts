/**
 * Role-based access for the admin. A role sets a level per area; every
 * collection and global maps to one area. Users carry a copy of their role's
 * permissions (recomputed on save), so checks are synchronous and cheap.
 */

export type Level = 'none' | 'view' | 'edit'

export const PERMISSION_AREAS = [
  { key: 'media', label: 'Media', group: 'Content', max: 'edit' },
  { key: 'faqs', label: 'FAQ', group: 'Content', max: 'edit' },
  { key: 'testimonials', label: 'Testimonials', group: 'Content', max: 'edit' },
  { key: 'services', label: 'Services', group: 'Content', max: 'edit' },
  { key: 'aboutPage', label: 'About Page', group: 'Content', max: 'edit' },
  { key: 'homePage', label: 'Home Page', group: 'Content', max: 'edit' },
  { key: 'aiDemo', label: 'AI Assistant Demo', group: 'Content', max: 'edit' },
  { key: 'servicesPage', label: 'Services Page', group: 'Content', max: 'edit' },
  { key: 'legalPages', label: 'Legal Pages', group: 'Content', max: 'edit' },
  { key: 'teamMembers', label: 'Team Members', group: 'Settings', max: 'edit' },
  { key: 'siteSettings', label: 'Site Settings', group: 'Settings', max: 'edit' },
  { key: 'demoSettings', label: 'Demos (show / hide)', group: 'Settings', max: 'edit' },
  { key: 'leads', label: 'Leads', group: 'Sales', max: 'edit' },
  { key: 'demoBookings', label: 'Demo Bookings', group: 'Demos', max: 'edit' },
  { key: 'demoLeads', label: 'Demo Leads', group: 'Demos', max: 'edit' },
  {
    key: 'analytics',
    label: 'Analytics (dashboard, visitors, sessions, page views, events)',
    group: 'Analytics',
    max: 'view',
  },
  { key: 'apiLogs', label: 'API Logs', group: 'System', max: 'view' },
] as const

export type AreaKey = (typeof PERMISSION_AREAS)[number]['key']

export type Permissions = {
  /** Full access to everything, including Users and Roles. */
  admin: boolean
  areas: Partial<Record<AreaKey, Level>>
}

export const NO_PERMISSIONS: Permissions = { admin: false, areas: {} }

/** What the built-in Editor role can do: all content, leads and demos, analytics read-only. */
export const EDITOR_AREAS: Record<AreaKey, Level> = {
  media: 'edit',
  faqs: 'edit',
  testimonials: 'edit',
  services: 'edit',
  aboutPage: 'edit',
  homePage: 'edit',
  aiDemo: 'edit',
  servicesPage: 'edit',
  legalPages: 'edit',
  teamMembers: 'edit',
  siteSettings: 'view',
  demoSettings: 'edit',
  leads: 'edit',
  demoBookings: 'edit',
  demoLeads: 'edit',
  analytics: 'view',
  apiLogs: 'none',
}

const RANK: Record<Level, number> = { none: 0, view: 1, edit: 2 }

function level(p: Permissions | undefined, area: AreaKey): Level {
  return p?.areas?.[area] ?? 'none'
}

export function canView(p: Permissions | undefined, area: AreaKey): boolean {
  return Boolean(p?.admin) || RANK[level(p, area)] >= RANK.view
}

export function canEdit(p: Permissions | undefined, area: AreaKey): boolean {
  return Boolean(p?.admin) || RANK[level(p, area)] >= RANK.edit
}

/** Reads the permissions copy stored on a user document; anything odd counts as no access. */
export function permissionsOf(user: unknown): Permissions {
  const raw = (user as { permissions?: unknown } | null | undefined)?.permissions
  if (!raw || typeof raw !== 'object') return NO_PERMISSIONS
  const p = raw as { admin?: unknown; areas?: unknown }
  const areas: Partial<Record<AreaKey, Level>> = {}
  if (p.areas && typeof p.areas === 'object') {
    for (const a of PERMISSION_AREAS) {
      const v = (p.areas as Record<string, unknown>)[a.key]
      if (v === 'view' || v === 'edit' || v === 'none') areas[a.key] = v
    }
  }
  return { admin: p.admin === true, areas }
}

/** Builds the permissions copy from a role document. */
export function permissionsFromRole(role: unknown): Permissions {
  if (!role || typeof role !== 'object') return NO_PERMISSIONS
  const r = role as { isAdmin?: unknown; areas?: unknown }
  return permissionsOf({ permissions: { admin: r.isAdmin === true, areas: r.areas } })
}
