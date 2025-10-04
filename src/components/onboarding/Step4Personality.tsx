'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Footer from '@/components/Footer'
import { useState, useEffect } from 'react'
import { Loader2, RefreshCw } from 'lucide-react'

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

const personalities = [
  { value: 'professionnel', label: 'Professionnel', description: 'Sérieux et fiable' },
  { value: 'moderne', label: 'Moderne', description: 'Innovant et tendance' },
  { value: 'amical', label: 'Amical', description: 'Accessible et chaleureux' },
  { value: 'luxe', label: 'Luxe', description: 'Élégant et premium' },
  { value: 'dynamique', label: 'Dynamique', description: 'Énergique et actif' },
  { value: 'minimaliste', label: 'Minimaliste', description: 'Épuré et simple' },
]

const audiences = [
  { value: 'b2b', label: 'Entreprises (B2B)' },
  { value: 'b2c', label: 'Consommateurs (B2C)' },
  { value: 'jeunes', label: 'Jeunes 18-30 ans' },
  { value: 'professionnels', label: 'Professionnels' },
  { value: 'creatifs', label: 'Créatifs' },
  { value: 'tech', label: 'Tech-savvy' },
]

export default function Step4Personality({ brandData, updateBrandData, currentStep, totalSteps, onNext, onPrevious }: Step4Props) {
  const [suggestedImages, setSuggestedImages] = useState<string[]>([])
  const [loadingImages, setLoadingImages] = useState(false)
  const [imageGeneration, setImageGeneration] = useState(0)

  // Générer les images suggérées quand brandPersonality et targetAudience sont sélectionnés
  useEffect(() => {
    if (brandData.brandPersonality && brandData.targetAudience && !brandData.coverImage) {
      generateImageSuggestions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandData.brandPersonality, brandData.targetAudience, brandData.coverImage])

  const generateImageSuggestions = async () => {
    setLoadingImages(true)
    try {
      const searchTerms = [
        brandData.description || brandData.name || brandData.prompt,
        brandData.brandPersonality,
        brandData.targetAudience
      ].filter(Boolean).join(' ')

      const queries = [
        `${searchTerms} business brand professional`,
        `${searchTerms} ${brandData.brandPersonality} modern`,
        `${searchTerms} workspace design studio`
      ]

      const imagePromises = queries.map(async (query, index) => {
        try {
          const response = await fetch('/api/get-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              query,
              seed: `${Date.now()}-${index}-${imageGeneration}`,
              provider: 'pexels',
              perPage: 15,
              page: Math.floor(Math.random() * 3) + 1
            })
          })

          if (response.ok) {
            const data = await response.json()
            return data.image?.url || data.imageUrl || null
          }
        } catch (error) {
          console.error(`Erreur lors de la récupération de l'image ${index + 1}:`, error)
        }
        return null
      })

      const images = await Promise.all(imagePromises)
      setSuggestedImages(images.filter(Boolean) as string[])
    } catch (error) {
      console.error('Erreur lors de la génération des suggestions d\'images:', error)
    } finally {
      setLoadingImages(false)
    }
  }

  const handleRefreshImages = () => {
    setImageGeneration(prev => prev + 1)
    generateImageSuggestions()
  }

  const handleSelectImage = (imageUrl: string) => {
    updateBrandData({ coverImage: imageUrl })
  }

  return (
    <div className="fixed inset-0 flex flex-col md:flex-row">
      {/* Image gauche - 1/4 */}
      <div className="hidden md:block md:w-1/4 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1575041051612-323e644ca1b8?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Brand Personality"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Liquid Glass Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Contenu droite - 3/4 */}
      <div className="flex-1 md:w-3/4 overflow-y-auto bg-white">
        {/* Logo Guidiqo */}
        <div className="absolute top-6 left-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-bold text-white"
          >
            Guidiqo
          </motion.div>
        </div>
        
        <div className="min-h-screen pt-32 pb-32 px-6 sm:px-12 md:px-16 lg:px-24">
          <div className="max-w-3xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4">
              Personnalité <span className="text-gray-400 text-2xl sm:text-3xl">4/4</span>
            </h2>
            <p className="text-gray-600 text-lg mb-12">
              Définissez le caractère et l&apos;audience de votre marque
            </p>

            <div className="space-y-10">
              {/* Personnalité */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Personnalité de la marque
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {personalities.map((personality) => (
                    <motion.button
                      key={personality.value}
                      onClick={() => updateBrandData({ brandPersonality: personality.value })}
                      className={`p-5 rounded-2xl border transition-all text-left ${
                        brandData.brandPersonality === personality.value
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-black">{personality.label}</p>
                        {brandData.brandPersonality === personality.value && (
                          <div className="w-2 h-2 bg-black rounded-full" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{personality.description}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Audience cible */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Audience cible
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {audiences.map((audience) => (
                    <motion.button
                      key={audience.value}
                      onClick={() => updateBrandData({ targetAudience: audience.value })}
                      className={`p-5 rounded-2xl border transition-all ${
                        brandData.targetAudience === audience.value
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-black text-sm">{audience.label}</p>
                        {brandData.targetAudience === audience.value && (
                          <div className="w-2 h-2 bg-black rounded-full" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Sélection de l'image de couverture */}
              {brandData.brandPersonality && brandData.targetAudience && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      Image de couverture
                    </h3>
                    {suggestedImages.length > 0 && (
                      <motion.button
                        onClick={handleRefreshImages}
                        disabled={loadingImages}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50"
                        whileHover={{ scale: loadingImages ? 1 : 1.05 }}
                        whileTap={{ scale: loadingImages ? 1 : 0.95 }}
                      >
                        <RefreshCw className={`w-4 h-4 ${loadingImages ? 'animate-spin' : ''}`} />
                        Proposer d&apos;autres
                      </motion.button>
                    )}
                  </div>

                  {loadingImages ? (
                    <div className="flex items-center justify-center py-12 border border-gray-200 rounded-2xl bg-gray-50">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
                        <p className="text-sm text-gray-600">Génération des suggestions...</p>
                      </div>
                    </div>
                  ) : suggestedImages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {suggestedImages.map((imageUrl, index) => (
                        <motion.button
                          key={`${imageUrl}-${index}`}
                          onClick={() => handleSelectImage(imageUrl)}
                          className={`relative aspect-video rounded-2xl overflow-hidden border-4 transition-all ${
                            brandData.coverImage === imageUrl
                              ? 'border-black shadow-lg scale-[1.02]'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                          whileHover={{ scale: brandData.coverImage === imageUrl ? 1.02 : 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Image
                            src={imageUrl}
                            alt={`Suggestion ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          {brandData.coverImage === imageUrl && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <div className="bg-white rounded-full p-2">
                                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  ) : null}
                </motion.div>
              )}
            </div>

            {brandData.brandPersonality && brandData.targetAudience && brandData.coverImage && (
              <div className="mt-12 relative rounded-2xl p-8 overflow-hidden border border-gray-200 bg-gray-50">
                <div className="absolute inset-0 bg-white/40" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                <div className="relative z-10">
                  <p className="text-xs font-medium text-gray-500 mb-6 tracking-wide">RÉSUMÉ DE VOTRE MARQUE</p>
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-3">
                      <span className="text-sm font-medium text-gray-900 min-w-[100px]">Personnalité</span>
                      <span className="text-lg text-black">
                        {personalities.find(p => p.value === brandData.brandPersonality)?.label}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-sm font-medium text-gray-900 min-w-[100px]">Audience</span>
                      <span className="text-lg text-black">
                        {audiences.find(a => a.value === brandData.targetAudience)?.label}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-sm font-medium text-gray-900 min-w-[100px]">Couverture</span>
                      <span className="text-sm text-green-600 font-medium">Sélectionnée</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-end gap-4 mt-12 pb-12">
              <motion.button
                onClick={onPrevious}
                className="relative overflow-hidden px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-white/10" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative z-10">Précédent</span>
              </motion.button>

              <motion.button
                onClick={onNext}
                disabled={!brandData.brandPersonality || !brandData.targetAudience || !brandData.coverImage}
                className="relative overflow-hidden px-8 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: brandData.brandPersonality && brandData.targetAudience && brandData.coverImage ? 1.02 : 1 }}
                whileTap={{ scale: brandData.brandPersonality && brandData.targetAudience && brandData.coverImage ? 0.98 : 1 }}
              >
                <div className="absolute inset-0 bg-white/10" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative z-10">Terminer</span>
              </motion.button>
            </div>
            </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
