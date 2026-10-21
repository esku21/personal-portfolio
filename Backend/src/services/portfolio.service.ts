import { prisma } from '../lib/prisma.js'

export async function getPortfolio() {
  const [profile, projects, skills, experience, education, certifications, services] = await Promise.all([
    prisma.profile.findUnique({ where: { id: 'default' } }),
    prisma.project.findMany({ where: { isPublished: true }, orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }] }),
    prisma.skill.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.experience.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.education.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.certification.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.service.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
  ])
  return { profile, projects, skills, experience, education, certifications, services }
}

export function getPublishedProject(slug: string) {
  return prisma.project.findFirst({ where: { slug, isPublished: true } })
}

export function listProjects() {
  return prisma.project.findMany({ orderBy: { updatedAt: 'desc' } })
}

type ReportPeriod = { from: Date; toExclusive: Date } | null

export async function getPortfolioReport(currentPeriod: ReportPeriod, previousPeriod: ReportPeriod) {
  const rangeWhere = (period: ReportPeriod) => period
    ? { createdAt: { gte: period.from, lt: period.toExclusive } }
    : {}
  const currentWhere = rangeWhere(currentPeriod)
  const previousWhere = rangeWhere(previousPeriod)
  const currentDays = currentPeriod
    ? Math.ceil((currentPeriod.toExclusive.getTime() - currentPeriod.from.getTime()) / 86_400_000)
    : Number.POSITIVE_INFINITY
  const bucket = currentDays <= 120 ? 'day' : 'month'
  const labelFormat = bucket === 'day' ? 'YYYY-MM-DD' : 'YYYY-MM'

  const [
    projects,
    publishedProjects,
    featuredProjects,
    skills,
    experience,
    education,
    services,
    certifications,
    messages,
    unreadMessages,
    admins,
    profiles,
    skillCategories,
    serviceTypes,
    experienceOrganizations,
    educationQualifications,
    recentProjects,
    projectsCreated,
    previousProjectsCreated,
    messagesReceived,
    previousMessagesReceived,
    activity,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { isPublished: true } }),
    prisma.project.count({ where: { isFeatured: true } }),
    prisma.skill.count(),
    prisma.experience.count(),
    prisma.education.count(),
    prisma.service.count(),
    prisma.certification.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: 'unread' } }),
    prisma.admin.count(),
    prisma.profile.count(),
    prisma.skill.groupBy({ by: ['category'], _count: { _all: true }, orderBy: { category: 'asc' } }),
    prisma.service.groupBy({ by: ['icon'], _count: { _all: true }, orderBy: { icon: 'asc' } }),
    prisma.experience.groupBy({ by: ['company'], _count: { _all: true }, orderBy: { company: 'asc' } }),
    prisma.education.groupBy({ by: ['degree'], _count: { _all: true }, orderBy: { degree: 'asc' } }),
    prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: { id: true, title: true, slug: true, isPublished: true, isFeatured: true, createdAt: true, updatedAt: true },
    }),
    prisma.project.count({ where: currentWhere }),
    previousPeriod ? prisma.project.count({ where: previousWhere }) : Promise.resolve(null),
    prisma.contactMessage.count({ where: currentWhere }),
    previousPeriod ? prisma.contactMessage.count({ where: previousWhere }) : Promise.resolve(null),
    prisma.$queryRaw<Array<{ label: string; projects: number; messages: number }>>`
      WITH events AS (
        SELECT "createdAt" AS event_date, 'project' AS event_type
        FROM "Project"
        WHERE (${currentPeriod?.from ?? null}::timestamptz IS NULL OR "createdAt" >= ${currentPeriod?.from ?? null})
          AND (${currentPeriod?.toExclusive ?? null}::timestamptz IS NULL OR "createdAt" < ${currentPeriod?.toExclusive ?? null})
        UNION ALL
        SELECT "createdAt" AS event_date, 'message' AS event_type
        FROM "ContactMessage"
        WHERE (${currentPeriod?.from ?? null}::timestamptz IS NULL OR "createdAt" >= ${currentPeriod?.from ?? null})
          AND (${currentPeriod?.toExclusive ?? null}::timestamptz IS NULL OR "createdAt" < ${currentPeriod?.toExclusive ?? null})
      )
      SELECT TO_CHAR(DATE_TRUNC(${bucket}, event_date), ${labelFormat}) AS label,
        COUNT(*) FILTER (WHERE event_type = 'project')::int AS projects,
        COUNT(*) FILTER (WHERE event_type = 'message')::int AS messages
      FROM events
      GROUP BY 1
      ORDER BY 1
    `,
  ])

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      projects,
      publishedProjects,
      draftProjects: projects - publishedProjects,
      featuredProjects,
      skills,
      experience,
      education,
      services,
      certifications,
      messages,
      unreadMessages,
      admins,
      profiles,
    },
    distributions: {
      skillCategories: skillCategories.map(({ category, _count }) => ({ name: category, count: _count._all })),
      serviceTypes: serviceTypes.map(({ icon, _count }) => ({ name: icon, count: _count._all })),
      experienceOrganizations: experienceOrganizations.map(({ company, _count }) => ({ name: company, count: _count._all })),
      educationQualifications: educationQualifications.map(({ degree, _count }) => ({ name: degree, count: _count._all })),
    },
    period: {
      projectsCreated: { current: projectsCreated, previous: previousProjectsCreated },
      messagesReceived: { current: messagesReceived, previous: previousMessagesReceived },
    },
    activity: {
      bucket,
      events: activity,
    },
    recentProjects,
    dataQuality: {
      recordsWithoutCreationTimestamps: skills + experience + education + services + certifications,
      recordTypesWithoutCreationTimestamps: ['Skills', 'Experience', 'Education', 'Services', 'Certifications'],
      projectCompletionStatusAvailable: false,
      experienceDurationReliable: false,
    },
  }
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

