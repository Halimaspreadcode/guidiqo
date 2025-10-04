import { NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'
import { prisma } from '@/lib/prisma'

// Route temporaire pour réinitialiser une demande de suppression en erreur
export async function POST() {
  try {
    const user = await stackServerApp.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { stackId: user.id },
      include: {
        accountDeletionRequest: true,
      },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    if (!dbUser.accountDeletionRequest) {
      return NextResponse.json({ error: 'Aucune demande trouvée' }, { status: 404 })
    }

    // Supprimer complètement la demande pour pouvoir en créer une nouvelle
    await prisma.accountDeletionRequest.delete({
      where: { id: dbUser.accountDeletionRequest.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Demande de suppression réinitialisée',
    })
  } catch (error) {
    console.error('Erreur réinitialisation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la réinitialisation' },
      { status: 500 }
    )
  }
}
