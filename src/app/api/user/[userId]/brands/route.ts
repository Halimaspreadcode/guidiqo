import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    // Récupérer toutes les créations publiques et complétées de l'utilisateur
    const brands = await prisma.brand.findMany({
      where: {
        userId: userId,
        isPublic: true,
        isCompleted: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(brands)
  } catch (error) {
    console.error('Error fetching user brands:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

