'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, Eye, Heart, Share2, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { LiquidButton } from '@/components/LiquidGlassButton'

interface LibraryBrand {
  id: string
  name: string
  description: string | null
  primaryColor: string | null
  secondaryColor: string | null
  accentColor: string | null
  primaryFont: string | null
  brandPersonality: string | null
  targetAudience: string | null
  coverImage: string | null
  isCompleted: boolean
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string | null
    email: string
    profileImage: string | null
    isVerified: boolean
  }
}

export default function BibliothequePage() {
  const router = useRouter()
  const [brands, setBrands] = useState<LibraryBrand[]>([])
  const [loading, setLoading] = useState(true)
  const [brandImages, setBrandImages] = useState<{[key: string]: string}>({})

  useEffect(() => {
    fetchLibraryBrands()
  }, [])

  const fetchLibraryBrands = async () => {
    try {
      // Ajouter un timestamp pour éviter le cache du navigateur
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/bibliotheque?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      })
      if (response.ok) {
        const data = await response.json()
        setBrands(data)
        // Ne plus générer d'images automatiquement - utiliser seulement les images fournies
      }
    } catch (error) {
      console.error('❌ Error fetching library brands:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateImagesForBrands = async (brands: LibraryBrand[]) => {
    const newImages: {[key: string]: string} = {}

    // Variétés de mots-clés pour ajouter de la diversité
    const varietyKeywords = [
      'workspace', 'design studio', 'creative office', 'modern business',
      'professional team', 'startup', 'innovation', 'technology',
      'branding', 'marketing', 'contemporary', 'elegant office'
    ]

    await Promise.all(
      brands.map(async (brand, index) => {
        try {
          const searchTerms = [
            brand.description || brand.name,
            brand.brandPersonality,
            brand.targetAudience
          ].filter(Boolean).join(' ')

          // Ajouter un mot-clé de variété basé sur l'index pour garantir la diversité
          const varietyKeyword = varietyKeywords[index % varietyKeywords.length]

          // Utiliser perPage et page pour obtenir différentes images à chaque fois
          const perPage = 15  // Maximum d'images par requête
          const randomPage = Math.floor(Math.random() * 3) + 1  // Page aléatoire entre 1 et 3
          
          // Ajouter un seed unique basé sur l'ID, l'index ET un élément aléatoire
          const response = await fetch('/api/get-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              query: `${searchTerms} ${varietyKeyword} black professional`,
              seed: `${brand.id}-${index}-${Date.now()}`,  // Seed avec timestamp pour éviter le cache
              provider: 'pexels',  // Forcer l'utilisation de Pexels
              perPage: perPage,
              page: randomPage
            })
          })

          if (response.ok) {
            const data = await response.json()
            newImages[brand.id] = data.image?.url || data.imageUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=900&fit=crop'
          }
        } catch (error) {
          console.error(`Error fetching image for brand ${brand.id}:`, error)
          // Fallback vers des images par défaut différentes basées sur l'index
          const fallbackImages = [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=900&fit=crop',
            'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&h=900&fit=crop',
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&h=900&fit=crop',
            'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&h=900&fit=crop',
            'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1600&h=900&fit=crop'
          ]
          newImages[brand.id] = fallbackImages[index % fallbackImages.length]
        }
      })
    )

    setBrandImages(newImages)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black relative overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="pt-36 md:pt-48 pb-12 md:pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 md:mb-24 text-center"
          >
            <motion.h1
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-6 md:mb-8 tracking-tighter text-black dark:text-white"
              style={{ fontFamily: "'Raleway', sans-serif" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Bibliothèque
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Découvrez les créations les plus inspirantes de notre communauté
            </motion.p>
          </motion.div>


          {/* Brands Grid */}
          {brands.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center py-12 sm:py-20 bg-gradient-to-br from-gray-50 to-white dark:from-black dark:to-black rounded-3xl border border-gray-100 dark:border-white/10"
            >
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-900/10 to-red-900/10 dark:from-white/10 dark:to-white/10 blur-2xl rounded-full" />
                <Palette className="relative w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 dark:text-white/60" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                Aucune création pour le moment
              </h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base max-w-md mx-auto px-4">
                La bibliothèque sera bientôt remplie des plus belles créations de notre communauté
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-12 gap-3 sm:gap-4 md:gap-6">
              {brands.map((brand, index) => {
                const gradient = `linear-gradient(135deg, ${brand.primaryColor || '#000'}, ${brand.secondaryColor || '#333'})`
                
                // Définir les proportions pour chaque ligne (comme ExploreSection)
                const getColumnSpan = (index: number) => {
                  const position = index % 5
                  if (position === 0) return 'col-span-9' // Ligne 1: gauche 3/4
                  if (position === 1) return 'col-span-3' // Ligne 1: droite 1/4
                  if (position === 2) return 'col-span-6' // Ligne 2: gauche 1/2
                  if (position === 3) return 'col-span-6' // Ligne 2: droite 1/2
                  if (position === 4) return 'col-span-8' // Ligne 3: gauche 2/3
                  return 'col-span-4' // Ligne 3: droite 1/3
                }

                return (
                  <motion.div
                    key={brand.id}
                    className={`group cursor-pointer ${getColumnSpan(index)}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    onClick={() => router.push(`/brand/${brand.id}`)}
                    whileHover={{ y: -5 }}
                  >
                    {/* Card responsive avec bandes de couleurs */}
                    <div 
                      className="relative w-full h-80 sm:h-72 md:h-80 rounded-2xl overflow-hidden "
                      style={{ background: gradient }}
                    >
                      {/* Image de fond si disponible */}
                      {brand.coverImage ? (
                        <img
                          src={brand.coverImage}
                          alt={brand.name}
                          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/60 dark:from-black/90 dark:to-black/70" />
                      )}

                      {/* Bandes de couleurs - En haut sur mobile, sur le côté gauche sur desktop */}
                      <div className="absolute top-0 left-0 right-0 md:right-auto md:top-1/2 md:-translate-y-1/2 flex md:flex-col gap-0 md:gap-2 z-10">
                        {[
                          { color: brand.primaryColor, label: 'P' },
                          { color: brand.secondaryColor, label: 'S' },
                          { color: brand.accentColor, label: 'A' }
                        ]
                          .filter(item => item.color)
                          .map((item, idx, arr) => (
                            <div
                              key={idx}
                              className="relative group/color cursor-pointer overflow-hidden
                                       flex-1 h-3 md:h-12 md:w-5 md:flex-none
                                       md:rounded-r-lg md:hover:w-44
                                       transition-all duration-300 ease-out"
                              style={{ backgroundColor: item.color! }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Label court visible sur mobile */}
                              <div className="md:hidden absolute inset-0 flex items-center justify-center">
                                <span className="text-[8px] font-bold text-white/70">
                                  {item.label}
                                </span>
                              </div>
                              
                              {/* Contenu complet visible au hover sur desktop */}
                              <div className="hidden md:flex absolute inset-0 flex-col items-center justify-center px-3 opacity-0 group-hover/color:opacity-100 transition-opacity">
                                <p className="text-[10px] font-bold text-white uppercase tracking-wider mb-0.5 whitespace-nowrap drop-shadow-md">
                                  {item.label === 'P' ? 'Principale' : item.label === 'S' ? 'Secondaire' : 'Accent'}
                                </p>
                                <p className="text-xs font-mono text-white/95 whitespace-nowrap drop-shadow-md">
                                  {item.color}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                      
                      {/* Overlay avec informations */}
                      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
                        {/* Header avec author - masqué sur mobile */}
                        <div className="flex items-start justify-between">
                          <motion.div 
                            className="flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-xl bg-white/10 cursor-pointer hover:bg-white/20 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/createur/${brand.user.id}`)
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="relative">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-stone-900 to-gray-800 flex items-center justify-center overflow-hidden">
                                {brand.user.profileImage ? (
                                  <img
                                    src={brand.user.profileImage}
                                    alt={brand.user.name || ''}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-white text-[10px] font-bold">
                                    {(brand.user.name || brand.user.email).substring(0, 2).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              {brand.user.isVerified && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src="https://e7msojy1cjnzyvsj.public.blob.vercel-storage.com/images/1759665603040-verified-badge-profile-icon-png.webp"
                                    alt="Verified"
                                    className="w-full h-full"
                                  />
                                </div>
                              )}
                            </div>
                            <p className="text-xs font-semibold text-white hidden md:flex">
                              {brand.user.name || brand.user.email.split('@')[0]}
                            </p>
                            <ArrowRight className="w-3 h-3 text-white opacity-0 md:opacity-100 transition-opacity" />
                          </motion.div>
                        </div>

                        {/* Center avec nom du brand */}
                        <div className="flex items-center justify-center flex-1">
                          <motion.h3
                            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center drop-shadow-2xl"
                            style={{ fontFamily: brand.primaryFont || "'Raleway', sans-serif" }}
                            whileHover={{ scale: 1.05 }}
                          >
                            {brand.name}
                          </motion.h3>
                        </div>

                        {/* Footer avec bouton */}
                        <div className="flex items-end justify-end">
                          {/* Bouton Voir - Caché par défaut, visible au hover */}
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/brand/${brand.id}`)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-100"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Voir
                            <ArrowRight className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
