import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

type UnsubscribePayload = {
  email?: string
  token?: string
  reason?: string
}

export async function POST(req: NextRequest) {
  try {
    const body: UnsubscribePayload = await req.json()
    const { email, token, reason } = body

    // Vérifier qu'on a au moins un identifiant
    if (!email && !token) {
      return NextResponse.json(
        { error: 'Email ou token requis pour le désabonnement.' },
        { status: 400 },
      )
    }

    // Normaliser l'email si fourni
    const normalizedEmail = email?.toLowerCase().trim()

    // Chercher un désabonnement existant ou en créer un nouveau
    let unsubscribeRecord

    if (token) {
      // Si on a un token, chercher par token
      unsubscribeRecord = await prisma.newsletterUnsubscribe.findUnique({
        where: { token },
      })
      
      if (unsubscribeRecord) {
        // Le désabonnement existe déjà
        return NextResponse.json({
          message: 'Vous êtes déjà désabonné de notre newsletter.',
          alreadyUnsubscribed: true,
        })
      }
    }

    if (normalizedEmail) {
      // Chercher par email
      unsubscribeRecord = await prisma.newsletterUnsubscribe.findUnique({
        where: { email: normalizedEmail },
      })

      if (unsubscribeRecord) {
        // Mettre à jour la raison si fournie
        if (reason) {
          await prisma.newsletterUnsubscribe.update({
            where: { email: normalizedEmail },
            data: { reason },
          })
        }
        return NextResponse.json({
          message: 'Vous êtes déjà désabonné de notre newsletter.',
          alreadyUnsubscribed: true,
        })
      }

      // Créer un nouveau désabonnement
      const newToken = token || crypto.randomUUID()
      
      await prisma.newsletterUnsubscribe.create({
        data: {
          email: normalizedEmail,
          token: newToken,
          reason: reason || null,
        },
      })

      return NextResponse.json({
        message: 'Vous avez été désabonné avec succès de notre newsletter.',
        success: true,
      })
    }

    // Si on n'a qu'un token (sans email), créer un désabonnement anonyme
    if (token && !normalizedEmail) {
      const newToken = token
      
      await prisma.newsletterUnsubscribe.create({
        data: {
          email: `unsubscribed-${Date.now()}@guidiqo.internal`,
          token: newToken,
          reason: reason || null,
        },
      })

      return NextResponse.json({
        message: 'Vous avez été désabonné avec succès de notre newsletter.',
        success: true,
      })
    }

    return NextResponse.json(
      { error: 'Impossible de traiter la demande de désabonnement.' },
      { status: 400 },
    )
  } catch (error) {
    console.error('❌ Error processing unsubscribe:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors du traitement de la demande.' },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}

// GET pour vérifier le statut d'un email
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const token = searchParams.get('token')

    if (!email && !token) {
      return NextResponse.json(
        { error: 'Email ou token requis.' },
        { status: 400 },
      )
    }

    let unsubscribeRecord

    if (token) {
      unsubscribeRecord = await prisma.newsletterUnsubscribe.findUnique({
        where: { token },
      })
    }

    if (email && !unsubscribeRecord) {
      const normalizedEmail = email.toLowerCase().trim()
      unsubscribeRecord = await prisma.newsletterUnsubscribe.findUnique({
        where: { email: normalizedEmail },
      })
    }

    return NextResponse.json({
      isUnsubscribed: !!unsubscribeRecord,
      email: unsubscribeRecord?.email || email,
    })
  } catch (error) {
    console.error('❌ Error checking unsubscribe status:', error)
    return NextResponse.json(
      { error: 'Erreur serveur.' },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}

