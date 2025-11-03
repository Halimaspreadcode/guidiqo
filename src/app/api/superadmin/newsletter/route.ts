import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { PrismaClient } from '@prisma/client'
import { AdminAuthError, DatabaseUnavailableError, assertAdmin } from '@/lib/adminAuth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

type NewsletterPayload = {
  subject?: string
  previewText?: string
  recipients?: string[] | string
  htmlContent?: string
  content?: string
}

const FROM_EMAIL = 'Guidiqo Newsletter <newsletter@guidiqo.com>'

const renderHtml = (subject: string, body: string, previewText?: string) => {
  const safePreview = previewText ?? subject
  
  // Convertir le body en HTML formaté avec support pour les paragraphes
  const formattedBody = body
    .split(/\n{2,}/)
    .map((paragraph) => {
      const trimmed = paragraph.trim()
      if (!trimmed) return ''
      // Échapper les caractères HTML
      const escaped = trimmed
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
      // Convertir les retours à la ligne en <br />
      return `<p class="text-[15px] text-neutral-700 leading-7 mb-4">${escaped.split('\n').join('<br />')}</p>`
    })
    .filter(Boolean)
    .join('')

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${subject}</title>
  <meta name="theme-color" content="#c9ff00">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600&family=Playfair+Display:wght@600;700&family=Shadows+Into+Light&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
      --lime: #c9ff00;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Raleway', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .handwrite {
      font-family: 'Shadows Into Light', cursive;
    }
    .signature {
      font-family: 'Shadows Into Light', cursive;
      font-size: 1.6rem;
      color: #111;
      letter-spacing: 0.04em;
    }
    /* Styles inline pour compatibilité email */
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #fafafa;
      }
    }
  </style>
