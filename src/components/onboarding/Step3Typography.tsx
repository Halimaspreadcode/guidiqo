'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import Footer from '@/components/Footer'
import { RefreshCw, Type } from 'lucide-react'
import { LiquidButton } from '@/components/LiquidGlassButton'

interface BrandData {
  name?: string
  description?: string
  brandPersonality?: string
  targetAudience?: string
  primaryFont?: string
  secondaryFont?: string
}

interface Step3Props {
  brandData: BrandData
  updateBrandData: (data: Partial<BrandData>) => void
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
}

const fontPairs = [
  { name: 'Moderne', primary: 'Inter', secondary: 'Roboto' },
  { name: 'Élégant', primary: 'Playfair Display', secondary: 'Source Sans Pro' },
  { name: 'Tech', primary: 'Space Grotesk', secondary: 'IBM Plex Mono' },
  { name: 'Classique', primary: 'Lora', secondary: 'Open Sans' },
  { name: 'Créatif', primary: 'Raleway', secondary: 'Nunito' },
  { name: 'Minimal', primary: 'Work Sans', secondary: 'Karla' },
]

// Liste complète des polices disponibles
const availableFonts = [
  'Raleway', 'Montserrat', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Nunito', 
  'Playfair Display', 'Merriweather', 'Bebas Neue', 'Oswald', 'Source Sans Pro', 
  'Inter', 'Work Sans', 'Space Grotesk', 'DM Sans', 'Manrope', 'Urbanist', 
  'Outfit', 'Plus Jakarta Sans', 'IBM Plex Mono', 'Lora', 'Karla'
]

