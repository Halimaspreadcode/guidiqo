import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stackServerApp } from '@/lib/stack'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('📥 Spotlight PATCH request for brand:', params.id)
  
  try {
    // Vérifier l'authentification et les droits admin
    let user
    try {
      user = await stackServerApp.getUser()
    } catch (error) {
      console.error('Auth error:', error)
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    console.log('👤 User authenticated:', user.id)

    // Vérifier si l'utilisateur est admin
    const dbUser = await prisma.user.findUnique({
      where: { stackId: user.id },
      select: { role: true }
    })

    console.log('🔍 User role:', dbUser?.role)

    if (dbUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé - Admin requis' }, { status: 403 })
    }

    const body = await req.json()
    const { isSpotlighted } = body

    console.log('📝 Request body:', { isSpotlighted })

    // Si on met en spotlight, vérifier qu'il n'y a pas déjà 5 brands spotlighted
    if (isSpotlighted) {
      const spotlightedCount = await prisma.brand.count({
        where: { 
          isSpotlighted: true,
          id: { not: params.id }
        }
      })

      console.log('📊 Current spotlighted count:', spotlightedCount)

      if (spotlightedCount >= 5) {
        return NextResponse.json({ 
          error: 'Maximum 5 brands peuvent être mis en avant simultanément' 
        }, { status: 400 })
      }
    }

    console.log(`🔄 Updating brand ${params.id} spotlight status to ${isSpotlighted}`)

    // Mettre à jour le statut spotlight
    const brand = await prisma.brand.update({
      where: { id: params.id },
      data: { isSpotlighted }
    })

    console.log(`✅ Brand ${params.id} spotlight status updated successfully`)

    return NextResponse.json(brand)
  } catch (error) {
    console.error('❌ Error updating brand spotlight:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json({ 
      error: 'Erreur serveur', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

