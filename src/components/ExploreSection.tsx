'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { LiquidButton } from './LiquidGlassButton'

const inspirations = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1755134148390-4bf1c1b2da03?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    label: 'Premium Branding'
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1754634026421-fa4237aaaf17?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    label: 'Fashion Branding'
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1750841896872-e09747c58c15?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    label: 'Rock Band Branding'
  },
  {
    id: 4,
    image:
      'https://images.unsplash.com/photo-1751716534721-335ad5522e3c?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    label: 'Ambient Music Branding'
  },
  {
    id: 5,
    image:
      'https://images.unsplash.com/photo-1753362770775-2f9b5c95a263?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    label: 'Jazz Band Branding'
  }
]

export default function ExploreSection () {
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

        <div className='grid grid-cols-12 gap-3 sm:gap-4 md:gap-6'>
          {inspirations.map((item, index) => {
            // Définir les proportions pour chaque ligne
            const getColumnSpan = (index: number) => {
              if (index === 0) return 'col-span-9' // Ligne 1: gauche 3/4, droite 1/4
              if (index === 1) return 'col-span-3'
              if (index === 2) return 'col-span-6' // Ligne 2: gauche 1/2, droite 1/2
              if (index === 3) return 'col-span-6'
              if (index === 4) return 'col-span-8' // Ligne 3: gauche 2/3, droite 1/3
              return 'col-span-4'
            }

            return (
              <motion.div
                key={item.id}
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
              >
                <div className='relative w-full h-64 sm:h-72 md:h-80 bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200'>
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    className='object-cover opacity-100 group-hover:opacity-100 transition-opacity duration-300'
                  />
                   <div className='absolute inset-0 flex items-end p-3 sm:p-4 md:p-6'>
                     
                     <LiquidButton className='opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                     {item.label}
                     </LiquidButton>
                   </div>
                   
                   
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
