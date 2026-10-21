import { prisma } from '../lib/prisma.js';
// Get all projects
export const getProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json(projects);
    }
    catch (error) {
        console.error('Error fetching projects:', error);
        return res.status(500).json({ error: error.message });
    }
};
// Save or Create/Update Project
export const saveProject = async (req, res) => {
    try {
        const id = String(req.params.id ?? '');
        const data = req.body;
        let project;
        if (id) {
            project = await prisma.project.update({
                where: { id },
                data: {
                    title: data.title,
                    slug: data.slug,
                    acronym: data.acronym,
                    description: data.description,
                    details: data.details,
                    techStack: data.techStack,
                    githubUrl: data.githubUrl,
                    liveUrl: data.liveUrl,
                    imageUrl: data.imageUrl,
                    isPublished: data.isPublished,
                    isFeatured: data.isFeatured,
                    updatedAt: new Date(),
                },
            });
        }
        else {
            project = await prisma.project.create({
                data: {
                    id: `proj_${Date.now()}`,
                    title: data.title,
                    slug: data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                    acronym: data.acronym,
                    description: data.description,
                    details: data.details,
                    techStack: data.techStack || [],
                    githubUrl: data.githubUrl,
                    liveUrl: data.liveUrl,
                    imageUrl: data.imageUrl,
                    isPublished: data.isPublished ?? true,
                    isFeatured: data.isFeatured ?? false,
                },
            });
        }
        return res.status(200).json({ success: true, data: project });
    }
    catch (error) {
        console.error('Error saving project:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
// Delete Project
export const deleteProject = async (req, res) => {
    try {
        const id = String(req.params.id ?? '');
        await prisma.project.delete({
            where: { id },
        });
        return res.status(200).json({ success: true, message: 'Project deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting project:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
//# sourceMappingURL=project.controller.js.map