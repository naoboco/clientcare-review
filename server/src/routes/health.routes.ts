import { Router } from 'express'
import { verifyDatabaseConnection } from '../db/pool.js'

export const healthRouter = Router()

healthRouter.get('/', (_request, response) => {
  response.status(200).json({
    status: 'ok',
    service: 'clientcare-api',
    timestamp: new Date().toISOString(),
  })
})

healthRouter.get('/database', async (_request, response) => {
  const databaseTime = await verifyDatabaseConnection()

  response.status(200).json({
    status: 'ok',
    service: 'clientcare-database',
    databaseTime: databaseTime.toISOString(),
  })
})
