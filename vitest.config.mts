import { fileURLToPath } from 'url'
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

// Integration tests: real Postgres via .env (local) or CI service.
export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      'server-only': fileURLToPath(new URL('./tests/helpers/empty.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts'],
    testTimeout: 30_000,
    hookTimeout: 60_000,
    fileParallelism: false,
  },
})
