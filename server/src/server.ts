import { app } from './app.js'
import { env } from './config/env.js'
import { closeDatabaseConnection } from './db/pool.js'

const server = app.listen(env.PORT, () => {
  console.log(`ClientCare API listening on http://localhost:${env.PORT}`)
})

async function shutdown() {
  server.close(async () => {
    await closeDatabaseConnection()
    process.exit(0)
  })
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)
