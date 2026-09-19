import { createProject, deleteProject, getProfile, listProjects, updateProfile, updateProject } from '../services/portfolio.service.js';
import { getStats, listMessages, updateMessageStatus } from '../services/message.service.js';
import { messageStatusSchema, profileSchema, projectSchema } from '../validators/index.js';
export async function stats(_req, res, next) {
    try {
        return res.json(await getStats());
    }
    catch (error) {
        return next(error);
    }
}
export async function projects(_req, res, next) {
    try {
        return res.json(await listProjects());
    }
    catch (error) {
        return next(error);
    }
}
export async function create(req, res, next) {
    try {
        return res.status(201).json(await createProject(projectSchema.parse(req.body)));
    }
    catch (error) {
        return next(error);
    }
}
export async function update(req, res, next) {
    try {
        return res.json(await updateProject(req.params.id, projectSchema.partial().parse(req.body)));
    }
    catch (error) {
        return next(error);
    }
}
export async function remove(req, res, next) {
    try {
        await deleteProject(req.params.id);
        return res.status(204).send();
    }
    catch (error) {
        return next(error);
    }
}
export async function messages(_req, res, next) {
    try {
        return res.json(await listMessages());
    }
    catch (error) {
        return next(error);
    }
}
export async function updateMessage(req, res, next) {
    try {
        const { status } = messageStatusSchema.parse(req.body);
        return res.json(await updateMessageStatus(req.params.id, status));
    }
    catch (error) {
        return next(error);
    }
}
export async function profile(_req, res, next) {
    try {
        return res.json(await getProfile());
    }
    catch (error) {
        return next(error);
    }
}
export async function saveProfile(req, res, next) {
    try {
        return res.json(await updateProfile(profileSchema.parse(req.body)));
    }
    catch (error) {
        return next(error);
    }
}
//# sourceMappingURL=admin.controller.js.map