import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stackServerApp } from '@/lib/stack'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await stackServerApp.getUser()
    
    // Chercher le brand
    const brand = await prisma.brand.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!brand) {
      return NextResponse.json({ error: 'Brand non trouvé' }, { status: 404 })
    }

    // Vérifier l'accès :
    // 1. Si le brand est dans la bibliothèque (isInLibrary), tout le monde peut y accéder
    // 2. Sinon, seul le propriétaire peut y accéder
    if (!brand.isInLibrary) {
      if (!user) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
      }

      const dbUser = await prisma.user.findUnique({
        where: { stackId: user.id }
      })

      if (!dbUser || brand.userId !== dbUser.id) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
      }
    }

    return NextResponse.json(brand)
  } catch (error) {
    console.error('Error fetching brand:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()

    const brand = await prisma.brand.updateMany({
      where: {
        id: params.id,
        user: {
          stackId: user.id
        }
      },
      data: body
    })

    if (brand.count === 0) {
      return NextResponse.json({ error: 'Brand non trouvé' }, { status: 404 })
    }

    const updatedBrand = await prisma.brand.findUnique({
      where: { id: params.id }
    })

    return NextResponse.json(updatedBrand)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    await prisma.brand.deleteMany({
      where: {
        id: params.id,
        user: {
          stackId: user.id
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

