import type { QueryResultRow } from 'pg'
import { pool } from '../db/pool.js'
import type { User, UserWithPassword } from '../types/user.js'

interface UserRow extends QueryResultRow {
  id: string
  name: string
  email: string
  password_hash: string
  created_at: Date
  updated_at: Date
}

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }
}

function mapUserWithPassword(row: UserRow): UserWithPassword {
  return {
    ...mapUser(row),
    passwordHash: row.password_hash,
  }
}

export async function createUser(name: string, email: string, passwordHash: string) {
  const result = await pool.query<UserRow>(
    `
      insert into users (name, email, password_hash)
      values ($1, $2, $3)
      returning id, name, email, password_hash, created_at, updated_at
    `,
    [name, email, passwordHash],
  )

  return mapUser(result.rows[0])
}

export async function findUserByEmail(email: string) {
  const result = await pool.query<UserRow>(
    `
      select id, name, email, password_hash, created_at, updated_at
      from users
      where email = $1
    `,
    [email],
  )

  return result.rows[0] ? mapUserWithPassword(result.rows[0]) : null
}

export async function findUserById(userId: string) {
  const result = await pool.query<UserRow>(
    `
      select id, name, email, password_hash, created_at, updated_at
      from users
      where id = $1
    `,
    [userId],
  )

  return result.rows[0] ? mapUser(result.rows[0]) : null
}

