import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'

export async function POST(request: NextRequest) {
  try {
    const { code, password } = await request.json()

    if (!code || !password) {
      return NextResponse.json(
        { error: 'Code et mot de passe requis' },
        { status: 400 }
      )
    }

    // Valider le mot de passe
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      )
    }

    try {
      // Réinitialiser le mot de passe via Stack Auth
      // Stack Auth gère automatiquement la validation du code
      await stackServerApp.verifyPasswordResetCode(code)
      await stackServerApp.resetPassword(code, password)

      return NextResponse.json({
        success: true,
        message: 'Mot de passe réinitialisé avec succès',
      })
    } catch (stackError: any) {
      console.error('Stack Auth error:', stackError)
      
      // Messages d'erreur personnalisés
      let errorMessage = 'Erreur lors de la réinitialisation du mot de passe'
      
      if (stackError.message?.includes('expired')) {
        errorMessage = 'Le lien de réinitialisation a expiré. Demandez-en un nouveau.'
      } else if (stackError.message?.includes('invalid')) {
        errorMessage = 'Le lien de réinitialisation est invalide.'
      } else if (stackError.message?.includes('used')) {
        errorMessage = 'Ce lien a déjà été utilisé.'
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}
