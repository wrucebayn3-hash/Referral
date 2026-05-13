import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Use DATABASE_URL env var, or fall back to the known absolute path
  const dbUrl = process.env.DATABASE_URL || 'file:/home/user/Referral/prisma/dev.db'
  const adapter = new PrismaLibSql({ url: dbUrl })
  return new PrismaClient({ adapter } as any)
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
