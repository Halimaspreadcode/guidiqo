import { NextRequest, NextResponse } from 'next/server'

// Stockage temporaire en mémoire (en production, utilisez une vraie base de données)
const profileImages = new Map<string, string>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, imageUrl } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 })
    }

    // Sauvegarder l'URL de l'image
    profileImages.set(userId, imageUrl || '')

    return NextResponse.json({ 
      success: true,
      message: 'Image de profil sauvegardée' 
    })
  } catch (error) {
    console.error('Erreur sauvegarde image profil:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde' }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 })
    }

    const imageUrl = profileImages.get(userId) || null

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('Erreur récupération image profil:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' }, 
      { status: 500 }
    )
  }
}

