import { NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await stackServerApp.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier si l'utilisateur est admin
    const dbUser = await prisma.user.findUnique({
      where: { stackId: user.id },
    })

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    // Récupérer toutes les demandes de suppression
    const deletionRequests = await prisma.accountDeletionRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            brands: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        requestedAt: 'desc',
      },
    })

    return NextResponse.json(deletionRequests)
  } catch (error) {
    console.error('Erreur récupération demandes:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
