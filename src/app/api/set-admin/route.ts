import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stackServerApp } from '@/lib/stack'

export async function POST(request: Request) {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 })
    }

    // Mettre à jour le rôle de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    })

    console.log('✅ Utilisateur mis à jour en ADMIN:', updatedUser)

    return NextResponse.json({ 
      success: true, 
      user: {
        email: updatedUser.email,
        role: updatedUser.role
      }
    })
  } catch (error) {
    console.error('❌ Error setting admin:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

