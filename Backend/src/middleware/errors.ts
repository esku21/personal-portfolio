import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { logger } from '../lib/logger.js'

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) return res.status(400).json({ error: 'Validation failed', details: error.flatten() })
  if (error?.code === 'P2025') return res.status(404).json({ error: 'Resource not found' })
  if (error?.code === 'P2002') return res.status(409).json({ error: 'A resource with that value already exists' })
  logger.error(error)
  return res.status(500).json({ error: 'Internal server error' })
}
