import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    console.log(`🔍 API: Récupération des brands pour userId: ${userId}`)

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      console.log(`❌ Utilisateur ${userId} non trouvé`)
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Récupérer toutes les créations publiques, dans la bibliothèque et complétées de l'utilisateur spécifique
    const brands = await prisma.brand.findMany({
      where: {
        AND: [
          { userId: userId },
          { isPublic: true },
          { isInLibrary: true },
          { isCompleted: true }
        ]
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

    console.log(`✅ API: ${brands.length} brands trouvés pour userId: ${userId}`)

    return NextResponse.json(brands)
  } catch (error) {
    console.error('Error fetching user brands:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

