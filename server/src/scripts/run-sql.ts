import { readFile } from 'node:fs/promises'
import { closeDatabaseConnection, pool } from '../db/pool.js'

const files = {
  schema: new URL('../../../database/schema.sql', import.meta.url),
  seed: new URL('../../../database/seed.sql', import.meta.url),
}

const requestedFile = process.argv[2] as keyof typeof files

if (!files[requestedFile]) {
  throw new Error('Expected one SQL target: schema or seed')
}

try {
  const sql = await readFile(files[requestedFile], 'utf8')
  await pool.query(sql)
  console.log(`Applied database ${requestedFile}`)
} finally {
  await closeDatabaseConnection()
}
