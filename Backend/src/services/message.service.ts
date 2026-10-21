import { prisma } from '../lib/prisma.js'

export function createMessage(data: { name: string; email: string; phone: string; subject: string; message: string }) {
  return prisma.contactMessage.create({ data })
}

export function listMessages() {
  return prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })
}

export function updateMessageStatus(id: string, status: string) {
  return prisma.contactMessage.update({ where: { id }, data: { status } })
}

export function deleteMessage(id: string) {
  return prisma.contactMessage.delete({ where: { id } })
}

export async function getStats() {
  const [projects, messages, unread, published, featured] = await Promise.all([
    prisma.project.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: 'unread' } }),
    prisma.project.count({ where: { isPublished: true } }),
    prisma.project.count({ where: { isFeatured: true } }),
  ])
  return { projects, messages, unread, published, featured }
}
