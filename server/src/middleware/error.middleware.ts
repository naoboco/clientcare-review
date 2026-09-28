import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { env } from '../config/env.js'
import { ApiError } from '../lib/api-error.js'

interface PostgreSqlError extends Error {
  code?: string
}

export const errorHandler: ErrorRequestHandler = (
  error: PostgreSqlError,
  _request,
  response,
  _next,
) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: 'Validation failed',
      details: error.flatten(),
    })
    return
  }

  if (error instanceof ApiError) {
    response.status(error.statusCode).json({ error: error.message })
    return
  }

  if (error.code === '23503') {
    response.status(409).json({ error: 'Related record does not exist' })
    return
  }

  if (env.NODE_ENV !== 'test') {
    console.error(error)
  }

  response.status(500).json({ error: 'Internal server error' })
}

