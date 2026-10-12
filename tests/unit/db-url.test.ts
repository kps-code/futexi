import { describe, expect, it } from 'vitest'
import { composeDatabaseUrl, isPostgresUrl } from '@/server/db-url'

describe('composeDatabaseUrl', () => {
  it('builds a local url with default port', () => {
    expect(
      composeDatabaseUrl({ user: 'postgres', password: 'secret', host: 'localhost', database: 'futexi' }),
    ).toBe('postgres://postgres:secret@localhost:5432/futexi')
  })

  it('encodes special characters in the password and adds ssl', () => {
    expect(
      composeDatabaseUrl({
        user: 'postgres',
        password: 'p@ss:w/rd#1',
        host: 'db.example.com',
        port: 6543,
        database: 'futexi',
        ssl: true,
      }),
    ).toBe('postgres://postgres:p%40ss%3Aw%2Frd%231@db.example.com:6543/futexi?sslmode=require')
  })
})

describe('isPostgresUrl', () => {
  it('accepts both schemes and rejects others', () => {
    expect(isPostgresUrl('postgres://a:b@c/d')).toBe(true)
    expect(isPostgresUrl('postgresql://a:b@c/d')).toBe(true)
    expect(isPostgresUrl('mysql://a:b@c/d')).toBe(false)
  })
})
