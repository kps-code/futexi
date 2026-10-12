import { withPayload } from '@payloadcms/next/withPayload'
import { withSentryConfig } from '@sentry/nextjs/config'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'
import { getServerEnv } from './src/server/env'

// Fail the build early when required environment is missing or malformed.
const env = getServerEnv()

const dirname = path.dirname(fileURLToPath(import.meta.url))

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()',
  },
  ...(env.VERCEL_ENV === 'production'
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
    : []),
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ['pino', 'thread-stream'],
  images: {
    formats: ['image/avif', 'image/webp'],
    localPatterns: [{ pathname: '/api/media/file/**' }],
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      { source: '/api/(.*)', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
      { source: '/admin/(.*)', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
    ]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

// Source maps are uploaded only when Sentry is on and an auth token exists (Vercel / CI).
const uploadSourcemaps = Boolean(env.SENTRY_DSN && env.SENTRY_AUTH_TOKEN)

export default withSentryConfig(withPayload(nextConfig, { devBundleServerPackages: false }), {
  silent: true,
  telemetry: false,
  widenClientFileUpload: true,
  authToken: env.SENTRY_AUTH_TOKEN,
  sourcemaps: { disable: !uploadSourcemaps },
})
