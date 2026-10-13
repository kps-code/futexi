import type { Access, FieldAccess } from 'payload'
import { canEdit, canView, permissionsOf, type AreaKey } from './permissions'

export const anyone: Access = () => true

export const isLoggedIn: Access = ({ req }) => Boolean(req.user)

export const nobody: Access = () => false

export const isAdmin: Access = ({ req }) => permissionsOf(req.user).admin

export const isAdminField: FieldAccess = ({ req }) => permissionsOf(req.user).admin

/** Logged-in users whose role can at least view the area. */
export const view =
  (area: AreaKey): Access =>
  ({ req }) =>
    Boolean(req.user) && canView(permissionsOf(req.user), area)

/** Logged-in users whose role can edit the area (create, update, delete). */
export const edit =
  (area: AreaKey): Access =>
  ({ req }) =>
    Boolean(req.user) && canEdit(permissionsOf(req.user), area)

type HiddenArgs = { user: unknown }

/** For `admin.hidden`: keeps the item out of the sidebar and dashboard unless the role can view it. */
export const hiddenUnless =
  (area: AreaKey) =>
  ({ user }: HiddenArgs): boolean =>
    !canView(permissionsOf(user), area)

export const hiddenUnlessAdmin = ({ user }: HiddenArgs): boolean => !permissionsOf(user).admin
