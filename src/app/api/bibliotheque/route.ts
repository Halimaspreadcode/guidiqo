import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('📚 Brands dans la bibliothèque:', brands.length)
    console.log('📦 Données:', brands)

    return NextResponse.json(brands)
  } catch (error) {
    console.error('Error fetching library brands:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
