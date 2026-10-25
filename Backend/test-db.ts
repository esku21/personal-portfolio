import 'dotenv/config'
import { prisma } from './src/lib/prisma.js'

try {
  const result = await prisma.$queryRaw`SELECT current_database() AS database_name, current_user AS database_user`
  console.log('Database query succeeded:', result)
} catch (error) {
  console.error('Database query failed:')
  console.dir(error, { depth: 10 })
} finally {
  await prisma.$disconnect()
}