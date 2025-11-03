import { prisma } from './prisma'
import { stackServerApp } from './stack'
import { Prisma } from '@prisma/client'

export class AdminAuthError extends Error {
  constructor(message: 'UNAUTHENTICATED' | 'FORBIDDEN') {
    super(message)
    this.name = 'AdminAuthError'
  }
}

export class DatabaseUnavailableError extends Error {
  constructor() {
    super('DATABASE_UNAVAILABLE')
    this.name = 'DatabaseUnavailableError'
  }
}

export async function assertAdmin() {
  let user
  try {
    user = await stackServerApp.getUser()
  } catch (error) {
    throw new AdminAuthError('UNAUTHENTICATED')
  }

  if (!user) {
    throw new AdminAuthError('UNAUTHENTICATED')
  }

  let dbUser
  try {
    dbUser = await prisma.user.findUnique({
      where: { stackId: user.id },
      select: { role: true },
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P1001') {
      throw new DatabaseUnavailableError()
    }
    throw error
  }

  if (dbUser?.role !== 'ADMIN') {
    throw new AdminAuthError('FORBIDDEN')
  }

  return user
}
