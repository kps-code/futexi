import 'server-only'
import { after } from 'next/server'

/**
 * Run work after the response is sent. Falls back to running immediately
 * (fire-and-forget) when there is no Next request scope, e.g. in tests.
 */
export function runAfter(task: () => Promise<unknown>): void {
  try {
    after(task)
  } catch {
    void task().catch(() => {})
  }
}
