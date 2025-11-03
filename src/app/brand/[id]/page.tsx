'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Edit, Download, X, Eye } from 'lucide-react'
import { useUser } from '@stackframe/stack'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialShare from '@/components/SocialShare'
import { generateModernBrandPDF } from '@/utils/generatePDF'

interface Brand {
  id: string
  name: string
  description: string | null
  prompt: string
  primaryColor: string | null
  secondaryColor: string | null
  accentColor: string | null
  primaryFont: string | null
  secondaryFont: string | null
  brandPersonality: string | null
  targetAudience: string | null
  isCompleted: boolean
  currentStep: number
  user?: {
    id: string
    name: string | null
    email: string
    profileImage: string | null
    isVerified: boolean
  }
}

export default function BrandPage() {
  const params = useParams()
  const router = useRouter()
  const user = useUser({ or: 'return-null' })
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [images, setImages] = useState<{[key: string]: string}>({
    hero: '',
    typography: '',
    personality: '',
    accent: '',
    application: ''
  })

  const handleDownloadPDF = async () => {
    if (!brand) return
    setDownloadingPDF(true)
    try {
      await generateModernBrandPDF(brand, images)
      
      // Incrémenter le compteur de téléchargements APRÈS la génération réussie
      // On attend un petit délai pour s'assurer que le téléchargement est bien initié
      setTimeout(async () => {
        try {
          await fetch(`/api/brands/${brand.id}/download`, {
            method: 'POST',
          })
        } catch (error) {
          console.error('Erreur lors du comptage:', error)
        }
      }, 500)
    } catch (error) {
      console.error('Error generating PDF:', error)
      // Ne pas compter si erreur
    } finally {
      setDownloadingPDF(false)
      setShowPreviewModal(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchBrand()
    }
  }, [params.id])

  const generateImages = async (brandData: Brand) => {
    const stopWords = [
      'avec', 'pour', 'dans', 'sont', 'être', 'vous', 'dont', 'cette', 'tout', 'tous', 'une', 'des', 'les', 'qui',
      'que', 'par', 'sur', 'sous', 'plus', 'comme', 'aussi', 'très', 'bien', 'peut', 'fait', 'faites', 'notre',
      'votre', 'leur', 'chaque', 'toutes', 'lalliance', 'dune', 'expertise', 'mission', 'techniques', 'avec', 'cela',
      'entre', 'depuis', 'leurs', 'leurs', 'leurs', 'vers', 'ainsi', 'dans', 'afin'
    ]

    const sectorKeywords: Record<string, string[]> = {
      coiffure: ['hair salon', 'hairdressing', 'haircut', 'styling', 'hair care', 'barbershop'],
      salon: ['hair salon', 'beauty salon', 'spa salon', 'hairdresser'],
      restaurant: ['restaurant', 'dining', 'culinary', 'gastronomy', 'chef table'],
      café: ['cafe', 'coffee shop', 'roastery', 'espresso bar'],
      tech: ['technology', 'software', 'digital product', 'innovation', 'startup'],
      finance: ['fintech', 'financial services', 'investment', 'banking'],
      fashion: ['fashion', 'editorial', 'apparel', 'style', 'lookbook'],
      fitness: ['fitness', 'gym', 'wellness', 'training', 'athletic'],
      beauty: ['skincare', 'cosmetics', 'aesthetic', 'beauty studio', 'makeup'],
      hospitality: ['hotel', 'hospitality', 'experience', 'luxury interior'],
      education: ['education', 'learning', 'academy', 'workshop'],
      music: ['music studio', 'concert', 'artist', 'sound design'],
      art: ['gallery', 'art director', 'creative studio', 'visual art']
    }

    const personalityDictionary: Record<string, string[]> = {
      modern: ['minimal', 'sleek', 'contemporary'],
      luxueux: ['luxury', 'premium', 'high-end'],
      luxe: ['luxury', 'premium', 'high-end'],
      énergique: ['vibrant', 'dynamic', 'bold'],
      vibrant: ['vibrant', 'energetic', 'colorful'],
      naturel: ['organic', 'natural', 'soft light'],
      chaleureux: ['warm', 'cozy', 'human'],
      futuriste: ['futuristic', 'innovative', 'digital'],
      artistique: ['artistic', 'creative', 'experimental'],
      authentique: ['authentic', 'documentary', 'lifestyle']
    }

    const extractKeywords = (text: string | null, limit: number = 8): string[] => {
      if (!text) return []
      return text
        .toLowerCase()
        .replace(/[^\w\séèêëàâäôöùûüîïç-]/g, ' ')
        .split(/\s+/)
        .filter((word) => word.length > 3 && !stopWords.includes(word))
        .filter((word, index, arr) => arr.indexOf(word) === index)
        .slice(0, limit)
    }

    const detectSector = (text: string): string[] => {
      const lowerText = text.toLowerCase()
      const detected: string[] = []

      for (const keywords of Object.values(sectorKeywords)) {
        if (keywords.some((keyword) => lowerText.includes(keyword.split(' ')[0]))) {
          detected.push(...keywords.slice(0, 3))
        }
      }

      if (lowerText.includes('salon') && (lowerText.includes('coiff') || lowerText.includes('capillaire') || lowerText.includes('cheveu'))) {
        detected.push('hair salon', 'hairdressing')
      }
      if (lowerText.includes('restaurant') || lowerText.includes('cuisine')) {
        detected.push('restaurant', 'culinary')
      }
      if (lowerText.includes('café') || lowerText.includes('coffee')) {
        detected.push('cafe', 'espresso bar')
      }

      return [...new Set(detected)]
    }

    const combinedText = [brandData.prompt, brandData.description, brandData.name, brandData.targetAudience]
      .filter(Boolean)
      .join(' ')

    const sectorTerms = detectSector(combinedText)
    const promptKeywords = extractKeywords(brandData.prompt, 10)
    const descriptionKeywords = extractKeywords(brandData.description, 6)
    const nameKeywords = extractKeywords(brandData.name, 3)
    const audienceKeywords = extractKeywords(brandData.targetAudience, 5)

    const personalityKey =
      brandData.brandPersonality?.toLowerCase().split(/\s+/)[0] ||
      (promptKeywords[0] ?? 'modern')
    const personalityTags = personalityDictionary[personalityKey] ?? [personalityKey]

    const baseKeywords = [
      ...new Set([
        ...sectorTerms,
        ...promptKeywords,
        ...descriptionKeywords,
        ...nameKeywords,
        ...audienceKeywords,
        ...personalityTags
      ])
    ]

    const palette = [brandData.primaryColor, brandData.secondaryColor, brandData.accentColor].filter(
      (color): color is string => Boolean(color)
    )
    const fallbackPalette = palette.length ? palette : ['#0f172a', '#1f2937', '#6366f1']

    const createGradientFallback = (label: string) => {
      const stops = fallbackPalette.map((color, idx) => {
        const offset =
          fallbackPalette.length === 1 ? 0 : Math.round((idx / (fallbackPalette.length - 1)) * 100)
        return `<stop offset="${offset}%" stop-color="${color}" />`
      })

      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              ${stops.join('')}
            </linearGradient>
          </defs>
          <rect width="1600" height="900" fill="url(#grad)" rx="64" />
          <rect x="80" y="80" width="480" height="120" fill="rgba(0,0,0,0.28)" rx="32" />
          <text x="120" y="148" font-size="40" fill="rgba(255,255,255,0.85)" font-family="Arial" font-weight="600">
            ${brandData.name}
          </text>
          <text x="120" y="196" font-size="26" fill="rgba(255,255,255,0.65)" font-family="Arial" letter-spacing="4">
            ${label.toUpperCase()}
          </text>
        </svg>
      `
      return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
    }

    const fallbackImages: Record<string, string> = {
      hero: createGradientFallback('Moodboard'),
      typography: createGradientFallback('Typographie'),
      personality: createGradientFallback('Identité'),
      accent: createGradientFallback('Texturing'),
      application: createGradientFallback('Applications')
    }

    const assembledQueries = {
      hero: [
        brandData.name,
        ...personalityTags,
        ...audienceKeywords,
        ...baseKeywords,
        'brand identity',
        'editorial photoshoot',
        'moodboard'
      ]
        .filter(Boolean)
        .join(' '),
      typography: [
        brandData.name,
        brandData.primaryFont,
        brandData.secondaryFont,
        ...baseKeywords,
        'typography poster',
        'font pairing',
        'brand guidelines layout'
      ]
        .filter(Boolean)
        .join(' '),
      personality: [
        brandData.name,
        ...baseKeywords,
        'storytelling portrait',
        'lifestyle',
        ...audienceKeywords,
        'editorial'
      ]
        .filter(Boolean)
        .join(' '),
      accent: [
        brandData.name,
        ...baseKeywords,
        'abstract texture',
        'brand assets',
        brandData.accentColor,
        'pattern design'
      ]
        .filter(Boolean)
        .join(' '),
      application: [
        brandData.name,
        ...baseKeywords,
        ...audienceKeywords,
        'product mockup',
        'digital experience',
        'brand presentation'
      ]
        .filter(Boolean)
        .join(' ')
    }

    const newImages: Record<string, string> = { ...fallbackImages }

    const fetchImage = async (key: string, query: string) => {
      const providers: Array<'unsplash' | 'pexels'> = ['unsplash', 'pexels']
      for (const provider of providers) {
        try {
          const response = await fetch('/api/get-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: query.trim(),
              seed: `${brandData.id}-${key}-${provider}`,
              provider,
              orientation: 'landscape'
            })
          })

          if (!response.ok) {
            continue
          }

          const data = await response.json()
          const url =
            data.image?.url ||
            data.image?.srcSet?.full ||
            data.image?.srcSet?.regular ||
            data.imageUrl

          if (url) {
            newImages[key] = url
            return
          }
        } catch (error) {
          console.error(`Error fetching ${key} image with ${provider}:`, error)
        }
      }
    }

    await Promise.all(
      Object.entries(assembledQueries).map(async ([key, query]) => fetchImage(key, query))
    )

    setImages(newImages)
  }

  const fetchBrand = async () => {
    try {
      const response = await fetch(`/api/brands/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setBrand(data)
        // Générer les images IA
        generateImages(data)
        
        // Vérifier si l'utilisateur est le propriétaire
        if (user) {
          const userResponse = await fetch('/api/user')
          if (userResponse.ok) {
            const userData = await userResponse.json()
            setIsOwner(userData.id === data.userId)
          }
        }
      } else {
        // Si non autorisé, rediriger vers la page d'accueil au lieu du dashboard
        if (response.status === 401 || response.status === 403) {
          router.push('/')
        } else {
          router.push(user ? '/dashboard' : '/')
        }
      }
    } catch (error) {
      console.error('Error fetching brand:', error)
      router.push(user ? '/dashboard' : '/')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!brand) {
    return null
  }

  const paletteColors = [brand.primaryColor, brand.secondaryColor, brand.accentColor].filter(
    (color): color is string => Boolean(color)
  )
  const displayPalette = paletteColors.length ? paletteColors : ['#111827', '#6366F1', '#F97316']
  const primaryFont = brand.primaryFont || 'Space Grotesk'
  const secondaryFont = brand.secondaryFont || primaryFont
  const personalityLabel = brand.brandPersonality || 'Modern & Visionary'
  const audienceLabel = brand.targetAudience || 'Audience polyvalent'
  const accentOverlay = brand.accentColor || 'rgba(17,17,17,0.45)'
  const promptKeywords = brand.prompt
    ? brand.prompt
        .split(/[,;\n]/)
        .map((piece) => piece.trim())
        .filter(Boolean)
        .slice(0, 4)
    : []
  const highlightKeywords = promptKeywords.length
    ? promptKeywords
    : ['Logotype', 'Palette', 'Typographie', 'Visuels']
  const keywordPills = Array.from(new Set(highlightKeywords))
  const previewPalette = displayPalette.slice(0, 3)
  const previewPages = [
    {
      key: 'cover',
      title: 'Cover',
      render: () => (
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl">
          {images.hero ? (
            <img
              src={images.hero}
              alt="Hero preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${brand.primaryColor || '#0f172a'}, ${
                  brand.secondaryColor || '#1f2937'
                })`
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/60 to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-between p-6">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.5rem] text-white/70">
              Guidiqo
              <span className="inline-flex h-px w-6 bg-white/60" />
              Brand
            </div>
            <div>
              <h4
                className="text-2xl font-semibold text-white sm:text-3xl"
                style={{ fontFamily: primaryFont }}
              >
                {brand.name}
              </h4>
              <div className="mt-2 flex gap-2">
                {previewPalette.map((color, idx) => (
                  <span
                    key={`cover-color-${color}-${idx}`}
                    className="h-7 w-7 rounded-xl border border-white/40"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'colors',
      title: 'Palette',
      render: () => (
        <div className="aspect-video w-full overflow-hidden rounded-3xl bg-white">
          <div className="h-full w-full bg-gradient-to-br from-slate-100 to-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.45rem] text-slate-500">
              Palette
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {displayPalette.map((color, idx) => (
                <div
                  key={`preview-color-${color}-${idx}`}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2"
                >
                  <div
                    className="h-16 w-full rounded-xl border border-slate-100"
                    style={{ backgroundColor: color }}
                  />
                  <p className="mt-2 truncate text-xs font-mono text-slate-600">{color}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'typography',
      title: 'Typographie',
      render: () => (
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700" />
          <div className="relative z-10 flex h-full flex-col justify-between p-5">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.45rem] text-slate-300">
              Type
              <span className="inline-flex h-px w-5 bg-slate-500" />
              System
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p
                  className="text-5xl font-semibold text-white"
                  style={{ fontFamily: primaryFont }}
                >
                  Aa
                </p>
                <p className="text-xs uppercase tracking-[0.3rem] text-slate-300">
                  {primaryFont}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3rem] text-slate-400">
                  {secondaryFont !== primaryFont ? secondaryFont : 'Baseline'}
                </p>
                <p
                  className="mt-2 max-w-[120px] text-right text-xs text-slate-300"
                  style={{ fontFamily: secondaryFont }}
                >
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'personality',
      title: 'Identité',
      render: () => (
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl">
          {images.personality ? (
            <img
              src={images.personality}
              alt="Mood preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-600" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-end p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.45rem] text-white/70">
              Audience
            </p>
            <h4 className="mt-2 text-lg font-semibold text-white" style={{ fontFamily: primaryFont }}>
              {brand.brandPersonality || 'Identité Affirmée'}
            </h4>
            <p className="mt-1 text-xs text-white/70">
              {brand.targetAudience || 'Communauté créative et engagée'}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'applications',
      title: 'Applications',
      render: () => (
        <div className="aspect-video w-full overflow-hidden rounded-3xl bg-slate-900">
          <div className="grid h-full w-full grid-cols-3 grid-rows-2 gap-2 p-2">
            <div className="relative col-span-2 row-span-2 overflow-hidden rounded-2xl">
              {images.application ? (
                <img
                  src={images.application}
                  alt="Application"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-black" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative z-10 p-3 text-white">
                <p className="text-[9px] uppercase tracking-[0.4rem] text-white/60">Hero</p>
                <p className="text-sm font-semibold">{brand.name}</p>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-3">
              <p className="text-[9px] uppercase tracking-[0.4rem] text-slate-500">CTA</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">
                {brand.accentColor ? 'Accent visuel' : 'Call to action'}
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-slate-800">
              {images.accent && (
                <img
                  src={images.accent}
                  alt="Accent preview"
                  className="absolute inset-0 h-full w-full object-cover opacity-40"
                />
              )}
              <div className="relative z-10 flex h-full flex-col justify-between p-3 text-white">
                <p className="text-[9px] uppercase tracking-[0.35rem] text-white/60">Stories</p>
                <p className="text-xs">
                  {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'guidelines',
      title: 'Usage',
      render: () => (
        <div className="aspect-video w-full overflow-hidden rounded-3xl bg-white">
          <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-slate-100 via-white to-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-16 overflow-hidden rounded-xl border border-slate-200 bg-slate-200/60">
                  {images.application ? (
                    <img
                      src={images.application}
                      alt="Aperçu guideline"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="h-full w-full"
                      style={{
                        background: `linear-gradient(135deg, ${brand.primaryColor || '#0f172a'} 0%, ${
                          brand.secondaryColor || '#1f2937'
                        } 100%)`
                      }}
                    />
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.45rem] text-slate-500">
                    Ratios
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-700 leading-snug">
                    Palette équilibrée 60 / 30 / 10
                  </p>
                </div>
              </div>
              <p className="text-[9px] uppercase tracking-[0.35rem] text-slate-400">
                {brand.name}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px] font-semibold uppercase tracking-[0.3rem] text-slate-500">
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <p className="text-xs text-slate-700">Primaire</p>
                <div
                  className="mt-2 h-2 rounded-full"
                  style={{ backgroundColor: brand.primaryColor || '#0f172a' }}
                />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <p className="text-xs text-slate-700">Secondaire</p>
                <div
                  className="mt-2 h-2 rounded-full"
                  style={{ backgroundColor: brand.secondaryColor || '#1f2937' }}
                />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <p className="text-xs text-slate-700">Accent</p>
                <div
                  className="mt-2 h-2 rounded-full"
                  style={{ backgroundColor: brand.accentColor || '#fbbf24' }}
                />
              </div>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black relative overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 px-4 md:px-8">
        {/* Bouton retour */}
        <div className="max-w-7xl mx-auto mb-8">
          <motion.button
            onClick={() => router.push(isOwner ? '/dashboard' : '/bibliotheque')}
            className="flex items-center gap-2 text-gray-600 hover:text-black dark:text-white transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            {isOwner ? 'Retour au dashboard' : 'Retour'}
          </motion.button>
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 md:mb-24 flex justify-between items-start"
          >
            <div>
              <motion.h1
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-6 md:mb-8 tracking-tighter text-black dark:text-white"
                style={{ fontFamily: brand.primaryFont || 'sans-serif' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {brand.name}
              </motion.h1>

              {brand.description && (
                <div className="max-w-3xl">
                  <motion.p
                    className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    {showFullDescription || brand.description.length <= 150
                      ? brand.description
                      : `${brand.description.substring(0, 150)}...`}
                  </motion.p>
                  {brand.description.length > 150 && (
                    <motion.button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mt-2 text-sm font-semibold text-black hover:text-gray-600 dark:text-white transition-colors underline"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      {showFullDescription ? 'Voir moins' : 'Voir plus'}
                    </motion.button>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {/* Bouton de partage - visible pour tous */}
              <SocialShare
                brandId={brand.id}
                brandName={brand.name}
                brandDescription={brand.description || undefined}
                brandUrl={typeof window !== 'undefined' ? window.location.href : ''}
              />
              
              {/* Actions propriétaire */}
              {isOwner && (
                <>
                  <motion.button
                    onClick={() => router.push(`/modifier/${brand.id}`)}
                    className="p-4 bg-white dark:bg-black border border-black/10 dark:border-white rounded-full hover:bg-black hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title="Modifier le branding"
                  >
                    <Edit className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={() => setShowPreviewModal(true)}
                    className="p-4 bg-black text-white dark:bg-white dark:text-black rounded-full hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title="Télécharger en PDF"
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>

          {/* Moodboard inspiré */}
          <div className="grid grid-cols-12 gap-3 md:gap-4 auto-rows-[160px] md:auto-rows-[200px] lg:auto-rows-[240px]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative col-span-12 md:col-span-7 md:row-span-3 rounded-3xl overflow-hidden group"
              whileHover={{ scale: 1.01 }}
            >
              {images.hero ? (
                <img
                  src={images.hero}
                  alt={`${brand.name} hero`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${brand.primaryColor || '#111827'}, ${brand.secondaryColor || '#1f2937'})`
                  }}
                />
              )}
              <div
                className="absolute inset-0 mix-blend-multiply"
                style={{
                  background: `linear-gradient(135deg, ${brand.primaryColor || '#111827'} 0%, ${brand.accentColor || '#1f2937'} 100%)`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
              <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-10">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/80">
                  <span className="h-px w-8 bg-white/60" />
                  Moodboard
                </div>
                <div>
                  <motion.h2
                    className="mb-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl"
                    style={{ fontFamily: primaryFont }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {brand.name}
                  </motion.h2>
                  {brand.description && (
                    <p className="max-w-xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
                      {showFullDescription || brand.description.length <= 160
                        ? brand.description
                        : `${brand.description.substring(0, 160)}...`}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="col-span-12 md:col-span-5 md:row-span-1 flex flex-col justify-between rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-colors dark:border-white/10 dark:bg-black md:p-8"
              whileHover={{ scale: 1.01 }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
                  Brand Guidelines
                </p>
                <h3
                  className="mt-4 text-2xl font-semibold text-black dark:text-white md:text-3xl"
                  style={{ fontFamily: secondaryFont }}
                >
                  Identité {brand.name}
                </h3>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {keywordPills.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/80 dark:bg-white/10 dark:text-white/80"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative col-span-12 md:col-span-5 md:row-span-2 overflow-hidden rounded-3xl"
              whileHover={{ scale: 1.01 }}
            >
              {images.accent && (
                <img
                  src={images.accent}
                  alt="Motif accent"
                  className="absolute inset-0 h-full w-full object-cover opacity-30"
                />
              )}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(160deg, ${accentOverlay} 0%, rgba(15,15,15,0.85) 100%)`
                }}
              />
              <div className="relative z-10 flex h-full flex-col p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                  Palette & Accents
                </p>
                <div className="mt-auto grid grid-cols-3 gap-3">
                  {displayPalette.map((color, idx) => (
                    <div
                      key={`${color}-${idx}`}
                      className="flex flex-col gap-3 rounded-2xl bg-white/15 p-3 backdrop-blur-lg"
                    >
                      <div
                        className="h-16 rounded-xl border border-white/20"
                        style={{ backgroundColor: color }}
                      />
                      <p className="text-xs font-mono uppercase text-white">{color}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="col-span-12 md:col-span-7 md:row-span-2 flex flex-col justify-between rounded-3xl border border-black/5 bg-white p-6 transition-colors dark:border-white/10 dark:bg-black md:p-10"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                <span className="h-px w-8 bg-gray-400/60 dark:bg-white/30" />
                Typographie
              </div>
              <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
                <div>
                  <p
                    className="text-7xl font-bold text-black dark:text-white sm:text-8xl"
                    style={{ fontFamily: primaryFont }}
                  >
                    Aa
                  </p>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {primaryFont}
                  </p>
                </div>
                <div className="flex-1 max-w-xl">
                  <p
                    className="text-lg leading-relaxed text-gray-700 dark:text-gray-200 md:text-xl"
                    style={{ fontFamily: secondaryFont }}
                  >
                    {brand.description ||
                      'Un système typographique équilibré pour renforcer la personnalité de la marque.'}
                  </p>
                  {secondaryFont !== primaryFont && (
                    <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      {secondaryFont}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="relative col-span-12 md:col-span-5 md:row-span-2 overflow-hidden rounded-3xl"
              whileHover={{ scale: 1.01 }}
            >
              {images.personality ? (
                <img
                  src={images.personality}
                  alt="Mood"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
              <div className="relative z-10 flex h-full flex-col justify-end gap-4 p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                  Ton & Audience
                </p>
                <h3
                  className="text-3xl font-semibold text-white md:text-4xl"
                  style={{ fontFamily: primaryFont }}
                >
                  {personalityLabel}
                </h3>
                <p className="text-sm text-white/80 md:text-base">{audienceLabel}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative col-span-12 md:col-span-12 md:row-span-3 overflow-hidden rounded-3xl"
              whileHover={{ scale: 1.005 }}
            >
              {images.application ? (
                <img
                  src={images.application}
                  alt="Brand application"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent" />
              <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-12">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/70">
                  <Eye className="h-4 w-4" />
                  Expressions de marque
                </div>
                <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
                  <div>
                    <h3
                      className="mb-4 text-4xl font-semibold text-white sm:text-5xl md:text-6xl"
                      style={{ fontFamily: primaryFont }}
                    >
                      {brand.name}
                    </h3>
                    {brand.description && (
                      <p className="max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg md:text-xl">
                        {brand.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {displayPalette.slice(0, 3).map((color, idx) => (
                      <div
                        key={`application-color-${color}-${idx}`}
                        className="h-24 w-12 rounded-xl border border-white/20 md:h-32 md:w-14"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modal d'aperçu PDF */}
      <AnimatePresence>
        {showPreviewModal && brand && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]"
              onClick={() => !downloadingPDF && setShowPreviewModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4"
              onClick={(e) => e.target === e.currentTarget && !downloadingPDF && setShowPreviewModal(false)}
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
                {/* Close button */}
                {!downloadingPDF && (
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto w-20 h-20 bg-gradient-to-br from-stone-900 to-red-900 rounded-full flex items-center justify-center mb-6"
                  >
                    <Eye className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-black mb-3">
                    Aperçu du PDF
                  </h3>
                  <p className="text-gray-600">
                    Votre Brand Guideline sera généré au format 16:9 (1920x1080px)
                  </p>
                </div>

                {/* Preview Cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {previewPages.map((page, idx) => (
                    <div
                      key={page.key}
                      className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.35rem] text-gray-500">
                        <span>{page.title}</span>
                        <span className="rounded-full bg-gray-100 px-2 py-[3px] text-[10px] text-gray-600">
                          Page {idx + 1}
                        </span>
                      </div>
                      <div className="mt-3 overflow-hidden rounded-2xl border border-gray-100 bg-white">
                        {page.render()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Info */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <h4 className="font-semibold text-black mb-3">Contenu du PDF</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>  Page de couverture immersive avec mood visuel</li>
                    <li>  Palette chromatique détaillée avec codes HEX / RGB</li>
                    <li>  Système typographique complet (titres & corps)</li>
                    <li>  Identité de marque & audience avec inspirations</li>
                    <li>  Collage d&apos;applications visuelles et bonnes pratiques</li>
                    <li>  Guidelines d&apos;usage des couleurs et ratios recommandés</li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => setShowPreviewModal(false)}
                    disabled={downloadingPDF}
                    className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                    whileHover={{ scale: downloadingPDF ? 1 : 1.02 }}
                    whileTap={{ scale: downloadingPDF ? 1 : 0.98 }}
                  >
                    Annuler
                  </motion.button>
                  
                  <motion.button
                    onClick={handleDownloadPDF}
                    disabled={downloadingPDF}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-stone-900 to-gray-800 text-white rounded-full font-semibold hover:from-red-900 hover:to-red-600 transition-all disabled:opacity-50"
                    whileHover={{ scale: downloadingPDF ? 1 : 1.02 }}
                    whileTap={{ scale: downloadingPDF ? 1 : 0.98 }}
                  >
                    {downloadingPDF ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Génération en cours...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Download className="w-5 h-5" />
                        Télécharger le PDF
                      </span>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Card créateur */}
      {brand && brand.user && (
        <section className="py-12 px-4 sm:px-6 bg-gray-50 dark:bg-black">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-3xl p-8 sm:p-12 cursor-pointer hover:scale-[1.02] transition-transform duration-300"
              style={{
                background: `linear-gradient(135deg, ${brand.primaryColor || '#000'} 0%, ${brand.secondaryColor || '#333'} 100%)`
              }}
              onClick={() => router.push(`/createur/${brand.user!.id}`)}
            >
              {/* Pattern overlay */}
              <Image
                src="https://images.unsplash.com/photo-1758551015352-fa735f167422?q=80&w=2600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Music studio background"
                fill
                className="object-cover opacity-90"
                priority
              />
              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden border-4 border-white/30"
                  >
                    {brand.user.profileImage ? (
                      <img
                        src={brand.user.profileImage}
                        alt={brand.user.name || ''}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-2xl sm:text-3xl font-bold">
                        {(brand.user.name || brand.user.email).substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </motion.div>
                  {brand.user.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://e7msojy1cjnzyvsj.public.blob.vercel-storage.com/images/1759665603040-verified-badge-profile-icon-png.webp"
                        alt="Verified"
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-white/80 text-sm sm:text-base mb-2">Créé par</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {brand.user.name || brand.user.email.split('@')[0]}
                  </h3>
                  <p className="text-white/70 text-sm sm:text-base">
                    {brand.user.email}
                  </p>
                </div>

                {/* Bouton "Voir plus" */}
                <motion.div
                  className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/30 hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <p className="text-white font-semibold text-sm sm:text-base whitespace-nowrap">
                    Voir plus →
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
