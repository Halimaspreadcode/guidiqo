import { NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await stackServerApp.getUser()

    if (!user) {
      return NextResponse.json({ hasPendingDeletion: false })
    }

    const dbUser = await prisma.user.findUnique({
      where: { stackId: user.id },
      include: {
        accountDeletionRequest: true,
      },
    })

    if (!dbUser || !dbUser.accountDeletionRequest) {
      return NextResponse.json({ hasPendingDeletion: false })
    }

    const request = dbUser.accountDeletionRequest

    if (request.status !== 'PENDING') {
      return NextResponse.json({ hasPendingDeletion: false })
    }

    // Formater la date en français
    const scheduledFor = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(request.scheduledFor))

    return NextResponse.json({
      hasPendingDeletion: true,
      scheduledFor,
      requestId: request.id,
      requestedAt: request.requestedAt,
    })
  } catch (error) {
    console.error('Erreur vérification statut suppression:', error)
    return NextResponse.json({ hasPendingDeletion: false })
  }
}
