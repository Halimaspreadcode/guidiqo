import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Désactiver le cache pour cette route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Récupérer tous les brands qui sont dans la bibliothèque (isInLibrary = true)
    const brands = await prisma.brand.findMany({
      where: {
        isInLibrary: true,
        isCompleted: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            isVerified: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('📚 Brands dans la bibliothèque:', brands.length)
    console.log('📦 Données:', brands)

    return NextResponse.json(brands, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    })
  } catch (error) {
    console.error('Error fetching library brands:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
