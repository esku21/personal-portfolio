
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client.js'
import { env } from './env.js'

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 1,
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 10000,
})

export const prisma = new PrismaClient({ adapter })
