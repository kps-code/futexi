/**
 * Creates the application database if it does not exist.
 * Reads .env (DATABASE_URL or DB_* parts). Safe to run repeatedly.
 *
 *   npm run db:create
 */
import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

function targetFromEnv() {
  const url = process.env.DATABASE_URL
  if (url) {
    const u = new URL(url)
    const database = decodeURIComponent(u.pathname.replace(/^\//, '')) || 'futexi'
    u.pathname = '/postgres' // maintenance database
    return { connectionString: u.toString(), database }
  }
  const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env
  if (!DB_USER || !DB_PASSWORD || !DB_HOST || !DB_NAME) {
    throw new Error('Set DATABASE_URL or DB_USER, DB_PASSWORD, DB_HOST, DB_NAME in .env')
  }
  return {
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: Number(DB_PORT || 5432),
    database: DB_NAME,
    maintenance: 'postgres',
  }
}

const target = targetFromEnv()
const name = target.database
const client = new Client(
  'connectionString' in target
    ? { connectionString: target.connectionString }
    : {
        user: target.user,
        password: target.password,
        host: target.host,
        port: target.port,
        database: target.maintenance,
      },
)

try {
  await client.connect()
  const existing = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [name])
  if (existing.rowCount) {
    console.log(`Database "${name}" already exists.`)
  } else {
    await client.query(`CREATE DATABASE "${name.replace(/"/g, '""')}"`)
    console.log(`Created database "${name}".`)
  }
} finally {
  await client.end()
}
