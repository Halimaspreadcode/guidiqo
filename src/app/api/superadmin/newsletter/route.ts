import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { AdminAuthError, DatabaseUnavailableError, assertAdmin } from '@/lib/adminAuth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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
  const paragraphs = body
    .split(/\n{2,}/)
    .map(
      (paragraph) =>
        `<p style="margin: 0 0 16px; color: #1f2937; line-height: 1.6;">${paragraph
          .split('\n')
          .map((line) => line.trim())
          .join('<br />')}</p>`,
    )
    .join('')

  return `<!DOCTYPE html>
  <html lang="fr">
    <head>
      <meta charset="utf-8" />
      <title>${subject}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:'Raleway',Arial,sans-serif;">
      <span style="display:none;visibility:hidden;mso-hide:all;font-size:1px;color:#f3f4f6;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${safePreview}</span>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" style="padding:40px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:620px;background:#ffffff;border-radius:24px;box-shadow:0 10px 45px rgba(15,23,42,0.08);overflow:hidden;">
              <tr>
                <td style="padding:32px 32px 0;text-align:left;">
                  <p style="margin:0 0 8px;font-size:14px;letter-spacing:1px;text-transform:uppercase;color:#6b7280;">Guidiqo</p>
                  <h1 style="margin:0 0 24px;font-size:28px;color:#111827;">${subject}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:0 32px 32px;text-align:left;">${paragraphs}</td>
              </tr>
              <tr>
                <td style="padding:24px 32px;border-top:1px solid #e5e7eb;background:#f9fafb;text-align:center;color:#6b7280;font-size:12px;">
                  Vous recevez cet email car vous êtes inscrit à la newsletter Guidiqo.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
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

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: validRecipients,
      subject,
      html,
      text: plainText,
    })

    if (error) {
      console.error('❌ Resend newsletter error:', error)
      return NextResponse.json(
        { error: 'Impossible d’envoyer la newsletter.' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      sentTo: validRecipients.length,
    })
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
      { error: 'Erreur serveur lors de l’envoi de la newsletter.' },
      { status: 500 },
    )
  }
}
