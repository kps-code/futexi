'use client'

import { useAuth } from '@payloadcms/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { canView, permissionsOf } from '../permissions'

const HREF = '/admin/analytics'

/** First item in the admin sidebar: the business dashboard. Only for roles that can view analytics. */
export function DashboardNavLink() {
  const pathname = usePathname()
  const { user } = useAuth()
  if (!canView(permissionsOf(user), 'analytics')) return null
  const active = pathname === HREF || pathname.startsWith(`${HREF}/`)
  return (
    <Link
      className={[
        'nav__link',
        'kf-nav-link',
        'kf-nav-link--dashboard',
        active ? 'nav__link--active active' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      href={HREF}
      prefetch={false}
      aria-current={active ? 'page' : undefined}
    >
      <span className="nav__link-indicator" />
      <span className="nav__link-label">Dashboard</span>
    </Link>
  )
}
