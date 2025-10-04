import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stackServerApp } from '@/lib/stack'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier si l'utilisateur est admin
    const dbUser = await prisma.user.findUnique({
      where: { stackId: user.id },
      select: { role: true }
    })

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }

    const body = await request.json()
    const { isInLibrary } = body

    const brand = await prisma.brand.update({
      where: {
        id: params.id
      },
      data: {
        isInLibrary: isInLibrary
      }
    })

    return NextResponse.json(brand)
  } catch (error) {
    console.error('Error updating brand library status:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
