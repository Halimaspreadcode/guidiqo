import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stackServerApp } from '@/lib/stack'

export async function GET() {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return NextResponse.json({ isAdmin: false }, { status: 200 })
    }

    // Vérifier si l'utilisateur est admin en DB
    const dbUser = await prisma.user.findUnique({
      where: { stackId: user.id }
    })

    if (!dbUser) {
      return NextResponse.json({ isAdmin: false }, { status: 200 })
    }

    const isAdmin = dbUser.role === 'ADMIN'
    console.log(`🔐 User ${dbUser.email} - Role: ${dbUser.role} - Is Admin: ${isAdmin}`)

    return NextResponse.json({ isAdmin }, { status: 200 })
  } catch (error) {
    console.error('❌ Error checking admin status:', error)
    return NextResponse.json({ isAdmin: false }, { status: 200 })
  }
}

