'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Footer from '@/components/Footer'
import { useState, useEffect } from 'react'
import { Loader2, RefreshCw, X } from 'lucide-react'

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
  const [customImageUrl, setCustomImageUrl] = useState('')
  const [isValidUrl, setIsValidUrl] = useState(true)

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
      // Utiliser la DESCRIPTION COMPLÈTE comme base principale
      const projectDescription = brandData.description || brandData.name || brandData.prompt || ''
      const projectName = brandData.name || ''

      // Mapping subtil des personnalités (termes minimalistes)
      const personalityVisuals: {[key: string]: string} = {
        'professionnel': 'professional',
        'moderne': 'modern',
        'amical': 'friendly',
        'luxe': 'luxury elegant',
        'dynamique': 'dynamic',
        'minimaliste': 'minimal clean'
      }

      const personalityTerm = personalityVisuals[brandData.brandPersonality || ''] || ''

      // LES 3 REQUÊTES SE CONCENTRENT SUR LE PROJET LUI-MÊME
      const queries = [
        // Requête 1 : Description COMPLÈTE + personnalité
        `${projectDescription} ${personalityTerm}`.trim(),
        // Requête 2 : Nom du projet + description abrégée
        `${projectName} ${projectDescription.split(' ').slice(0, 5).join(' ')}`.trim(),
        // Requête 3 : Termes principaux du projet
        `${projectDescription.split(' ').slice(0, 4).join(' ')} ${personalityTerm}`.trim()
      ]

      const imagePromises = queries.map(async (query, index) => {
        // Ne pas faire de requête vide
        if (!query || query.length < 3) {
          return null
        }

        try {
          const response = await fetch('/api/get-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              query,
              seed: `${Date.now()}-${index}-${imageGeneration}-${Math.random()}`,
              provider: 'pexels',
              perPage: 25,
              page: Math.floor(Math.random() * 4) + 1
            })
          })

          if (response.ok) {
            const data = await response.json()
            const imageUrl = data.image?.url || data.imageUrl
            return imageUrl || null
          }
        } catch (error) {
          console.error(`❌ Erreur image ${index + 1}:`, error)
        }
        return null
      })

      const images = await Promise.all(imagePromises)
      const validImages = images.filter(Boolean) as string[]
      
      // S'assurer qu'on a au moins 3 images
      if (validImages.length < 3) {
        const additionalQueries = [
          // Encore plus centré sur le projet
          projectDescription,
          `${projectName} brand`,
          projectDescription.split(' ').slice(0, 3).join(' ')
        ]
        
        for (let i = validImages.length; i < 3; i++) {
          const query = additionalQueries[i] || projectDescription
          if (!query || query.length < 3) continue

          try {
            const response = await fetch('/api/get-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                query,
                seed: `additional-${Date.now()}-${i}-${Math.random()}`,
                provider: 'pexels',
                perPage: 20,
                page: Math.floor(Math.random() * 3) + 1
              })
            })
            
            if (response.ok) {
              const data = await response.json()
              const imageUrl = data.image?.url || data.imageUrl
              if (imageUrl && !validImages.includes(imageUrl)) {
                validImages.push(imageUrl)
              }
            }
          } catch (error) {
            console.error('❌ Erreur image complémentaire:', error)
          }
        }
      }
      
      setSuggestedImages(validImages)
    } catch (error) {
      console.error('❌ Erreur génération:', error)
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

  const validateImageUrl = (url: string): boolean => {
    if (!url) return true // Empty is valid
    try {
      const urlObj = new URL(url)
      // Vérifier que c'est une URL http/https
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }

  const handleCustomUrlChange = (url: string) => {
    setCustomImageUrl(url)
    const valid = validateImageUrl(url)
    setIsValidUrl(valid)
    
    // Si l'URL est valide et non vide, l'appliquer
    if (valid && url.trim()) {
      updateBrandData({ coverImage: url.trim() })
    }
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

      {/* Contenu droite - 3/4 */}
      <div className="flex-1 md:w-3/4 overflow-y-auto bg-white dark:bg-black">
        
        <div className="min-h-screen pt-32 pb-32 px-6 sm:px-12 md:px-16 lg:px-24">
          <div className="max-w-3xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-4">
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
                          : 'border-gray dark:border-white/20-200 hover:border-gray dark:border-white/20-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-black dark:text-white">{personality.label}</p>
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
                          : 'border-gray dark:border-white/20-200 hover:border-gray dark:border-white/20-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-black dark:text-white text-sm">{audience.label}</p>
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
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Image de couverture <span className="text-gray-400 font-normal">(optionnel)</span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Choisissez une image ou laissez vide pour un design généré
                      </p>
                    </div>
                    {suggestedImages.length > 0 && (
                      <motion.button
                        onClick={handleRefreshImages}
                        disabled={loadingImages}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white dark:bg-black border border-gray dark:border-white/20-300 rounded-full hover:bg-gray-50 disabled:opacity-50 transition-all"
                        whileHover={{ scale: loadingImages ? 1 : 1.05 }}
                        whileTap={{ scale: loadingImages ? 1 : 0.95 }}
                      >
                        <RefreshCw className={`w-4 h-4 ${loadingImages ? 'animate-spin' : ''}`} />
                        Autres suggestions
                      </motion.button>
                    )}
                  </div>

                  {loadingImages ? (
                    <div className="flex items-center justify-center py-16 border border-gray dark:border-white/20-200 rounded-2xl bg-gradient-to-br from-gray-50 to-white">
                      <div className="text-center">
                        <Loader2 className="w-10 h-10 text-gray-400 animate-spin mx-auto mb-4" />
                        <p className="text-sm font-medium text-gray-700">Recherche d&apos;images de qualité...</p>
                        <p className="text-xs text-gray-500 mt-1">Personnalisées pour votre projet</p>
                      </div>
                    </div>
                  ) : suggestedImages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {suggestedImages.map((imageUrl, index) => (
                        <motion.div
                          key={`${imageUrl}-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <motion.button
                            onClick={() => handleSelectImage(imageUrl)}
                            className={`relative aspect-video rounded-2xl overflow-hidden border-4 transition-all w-full ${
                              brandData.coverImage === imageUrl
                                ? 'border-black shadow-xl ring-2 ring-black ring-offset-2'
                                : 'border-gray dark:border-white/20-200 hover:border-gray dark:border-white/20-400 hover:shadow-lg'
                            }`}
                            whileHover={{ scale: brandData.coverImage === imageUrl ? 1.02 : 1.03 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Image
                              src={imageUrl}
                              alt={`Suggestion ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                            
                            {brandData.coverImage === imageUrl ? (
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[2px]">
                                <div className="bg-white dark:bg-black rounded-full p-3 shadow-xl">
                                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="absolute bottom-3 right-3 px-3 py-1 bg-white dark:bg-black/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                                {index + 1}
                              </div>
                            )}
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  ) : null}

                  {/* Champ URL personnalisée */}
                  <div className="mt-6">
                    <label htmlFor="customImageUrl" className="block text-sm font-medium text-gray-900 mb-3">
                      Ou collez l&apos;URL de votre propre image
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        id="customImageUrl"
                        value={customImageUrl}
                        onChange={(e) => handleCustomUrlChange(e.target.value)}
                        placeholder="https://exemple.com/mon-image.jpg"
                        className={`w-full px-6 py-4 bg-white dark:bg-black border rounded-2xl focus:outline-none focus:ring-2 transition-all ${
                          !isValidUrl 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray dark:border-white/20-200 focus:ring-black focus:border-transparent'
                        } text-black dark:text-white placeholder-gray-400 text-sm`}
                      />
                      {customImageUrl && (
                        <button
                          onClick={() => {
                            setCustomImageUrl('')
                            setIsValidUrl(true)
                            if (brandData.coverImage === customImageUrl.trim()) {
                              updateBrandData({ coverImage: undefined })
                            }
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    {!isValidUrl && customImageUrl && (
                      <p className="mt-2 text-sm text-red-600">
                        Veuillez entrer une URL valide (http:// ou https://)
                      </p>
                    )}
                    {isValidUrl && customImageUrl && (
                      <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Image personnalisée sélectionnée
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {brandData.brandPersonality && brandData.targetAudience && (
              <div className="mt-12 relative rounded-2xl p-8 overflow-hidden border border-gray dark:border-white/20-200 bg-gray-50">
                <div className="absolute inset-0 bg-white dark:bg-black/40" />
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
                      <span className="text-lg text-black dark:text-white">
                        {personalities.find(p => p.value === brandData.brandPersonality)?.label}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-sm font-medium text-gray-900 min-w-[100px]">Audience</span>
                      <span className="text-lg text-black dark:text-white">
                        {audiences.find(a => a.value === brandData.targetAudience)?.label}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-sm font-medium text-gray-900 min-w-[100px]">Couverture</span>
                      <span className={`text-sm font-medium ${brandData.coverImage ? 'text-green-600' : 'text-gray-500'}`}>
                        {brandData.coverImage ? 'Sélectionnée' : 'Design automatique'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-end gap-4 mt-12 pb-12">
              <motion.button
                onClick={onPrevious}
                className="relative overflow-hidden px-6 py-3 rounded-full border border-gray dark:border-white/20-300 hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-white dark:bg-black/10" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative z-10">Précédent</span>
              </motion.button>

              <motion.button
                onClick={onNext}
                disabled={!brandData.brandPersonality || !brandData.targetAudience}
                className="relative overflow-hidden px-8 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: brandData.brandPersonality && brandData.targetAudience ? 1.02 : 1 }}
                whileTap={{ scale: brandData.brandPersonality && brandData.targetAudience ? 0.98 : 1 }}
              >
                <div className="absolute inset-0 bg-white dark:bg-black/10" />
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
