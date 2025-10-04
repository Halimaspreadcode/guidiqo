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
  brandPersonality: string | null
  targetAudience: string | null
  coverImage: string | null
  isCompleted: boolean
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => router.push(`/brand/${brand.id}`)}
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-900 transition-all duration-300 cursor-pointer"
    >
      {/* Image de couverture */}
      {brand.coverImage && (
        <div className="relative w-full aspect-video">
          <Image
            src={brand.coverImage}
            alt={brand.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          {/* Status badge sur l'image */}
          <span className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-md backdrop-blur-sm ${
            brand.isCompleted 
              ? 'bg-black/80 text-white' 
              : 'bg-white/90 text-gray-900'
          }`}>
            {brand.isCompleted ? 'Terminé' : `${brand.currentStep}/4`}
          </span>
        </div>
      )}

      {/* Header simple avec couleurs */}
      <div className="p-4 md:p-6 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-xl font-semibold text-gray-900 truncate mb-1">
              {brand.name}
            </h3>
            {brand.description && (
              <p className="hidden md:block text-sm text-gray-500 line-clamp-1">
                {brand.description}
              </p>
            )}
          </div>
          
          {/* Status badge minimaliste - seulement si pas d'image */}
          {!brand.coverImage && (
            <span className={`shrink-0 text-[10px] md:text-xs font-medium px-2 md:px-2.5 py-1 rounded-md ${
              brand.isCompleted 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {brand.isCompleted ? 'Terminé' : `${brand.currentStep}/4`}
            </span>
          )}
        </div>

        {/* Palette de couleurs */}
        <div className="flex items-center gap-1.5">
          {[brand.primaryColor, brand.secondaryColor, brand.accentColor]
            .filter(Boolean)
            .map((color, idx) => (
              <div
                key={idx}
                className="w-6 h-6 md:w-8 md:h-8 rounded-md border border-gray-200"
                style={{ backgroundColor: color! }}
              />
            ))}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4 md:p-6">
        {/* Tags - Desktop only */}
        {(brand.brandPersonality || brand.targetAudience) && (
          <div className="hidden md:flex flex-wrap gap-2 mb-4">
            {brand.brandPersonality && (
              <span className="text-xs px-2.5 py-1 border border-gray-200 text-gray-700 rounded-md">
                {brand.brandPersonality}
              </span>
            )}
            {brand.targetAudience && (
              <span className="text-xs px-2.5 py-1 border border-gray-200 text-gray-700 rounded-md">
                {brand.targetAudience}
              </span>
            )}
          </div>
        )}

        {/* Footer avec actions */}
        <div className="flex items-center justify-between gap-2">
          {/* Date */}
          <span className="text-xs text-gray-400">
            {new Date(brand.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/onboarding/${brand.id}?step=${brand.currentStep}`)
              }}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              title="Modifier"
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(brand.id)
              }}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="w-px h-4 bg-gray-200 mx-1" />

            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}