'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Footer from '@/components/Footer'
import { useEffect, useMemo, useState } from 'react'
import { X, Search, Loader2, RefreshCw, Upload } from 'lucide-react'
import { useLanguage, useTranslations } from '@/contexts/LanguageContext'

interface BrandData {
  brandPersonality?: string
  targetAudience?: string
  coverImage?: string
  name?: string
  description?: string
  prompt?: string
}

interface Step4Props {
  brandData: BrandData
  updateBrandData: (data: Partial<BrandData>) => void
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
}

type PersonalityConfig = {
  value: string
}

type AudienceConfig = {
  value: string
}

type CuratedImageConfig = {
  id: string
  url: string
}

const curatedGalleryConfigs: Record<string, CuratedImageConfig[]> = {
  professionnel: [
    {
      id: 'strategy',
      url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'collaboration',
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'atelier',
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80',
    },
  ],
  moderne: [
    {
      id: 'neon',
      url: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'geometry',
      url: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'studio',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    },
  ],
  amical: [
    {
      id: 'workshop',
      url: 'https://images.unsplash.com/photo-1521737604893-0df3c7966a84?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'coffee',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'creativity',
      url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80',
    },
  ],
  luxe: [
    {
      id: 'lounge',
      url: 'https://images.unsplash.com/photo-1517242025533-3821d9eac7bd?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'details',
      url: 'https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'architecture',
      url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    },
  ],
  dynamique: [
    {
      id: 'city',
      url: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'startup',
      url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'sport',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80',
    },
  ],
  minimaliste: [
    {
      id: 'hall',
      url: 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'interior',
      url: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'decor',
      url: 'https://images.unsplash.com/photo-1525981084248-573eba904519?auto=format&fit=crop&w=1600&q=80',
    },
  ],
}

const personalityConfigs: PersonalityConfig[] = [
  { value: 'professionnel' },
  { value: 'moderne' },
  { value: 'amical' },
  { value: 'luxe' },
  { value: 'dynamique' },
  { value: 'minimaliste' },
]

const audienceConfigs: AudienceConfig[] = [
  { value: 'b2b' },
  { value: 'b2c' },
  { value: 'jeunes' },
  { value: 'professionnels' },
  { value: 'creatifs' },
  { value: 'tech' },
]

