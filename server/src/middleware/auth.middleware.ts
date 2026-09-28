import type { RequestHandler } from 'express'
import { readSessionToken } from '../services/session.service.js'

const sessionCookieName = 'clientcare_session'

function readBearerToken(authorizationHeader?: string) {
  if (!authorizationHeader?.startsWith('Bearer ')) return null
  return authorizationHeader.slice('Bearer '.length).trim()
}

export const requireCoordinator: RequestHandler = (request, response, next) => {
  const token = request.cookies?.[sessionCookieName]
    ?? readBearerToken(request.header('authorization'))

  if (!token) {
    response.status(401).json({ error: 'Authentication required' })
    return
  }

  try {
    const coordinatorId = readSessionToken(token)

    if (!coordinatorId) {
      response.status(401).json({ error: 'Invalid session' })
      return
    }

    response.locals.coordinatorId = coordinatorId
    next()
  } catch {
    response.status(401).json({ error: 'Invalid or expired session' })
  }
}

export { sessionCookieName }

