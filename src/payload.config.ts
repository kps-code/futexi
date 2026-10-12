import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './payload/collections/Users'
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
import { SiteSettings } from './payload/globals/SiteSettings'
import { AboutPage } from './payload/globals/AboutPage'
import { DemoSettings } from './payload/globals/DemoSettings'
import { getDatabaseUrl } from './server/env'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const blobToken = process.env.BLOB_READ_WRITE_TOKEN || ''

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
      providers: ['/payload/admin/PasswordRevealProvider#PasswordRevealProvider'],
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
  ],
  globals: [SiteSettings, AboutPage, DemoSettings],
  editor: lexicalEditor(),
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