export function listExperience() {
  return prisma.experience.findMany({ orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }] })
}

export function createExperience(data: Parameters<typeof prisma.experience.create>[0]['data']) {
  return prisma.experience.create({ data })
}

export function updateExperience(id: string, data: Parameters<typeof prisma.experience.update>[0]['data']) {
  return prisma.experience.update({ where: { id }, data })
}

export function deleteExperience(id: string) {
  return prisma.experience.delete({ where: { id } })
}

export function listEducation() {
  return prisma.education.findMany({ orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }] })
}

export function createEducation(data: Parameters<typeof prisma.education.create>[0]['data']) {
  return prisma.education.create({ data })
}

export function updateEducation(id: string, data: Parameters<typeof prisma.education.update>[0]['data']) {
  return prisma.education.update({ where: { id }, data })
}

export function deleteEducation(id: string) {
  return prisma.education.delete({ where: { id } })
}

export function listSkills() {
  return prisma.skill.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] })
}

export function createSkill(data: Parameters<typeof prisma.skill.create>[0]['data']) {
  return prisma.skill.create({ data })
}

export function updateSkill(id: string, data: Parameters<typeof prisma.skill.update>[0]['data']) {
  return prisma.skill.update({ where: { id }, data })
}

export function deleteSkill(id: string) {
  return prisma.skill.delete({ where: { id } })
}

export function listServices() {
  return prisma.service.findMany({ orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }] })
}

export function createService(data: Parameters<typeof prisma.service.create>[0]['data']) {
  return prisma.service.create({ data })
}

export function updateService(id: string, data: Parameters<typeof prisma.service.update>[0]['data']) {
  return prisma.service.update({ where: { id }, data })
}

export function deleteService(id: string) {
  return prisma.service.delete({ where: { id } })
}

export function listCertifications() {
  return prisma.certification.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] })
}

export function createCertification(data: Parameters<typeof prisma.certification.create>[0]['data']) {
  return prisma.certification.create({ data })
}

export function updateCertification(id: string, data: Parameters<typeof prisma.certification.update>[0]['data']) {
  return prisma.certification.update({ where: { id }, data })
}

export function deleteCertification(id: string) {
  return prisma.certification.delete({ where: { id } })
}
