'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Palette, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { LiquidButton } from '@/components/LiquidGlassButton'

interface User {
  id: string
  name: string | null
  email: string
  profileImage: string | null
  isVerified: boolean
}

interface Brand {
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
  user: User
}

export default function CreateurPage() {
  const params = useParams()
  const router = useRouter()
  const [creator, setCreator] = useState<User | null>(null)
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredColor, setHoveredColor] = useState<string | null>(null)

  const userId = params.userId as string

  useEffect(() => {
    fetchCreatorData()
  }, [userId])

  const fetchCreatorData = async () => {
    try {
     
      
      // Récupérer les données du créateur
      const userResponse = await fetch(`/api/users/${userId}`, {
        cache: 'no-store'
      })
      
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setCreator(userData)
        console.log('✅ Créateur chargé:', userData)
      }

      // Récupérer les brands du créateur
      const brandsResponse = await fetch(`/api/user/${userId}/brands`, {
        cache: 'no-store'
      })
      
      if (brandsResponse.ok) {
        const brandsData = await brandsResponse.json()
        console.log(`✅ ${brandsData.length} créations publiques chargées pour l'utilisateur ${userId}`)
        setBrands(brandsData)
      }
    } catch (error) {
      console.error('❌ Error fetching creator data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center pt-32 px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-2">
              Oops ! Nous ne le trouvons pas...
            </h1>
            <h2 className="text-gray-600 mb-6 text-2xl">
              Ce créateur n&apos;existe pas ou n&apos;est plus disponible.
            </h2>
            <button
              onClick={() => router.push('/bibliotheque')}
              className="px-6 py-3 bg-black mb-8 text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              Retour à la bibliothèque
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Header />

      {/* Hero Section with Creator Info */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Creator Header */}
          {creator && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-16 md:mb-24"
            >
              <div className="flex flex-col items-center text-center mb-8">
                {/* Avatar */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-stone-900 to-gray-800 flex items-center justify-center mb-6 shadow-2xl overflow-hidden"
                >
                  {creator.profileImage ? (
                    <img
                      src={creator.profileImage}
                      alt={creator.name || ''}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-3xl md:text-4xl font-bold">
                      {(creator.name || creator.email).substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </motion.div>

                {/* Creator Name */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  <motion.h1
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-black"
                    style={{ fontFamily: "'Raleway', sans-serif" }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    {creator.name || creator.email.split('@')[0]}
                  </motion.h1>
                  {creator.isVerified && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, delay: 0.5, type: "spring" }}
                      className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://e7msojy1cjnzyvsj.public.blob.vercel-storage.com/images/1759665603040-verified-badge-profile-icon-png.webp"
                        alt="Verified"
                        className="w-full h-full"
                      />
                    </motion.div>
                  )}
                </div>

                <motion.p
                  className="text-lg md:text-xl text-gray-600 max-w-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {brands.length} création{brands.length > 1 ? 's' : ''} publique{brands.length > 1 ? 's' : ''}
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* Brands Grid */}
          {brands.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center py-12 sm:py-20 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100"
            >
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-900/10 to-red-900/10 blur-2xl rounded-full" />
                <Palette className="relative w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                Aucune création publique
              </h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base max-w-md mx-auto px-4">
                Ce créateur n&apos;a pas encore de créations publiques à afficher
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-12 gap-3 sm:gap-4 md:gap-6">
              {brands.map((brand, index) => {
                const gradient = `linear-gradient(135deg, ${brand.primaryColor || '#000'}, ${brand.secondaryColor || '#333'})`
                
                // Mobile: 1/2 ou full, Desktop: proportions variées
                const getColumnSpan = (index: number) => {
                  if (index === 0) return 'col-span-12 md:col-span-9'
                  if (index === 1) return 'col-span-6 md:col-span-3'
                  if (index === 2) return 'col-span-6'
                  if (index === 3) return 'col-span-6'
                  if (index === 4) return 'col-span-12 md:col-span-8'
                  return 'col-span-6 md:col-span-4'
                }

                return (
                  <motion.div
                    key={brand.id}
                    className={`group cursor-pointer ${getColumnSpan(index)}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    onClick={() => {
                      router.push(`/brand/${brand.id}`)
                    }}
                    whileHover={{ y: -5 }}
                  >
                    <div 
                      className="relative w-full h-64 sm:h-72 md:h-80 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200"
                      style={{ background: gradient }}
                    >
                      {/* Image de fond */}
                      {brand.coverImage ? (
                        <img
                          src={brand.coverImage}
                          alt={brand.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/60" />
                      )}

                      {/* Bandes de couleurs verticales */}
                      <div className="absolute left-0 top-0 bottom-0 flex flex-row gap-0 z-30 opacity-100 transition-opacity duration-300">
                        {[
                          { color: brand.primaryColor, name: 'Principale' },
                          { color: brand.secondaryColor, name: 'Secondaire' },
                          { color: brand.accentColor, name: 'Accent' }
                        ]
                          .filter(item => item.color)
                          .map((item, idx) => {
                            const colorKey = `${brand.id}-${idx}`
                            const isHovered = hoveredColor === colorKey
                            
                            return (
                              <motion.div
                                key={idx}
                                className="relative h-full cursor-pointer overflow-hidden"
                                animate={{ 
                                  width: isHovered ? '100px' : '30px'
                                }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                style={{ backgroundColor: item.color! }}
                                onClick={(e) => e.stopPropagation()}
                                onMouseEnter={() => setHoveredColor(colorKey)}
                                onMouseLeave={() => setHoveredColor(null)}
                              >
                                <motion.div 
                                  className="absolute inset-0 flex flex-col items-center justify-center py-3 px-2"
                                  animate={{ opacity: isHovered ? 1 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <p className="text-[11px] font-bold text-white uppercase tracking-wider mb-1 whitespace-nowrap drop-shadow-md">
                                    {item.name}
                                  </p>
                                  <p className="text-xs font-mono text-white/95 whitespace-nowrap drop-shadow-md">
                                    {item.color}
                                  </p>
                                </motion.div>
                              </motion.div>
                            )
                          })}
                      </div>
                      
                      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10' />
                      
                      <div className='absolute inset-0 flex items-end justify-end p-3 sm:p-4 md:p-6 z-20 pointer-events-none'>
                        <LiquidButton className='opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto'>
                          {brand.name}
                        </LiquidButton>
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

