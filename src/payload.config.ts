import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './payload/collections/Users'
import { Roles } from './payload/collections/Roles'
import { Media } from './payload/collections/Media'
import { TeamMembers } from './payload/collections/TeamMembers'
import { Leads } from './payload/collections/Leads'
import { ApiLogs } from './payload/collections/ApiLogs'
import { Visitors } from './payload/collections/Visitors'
import { Sessions } from './payload/collections/Sessions'
import { PageViews } from './payload/collections/PageViews'
import { Events } from './payload/collections/Events'
import { DemoBookings } from './payload/collections/DemoBookings'
import { DemoLeads } from './payload/collections/DemoLeads'
import { Faqs } from './payload/collections/Faqs'
import { Testimonials } from './payload/collections/Testimonials'
import { Services } from './payload/collections/Services'
import { SiteSettings } from './payload/globals/SiteSettings'
import { AboutPage } from './payload/globals/AboutPage'
import { DemoSettings } from './payload/globals/DemoSettings'
import { HomePage } from './payload/globals/HomePage'
import { AiDemo } from './payload/globals/AiDemo'
import { ServicesPage } from './payload/globals/ServicesPage'
import { LegalPages } from './payload/globals/LegalPages'
import { getDatabaseUrl } from './server/env'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const blobToken = process.env.BLOB_READ_WRITE_TOKEN || ''

/**
 * Admin emails (forgot password, verification) go through Resend with the same
 * key as lead notifications. Until the domain is verified, Resend's test sender
 * only delivers to the Resend account owner's address.
 */
const resendKey = process.env.RESEND_API_KEY || ''
function fromParts(raw: string | undefined): { name: string; address: string } {
  const m = raw?.match(/^\s*(.*?)\s*<([^>]+)>\s*$/)
  if (m) return { name: m[1] || 'KAPOSA FUTEXI', address: m[2] }
  return { name: 'KAPOSA FUTEXI', address: raw?.trim() || 'onboarding@resend.dev' }
}
const from = fromParts(process.env.LEAD_FROM_EMAIL)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · KAPOSA FUTEXI',
    },
    components: {
      beforeNavLinks: ['/payload/admin/DashboardNavLink#DashboardNavLink'],
      afterNavLinks: ['/payload/admin/LogoutNavLink#LogoutNavLink'],
      providers: [
        '/payload/admin/PasswordRevealProvider#PasswordRevealProvider',
        '/payload/admin/NavAccordionProvider#NavAccordionProvider',
      ],
      views: {
        analytics: {
          Component: '/payload/admin/views/AnalyticsView#AnalyticsView',
          path: '/analytics',
          exact: true,
        },
      },
    },
  },
  collections: [
    Users,
    Roles,
    Media,
    TeamMembers,
    Leads,
    ApiLogs,
    Visitors,
    Sessions,
    PageViews,
    Events,
    DemoBookings,
    DemoLeads,
    Faqs,
    Testimonials,
    Services,
  ],
  globals: [SiteSettings, AboutPage, DemoSettings, HomePage, AiDemo, ServicesPage, LegalPages],
  editor: lexicalEditor(),
  email: resendKey
    ? resendAdapter({ apiKey: resendKey, defaultFromAddress: from.address, defaultFromName: from.name })
    : undefined,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: getDatabaseUrl(),
    },
    // Auto-sync schema in development only. Production uses migrations.
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(blobToken),
      collections: { media: true },
      token: blobToken,
    }),
  ],
})
