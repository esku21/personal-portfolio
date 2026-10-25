
import bcrypt from 'bcrypt'
import { prisma } from '../src/lib/prisma.js'

const projects = [
  {
    slug: 'acacoms',
    title: 'Adama City Administration Communication Office Management System',
    acronym: 'ACACOMS',
    description:
      'A focused platform for organizing communication workflows and office operations.',
    details:
      'ACACOMS brings requests, communication records, and operational follow-up into a clear, searchable workspace for a city administration team.',
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    isFeatured: true,
  },
  {
    slug: 'acagms',
    title: 'Adama City Administration Gallery Management System',
    acronym: 'ACAGMS',
    description:
      'A digital gallery management experience for preserving and presenting city stories.',
    details:
      'ACAGMS helps teams curate gallery content, manage media, and make institutional stories easier to discover.',
    techStack: ['React', 'Express', 'Prisma', 'PostgreSQL'],
    isFeatured: true,
  },
]

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail) {
    throw new Error('ADMIN_EMAIL is missing from the environment.')
  }

  if (!adminPassword || adminPassword.length < 8) {
    throw new Error(
      'ADMIN_PASSWORD must contain at least 8 characters.',
    )
  }

  // Test the database connection before writing.
  await prisma.$queryRaw`SELECT 1`
  console.log('Database connection successful.')

  const passwordHash = await bcrypt.hash(adminPassword, 12)

  // Create the administrator or update the existing account.
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      name: 'Eskedar',
      passwordHash,
    },
    create: {
      email: adminEmail,
      name: 'Eskedar',
      passwordHash,
    },
  })

  console.log('Admin account created or updated.')

  await prisma.profile.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Eskedar',
      role: 'Software Engineering student & full-stack developer',
      bio: 'I create useful, resilient software for people and teams who want to move the world forward.',
      location: 'Adama, Ethiopia',
      email: 'hello@eskedar.dev',
      githubUrl: 'https://github.com/esku21',
      availability: 'Available for select opportunities',
      aboutTitle: 'Curious by nature. Precise by craft.',
      aboutText:
        'I care about the space where good engineering meets a great human experience. My approach is calm, collaborative, and grounded in the people who use what we build.',
    },
  })

  console.log('Default profile checked.')

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    })
  }

  console.log('Portfolio projects created or updated.')

  if ((await prisma.skill.count()) === 0) {
    await prisma.skill.createMany({
      data: [
        {
          name: 'React & TypeScript',
          category: 'Frontend',
          level: 88,
          sortOrder: 1,
        },
        {
          name: 'Node.js & Express',
          category: 'Backend',
          level: 84,
          sortOrder: 2,
        },
        {
          name: 'PostgreSQL & Prisma',
          category: 'Data',
          level: 78,
          sortOrder: 3,
        },
        {
          name: 'UI systems & accessibility',
          category: 'Product',
          level: 76,
          sortOrder: 4,
        },
      ],
    })

    console.log('Default skills created.')
  } else {
    console.log('Existing skills preserved.')
  }

  if ((await prisma.service.count()) === 0) {
    await prisma.service.createMany({
      data: [
        {
          title: 'Product interfaces',
          description:
            'Clear, responsive interfaces that make complex workflows feel simple.',
          icon: 'LayoutTemplate',
          sortOrder: 1,
        },
        {
          title: 'Full-stack systems',
          description:
            'Reliable APIs and data models that support ambitious digital products.',
          icon: 'Layers3',
          sortOrder: 2,
        },
        {
          title: 'Technical direction',
          description:
            'Thoughtful architecture, documentation, and delivery from idea to launch.',
          icon: 'Compass',
          sortOrder: 3,
        },
      ],
    })

    console.log('Default services created.')
  } else {
    console.log('Existing services preserved.')
  }

  console.log('Database seed completed successfully.')
}

main()
  .catch((error: unknown) => {
    console.error('Database seed failed:')
    console.dir(error, { depth: 10 })
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
