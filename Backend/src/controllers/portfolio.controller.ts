import type { NextFunction, Request, Response } from 'express'
import { getPortfolio, getPublishedProject } from '../services/portfolio.service.js'

export async function portfolio(_req: Request, res: Response, next: NextFunction) {
  try { res.json(await getPortfolio()) } catch (error) { next(error) }
}

export async function projectDetails(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await getPublishedProject(req.params.slug as string)
    if (!project) return res.status(404).json({ error: 'Project not found' })
    return res.json(project)
  } catch (error) { return next(error) }
}
