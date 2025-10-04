import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Récupérer les 5 brands mis en avant
    const spotlightedBrands = await prisma.brand.findMany({
      where: {
        isSpotlighted: true,
        isCompleted: true
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 5
    })

    return NextResponse.json(spotlightedBrands)
  } catch (error) {
    console.error('Error fetching spotlighted brands:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

