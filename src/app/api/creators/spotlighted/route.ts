import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Désactiver le cache pour toujours avoir les données à jour
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Récupérer les créateurs avec des brands spotlighted
    const creatorsWithSpotlightedBrands = await prisma.user.findMany({
      where: {
        brands: {
          some: {
            isSpotlighted: true,
            isCompleted: true
          }
        }
      },
      include: {
        brands: {
          where: {
            isSpotlighted: true,
            isCompleted: true
          },
          orderBy: {
            updatedAt: 'desc'
          },
          take: 1 // Prendre seulement le dernier brand spotlighted
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 4 // Les 4 derniers créateurs
    })

    // Transformer les données pour inclure le comptage
    const creatorsWithCount = await Promise.all(
      creatorsWithSpotlightedBrands.map(async (creator) => {
        const spotlightedCount = await prisma.brand.count({
          where: {
            userId: creator.id,
            isSpotlighted: true,
            isCompleted: true
          }
        })

        const totalBrandsCount = await prisma.brand.count({
          where: {
            userId: creator.id,
            isCompleted: true
          }
        })

        return {
          id: creator.id,
          name: creator.name,
          email: creator.email,
          profileImage: creator.profileImage,
          isVerified: creator.isVerified,
          spotlightedCount,
          totalBrandsCount,
          latestBrand: creator.brands[0] || null
        }
      })
    )

    return NextResponse.json(creatorsWithCount)
  } catch (error) {
    console.error('Error fetching spotlighted creators:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

