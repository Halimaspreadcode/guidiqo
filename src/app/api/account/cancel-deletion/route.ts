import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const user = await stackServerApp.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { stackId: user.id },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Trouver la demande de suppression
    const deleteRequest = await prisma.accountDeletionRequest.findUnique({
      where: { userId: dbUser.id },
    })

    if (!deleteRequest) {
      return NextResponse.json(
        { error: 'Aucune demande de suppression trouvée' },
        { status: 404 }
      )
    }

    if (deleteRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Cette demande ne peut plus être annulée' },
        { status: 400 }
      )
    }

    // Annuler la demande
    await prisma.accountDeletionRequest.update({
      where: { id: deleteRequest.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    })

    // Email de confirmation à l'utilisateur
    const userEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Raleway', Arial, sans-serif; background: #f5f5f5; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center; }
          .logo { font-size: 32px; font-weight: bold; color: white; margin: 0; }
          .content { padding: 40px; }
          h2 { color: #1a1a1a; font-size: 24px; margin: 0 0 20px 0; }
          p { color: #666; line-height: 1.6; margin: 0 0 20px 0; }
          .success-box { background: #f0fdf4; border: 2px solid #10b981; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center; }
          .button { display: inline-block; padding: 16px 32px; background: #1a1a1a; color: white; text-decoration: none; border-radius: 50px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f9f9f9; padding: 30px; text-align: center; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Guidiqo</div>
          </div>
          <div class="content">
            <h2>Suppression de compte annulée</h2>
            <p>Bonjour ${dbUser.name || 'Utilisateur'},</p>
            
            <div class="success-box">
              <p style="margin: 0; color: #059669; font-weight: 600; font-size: 18px;">
                ✅ Votre compte a été conservé
              </p>
            </div>

            <p>
              Votre demande de suppression de compte a bien été annulée. 
              Votre compte et tous vos projets sont maintenant sécurisés.
            </p>

            <p>
              Vous pouvez continuer à utiliser Guidiqo normalement. 
              Tous vos projets et données sont toujours accessibles.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="button">
                Retour au Dashboard
              </a>
            </div>

            <p style="font-size: 14px; color: #999; margin-top: 30px;">
              Merci de continuer à utiliser Guidiqo ! 🎨
            </p>
          </div>
          <div class="footer">
            <p style="font-weight: 600; color: #666; margin-bottom: 10px;">© 2024 Guidiqo</p>
            <p>Créez votre branding professionnel avec l'IA</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Email à l'admin
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px; }
          .info-box { background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Annulation de Suppression</h1>
          </div>
          <div class="content">
            <p>Un utilisateur a annulé sa demande de suppression de compte.</p>
            <div class="info-box">
              <p><strong>Email:</strong> ${dbUser.email}</p>
              <p><strong>Nom:</strong> ${dbUser.name || 'N/A'}</p>
              <p><strong>Date d'annulation:</strong> ${new Date().toLocaleString('fr-FR')}</p>
            </div>
            <p>Le compte a été conservé et reste actif.</p>
          </div>
          <div class="footer">
            <p>© 2024 Guidiqo - Notification Automatique</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Envoyer les emails
    try {
      console.log('📧 Envoi emails d\'annulation...')
      console.log('📧 Destinataire:', dbUser.email)
      
      await resend.emails.send({
        from: 'Guidiqo <noreply@santosagence.com>',
        to: [dbUser.email],
        subject: '✅ Votre compte Guidiqo a été conservé',
        html: userEmailHtml,
      })

      await resend.emails.send({
        from: 'Guidiqo <noreply@santosagence.com>',
        to: [process.env.ADMIN_EMAIL || dbUser.email],
        subject: `Annulation suppression - ${dbUser.email}`,
        html: adminEmailHtml,
      })
      
      console.log('✅ Emails d\'annulation envoyés')
    } catch (emailError) {
      console.error('❌ Erreur envoi email:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Demande de suppression annulée avec succès',
    })
  } catch (error) {
    console.error('Erreur annulation suppression:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'annulation' },
      { status: 500 }
    )
  }
}
