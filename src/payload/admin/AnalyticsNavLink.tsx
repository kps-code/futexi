import Link from 'next/link'

/** Extra link in the admin sidebar, rendered after the collection links. */
export function AnalyticsNavLink() {
  return (
    <Link className="nav__link kf-nav-link" href="/admin/analytics" prefetch={false}>
      <span className="nav__link-label">Analytics</span>
    </Link>
  )
}
