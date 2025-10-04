import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stackServerApp } from '@/lib/stack'

export async function GET() {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const brands = await prisma.brand.findMany({
      where: {
        user: {
          stackId: user.id
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json(brands)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      prompt, 
      name, 
      description,
      primaryColor,
      secondaryColor,
      accentColor,
      primaryFont,
      secondaryFont,
      brandPersonality,
      targetAudience,
      isCompleted,
      currentStep
    } = body

    // Créer ou trouver l'utilisateur dans la DB
    const dbUser = await prisma.user.upsert({
      where: { stackId: user.id },
      update: { 
        email: user.primaryEmail || '',
        name: user.displayName
      },
      create: {
        stackId: user.id,
        email: user.primaryEmail || '',
        name: user.displayName
      }
    })

    // Créer le brand avec toutes les données
    const brand = await prisma.brand.create({
      data: {
        userId: dbUser.id,
        name: name || 'Nouveau Brand',
        description: description || null,
        prompt: prompt || '',
        primaryColor: primaryColor || null,
        secondaryColor: secondaryColor || null,
        accentColor: accentColor || null,
        primaryFont: primaryFont || null,
        secondaryFont: secondaryFont || null,
        brandPersonality: brandPersonality || null,
        targetAudience: targetAudience || null,
        isCompleted: isCompleted || false,
        currentStep: currentStep || 1
      }
    })

    return NextResponse.json(brand)
  } catch (error) {
    console.error('Error creating brand:', error)
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}

