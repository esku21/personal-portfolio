import { prisma } from '../lib/prisma.js';
export async function getPortfolio() {
    const [profile, projects, skills, experience, education, certifications, services] = await Promise.all([
        prisma.profile.findUnique({ where: { id: 'default' } }),
        prisma.project.findMany({ where: { isPublished: true }, orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }] }),
        prisma.skill.findMany({ orderBy: { sortOrder: 'asc' } }),
        prisma.experience.findMany({ orderBy: { sortOrder: 'asc' } }),
        prisma.education.findMany({ orderBy: { sortOrder: 'asc' } }),
        prisma.certification.findMany({ orderBy: { sortOrder: 'asc' } }),
        prisma.service.findMany({ orderBy: { sortOrder: 'asc' } }),
    ]);
    return { profile, projects, skills, experience, education, certifications, services };
}
export function getPublishedProject(slug) {
    return prisma.project.findFirst({ where: { slug, isPublished: true } });
}
export function listProjects() {
    return prisma.project.findMany({ orderBy: { updatedAt: 'desc' } });
}
export function createProject(data) {
    return prisma.project.create({ data });
}
export function updateProject(id, data) {
    return prisma.project.update({ where: { id }, data });
}
export function deleteProject(id) {
    return prisma.project.delete({ where: { id } });
}
export function getProfile() {
    return prisma.profile.findUnique({ where: { id: 'default' } });
}
export function updateProfile(data) {
    return prisma.profile.upsert({ where: { id: 'default' }, create: { id: 'default', ...data }, update: data });
}
//# sourceMappingURL=portfolio.service.js.map