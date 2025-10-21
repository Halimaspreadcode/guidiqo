'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { X } from 'lucide-react'
import Footer from '@/components/Footer'

interface BrandData {
  name: string
  description?: string
  prompt: string
}

interface Step1Props {
  brandData: BrandData
  updateBrandData: (data: Partial<BrandData>) => void
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
}

export default function Step1BasicInfo({ brandData, updateBrandData, currentStep, totalSteps, onNext, onPrevious }: Step1Props) {
  const router = useRouter()
  const [showCancelModal, setShowCancelModal] = useState(false)

  const handleCancel = () => {
    // Nettoyer le sessionStorage
    sessionStorage.removeItem('brandData')
    sessionStorage.removeItem('downloadIntent')
    // Rediriger vers la page d'accueil
    router.push('/')
  }
  return (
    <div className="fixed inset-0 flex flex-col md:flex-row">
      {/* Image gauche - 1/4 - hidden on mobile */}
      <div className="hidden md:block md:w-1/4 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1575041051612-323e644ca1b8?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Brand Identity"
          fill
          className="object-cover"
          priority
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
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-4">
              Informations <span className="text-gray-400 text-2xl sm:text-3xl">1/4</span>
            </h2>
            <p className="text-gray-600 text-lg mb-12">
                Commençons par les bases de votre projet
            </p>

            {/* Glassmorphism Prompt Card */}
            <div className="relative rounded-3xl p-8 mb-12 overflow-hidden border border-black/5 backdrop-blur-md bg-white dark:bg-black/70">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <div className="relative z-10">
                <p className="text-xs font-medium text-gray-500 mb-2 tracking-wide">IDÉE INITIALE</p>
                <p className="text-gray-900 text-sm">{brandData.prompt}</p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-3">
                  Nom du projet
                </label>
                <input
                  type="text"
                  id="name"
                  value={brandData.name}
                  onChange={(e) => updateBrandData({ name: e.target.value })}
                  placeholder="Ex: TechFlow, CreaSpace..."
                  className="w-full px-6 py-4 bg-white dark:bg-black border border-gray-200 dark:border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black dark:text-white placeholder-gray-400 text-lg transition-all"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-3">
                  Description
                </label>
                <textarea
                  id="description"
                  value={brandData.description || ''}
                  onChange={(e) => updateBrandData({ description: e.target.value })}
                  placeholder="Décrivez votre projet, ses valeurs, sa mission..."
                  rows={6}
                  className="w-full px-6 py-4 bg-white dark:bg-black border border-gray-200 dark:border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black dark:text-white placeholder-gray-400 resize-none transition-all"
                />
              </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end gap-4 mt-12 pb-12">
              <motion.button
                onClick={() => setShowCancelModal(true)}
                className="relative overflow-hidden px-6 py-3 rounded-full border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-white dark:bg-black/10" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative z-10">Annuler</span>
              </motion.button>

              <motion.button
                onClick={onNext}
                disabled={!brandData.name || brandData.name.trim().length === 0}
                className="relative overflow-hidden px-8 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: !brandData.name || brandData.name.trim().length === 0 ? 1 : 1.02 }}
                whileTap={{ scale: !brandData.name || brandData.name.trim().length === 0 ? 1 : 0.98 }}
              >
                <div className="absolute inset-0 bg-white dark:bg-black/10 text-black dark:text-white" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative z-10 text-black dark:text-white">Suivant</span>
              </motion.button>
            </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      {/* Modal de confirmation d'annulation */}
      <AnimatePresence>
        {showCancelModal && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
              onClick={() => setShowCancelModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-black rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
                {/* Decorative gradient */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-red-600 to-red-500 rounded-t-3xl" />
                
                <div className="text-center">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mb-6"
                  >
                    <X className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-3">
                    Annuler la création ?
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Êtes-vous sûr de vouloir annuler ? Toutes vos modifications seront perdues et ne seront pas sauvegardées.
                  </p>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      onClick={() => setShowCancelModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Non, continuer
                    </motion.button>
                    
                    <motion.button
                      onClick={handleCancel}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-semibold hover:from-red-600 hover:to-red-700 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Oui, annuler
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

