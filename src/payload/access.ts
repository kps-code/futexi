import type { Access, FieldAccess } from 'payload'

export const anyone: Access = () => true

export const isLoggedIn: Access = ({ req }) => Boolean(req.user)

export const isAdmin: Access = ({ req }) => req.user?.role === 'admin'

export const nobody: Access = () => false

export const isAdminField: FieldAccess = ({ req }) => req.user?.role === 'admin'
