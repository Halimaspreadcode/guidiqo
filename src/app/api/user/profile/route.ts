import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Récupérer les informations de profil utilisateur
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const stackId = searchParams.get('stackId')

    if (!stackId) {
      return NextResponse.json({ error: 'stackId requis' }, { status: 400 })
    }

    // Chercher l'utilisateur dans la DB par stackId
    const user = await prisma.user.findUnique({
      where: { stackId },
      select: {
        id: true,
        stackId: true,
        email: true,
        name: true,
        profileImage: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Erreur récupération profil:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du profil' },
      { status: 500 }
    )
  }
}

// Mettre à jour les informations de profil utilisateur
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { stackId, profileImage, name } = body

    if (!stackId) {
      return NextResponse.json({ error: 'stackId requis' }, { status: 400 })
    }

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { stackId },
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { stackId },
      data: {
        ...(profileImage !== undefined && { profileImage }),
        ...(name !== undefined && { name }),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        stackId: true,
        email: true,
        name: true,
        profileImage: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Erreur mise à jour profil:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du profil' },
      { status: 500 }
    )
  }
}

// Créer un utilisateur dans la DB (synchronisation avec Stack Auth)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { stackId, email, name } = body

    if (!stackId || !email) {
      return NextResponse.json(
        { error: 'stackId et email requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { stackId },
    })

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: 'Utilisateur déjà existant',
        user: existingUser,
      })
    }

    // Créer l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        stackId,
        email,
        name,
        role: 'USER',
      },
      select: {
        id: true,
        stackId: true,
        email: true,
        name: true,
        profileImage: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Utilisateur créé avec succès',
      user: newUser,
    })
  } catch (error) {
    console.error('Erreur création utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'utilisateur' },
      { status: 500 }
    )
  }
}