</head>
<body class="antialiased bg-neutral-50 text-neutral-900 selection:bg-lime-200 selection:text-black" style="margin: 0; padding: 0; font-family: 'Raleway', sans-serif; background-color: #fafafa;">
  <div class="sm:px-6 w-full pt-12 pr-4 pb-12 pl-4" style="padding: 48px 16px;">
    <div class="mx-auto w-full max-w-[780px] rounded-3xl bg-white shadow-lg ring-1 ring-neutral-200 overflow-hidden" style="max-width: 780px; margin: 0 auto; background: white; border-radius: 24px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; overflow: hidden;">
      <!-- Header -->
      <div class="px-6 py-5 border-b border-neutral-200 flex items-center justify-between bg-gradient-to-r from-lime-100 to-lime-50" style="padding: 20px 24px; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; background: linear-gradient(to right, #f7fee7, #fefce8);">
        <div class="flex items-center gap-3" style="display: flex; align-items: center; gap: 12px;">
          <div class="flex font-semibold text-black tracking-tight w-8 h-8 bg-[url(https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/72b8bb91-83fe-4d08-9fc1-7a3c0f3b31e1_320w.png)] bg-cover bg-center rounded-md items-center justify-center" style="width: 32px; height: 32px; background-image: url('https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/72b8bb91-83fe-4d08-9fc1-7a3c0f3b31e1_320w.png'); background-size: cover; background-position: center; border-radius: 6px;"></div>
          <div class="text-[13px] text-neutral-600" style="font-size: 13px; color: #525252;">Guidiqo — Newsletter</div>
        </div>
      </div>

      <!-- Hero Section -->
      <div class="px-6 pt-8" style="padding: 32px 24px 0;">
        <div class="overflow-hidden rounded-3xl border border-lime-200" style="overflow: hidden; border-radius: 24px; border: 1px solid #e9e7e1;">
          <img src="https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/179d3ea0-e462-47e0-9f85-454f2f86f830_1600w.png" alt="Guidiqo Hero" class="w-full h-72 object-cover" style="width: 100%; height: 288px; object-fit: cover; display: block;">
        </div>
      </div>

      <!-- Content -->
      <div class="px-8 pt-10" style="padding: 40px 32px 0;">
        <h1 class="text-4xl sm:text-5xl font-[Playfair Display] tracking-tight text-neutral-900 leading-snug" style="font-family: 'Playfair Display', serif; font-size: 36px; line-height: 1.2; color: #171717; font-weight: 700; letter-spacing: -0.02em; margin: 0;">${subject}</h1>
        <div class="mt-5" style="margin-top: 20px;">
          ${formattedBody}
        </div>
      </div>

      <!-- CTA Section -->
      <div class="px-8 mt-16 text-center" style="padding: 0 32px; margin-top: 64px; text-align: center;">
        <a href="https://guidiqo.com" class="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-lime-500 text-black text-[16px] font-semibold hover:bg-lime-400 shadow-lg transition" style="display: inline-flex; align-items: center; gap: 8px; padding: 16px 40px; border-radius: 9999px; background-color: #c9ff00; color: #000; font-size: 16px; font-weight: 600; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); text-decoration: none;">
          Découvrir Guidiqo
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="width: 20px; height: 20px;"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </a>
      </div>

      <!-- Signature -->
      <div class="px-8 mt-14 text-right" style="padding: 0 32px; margin-top: 56px; text-align: right;">
        <p class="text-neutral-500 text-[14px]" style="color: #737373; font-size: 14px; margin: 0;">Avec créativité,</p>
        <p class="signature mt-1" style="font-family: 'Shadows Into Light', cursive; font-size: 1.6rem; color: #111; letter-spacing: 0.04em; margin-top: 4px; margin-bottom: 0;">L'équipe Guidiqo</p>
      </div>

      <!-- Footer -->
      <div class="px-6 py-10 mt-14 border-t border-neutral-200 text-center" style="padding: 40px 24px; margin-top: 56px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p class="text-[12.5px] text-neutral-500" style="font-size: 12.5px; color: #737373; margin: 0;">
          © 2025 Guidiqo — Tous droits réservés · <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://guidiqo.com'}/unsubscribe" class="underline underline-offset-2 text-lime-600 hover:text-lime-700" style="text-decoration: underline; text-underline-offset: 2px; color: #16a34a;">Se désabonner</a>
        </p>
      </div>
    </div>
  </div>
  <span style="display:none;visibility:hidden;mso-hide:all;font-size:1px;color:#f3f4f6;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${safePreview}</span>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    await assertAdmin()

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Clé API Resend manquante' },
        { status: 500 },
      )
    }

    const body = (await req.json()) as NewsletterPayload
    const subject = body.subject?.trim()
    const previewText = body.previewText?.trim()
    const rawRecipients = body.recipients
    const textContent = body.content?.trim()
    const htmlContent = body.htmlContent?.trim()

    if (!subject) {
      return NextResponse.json(
        { error: 'Le sujet est obligatoire.' },
        { status: 400 },
      )
    }

    const recipients = Array.isArray(rawRecipients)
      ? rawRecipients
      : String(rawRecipients ?? '')
          .split(/[\n,;]/)
          .map((email) => email.trim())
          .filter(Boolean)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const uniqueRecipients = Array.from(new Set(recipients.map((email) => email.toLowerCase())))
    const validRecipients = uniqueRecipients.filter((email) => emailRegex.test(email))

    if (!validRecipients.length) {
      return NextResponse.json(
        { error: 'Veuillez renseigner au moins un destinataire.' },
        { status: 400 },
      )
    }

    // Filtrer les emails désabonnés
    const unsubscribedEmails = await prisma.newsletterUnsubscribe.findMany({
      where: {
        email: { in: validRecipients },
      },
      select: { email: true },
    })

    const unsubscribedEmailSet = new Set(unsubscribedEmails.map((u) => u.email))
    const recipientsToSend = validRecipients.filter((email) => !unsubscribedEmailSet.has(email))

    if (!recipientsToSend.length) {
      return NextResponse.json(
        { error: 'Tous les destinataires sont désabonnés de la newsletter.' },
        { status: 400 },
      )
    }

    if (validRecipients.length > 1000) {
      return NextResponse.json(
        { error: 'Le nombre de destinataires ne peut pas dépasser 1000 adresses.' },
        { status: 400 },
      )
    }

    if (!htmlContent && !textContent) {
      return NextResponse.json(
        { error: 'Le contenu du message est requis.' },
        { status: 400 },
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const plainText =
      textContent ??
      htmlContent
        ?.replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

    const html = htmlContent ?? renderHtml(subject, textContent ?? '', previewText)

    console.log(`📧 Starting newsletter send to ${recipientsToSend.length} recipients`)

    // Resend limite à 50 destinataires par envoi
    // Diviser en batches si nécessaire
    const BATCH_SIZE = 50
    let totalSent = 0
    let totalErrors = 0
    const errors: string[] = []

    // Envoyer les emails par batches avec gestion d'erreur robuste
    for (let i = 0; i < recipientsToSend.length; i += BATCH_SIZE) {
      const batch = recipientsToSend.slice(i, i + BATCH_SIZE)
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1
      
      try {
        console.log(`📤 Sending batch ${batchNumber}/${Math.ceil(recipientsToSend.length / BATCH_SIZE)} to ${batch.length} recipients`)
        
        const { data, error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: batch,
          subject,
          html,
          text: plainText,
        })

        console.log(`📥 Batch ${batchNumber} response:`, { 
          hasData: !!data, 
          dataId: data?.id, 
          hasError: !!error,
          errorType: error ? typeof error : 'none'
        })

        if (error) {
          console.error(`❌ Resend newsletter error (batch ${batchNumber}):`, error)
          let errorMsg = 'Erreur inconnue'
          
          if (typeof error === 'string') {
            errorMsg = error
          } else if (error && typeof error === 'object') {
            // Resend retourne souvent { message: string, name?: string }
            errorMsg = (error as any).message || (error as any).name || JSON.stringify(error)
          }
          
          totalErrors += batch.length
          errors.push(`Batch ${batchNumber}: ${errorMsg}`)
          continue
        }

        // Vérifier que l'envoi a réussi
        if (data?.id) {
          totalSent += batch.length
          console.log(`✅ Newsletter batch ${batchNumber} sent successfully (${batch.length} recipients) - ID: ${data.id}`)
        } else {
          // Pas d'erreur mais pas de data.id non plus - cas suspect
          console.warn(`⚠️ Newsletter batch ${batchNumber}: No data.id returned from Resend`)
          console.warn(`📋 Response data:`, JSON.stringify(data).substring(0, 200))
          // En production, considérer comme échec si pas de data.id
          totalErrors += batch.length
          errors.push(`Batch ${batchNumber}: Aucun ID retourné par Resend`)
        }
      } catch (batchError: any) {
        console.error(`❌ Newsletter batch ${batchNumber} exception:`, batchError)
        const errorMsg = batchError?.message || batchError?.toString() || 'Erreur inconnue'
        totalErrors += batch.length
        errors.push(`Batch ${batchNumber}: ${errorMsg}`)
      }
      
      // Petit délai entre les batches pour éviter de surcharger l'API
      if (i + BATCH_SIZE < recipientsToSend.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    console.log(`📊 Newsletter send summary: ${totalSent} sent, ${totalErrors} failed, ${validRecipients.length - recipientsToSend.length} skipped`)

    // Si tous les envois ont échoué
    if (totalSent === 0 && totalErrors > 0) {
      console.error(`❌ All newsletter batches failed. Errors:`, errors)
      return NextResponse.json(
        { 
          error: 'Impossible d\'envoyer la newsletter.', 
          details: errors.length > 0 ? errors.join('; ') : undefined 
        },
        { status: 500 },
      )
    }

    // Si certains envois ont réussi
    const result = {
      success: true,
      sentTo: totalSent,
      failed: totalErrors,
      skipped: validRecipients.length - recipientsToSend.length,
      warnings: errors.length > 0 ? errors : undefined,
    }
    
    console.log(`✅ Newsletter send completed:`, result)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof AdminAuthError) {
      if (error.message === 'UNAUTHENTICATED') {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
      }
      if (error.message === 'FORBIDDEN') {
        return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
      }
    }
    if (error instanceof DatabaseUnavailableError) {
      return NextResponse.json({ error: 'Base de données indisponible' }, { status: 503 })
    }

    console.error('❌ Unexpected error sending newsletter:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'envoi de la newsletter.' },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}
