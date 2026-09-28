import type { RequestHandler } from 'express'
import { env } from '../config/env.js'

export const developmentIdentity: RequestHandler = (_request, response, next) => {
  if (env.NODE_ENV !== 'production' && env.DEVELOPMENT_USER_ID) {
    response.locals.coordinatorId = env.DEVELOPMENT_USER_ID
  }

  next()
}

export const requireCoordinator: RequestHandler = (_request, response, next) => {
  if (!response.locals.coordinatorId) {
    response.status(401).json({ error: 'Authentication required' })
    return
  }

  next()
}

