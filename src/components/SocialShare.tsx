'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Twitter, Facebook, Linkedin, Copy, Check } from 'lucide-react'

interface SocialShareProps {
  brandId: string
  brandName: string
  brandDescription?: string
  brandUrl: string
  className?: string
}

export default function SocialShare({ brandId, brandName, brandDescription, brandUrl, className = '' }: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [hasTracked, setHasTracked] = useState(false)  // Pour ne compter qu'une seule fois

  const shareText = `Découvrez le branding de ${brandName} créé avec Guidiqo ! ${brandDescription || 'Un design professionnel généré par IA.'}`
  const encodedUrl = encodeURIComponent(brandUrl)
  const encodedText = encodeURIComponent(shareText)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  }

  const trackShare = async () => {
    // Ne tracker qu'une seule fois par session
    if (hasTracked) return
    
    try {
      await fetch(`/api/brands/${brandId}/share`, {
        method: 'POST',
      })
      setHasTracked(true)
    } catch (error) {
      console.error('Erreur lors du tracking du partage:', error)
    }
  }

  const handleToggleMenu = () => {
    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)
    
    // Comptabiliser le partage dès l'ouverture du menu
    if (newIsOpen) {
      trackShare()
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(brandUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erreur lors de la copie:', error)
    }
  }

  const handleShare = async (platform: string) => {
    const url = shareLinks[platform as keyof typeof shareLinks]
    if (url) {
      window.open(url, '_blank', 'width=600,height=400')
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Bouton principal - style circulaire comme les autres boutons */}
      <motion.button
        onClick={handleToggleMenu}
        className="p-4 bg-white border border-black/10 rounded-full hover:bg-black hover:text-white transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Partager sur les réseaux"
      >
        <Share2 className="w-5 h-5" />
      </motion.button>

      {/* Menu déroulant */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-2 z-20 min-w-[200px]"
            >
              <div className="space-y-1">
                {/* Twitter */}
                <motion.button
                  onClick={() => handleShare('twitter')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-xl transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Twitter className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">Twitter</span>
                </motion.button>

                {/* Facebook */}
                <motion.button
                  onClick={() => handleShare('facebook')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-xl transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Facebook className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">Facebook</span>
                </motion.button>

                {/* LinkedIn */}
                <motion.button
                  onClick={() => handleShare('linkedin')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-xl transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                    <Linkedin className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">LinkedIn</span>
                </motion.button>

                {/* Séparateur */}
                <div className="h-px bg-gray-100 my-2" />

                {/* Copier le lien */}
                <motion.button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-xl transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                    {copied ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Copy className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium">
                    {copied ? 'Copié !' : 'Copier le lien'}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
