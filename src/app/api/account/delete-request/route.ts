import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Fonction pour calculer la date de suppression (7 jours ouvrés)
function calculateDeletionDate(): Date {
  const now = new Date()
  let businessDays = 0
  let currentDate = new Date(now)

  while (businessDays < 7) {
    currentDate.setDate(currentDate.getDate() + 1)
    const dayOfWeek = currentDate.getDay()
    // 0 = Dimanche, 6 = Samedi
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessDays++
    }
  }

  return currentDate
}

// Fonction pour formater la date en français
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export async function POST(req: NextRequest) {
  try {
    const user = await stackServerApp.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { reason } = await req.json()

    // Récupérer les infos utilisateur depuis la DB
    const dbUser = await prisma.user.findUnique({
      where: { stackId: user.id },
      include: {
        brands: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Calculer la date de suppression
    const deletionDate = calculateDeletionDate()

    // Créer ou mettre à jour la demande de suppression
    const deleteRequest = await prisma.accountDeletionRequest.upsert({
      where: { userId: dbUser.id },
      update: {
        reason,
        requestedAt: new Date(),
        scheduledFor: deletionDate,
        status: 'PENDING',
      },
      create: {
        userId: dbUser.id,
        reason,
        scheduledFor: deletionDate,
        status: 'PENDING',
      },
    })

    // Email à l'admin (vous)
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px; }
          .info-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .info-row { margin: 10px 0; }
          .label { font-weight: bold; color: #333; }
          .value { color: #666; }
          .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Demande de Suppression de Compte</h1>
          </div>
          <div class="content">
            <p>Une nouvelle demande de suppression de compte a été reçue.</p>
            
            <div class="info-box">
              <div class="info-row">
                <span class="label">Utilisateur:</span>
                <span class="value">${dbUser.name || 'N/A'}</span>
              </div>
              <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">${dbUser.email}</span>
              </div>
              <div class="info-row">
                <span class="label">ID:</span>
                <span class="value">${dbUser.id}</span>
              </div>
              <div class="info-row">
                <span class="label">Date de demande:</span>
                <span class="value">${formatDate(new Date())}</span>
              </div>
              <div class="info-row">
                <span class="label">Suppression prévue le:</span>
                <span class="value">${formatDate(deletionDate)}</span>
              </div>
              <div class="info-row">
                <span class="label">Nombre de projets:</span>
                <span class="value">${dbUser.brands.length}</span>
              </div>
              ${reason ? `
              <div class="info-row">
                <span class="label">Raison:</span>
                <div class="value" style="margin-top: 10px; font-style: italic;">${reason}</div>
              </div>
              ` : ''}
            </div>

            ${dbUser.brands.length > 0 ? `
            <div style="margin: 20px 0;">
              <p><strong>Projets associés:</strong></p>
              <ul>
                ${dbUser.brands.map((brand: { name: string; id: string }) => `<li>${brand.name} (ID: ${brand.id})</li>`).join('')}
              </ul>
            </div>
            ` : ''}

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Cette suppression sera automatiquement effectuée le ${formatDate(deletionDate)} sauf annulation.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Guidiqo - Notification Automatique</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Email à l'utilisateur
    const userEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Raleway', Arial, sans-serif; background: #f5f5f5; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%); padding: 40px; text-align: center; }
          .logo { font-size: 32px; font-weight: bold; color: white; margin: 0; }
          .content { padding: 40px; }
          h2 { color: #1a1a1a; font-size: 24px; margin: 0 0 20px 0; }
          p { color: #666; line-height: 1.6; margin: 0 0 20px 0; }
          .warning-box { background: #fef2f2; border: 2px solid #ef4444; padding: 20px; border-radius: 12px; margin: 20px 0; }
          .info-box { background: #f9f9f9; padding: 20px; border-radius: 12px; margin: 20px 0; }
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
            <h2>Demande de suppression de compte reçue</h2>
            <p>Bonjour ${dbUser.name || 'Utilisateur'},</p>
            
            <p>
              Nous avons bien reçu votre demande de suppression de compte Guidiqo.
            </p>

            <div class="warning-box">
              <p style="margin: 0; color: #dc2626; font-weight: 600;">
                ⚠️ Votre compte sera définitivement supprimé le <strong>${formatDate(deletionDate)}</strong>
              </p>
            </div>

            <div class="info-box">
              <p style="margin: 0 0 10px 0;"><strong>Ce qui sera supprimé :</strong></p>
              <ul style="margin: 0; padding-left: 20px; color: #666;">
                <li>Votre profil utilisateur</li>
                <li>Tous vos projets de branding (${dbUser.brands.length})</li>
                <li>Vos images et fichiers téléchargés</li>
                <li>Toutes vos données personnelles</li>
              </ul>
            </div>

            <p style="font-size: 14px; color: #666;">
              <strong>Délai de rétractation :</strong> Vous disposez de <strong>7 jours ouvrés</strong> 
              pour annuler cette demande. Passé ce délai, la suppression sera irréversible.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/profil/cancel-deletion" class="button">
                Annuler la suppression
              </a>
            </div>

            <p style="font-size: 14px; color: #999; margin-top: 30px;">
              Si vous n'avez pas fait cette demande, veuillez nous contacter immédiatement.
            </p>
          </div>
          <div class="footer">
            <p style="font-weight: 600; color: #666; margin-bottom: 10px;">© 2024 Guidiqo</p>
            <p>Cet email a été envoyé suite à votre demande de suppression de compte.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Envoyer les emails
    try {
      console.log('📧 Tentative d\'envoi des emails...')
      console.log('📧 Destinataire:', dbUser.email)
      
      // Email à l'admin
      const adminEmail = await resend.emails.send({
        from: 'Guidiqo <noreply@santosagence.com>',
        to: [process.env.ADMIN_EMAIL || dbUser.email],
        subject: `⚠️ Demande de suppression de compte - ${dbUser.email}`,
        html: adminEmailHtml,
      })
      console.log('✅ Email admin envoyé:', adminEmail)

      // Email à l'utilisateur
      const userEmail = await resend.emails.send({
        from: 'Guidiqo <noreply@santosagence.com>',
        to: [dbUser.email],
        subject: 'Confirmation de votre demande de suppression de compte',
        html: userEmailHtml,
      })
      console.log('✅ Email utilisateur envoyé:', userEmail)
    } catch (emailError) {
      console.error('❌ Erreur envoi email:', emailError)
      // On continue même si l'email échoue
    }

    return NextResponse.json({
      success: true,
      message: 'Demande de suppression enregistrée',
      deletionDate: formatDate(deletionDate),
      requestId: deleteRequest.id,
    })
  } catch (error) {
    console.error('Erreur demande suppression:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la demande de suppression' },
      { status: 500 }
    )
  }
}
