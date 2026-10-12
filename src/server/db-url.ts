/** Build a Postgres connection string from parts. Pure, so it can be unit tested. */
export function composeDatabaseUrl(parts: {
  user: string
  password: string
  host: string
  port?: number
  database: string
  ssl?: boolean
}): string {
  const auth = `${encodeURIComponent(parts.user)}:${encodeURIComponent(parts.password)}`
  const port = parts.port ?? 5432
  const query = parts.ssl ? '?sslmode=require' : ''
  return `postgres://${auth}@${parts.host}:${port}/${encodeURIComponent(parts.database)}${query}`
}

export function isPostgresUrl(value: string): boolean {
  return value.startsWith('postgres://') || value.startsWith('postgresql://')
}
