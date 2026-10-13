import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import { ensureDefaultRoles } from '../../src/payload/roles-default.js'

export const testUser = {
  email: 'dev@payloadcms.com',
  password: 'test',
  name: 'Test Admin',
}

/**
 * Seeds an admin test user for e2e admin tests (assigned the built-in Admin role).
 */
export async function seedTestUser(): Promise<void> {
  const payload = await getPayload({ config })
  const { adminId } = await ensureDefaultRoles(payload)

  // Delete existing test user if any
  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: testUser.email,
      },
    },
  })

  // Create fresh test user
  await payload.create({
    collection: 'users',
    data: { ...testUser, assignedRole: adminId },
  })
}

/**
 * Cleans up test user after tests
 */
export async function cleanupTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: testUser.email,
      },
    },
  })
}
