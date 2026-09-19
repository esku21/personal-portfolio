import type { NextFunction, Request, Response } from 'express'
import { authenticate, findAdmin } from '../services/auth.service.js'
import { loginSchema } from '../validators/index.js'
import type { AuthRequest } from '../middleware/auth.js'

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const result = await authenticate(email, password)
    if (!result) return res.status(401).json({ error: 'Invalid credentials' })
    return res.json(result)
  } catch (error) { return next(error) }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try { return res.json(await findAdmin(req.adminId!)) } catch (error) { return next(error) }
}
