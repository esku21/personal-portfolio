import { prisma } from '../lib/prisma.js'

export async function getPortfolio() {
  const [profile, projects, skills, experience, education, certifications, services] = await Promise.all([
    prisma.profile.findUnique({ where: { id: 'default' } }),
    prisma.project.findMany({ where: { isPublished: true }, orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }] }),
    prisma.skill.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.experience.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.education.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.certification.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.service.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])
  return { profile, projects, skills, experience, education, certifications, services }
}

export function getPublishedProject(slug: string) {
  return prisma.project.findFirst({ where: { slug, isPublished: true } })
}

export function listProjects() {
  return prisma.project.findMany({ orderBy: { updatedAt: 'desc' } })
}

export function createProject(data: Parameters<typeof prisma.project.create>[0]['data']) {
  return prisma.project.create({ data })
}

export function updateProject(id: string, data: Parameters<typeof prisma.project.update>[0]['data']) {
  return prisma.project.update({ where: { id }, data })
}

export function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } })
}

export function getProfile() {
  return prisma.profile.findUnique({ where: { id: 'default' } })
}

export function updateProfile(data: Parameters<typeof prisma.profile.upsert>[0]['create']) {
  return prisma.profile.upsert({ where: { id: 'default' }, create: { id: 'default', ...data }, update: data })
}
