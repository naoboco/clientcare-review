import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { developmentIdentity } from './middleware/coordinator.middleware.js'
import { errorHandler } from './middleware/error.middleware.js'
import { clientsRouter } from './routes/clients.routes.js'
import { healthRouter } from './routes/health.routes.js'

export const app = express()

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }))
app.use(express.json({ limit: '100kb' }))
app.use(developmentIdentity)

app.use('/api/health', healthRouter)
app.use('/api/clients', clientsRouter)

app.use((_request, response) => {
  response.status(404).json({ error: 'Route not found' })
})

app.use(errorHandler)
