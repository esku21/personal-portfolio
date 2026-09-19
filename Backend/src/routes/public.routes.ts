import { Router } from 'express'
import { portfolio, projectDetails } from '../controllers/portfolio.controller.js'
import { contact } from '../controllers/contact.controller.js'

export const publicRouter = Router()
publicRouter.get('/portfolio', portfolio)
publicRouter.get('/projects/:slug', projectDetails)
publicRouter.post('/contact', contact)