export default function Step3Typography({ brandData, updateBrandData, currentStep, totalSteps, onNext, onPrevious }: Step3Props) {
  const [selectedPair, setSelectedPair] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<any>(null)
  const [showManualInput, setShowManualInput] = useState(false)

  const handleFontSelect = (index: number) => {
    setSelectedPair(index)
    const pair = fontPairs[index]
    updateBrandData({
      primaryFont: pair.primary,
      secondaryFont: pair.secondary,
    })
  }

  const handleAiSuggestion = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/suggest-fonts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: brandData.description || brandData.name,
          personality: brandData.brandPersonality,
          targetAudience: brandData.targetAudience
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAiSuggestion(data)
        updateBrandData({
          primaryFont: data.primaryFont,
          secondaryFont: data.secondaryFont,
        })
        setSelectedPair(null)
      }
    } catch (error) {
      console.error('Error getting AI suggestion:', error)
      alert('Erreur lors de la génération IA. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const handleManualFontChange = (type: 'primary' | 'secondary', font: string) => {
    const update = type === 'primary' 
      ? { primaryFont: font }
      : { secondaryFont: font }
    
    updateBrandData(update)
    setSelectedPair(null)
  }

  return (
    <div className="fixed inset-0 flex flex-col md:flex-row">
      {/* Image gauche - 1/4 */}
      <div className="hidden md:block md:w-1/4 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1575041051612-323e644ca1b8?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Typography"
          fill
          className="object-cover"
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
          <div className="max-w-3xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-4">
              Typographie <span className="text-gray-400 text-2xl sm:text-3xl">3/4</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Choisissez les polices qui définissent votre identité
            </p>

            {/* Boutons IA et Manuel */}
            <div className="flex flex-wrap gap-3 mb-8">
              <LiquidButton
                onClick={handleAiSuggestion}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-900 to-red-950 text-white rounded-full font-semibold hover:from-red-700 hover:to-red-700 transition-all disabled:opacity-50"
               
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Génération...</span>
                  </>
                ) : (
                  <>
                    <span>Suggérer avec IA</span>
                  </>
                )}
              </LiquidButton>

              {brandData.primaryFont && (
                <motion.button
                  onClick={handleAiSuggestion}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-black dark:text-white rounded-full font-semibold hover:bg-gray-200 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Régénérer</span>
                </motion.button>
              )}

              <motion.button
                onClick={() => setShowManualInput(!showManualInput)}
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-black border border-gray-200 dark:border-white/20 text-black dark:text-white rounded-full font-semibold hover:bg-gray-50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Type className="w-4 h-4" />
                <span>{showManualInput ? 'Masquer' : 'Personnaliser'}</span>
              </motion.button>
            </div>

            {/* AI Explanation */}
            {aiSuggestion?.explanation && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-purple-50 border border-purple-200 rounded-xl"
              >
                <p className="text-sm text-purple-900">
                  <span className="font-semibold">Suggestion IA : </span>
                  {aiSuggestion.explanation}
                </p>
              </motion.div>
            )}

            {/* Manual Font Input */}
            {showManualInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-6 bg-gray-50 border border-gray-200 dark:border-white/20 rounded-2xl space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Police Principale</label>
                  <select
                    value={brandData.primaryFont || ''}
                    onChange={(e) => handleManualFontChange('primary', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    style={{ fontFamily: brandData.primaryFont || 'inherit' }}
                  >
                    <option value="">Sélectionnez une police</option>
                    {availableFonts.map((font) => (
                      <option key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Police Secondaire</label>
                  <select
                    value={brandData.secondaryFont || ''}
                    onChange={(e) => handleManualFontChange('secondary', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    style={{ fontFamily: brandData.secondaryFont || 'inherit' }}
                  >
                    <option value="">Sélectionnez une police</option>
                    {availableFonts.map((font) => (
                      <option key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {fontPairs.map((pair, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleFontSelect(index)}
                  className={`p-6 rounded-2xl border transition-all text-left ${
                    selectedPair === index
                      ? 'border-black'
                      : 'border-gray-200 dark:border-white/20 hover:border-gray-300 dark:hover:border-white/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-black dark:text-white text-lg">{pair.name}</span>
                    {selectedPair === index && (
                      <div className="w-2 h-2 bg-black rounded-full" />
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-black dark:text-white mb-2" style={{ fontFamily: pair.primary }}>
                        Aa
                      </p>
                      <p className="text-xs text-gray-500">{pair.primary}</p>
                    </div>
                    <div>
                      <p className="text-xl text-gray-700" style={{ fontFamily: pair.secondary }}>
                        Aa
                      </p>
                      <p className="text-xs text-gray-500">{pair.secondary}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {brandData.primaryFont && (
              <div className="relative rounded-2xl p-8 overflow-hidden border border-gray-200 dark:border-white/20 bg-gray-50">
                <div className="absolute inset-0 bg-white dark:bg-black/40" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                <div className="relative z-10 space-y-8">
                  <p className="text-xs font-medium text-gray-500 mb-6 tracking-wide">APERÇU TYPOGRAPHIQUE</p>
                  <div>
                    <h1 className="text-5xl font-bold text-black dark:text-white mb-3" style={{ fontFamily: brandData.primaryFont }}>
                      Votre Marque
                    </h1>
                    <p className="text-sm text-gray-500">{brandData.primaryFont}</p>
                  </div>
                  <div>
                    <p className="text-xl text-gray-700 leading-relaxed" style={{ fontFamily: brandData.secondaryFont }}>
                      Ceci est un exemple de texte utilisant votre police secondaire. 
                      Elle sera utilisée pour tous les contenus de votre branding.
                    </p>
                    <p className="text-sm text-gray-500 mt-3">{brandData.secondaryFont}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-end gap-4 mt-12 pb-12">
              <motion.button
                onClick={onPrevious}
                className="relative overflow-hidden px-6 py-3 rounded-full border border-gray-300 dark:border-white/30 hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-white dark:bg-black/10" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative z-10">Précédent</span>
              </motion.button>

              <motion.button
                onClick={onNext}
                className="relative overflow-hidden px-8 py-3 rounded-full bg-black hover:bg-gray-800 transition-colors text-black dark:text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
        <Footer />
      </div>
    </div>
  )
}

