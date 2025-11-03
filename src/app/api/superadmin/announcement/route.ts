import { NextRequest, NextResponse } from 'next/server'
import {
  DEFAULT_NEWS_BANNER,
  LocalizedText,
  getNewsBannerSettings,
  saveNewsBannerSettings,
} from '@/lib/siteSettings'
import { AdminAuthError, DatabaseUnavailableError, assertAdmin } from '@/lib/adminAuth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type BannerPayload = {
  message?: string | Partial<LocalizedText>
  ctaLabel?: string | Partial<LocalizedText>
  ctaHref?: string
  enabled?: boolean
}

const normalizeInputLocalized = (
  value: string | Partial<LocalizedText> | undefined,
): LocalizedText | null => {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) {
      return null
    }
    return { fr: trimmed, en: trimmed }
  }

  if (value && typeof value === 'object') {
    const fr = typeof value.fr === 'string' ? value.fr.trim() : ''
    const en = typeof value.en === 'string' ? value.en.trim() : ''
    if (!fr && !en) {
      return null
    }
    return { fr, en }
  }

  return null
}

export async function GET() {
  try {
    await assertAdmin()
    const banner = await getNewsBannerSettings()
    return NextResponse.json(banner)
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

    console.error('❌ Error fetching admin banner configuration:', error)
    return NextResponse.json(DEFAULT_NEWS_BANNER, { status: 200 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await assertAdmin()

    const body = (await req.json()) as BannerPayload
    const message = normalizeInputLocalized(body.message)

    if (!message || !message.fr || !message.en) {
      return NextResponse.json(
        { error: 'Les messages français et anglais sont obligatoires.' },
        { status: 400 },
      )
    }

    const rawCta = normalizeInputLocalized(body.ctaLabel)
    const ctaLabel = rawCta && rawCta.fr && rawCta.en ? rawCta : undefined

    if (body.ctaLabel && !ctaLabel) {
      return NextResponse.json(
        { error: 'Le texte du bouton doit être fourni en français et en anglais.' },
        { status: 400 },
      )
    }

    const ctaHref = typeof body.ctaHref === 'string' && body.ctaHref.trim()
      ? body.ctaHref.trim()
      : undefined

    if (ctaLabel && !ctaHref) {
      return NextResponse.json(
        { error: 'Le lien du bouton est requis si un texte est fourni.' },
        { status: 400 },
      )
    }

    const enabled =
      typeof body.enabled === 'boolean' ? body.enabled : DEFAULT_NEWS_BANNER.enabled

    const saved = await saveNewsBannerSettings({
      message,
      ctaLabel,
      ctaHref,
      enabled,
    })

    return NextResponse.json(saved)
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

    console.error('❌ Error updating banner configuration:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la bannière' },
      { status: 500 },
    )
  }
}
