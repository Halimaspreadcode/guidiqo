import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stackServerApp } from '@/lib/stack'

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const currentUser = await stackServerApp.getUser()
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier si l'utilisateur est admin
    const dbUser = await prisma.user.findUnique({
      where: { stackId: currentUser.id }
    })

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const body = await request.json()
    const { isVerified } = body

    // Mettre à jour le statut verified de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data: { isVerified }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user verified status:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

