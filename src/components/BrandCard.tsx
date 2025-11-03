'use client'

import { motion } from 'framer-motion'
import { Edit, Trash2, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Brand {
  id: string
  name: string
  description: string | null
  primaryColor: string | null
  secondaryColor: string | null
  accentColor: string | null
  primaryFont: string | null
  secondaryFont: string | null
  brandPersonality: string | null
  targetAudience: string | null
  coverImage: string | null
  isCompleted: boolean
  isPublic: boolean
  currentStep: number
  createdAt: string
  updatedAt: string
}

interface BrandCardProps {
  brand: Brand
  index: number
  onDelete: (id: string) => void
}

export default function BrandCard({ brand, index, onDelete }: BrandCardProps) {
  const router = useRouter()

  const handleTogglePublic = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      const newPublicState = !brand.isPublic
      const response = await fetch(`/api/brands/${brand.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          isPublic: newPublicState
        })
      })
      
      if (response.ok) {
        // Rafraîchir la page
        window.location.reload()
      }
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => router.push(`/brand/${brand.id}`)}
      className="group bg-white dark:bg-black rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
      whileHover={{ y: -4 }}
    >
      {/* Image de couverture OU Design généré */}
      {brand.coverImage ? (
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={brand.coverImage}
            alt={brand.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          
          {/* Status badge sur l'image */}
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg ${
              brand.isCompleted 
                ? 'bg-green-500/90 text-white border border-green-400/30' 
                : 'bg-white/95 text-gray-900 dark:bg-black/80 dark:text-white dark:border-white/20 border border-gray-200/30'
            }`}
          >
            {brand.isCompleted ? '✓ Terminé' : `${brand.currentStep}/4`}
          </motion.span>
        </div>
      ) : (
        <div 
          className="relative w-full aspect-video overflow-hidden"
          style={{
            background: brand.primaryColor 
              ? `linear-gradient(135deg, ${brand.primaryColor} 0%, ${brand.secondaryColor || brand.primaryColor} 50%, ${brand.accentColor || brand.primaryColor} 100%)`
              : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)'
          }}
        >
          {/* Motif décoratif amélioré */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id={`pattern-${brand.id}`} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                  <circle cx="30" cy="30" r="2" fill="white" opacity="0.6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#pattern-${brand.id})`} />
            </svg>
          </div>
          
          {/* Nom du projet en grand avec animation */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white text-center drop-shadow-2xl"
              style={{ fontFamily: brand.primaryFont || "'Raleway', sans-serif" }}
              whileHover={{ scale: 1.05 }}
            >
              {brand.name}
            </motion.h2>
          </div>
          
          {/* Status badge */}
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg ${
              brand.isCompleted 
                ? 'bg-green-500/90 text-white border border-green-400/30' 
                : 'bg-white/95 text-gray-900 dark:bg-black/80 dark:text-white dark:border-white/20 border border-gray-200/30'
            }`}
          >
            {brand.isCompleted ? '✓ Terminé' : `${brand.currentStep}/4`}
          </motion.span>
        </div>
      )}

      {/* Header amélioré avec description */}
      <div className="p-5 md:p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
            {brand.name}
          </h3>
          {brand.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {brand.description}
            </p>
          )}
        </div>

        {/* Palette de couleurs améliorée */}
        <div className="flex items-center gap-2">
          {[brand.primaryColor, brand.secondaryColor, brand.accentColor]
            .filter(Boolean)
            .map((color, idx) => (
              <motion.div
                key={idx}
                className="w-8 h-8 md:w-10 md:h-10 rounded-lg border-2 border-gray-200 dark:border-white/20 shadow-sm group-hover:scale-110 transition-transform cursor-pointer"
                style={{ backgroundColor: color! }}
                whileHover={{ scale: 1.15, zIndex: 10 }}
                title={color!}
              />
            ))}
          {[brand.primaryColor, brand.secondaryColor, brand.accentColor].filter(Boolean).length === 0 && (
            <div className="flex gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-white/10" />
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 border border-gray-200 dark:border-white/10" />
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-600 border border-gray-200 dark:border-white/10" />
            </div>
          )}
        </div>
      </div>

      {/* Contenu amélioré */}
      <div className="px-5 md:px-6 pb-5 md:pb-6 space-y-4">
        {/* Tags améliorés */}
        {(brand.brandPersonality || brand.targetAudience) && (
          <div className="flex flex-wrap gap-2">
            {brand.brandPersonality && (
              <span className="text-xs font-medium px-3 py-1.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-white/10">
                {brand.brandPersonality}
              </span>
            )}
            {brand.targetAudience && (
              <span className="text-xs font-medium px-3 py-1.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-white/10">
                {brand.targetAudience}
              </span>
            )}
          </div>
        )}

        {/* Toggle Public/Privé amélioré */}
        <div>
          <motion.button
            type="button"
            onClick={handleTogglePublic}
            className={`relative w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border-2 group cursor-pointer ${
              brand.isPublic
                ? 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20 border-blue-300 dark:border-blue-800/60 shadow-blue-100/50 dark:shadow-blue-900/20'
                : 'bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-950/50 border-gray-300 dark:border-gray-700 shadow-gray-100/50 dark:shadow-gray-900/20'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Indicateur avec icône animée */}
            <div className="flex items-center gap-3">
              <motion.div 
                className={`relative w-3 h-3 rounded-full ${
                  brand.isPublic ? 'bg-blue-500' : 'bg-gray-400 dark:bg-gray-500'
                }`}
                animate={{
                  scale: brand.isPublic ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Animation de pulse pour l'état public */}
                {brand.isPublic && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-blue-500"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>
              <div className="text-left">
                <motion.p 
                  className={`text-sm font-bold ${
                    brand.isPublic 
                      ? 'text-blue-700 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-400'
                  }`}
                  animate={{
                    color: brand.isPublic ? '#1d4ed8' : '#374151'
                  }}
                >
                  {brand.isPublic ? 'Public' : 'Privé'}
                </motion.p>
                <p className={`text-xs mt-0.5 transition-colors ${
                  brand.isPublic 
                    ? 'text-blue-600/70 dark:text-blue-400/70' 
                    : 'text-gray-500 dark:text-gray-500'
                }`}>
                  {brand.isPublic ? 'Visible sur votre profil public' : 'Visible uniquement par vous'}
                </p>
              </div>
            </div>
            
            {/* Toggle Switch amélioré */}
            <div 
              className={`relative w-14 h-7 rounded-full transition-all duration-300 pointer-events-none ${
                brand.isPublic 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30' 
                  : 'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700'
              }`}
            >
              {/* Effet de brillance au hover */}
              <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                brand.isPublic 
                  ? 'bg-gradient-to-r from-white/20 via-transparent to-transparent' 
                  : 'bg-gradient-to-r from-white/10 via-transparent to-transparent'
              }`} />
              
              {/* Bouton du toggle avec icône */}
              <motion.div 
                className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-xl flex items-center justify-center pointer-events-none"
                animate={{
                  x: brand.isPublic ? 28 : 0,
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 600, 
                  damping: 35 
                }}
              >
                {/* Icône dans le bouton */}
                {brand.isPublic ? (
                  <motion.div
                    key="public"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-blue-500 text-xs font-bold"
                  >
                    ✓
                  </motion.div>
                ) : (
                  <motion.div
                    key="private"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400 text-xs"
                  >
                    ●
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.button>
        </div>

        {/* Footer avec actions améliorées */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/10">
          {/* Date améliorée */}
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {new Date(brand.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>

          {/* Actions améliorées */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/onboarding/${brand.id}?step=${brand.currentStep}`)
              }}
              className="relative p-2.5 rounded-xl transition-all duration-200 group/edit overflow-hidden"
              title="Modifier"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gray-100/0 group-hover/edit:bg-gray-100 dark:group-hover/edit:bg-white/10 backdrop-blur-sm transition-all duration-300 rounded-xl" />
              <Edit className="relative w-4 h-4 z-10 text-gray-600 dark:text-gray-400 group-hover/edit:text-gray-900 dark:group-hover/edit:text-white transition-colors" />
            </motion.button>

            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(brand.id)
              }}
              className="relative p-2.5 rounded-xl transition-all duration-200 group/delete overflow-hidden"
              title="Supprimer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-red-50/0 group-hover/delete:bg-red-50 dark:group-hover/delete:bg-red-900/30 backdrop-blur-sm transition-all duration-300 rounded-xl border border-transparent group-hover/delete:border-red-200 dark:group-hover/delete:border-red-800/50" />
              <Trash2 className="relative w-4 h-4 z-10 text-gray-600 dark:text-gray-400 group-hover/delete:text-red-600 dark:group-hover/delete:text-red-400 transition-colors" />
            </motion.button>

            <motion.div 
              className="flex items-center justify-center ml-1"
              whileHover={{ x: 4 }}
            >
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}