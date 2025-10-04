'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X } from 'lucide-react'
import { useUserProfile } from '@/hooks/useUserProfile'

interface AvatarUploadProps {
  currentImage?: string
  onImageChange?: (imageUrl: string) => void
  className?: string
}

export default function AvatarUpload({ currentImage, onImageChange, className = '' }: AvatarUploadProps) {
  const { profile, updateProfile, stackUser } = useUserProfile()
  const [isUploading, setIsUploading] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide')
        return
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image doit faire moins de 5MB')
        return
      }

      // Uploader l'image directement
      uploadImage(file)
    }
  }

  const uploadImage = async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        const imageUrl = result.imageUrl

        // Mettre à jour le profil dans la base de données
        await updateProfile({ profileImage: imageUrl })

        // Notifier le composant parent
        if (onImageChange) {
          onImageChange(imageUrl)
        }

        setShowOptions(false)
        
        // Afficher un message de succès
        alert('Photo de profil mise à jour avec succès!')
        
        // Recharger la page pour mettre à jour tous les avatars
        window.location.reload()
      } else {
        throw new Error('Erreur lors de l\'upload')
      }
    } catch (error) {
      console.error('Erreur upload:', error)
      alert('Erreur lors de l\'upload de l\'image')
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = async () => {
    if (!stackUser) return

    try {
      // Mettre à jour le profil dans la base de données
      await updateProfile({ profileImage: null })

      if (onImageChange) {
        onImageChange('')
      }
      setShowOptions(false)
      alert('Photo de profil supprimée avec succès!')
      
      // Recharger la page pour mettre à jour tous les avatars
      window.location.reload()
    } catch (error) {
      console.error('Erreur suppression:', error)
      alert('Erreur lors de la suppression de l\'image')
    }
  }

  const getInitials = () => {
    const displayName = profile?.name || stackUser?.displayName
    if (!displayName) return 'U'
    return displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Utiliser l'image du profil de la DB
  const displayImage = profile?.profileImage || currentImage

  return (
    <div className={`relative ${className}`}>
      {/* Avatar */}
      <motion.div
        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden cursor-pointer group"
        whileHover={{ scale: 1.05 }}
        onClick={() => setShowOptions(!showOptions)}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-stone-900 to-gray-800 text-white font-bold text-2xl sm:text-3xl flex items-center justify-center">
            {getInitials()}
          </div>
        )}

        {/* Overlay au survol */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="w-6 h-6 text-white" />
        </div>

        {/* Indicateur de chargement */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </motion.div>

      {/* Menu d'options */}
      <AnimatePresence>
        {showOptions && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-10"
              onClick={() => setShowOptions(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-2 z-20 min-w-[180px]"
            >
              <div className="space-y-1">
                {/* Changer la photo */}
                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-xl transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">Changer la photo</span>
                </motion.button>

                {/* Supprimer la photo */}
                {displayImage && (
                  <motion.button
                    onClick={removeImage}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-red-50 rounded-xl transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                      <X className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-red-600">Supprimer</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}