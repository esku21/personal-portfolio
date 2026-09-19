import { getPortfolio, getPublishedProject } from '../services/portfolio.service.js';
export async function portfolio(_req, res, next) {
    try {
        res.json(await getPortfolio());
    }
    catch (error) {
        next(error);
    }
}
export async function projectDetails(req, res, next) {
    try {
        const project = await getPublishedProject(req.params.slug);
        if (!project)
            return res.status(404).json({ error: 'Project not found' });
        return res.json(project);
    }
    catch (error) {
        return next(error);
    }
}
//# sourceMappingURL=portfolio.controller.js.map