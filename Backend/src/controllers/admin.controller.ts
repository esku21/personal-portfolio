import type { NextFunction, Response } from 'express'
import type { AuthRequest } from '../middleware/auth.js'
import { createProject, deleteProject, getProfile, listProjects, updateProfile, updateProject } from '../services/portfolio.service.js'
import { getStats, listMessages, updateMessageStatus } from '../services/message.service.js'
import { messageStatusSchema, profileSchema, projectSchema } from '../validators/index.js'

export async function stats(_req: AuthRequest, res: Response, next: NextFunction) {
  try { return res.json(await getStats()) } catch (error) { return next(error) }
}

export async function projects(_req: AuthRequest, res: Response, next: NextFunction) {
  try { return res.json(await listProjects()) } catch (error) { return next(error) }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try { return res.status(201).json(await createProject(projectSchema.parse(req.body))) } catch (error) { return next(error) }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try { return res.json(await updateProject(req.params.id as string, projectSchema.partial().parse(req.body))) } catch (error) { return next(error) }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try { await deleteProject(req.params.id as string); return res.status(204).send() } catch (error) { return next(error) }
}

export async function messages(_req: AuthRequest, res: Response, next: NextFunction) {
  try { return res.json(await listMessages()) } catch (error) { return next(error) }
}

export async function updateMessage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { status } = messageStatusSchema.parse(req.body)
    return res.json(await updateMessageStatus(req.params.id as string, status))
  } catch (error) { return next(error) }
}

export async function profile(_req: AuthRequest, res: Response, next: NextFunction) {
  try { return res.json(await getProfile()) } catch (error) { return next(error) }
}

export async function saveProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try { return res.json(await updateProfile(profileSchema.parse(req.body))) } catch (error) { return next(error) }
}
