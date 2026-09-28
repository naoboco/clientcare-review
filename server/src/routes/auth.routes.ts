import bcrypt from 'bcryptjs'
import type { CookieOptions, Response } from 'express'
import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { env } from '../config/env.js'
import {
  requireCoordinator,
  sessionCookieName,
} from '../middleware/auth.middleware.js'
import {
  createUser,
  findUserByEmail,
  findUserById,
} from '../repositories/user.repository.js'
import { loginSchema, registerSchema } from '../schemas/auth.schemas.js'
import {
  createSessionToken,
  sessionDurationMilliseconds,
} from '../services/session.service.js'

export const authRouter = Router()

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1_000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Try again later.' },
})

authRouter.use(['/register', '/login'], authRateLimit)

const invalidPasswordHash = '$2b$12$YOtsO0TKMErOYWE3V2oMeujZaRQWFQr6KyVujc40h2s/0.EVQZHRm'

const sessionCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: sessionDurationMilliseconds,
}

function setSessionCookie(response: Response, userId: string) {
  response.cookie(sessionCookieName, createSessionToken(userId), sessionCookieOptions)
}

authRouter.post('/register', async (request, response) => {
  const input = registerSchema.parse(request.body)
  const passwordHash = await bcrypt.hash(input.password, 12)
  const user = await createUser(input.name, input.email, passwordHash)

  setSessionCookie(response, user.id)
  response.status(201).json({ data: user })
})

authRouter.post('/login', async (request, response) => {
  const input = loginSchema.parse(request.body)
  const user = await findUserByEmail(input.email)
  const passwordMatches = await bcrypt.compare(
    input.password,
    user?.passwordHash ?? invalidPasswordHash,
  )

  if (!user || !passwordMatches) {
    response.status(401).json({ error: 'Invalid email or password' })
    return
  }

  const { passwordHash: _passwordHash, ...safeUser } = user
  setSessionCookie(response, safeUser.id)
  response.status(200).json({ data: safeUser })
})

authRouter.post('/logout', (_request, response) => {
  response.clearCookie(sessionCookieName, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  })
  response.status(204).send()
})

authRouter.get('/me', requireCoordinator, async (_request, response) => {
  const user = await findUserById(response.locals.coordinatorId!)

  if (!user) {
    response.status(401).json({ error: 'Invalid session' })
    return
  }

  response.status(200).json({ data: user })
})
