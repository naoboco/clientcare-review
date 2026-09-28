import jwt, { type JwtPayload } from 'jsonwebtoken'
import { env } from '../config/env.js'

const issuer = 'clientcare-api'
const audience = 'clientcare-web'

export const sessionDurationMilliseconds = 8 * 60 * 60 * 1_000

export function createSessionToken(userId: string) {
  return jwt.sign({}, env.JWT_SECRET, {
    subject: userId,
    expiresIn: '8h',
    issuer,
    audience,
  })
}

export function readSessionToken(token: string) {
  const payload = jwt.verify(token, env.JWT_SECRET, {
    issuer,
    audience,
  })

  if (typeof payload === 'string') return null

  const subject = (payload as JwtPayload).sub
  return subject && /^\d+$/.test(subject) ? subject : null
}

