'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Liquid Glass Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Contenu droite - 3/4 */}
      <div className="flex-1 md:w-3/4 overflow-y-auto bg-white">
        {/* Logo Guidiqo */}
        <div className="absolute top-6 left-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-bold text-white"
          >
            Guidiqo
          </motion.div>
        </div>
        
        <div className="min-h-screen pt-32 pb-32 px-6 sm:px-12 md:px-16 lg:px-24">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4">
              Informations <span className="text-gray-400 text-2xl sm:text-3xl">1/4</span>
            </h2>
            <p className="text-gray-600 text-lg mb-12">
                Commençons par les bases de votre projet
            </p>

            {/* Glassmorphism Prompt Card */}
            <div className="relative rounded-3xl p-8 mb-12 overflow-hidden border border-black/5 backdrop-blur-md bg-white/70">
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
                  className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-400 text-lg transition-all"
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
                  className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-400 resize-none transition-all"
                />
              </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end gap-4 mt-12 pb-12">
              <motion.button
                onClick={onPrevious}
                disabled={currentStep === 1}
                className="relative overflow-hidden px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-white/10" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative z-10">Précédent</span>
              </motion.button>

              <motion.button
                onClick={onNext}
                className="relative overflow-hidden px-8 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-white/10" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative z-10">Suivant</span>
              </motion.button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
    </div>
  )
}

