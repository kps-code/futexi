import type { GlobalConfig } from 'payload'
import { servicesPage } from '@/content/services'
import { anyone, isLoggedIn } from '../access'
import { revalidateServicesPage } from '../hooks/revalidate'

/** Heading and sub-text at the top of the Services page. The cards come from Content > Services. */
export const ServicesPage: GlobalConfig = {
  slug: 'services-page',
  label: 'Services Page',
  admin: {
    group: 'Content',
    description:
      'Heading and sub-text at the top of the Services page. The service cards are under Content > Services.',
  },
  access: {
    read: anyone,
    update: isLoggedIn,
  },
  hooks: { afterChange: [revalidateServicesPage] },
  fields: [
    { name: 'heading', type: 'text', required: true, maxLength: 80, defaultValue: servicesPage.heading },
    { name: 'sub', label: 'Sub-text', type: 'textarea', maxLength: 200, defaultValue: servicesPage.sub },
  ],
}
