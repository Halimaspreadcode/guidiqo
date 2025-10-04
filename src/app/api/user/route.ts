import { NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Récupérer l'utilisateur de la base de données
    const dbUser = await prisma.user.findUnique({
      where: { stackId: user.id }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    return NextResponse.json({
      id: dbUser.id,
      stackId: dbUser.stackId,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

