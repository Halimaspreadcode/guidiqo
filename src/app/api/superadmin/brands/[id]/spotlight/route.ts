import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stackServerApp } from '@/lib/stack'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification et les droits admin
    const user = await stackServerApp.getUser({ or: 'redirect' })
    
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Vérifier si l'utilisateur est admin
    const dbUser = await prisma.user.findUnique({
      where: { stackId: user.id },
      select: { role: true }
    })

    if (dbUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const { isSpotlighted } = await req.json()

    // Si on met en spotlight, vérifier qu'il n'y a pas déjà 5 brands spotlighted
    if (isSpotlighted) {
      const spotlightedCount = await prisma.brand.count({
        where: { isSpotlighted: true }
      })

      if (spotlightedCount >= 5) {
        return NextResponse.json({ 
          error: 'Maximum 5 brands peuvent être mis en avant simultanément' 
        }, { status: 400 })
      }
    }

    // Mettre à jour le statut spotlight
    const brand = await prisma.brand.update({
      where: { id: params.id },
      data: { isSpotlighted }
    })

    return NextResponse.json(brand)
  } catch (error) {
    console.error('Error updating brand spotlight:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

