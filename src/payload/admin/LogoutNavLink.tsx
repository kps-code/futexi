import Link from 'next/link'

/** Clearly visible logout entry after the collection groups in the admin sidebar. */
export function LogoutNavLink() {
  return (
    <Link className="nav__link kf-nav-link kf-nav-link--logout" href="/admin/logout" prefetch={false}>
      <span className="nav__link-label">Log out</span>
    </Link>
  )
}
