import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { create, messages, profile, projects, remove, saveProfile, stats, update, updateMessage } from '../controllers/admin.controller.js'

export const adminRouter = Router()
adminRouter.use(requireAuth)
adminRouter.get('/stats', stats)
adminRouter.get('/projects', projects)
adminRouter.post('/projects', create)
adminRouter.patch('/projects/:id', update)
adminRouter.put('/projects/:id', update)
adminRouter.delete('/projects/:id', remove)
adminRouter.get('/messages', messages)
adminRouter.patch('/messages/:id', updateMessage)
adminRouter.get('/profile', profile)
adminRouter.put('/profile', saveProfile)
