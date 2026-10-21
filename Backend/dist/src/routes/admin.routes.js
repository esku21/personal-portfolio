import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../middleware/auth.js';
import { certifications, create, createCertificationRecord, createEducationRecord, createExperienceRecord, createServiceRecord, createSkillRecord, deleteCertificationRecord, deleteEducationRecord, deleteExperienceRecord, deleteServiceRecord, deleteSkillRecord, education, experience, messages, profile, projects, remove, removeMessage, reports, saveProfile, services, skills, stats, update, updateAccount, updateCertificationRecord, updateEducationRecord, updateExperienceRecord, updateMessage, updateServiceRecord, updateSkillRecord } from '../controllers/admin.controller.js';
export const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
}));
adminRouter.get('/stats', stats);
adminRouter.get('/reports', reports);
adminRouter.get('/projects', projects);
adminRouter.post('/projects', create);
adminRouter.patch('/projects/:id', update);
adminRouter.put('/projects/:id', update);
adminRouter.delete('/projects/:id', remove);
adminRouter.get('/experience', experience);
adminRouter.post('/experience', createExperienceRecord);
adminRouter.put('/experience/:id', updateExperienceRecord);
adminRouter.patch('/experience/:id', updateExperienceRecord);
adminRouter.delete('/experience/:id', deleteExperienceRecord);
adminRouter.get('/education', education);
adminRouter.post('/education', createEducationRecord);
adminRouter.put('/education/:id', updateEducationRecord);
adminRouter.patch('/education/:id', updateEducationRecord);
adminRouter.delete('/education/:id', deleteEducationRecord);
adminRouter.get('/skills', skills);
adminRouter.post('/skills', createSkillRecord);
adminRouter.put('/skills/:id', updateSkillRecord);
adminRouter.patch('/skills/:id', updateSkillRecord);
adminRouter.delete('/skills/:id', deleteSkillRecord);
adminRouter.get('/services', services);
adminRouter.post('/services', createServiceRecord);
adminRouter.put('/services/:id', updateServiceRecord);
adminRouter.patch('/services/:id', updateServiceRecord);
adminRouter.delete('/services/:id', deleteServiceRecord);
adminRouter.get('/certifications', certifications);
adminRouter.post('/certifications', createCertificationRecord);
adminRouter.put('/certifications/:id', updateCertificationRecord);
adminRouter.patch('/certifications/:id', updateCertificationRecord);
adminRouter.delete('/certifications/:id', deleteCertificationRecord);
adminRouter.get('/messages', messages);
adminRouter.patch('/messages/:id', updateMessage);
adminRouter.delete('/messages/:id', removeMessage);
adminRouter.get('/profile', profile);
adminRouter.put('/profile', saveProfile);
adminRouter.put('/account', updateAccount);
//# sourceMappingURL=admin.routes.js.map