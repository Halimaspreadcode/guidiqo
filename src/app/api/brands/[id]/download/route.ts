import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const brandId = params.id

    // Incrémenter le compteur de téléchargements
    await prisma.brand.update({
      where: { id: brandId },
      data: {
        pdfDownloads: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur incrémentation téléchargement:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'incrémentation' },
      { status: 500 }
    )
  }
}
