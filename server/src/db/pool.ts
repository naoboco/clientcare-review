import { Pool } from 'pg'
import { env } from '../config/env.js'

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.DATABASE_POOL_MAX,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  options: `-c timezone=${env.APP_TIME_ZONE}`,
  application_name: 'clientcare-api',
})

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error', error)
})

export async function verifyDatabaseConnection() {
  const result = await pool.query<{ current_time: Date }>(
    'select current_timestamp as current_time',
  )

  return result.rows[0].current_time
}

export async function closeDatabaseConnection() {
  await pool.end()
}

