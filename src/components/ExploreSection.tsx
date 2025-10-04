'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LiquidButton } from './LiquidGlassButton'

interface SpotlightedBrand {
  id: string
  name: string
  coverImage: string | null
  primaryColor: string | null
  secondaryColor: string | null
  accentColor: string | null
  user: {
    name: string | null
    email: string
  }
}

export default function ExploreSection () {
  const router = useRouter()
  const [brands, setBrands] = useState<SpotlightedBrand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSpotlightedBrands = async () => {
      try {
        const response = await fetch('/api/spotlighted')
        if (response.ok) {
          const data = await response.json()
          setBrands(data)
        }
      } catch (error) {
        console.error('Error fetching spotlighted brands:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSpotlightedBrands()
  }, [])
  return (
    <section className='py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 bg-white'>
      <div className='max-w-7xl mx-auto'>
        <motion.div
          className='text-center mb-12 sm:mb-16'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-black'>
            Explorez et inspirez-vous
          </h2>
          <p className='text-gray-600 text-sm sm:text-base md:text-lg max-w-xl sm:max-w-2xl mx-auto px-4'>
            Découvrez des millions de créations réalisées par notre communauté
            créative. Trouvez l&apos;inspiration pour votre prochaine création.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Aucun brand mis en avant pour le moment
          </div>
        ) : (
          <div className='grid grid-cols-12 gap-3 sm:gap-4 md:gap-6'>
            {brands.map((brand, index) => {
              // Définir les proportions pour chaque ligne
              const getColumnSpan = (index: number) => {
                if (index === 0) return 'col-span-9' // Ligne 1: gauche 3/4, droite 1/4
                if (index === 1) return 'col-span-3'
                if (index === 2) return 'col-span-6' // Ligne 2: gauche 1/2, droite 1/2
                if (index === 3) return 'col-span-6'
                if (index === 4) return 'col-span-8' // Ligne 3: gauche 2/3, droite 1/3
                return 'col-span-4'
              }

              const gradient = `linear-gradient(135deg, ${brand.primaryColor || '#000'}, ${brand.secondaryColor || '#333'})`

              return (
                <motion.div
                  key={brand.id}
                  className={`group cursor-pointer ${getColumnSpan(index)}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: 'easeOut'
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  onClick={() => router.push(`/brand/${brand.id}`)}
                >
                  <div 
                    className='relative w-full h-64 sm:h-72 md:h-80 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200'
                    style={{ background: brand.coverImage ? 'transparent' : gradient }}
                  >
                    {brand.coverImage ? (
                      <img
                        src={brand.coverImage}
                        alt={brand.name}
                        className='absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                      />
                    ) : (
                      <div className="absolute inset-0" style={{ background: gradient }} />
                    )}
                    
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
                    
                    <div className='absolute inset-0 flex items-end p-3 sm:p-4 md:p-6'>
                      <LiquidButton className='opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
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
  )
}