export default function Step4Personality({ brandData, updateBrandData, currentStep, totalSteps, onNext, onPrevious }: Step4Props) {
  const [customImageUrl, setCustomImageUrl] = useState('')
  const [isValidUrl, setIsValidUrl] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Array<{
    id?: string
    url: string
    title: string
    vibe: string
    photographer?: {
      name: string
      url: string
      username?: string
    }
    photographerUrl?: string
    unsplashUrl?: string
    downloadLocation?: string
  }>>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [showCoverWarningModal, setShowCoverWarningModal] = useState(false)

  const { brandPersonality, targetAudience, coverImage } = brandData
  const safeCurrentStep = Math.max(currentStep, 1)
  const safeTotalSteps = totalSteps > 0 ? totalSteps : safeCurrentStep
  const { locale } = useLanguage()
  const t = useTranslations()
  const stepIndicator = t('onboarding.stepIndicator', { current: safeCurrentStep, total: safeTotalSteps })
  const personalities = useMemo(
    () =>
      personalityConfigs.map((config) => ({
        value: config.value,
        label: t(`onboarding.step4.personalities.${config.value}.label`),
        description: t(`onboarding.step4.personalities.${config.value}.description`),
        tone: t(`onboarding.step4.personalities.${config.value}.tone`),
      })),
    [t]
  )
  const audiences = useMemo(
    () =>
      audienceConfigs.map((config) => ({
        value: config.value,
        label: t(`onboarding.step4.audiences.${config.value}.label`),
        focus: t(`onboarding.step4.audiences.${config.value}.focus`),
      })),
    [t]
  )
  const curatedGalleries = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(curatedGalleryConfigs).map(([key, images]) => [
          key,
          images.map((image) => ({
            url: image.url,
            title: t(`onboarding.step4.galleries.${key}.${image.id}.title`),
            vibe: t(`onboarding.step4.galleries.${key}.${image.id}.vibe`),
          })),
        ])
      ),
    [t]
  )
  const personalityByValue = useMemo(
    () => Object.fromEntries(personalities.map((item) => [item.value, item])),
    [personalities]
  )
  const audienceByValue = useMemo(
    () => Object.fromEntries(audiences.map((item) => [item.value, item])),
    [audiences]
  )

  const selectedPersonality = useMemo(
    () => (brandPersonality ? personalityByValue[brandPersonality] : undefined),
    [brandPersonality, personalityByValue]
  )

  const selectedAudience = useMemo(
    () => (targetAudience ? audienceByValue[targetAudience] : undefined),
    [audienceByValue, targetAudience]
  )

  const curatedSuggestions = useMemo(() => {
    if (!brandPersonality) return []
    const base = curatedGalleries[brandPersonality] ?? []
    if (!selectedAudience?.focus) {
      return base
    }
    return base.map((item) => ({
      ...item,
      vibe: t('onboarding.step4.curated.vibeWithAudience', {
        vibe: item.vibe,
        audience: selectedAudience.focus.toLocaleLowerCase(locale),
      }),
    }))
  }, [brandPersonality, curatedGalleries, locale, selectedAudience, t])

  const curatedUrls = useMemo(
    () => curatedSuggestions.map((item) => item.url),
    [curatedSuggestions]
  )

  const validateImageUrl = (url: string): boolean => {
    if (!url) return true
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }

  const handleSelectImage = (imageUrl: string) => {
    setCustomImageUrl('')
    setIsValidUrl(true)
    updateBrandData({ coverImage: imageUrl })
  }

  const handleCustomUrlChange = (url: string) => {
    setCustomImageUrl(url)
    const valid = validateImageUrl(url)
    setIsValidUrl(valid)
    
    if (valid && url.trim()) {
      updateBrandData({ coverImage: url.trim() })
    }
  }

  const searchImages = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch('/api/ai/search-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          personality: brandPersonality,
          targetAudience: targetAudience
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('📥 Search results received:', {
          source: data.source,
          total: data.total,
          imagesCount: data.images?.length || 0,
          query: data.query
        })
        
        const images = data.images || []
        console.log('🖼️ Setting search results:', images.length, 'images')
        
        setSearchResults(images)
        setShowSearchResults(true)
        
        if (images.length === 0) {
          console.warn('⚠️ No images returned from API')
        }
      } else {
        const error = await response.json()
        console.error('❌ Search error:', error)
        alert(error.error || t('onboarding.step4.errors.search'))
      }
    } catch (error) {
      console.error('Error searching images:', error)
      alert(t('onboarding.step4.errors.search'))
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchImageSelect = async (image: { url: string; downloadLocation?: string; id?: string }) => {
    // Déclencher le download Unsplash si disponible
    if (image.downloadLocation) {
      try {
        await fetch('/api/unsplash/trigger-download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ downloadLocation: image.downloadLocation })
        })
      } catch (error) {
        console.error('Error triggering Unsplash download:', error)
        // On continue même si le download trigger échoue
      }
    }

    updateBrandData({ coverImage: image.url })
    setShowSearchResults(false)
    setSearchQuery('')
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowSearchResults(false)
  }

  const handleFinish = () => {
    // Vérifier si l'image de couverture n'est pas définie
    if (!coverImage || coverImage.trim().length === 0) {
      setShowCoverWarningModal(true)
      return
    }
    onNext()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Vérifier que c'est une image
    if (!file.type.startsWith('image/')) {
      alert(t('onboarding.step4.upload.invalidType') || 'Veuillez sélectionner une image')
      return
    }

    // Vérifier la taille (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert(t('onboarding.step4.upload.tooLarge') || 'L\'image est trop grande (max 10MB)')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setUploadedImage(dataUrl)
      setCustomImageUrl('')
      setIsValidUrl(true)
      updateBrandData({ coverImage: dataUrl })
    }
    reader.onerror = () => {
      alert(t('onboarding.step4.upload.error') || 'Erreur lors du chargement de l\'image')
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (!coverImage) {
      setCustomImageUrl('')
      setIsValidUrl(true)
      return
    }

    const trimmed = coverImage.trim()
    if (curatedUrls.includes(trimmed)) {
      setCustomImageUrl('')
      setIsValidUrl(true)
      return
    }

    setCustomImageUrl(trimmed)
    setIsValidUrl(validateImageUrl(trimmed))
  }, [coverImage, curatedUrls])

  return (
    <div className="fixed inset-0 flex flex-col md:flex-row">
      {/* Image gauche - 1/4 */}
      <div className="hidden md:block md:w-1/4 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1575041051612-323e644ca1b8?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Typography"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Logo Guidiqo sur l'image */}
        <div className="absolute top-6 left-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            Guidiqo
          </motion.div>
        </div>
        
        {/* Liquid Glass Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="flex-1 md:w-3/4 overflow-y-auto bg-white dark:bg-black">
        <div className="min-h-screen pt-24 pb-32 px-6 sm:px-12 md:px-16 lg:px-24">
          <div className="max-w-3xl">
            <div className="flex items-baseline justify-between gap-4 mb-6">
              <h2 className="text-4xl sm:text-5xl font-bold text-black dark:text-white">
                {t('onboarding.step4.title')}
              </h2>
              <span className="text-gray-400 text-lg">{stepIndicator}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-12">
              {t('onboarding.step4.subtitle')}
            </p>

            <div className="space-y-10">
              <section>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4">
                  {t('onboarding.step4.sections.personality.title')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {personalities.map((personality) => (
                    <motion.button
                      key={personality.value}
                      onClick={() => updateBrandData({ brandPersonality: personality.value })}
                      className={`p-4 rounded-xl border transition-all text-center ${
                        brandPersonality === personality.value
                          ? 'border-black bg-gray-50 shadow-sm'
                          : 'border-gray-200 dark:border-white/15 hover:border-gray-300 dark:hover:border-white/25'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <p className="font-semibold text-black dark:text-white text-sm">{personality.label}</p>
                        {brandPersonality === personality.value && (
                          <div className="w-2 h-2 bg-black rounded-full shrink-0" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4">
                  {t('onboarding.step4.sections.audience.title')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {audiences.map((audience) => (
                    <motion.button
                      key={audience.value}
                      onClick={() => updateBrandData({ targetAudience: audience.value })}
                      className={`p-4 rounded-xl border transition-all text-center ${
                        targetAudience === audience.value
                          ? 'border-black bg-gray-50 shadow-sm'
                          : 'border-gray-200 dark:border-white/15 hover:border-gray-300 dark:hover:border-white/25'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <p className="font-semibold text-black dark:text-white text-sm">{audience.label}</p>
                        {targetAudience === audience.value && (
                          <div className="w-2 h-2 bg-black rounded-full shrink-0" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4">
                  {t('onboarding.step4.sections.cover.title')}
                </h3>

                {/* 1. Recherche par mots-clés */}
                <div className="mb-8 hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {t('onboarding.step4.search.heading')}
                    </h4>
                    {showSearchResults && (
                      <motion.button
                        onClick={clearSearch}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {t('onboarding.step4.search.clear')}
                      </motion.button>
                    )}
                  </div>
                  
                  <div className="flex gap-3 mb-4">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchImages()}
                        placeholder={t('onboarding.step4.search.placeholder')}
                        className="w-full px-4 py-3 bg-white dark:bg-black border border-gray-200 dark:border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-black dark:text-white placeholder-gray-400 text-sm"
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <motion.button
                      onClick={searchImages}
                      disabled={isSearching || !searchQuery.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all disabled:cursor-not-allowed flex items-center gap-2"
                      whileHover={{ scale: isSearching ? 1 : 1.05 }}
                      whileTap={{ scale: isSearching ? 1 : 0.95 }}
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t('onboarding.step4.search.loading')}
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          {t('onboarding.step4.search.button')}
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Search results */}
                  {showSearchResults && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {`${searchResults.length} ${
                              searchResults.length === 1
                                ? t('onboarding.step4.search.resultsSingular')
                                : t('onboarding.step4.search.resultsPlural')
                            }`}
                          </p>
                          <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                            Unsplash
                          </span>
                        </div>
                        <motion.button
                          onClick={() => searchImages()}
                          disabled={isSearching}
                          className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                          whileHover={{ scale: isSearching ? 1 : 1.05 }}
                        >
                          <RefreshCw className={`w-3 h-3 ${isSearching ? 'animate-spin' : ''}`} />
                          {t('onboarding.step4.search.refresh')}
                        </motion.button>
                      </div>

                      {searchResults.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {searchResults.map((image, index) => (
                            <motion.div
                              key={`search-${image.url}-${index}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="group"
                            >
                              <motion.button
                                onClick={() => handleSearchImageSelect(image)}
                                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all w-full ${
                                  coverImage === image.url
                                    ? 'border-red-500 shadow-xl ring-2 ring-red-500 ring-offset-2'
                                    : 'border-gray-200 dark:border-white/20 hover:border-red-300 dark:hover:border-red-500 hover:shadow-lg'
                                }`}
                                whileHover={{ scale: coverImage === image.url ? 1.02 : 1.05 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Image
                                  src={image.url}
                                  alt={image.title || 'Search result'}
                                  fill
                                  sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                                
                                {coverImage === image.url ? (
                                  <>
                                    <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center backdrop-blur-[2px]">
                                      <div className="bg-white dark:bg-black rounded-full p-2 shadow-xl">
                                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                    {/* Attribution pour l'image sélectionnée */}
                                    {image.photographer && (
                                      <div className="absolute inset-x-2 bottom-2">
                                        <div className="bg-white/95 dark:bg-black/95 backdrop-blur-sm rounded-md px-2 py-1.5 text-left">
                                          <p className="text-[9px] text-gray-500 dark:text-gray-500 leading-tight">
                                            Photo par{' '}
                                            <a 
                                              href={image.photographer.url || image.photographerUrl || `https://unsplash.com/@${image.photographer.username || ''}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="underline hover:text-gray-700 dark:hover:text-gray-300"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              {image.photographer.name}
                                            </a>
                                            {' '}sur{' '}
                                            <a 
                                              href={image.unsplashUrl || 'https://unsplash.com'}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="underline hover:text-gray-700 dark:hover:text-gray-300"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              Unsplash
                                            </a>
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute inset-x-2 bottom-2">
                                      <div className="bg-white/95 dark:bg-black/95 backdrop-blur-sm rounded-md px-2 py-1.5 text-left">
                                        {image.title && (
                                          <p className="font-medium text-gray-900 dark:text-white text-xs truncate mb-0.5">
                                            {image.title}
                                          </p>
                                        )}
                                        {image.vibe && (
                                          <p className="text-[10px] text-gray-600 dark:text-gray-400 line-clamp-2 leading-tight mb-1">
                                            {image.vibe}
                                          </p>
                                        )}
                                        {/* Attribution Unsplash */}
                                        {image.photographer && (
                                          <p className="text-[9px] text-gray-500 dark:text-gray-500 leading-tight">
                                            Photo par{' '}
                                            <a 
                                              href={image.photographer.url || image.photographerUrl || `https://unsplash.com/@${image.photographer.username || ''}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="underline hover:text-gray-700 dark:hover:text-gray-300"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              {image.photographer.name}
                                            </a>
                                            {' '}sur{' '}
                                            <a 
                                              href={image.unsplashUrl || 'https://unsplash.com'}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="underline hover:text-gray-700 dark:hover:text-gray-300"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              Unsplash
                                            </a>
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </motion.button>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="border border-dashed border-gray-300 dark:border-white/20 rounded-xl p-8 text-center text-sm text-gray-500">
                          {t('onboarding.step4.search.noResults', { query: searchQuery })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* 2. URL personnalisée */}
                <div>
                  <label htmlFor="customImageUrl" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    {t('onboarding.step4.urlLabel')}
                  </label>
                    <div className="relative">
                      <input
                        type="url"
                        id="customImageUrl"
                        value={customImageUrl}
                        onChange={(e) => handleCustomUrlChange(e.target.value)}
                        placeholder={t('onboarding.step4.urlPlaceholder')}
                        className={`w-full px-6 py-4 bg-white dark:bg-black border rounded-2xl focus:outline-none focus:ring-2 transition-all ${
                          !isValidUrl 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-200 dark:border-white/15 focus:ring-black focus:border-transparent'
                        } text-black dark:text-white placeholder-gray-400 text-sm`}
                      />
                      {customImageUrl && (
                        <button
                          onClick={() => {
                            setCustomImageUrl('')
                            setIsValidUrl(true)
                          if (coverImage === customImageUrl.trim()) {
                              updateBrandData({ coverImage: undefined })
                            }
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label={t('onboarding.step4.urlClear')}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    {!isValidUrl && customImageUrl && (
                      <p className="mt-2 text-sm text-red-600">
                        {t('onboarding.step4.invalidUrl')}
                      </p>
                    )}
                    {isValidUrl && customImageUrl && (
                      <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {t('onboarding.step4.customSelected')}
                      </p>
                    )}
                  </div>
              </section>
            </div>

            {(brandPersonality || targetAudience) && (
              <div className="mt-12 grid gap-6 md:grid-cols-2">
                <div className="relative rounded-2xl border border-gray-200 dark:border-white/20 bg-gray-50/80 dark:bg-white/[0.04] p-6 overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="relative z-10 space-y-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {t('onboarding.step4.summaryTitle')}
                    </p>
                    <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {t('onboarding.step4.summary.personality')}
                        </p>
                        <p>{selectedPersonality?.label || '—'}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {t('onboarding.step4.summary.audience')}
                        </p>
                        <p>{selectedAudience?.label || '—'}</p>
                    </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {t('onboarding.step4.summary.cover')}
                        </p>
                        <p className={coverImage ? 'text-green-600 font-semibold' : ''}>
                          {coverImage
                            ? t('onboarding.step4.summary.coverSelected')
                            : t('onboarding.step4.summary.coverAuto')}
                        </p>
                    </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 dark:border-white/20 p-6 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {t('onboarding.step4.tips.title')}
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>{t('onboarding.step4.tips.items.adjust')}</li>
                    <li>{t('onboarding.step4.tips.items.coverQuality')}</li>
                    <li>{t('onboarding.step4.tips.items.clarity')}</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4 mt-12 pb-12">
              <motion.button
                onClick={onPrevious}
                className="relative overflow-hidden px-6 py-3 rounded-full border border-gray-300 dark:border-white/30 hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">{t('actions.previous')}</span>
              </motion.button>

              <motion.button
                onClick={handleFinish}
                disabled={!brandPersonality || !targetAudience}
                className="relative overflow-hidden px-8 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: brandPersonality && targetAudience ? 1.02 : 1 }}
                whileTap={{ scale: brandPersonality && targetAudience ? 0.98 : 1 }}
              >
                <span className="relative z-10 text-white dark:text-black">{t('actions.finish')}</span>
              </motion.button>
            </div>
            </div>
        </div>
        <Footer hideLinks={true} />
      </div>

      {/* Modal d'avertissement pour l'image de couverture manquante */}
      <AnimatePresence>
        {showCoverWarningModal && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
              onClick={() => setShowCoverWarningModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-black rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
                <div className="text-center">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mb-6"
                  >
                    <span className="text-3xl">⚠️</span>
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-3">
                    Image de couverture requise
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                    Vous devez sélectionner une image de couverture avant de continuer.<br /><br />
                    Vous pouvez coller l&apos;URL de votre propre image dans le champ prévu à cet effet.
                  </p>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      onClick={() => setShowCoverWarningModal(false)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full font-semibold transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Ajouter une image
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
