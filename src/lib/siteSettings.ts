import { prisma } from './prisma'

export const NEWS_BANNER_KEY = 'news_banner'

export type LocalizedText = {
  fr: string
  en: string
}

export type NewsBannerSettings = {
  message: LocalizedText
  ctaLabel?: LocalizedText
  ctaHref?: string
  enabled: boolean
}

export type StoredBanner = NewsBannerSettings & { version: string }

const DEFAULT_MESSAGE: LocalizedText = {
  fr: 'Nouveauté : Mode sombre disponible ! Découvrez toutes les fonctionnalités',
  en: 'New: Dark mode is now available! Discover every feature',
}

const DEFAULT_CTA: LocalizedText = {
  fr: 'Découvrir',
  en: 'Discover',
}

export const DEFAULT_NEWS_BANNER: StoredBanner = {
  message: DEFAULT_MESSAGE,
  ctaLabel: DEFAULT_CTA,
  enabled: true,
  version: 'default',
}

const isPrismaUnavailableError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'code' in (error as Record<string, unknown>) &&
  (error as { code?: string }).code === 'P1001'

const normalizeLocalized = (value: unknown, fallback: LocalizedText): LocalizedText => {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return {
      fr: trimmed || fallback.fr,
      en: trimmed || fallback.en,
    }
  }

  if (value && typeof value === 'object') {
    const fr = typeof (value as Record<string, unknown>).fr === 'string'
      ? ((value as Record<string, unknown>).fr as string).trim()
      : fallback.fr
    const en = typeof (value as Record<string, unknown>).en === 'string'
      ? ((value as Record<string, unknown>).en as string).trim()
      : fallback.en
    return {
      fr: fr || fallback.fr,
      en: en || fallback.en,
    }
  }

  return fallback
}

export async function getNewsBannerSettings(): Promise<StoredBanner> {
  let setting
  try {
    setting = await prisma.siteSetting.findUnique({
      where: { key: NEWS_BANNER_KEY },
    })
  } catch (error) {
    if (isPrismaUnavailableError(error)) {
      console.error('❌ Base de données indisponible pour récupérer la bannière:', error)
      return DEFAULT_NEWS_BANNER
    }
    throw error
  }

  if (!setting) {
    return DEFAULT_NEWS_BANNER
  }

  try {
    const parsed = JSON.parse(setting.value) as Partial<NewsBannerSettings> & {
      message?: unknown
      ctaLabel?: unknown
    }

    const message = normalizeLocalized(parsed.message, DEFAULT_MESSAGE)
    const ctaLabel = parsed.ctaLabel
      ? normalizeLocalized(parsed.ctaLabel, DEFAULT_CTA)
      : undefined
    const enabled =
      typeof parsed.enabled === 'boolean'
        ? parsed.enabled
        : DEFAULT_NEWS_BANNER.enabled
    const ctaHref = typeof parsed.ctaHref === 'string' ? parsed.ctaHref : undefined

    return {
      message,
      ctaLabel,
      ctaHref,
      enabled,
      version: setting.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error('❌ Impossible de parser la configuration de bannière:', error)
    return {
      ...DEFAULT_NEWS_BANNER,
      version: setting.updatedAt.toISOString(),
    }
  }
}

export async function saveNewsBannerSettings(
  settings: NewsBannerSettings,
): Promise<StoredBanner> {
  const payload = JSON.stringify(settings)

  try {
    const updated = await prisma.siteSetting.upsert({
      where: { key: NEWS_BANNER_KEY },
      update: { value: payload },
      create: { key: NEWS_BANNER_KEY, value: payload },
    })

    return {
      ...settings,
      version: updated.updatedAt.toISOString(),
    }
  } catch (error) {
    if (isPrismaUnavailableError(error)) {
      console.error('❌ Base de données indisponible pour enregistrer la bannière:', error)
      return {
        ...settings,
        version: new Date().toISOString(),
      }
    }
    throw error
  }
}
