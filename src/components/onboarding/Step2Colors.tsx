'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import Footer from '@/components/Footer'
import { Sparkles, RefreshCw, Palette } from 'lucide-react'
import { LiquidButton } from '@/components/LiquidGlassButton'

interface BrandData {
  name?: string
  description?: string
  brandPersonality?: string
  targetAudience?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
}

interface Step2Props {
  brandData: BrandData
  updateBrandData: (data: Partial<BrandData>) => void
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
}

const colorPalettes = [
  { name: 'Tech Modern', primary: '#000000', secondary: '#6B7280', accent: '#3B82F6' },
  { name: 'Nature', primary: '#10B981', secondary: '#059669', accent: '#34D399' },
  { name: 'Sunset', primary: '#F59E0B', secondary: '#EF4444', accent: '#F97316' },
  { name: 'Ocean', primary: '#0EA5E9', secondary: '#0284C7', accent: '#06B6D4' },
  { name: 'Purple Dream', primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA' },
  { name: 'Rose Gold', primary: '#EC4899', secondary: '#DB2777', accent: '#F472B6' },
]

export default function Step2Colors({ brandData, updateBrandData, currentStep, totalSteps, onNext, onPrevious }: Step2Props) {
  const [selectedPalette, setSelectedPalette] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<any>(null)
  const [showManualInput, setShowManualInput] = useState(false)

  const handlePaletteSelect = (index: number) => {
    setSelectedPalette(index)
    const palette = colorPalettes[index]
    updateBrandData({
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
      accentColor: palette.accent,
    })
  }

  const handleAiSuggestion = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/suggest-colors', {
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
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          accentColor: data.accentColor,
        })
        setSelectedPalette(null)
      }
    } catch (error) {
      console.error('Error getting AI suggestion:', error)
      alert('Erreur lors de la génération IA. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const handleManualColorChange = (type: 'primary' | 'secondary' | 'accent', color: string) => {
    const update = type === 'primary' 
      ? { primaryColor: color }
      : type === 'secondary'
      ? { secondaryColor: color }
      : { accentColor: color }
    
    updateBrandData(update)
    setSelectedPalette(null)
  }

  return (
    <div className="fixed inset-0 flex flex-col md:flex-row">
      {/* Image gauche - 1/4 */}
      <div className="hidden md:block md:w-1/4 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1575041051612-323e644ca1b8?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Colors"
          fill
          className="object-cover"
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
          <div className="max-w-3xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4">
              Couleurs <span className="text-gray-400 text-2xl sm:text-3xl">2/4</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Sélectionnez la palette qui représente votre marque
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

              {brandData.primaryColor && (
                <motion.button
                  onClick={handleAiSuggestion}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-black rounded-full font-semibold hover:bg-gray-200 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Régénérer</span>
                </motion.button>
              )}

              <motion.button
                onClick={() => setShowManualInput(!showManualInput)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-black rounded-full font-semibold hover:bg-gray-50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Palette className="w-4 h-4" />
                <span>{showManualInput ? 'Masquer' : 'Personnaliser'}</span>
              </motion.button>
            </div>

            {/* AI Explanation */}
            {aiSuggestion?.explanation && (
              <LiquidButton
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-purple-50 border border-purple-200 rounded-xl"
              >
                <p className="text-sm text-purple-900">
                  <span className="font-semibold">Suggestion IA : </span>
                  {aiSuggestion.explanation}
                </p>
              </LiquidButton>
            )}

            {/* Manual Color Input */}
            {showManualInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-2xl space-y-4"
              >
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-32">Couleur Primaire</label>
                  <input
                    type="color"
                    value={brandData.primaryColor || '#000000'}
                    onChange={(e) => handleManualColorChange('primary', e.target.value)}
                    className="w-16 h-12 rounded-lg cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={brandData.primaryColor || ''}
                    onChange={(e) => handleManualColorChange('primary', e.target.value)}
                    placeholder="#000000"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-32">Couleur Secondaire</label>
                  <input
                    type="color"
                    value={brandData.secondaryColor || '#666666'}
                    onChange={(e) => handleManualColorChange('secondary', e.target.value)}
                    className="w-16 h-12 rounded-lg cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={brandData.secondaryColor || ''}
                    onChange={(e) => handleManualColorChange('secondary', e.target.value)}
                    placeholder="#666666"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-32">Couleur Accent</label>
                  <input
                    type="color"
                    value={brandData.accentColor || '#999999'}
                    onChange={(e) => handleManualColorChange('accent', e.target.value)}
                    className="w-16 h-12 rounded-lg cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={brandData.accentColor || ''}
                    onChange={(e) => handleManualColorChange('accent', e.target.value)}
                    placeholder="#999999"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {colorPalettes.map((palette, index) => (
                <motion.button
                  key={index}
                  onClick={() => handlePaletteSelect(index)}
                  className={`p-6 rounded-2xl border transition-all ${
                    selectedPalette === index
                      ? 'border-red-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-black text-lg">{palette.name}</span>
                    {selectedPalette === index && (
                      <div className="w-2 h-2 bg-black rounded-full" />
                    )}
                  </div>
                  <div className="flex gap-3">
                    <div
                      className="flex-1 h-20 rounded-xl"
                      style={{ backgroundColor: palette.primary }}
                    />
                    <div
                      className="flex-1 h-20 rounded-xl"
                      style={{ backgroundColor: palette.secondary }}
                    />
                    <div
                      className="flex-1 h-20 rounded-xl"
                      style={{ backgroundColor: palette.accent }}
                    />
                  </div>
                </motion.button>
              ))}
            </div>

            {brandData.primaryColor && (
              <div className="relative rounded-2xl p-8 overflow-hidden border border-gray-200 bg-gray-50">
                <div className="absolute inset-0 bg-white/40" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                <div className="relative z-10">
                  <p className="text-xs font-medium text-gray-500 mb-6 tracking-wide">APERÇU DE LA PALETTE</p>
                  <div className="flex gap-6">
                    <div className="flex-1 space-y-3">
                      <div
                        className="h-24 rounded-xl flex items-center justify-center text-white font-medium shadow-sm"
                        style={{ backgroundColor: brandData.primaryColor }}
                      >
                        Primaire
                      </div>
                      <p className="text-xs text-gray-600 text-center font-mono">
                        {brandData.primaryColor}
                      </p>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div
                        className="h-24 rounded-xl flex items-center justify-center text-white font-medium shadow-sm"
                        style={{ backgroundColor: brandData.secondaryColor }}
                      >
                        Secondaire
                      </div>
                      <p className="text-xs text-gray-600 text-center font-mono">
                        {brandData.secondaryColor}
                      </p>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div
                        className="h-24 rounded-xl flex items-center justify-center text-white font-medium shadow-sm"
                        style={{ backgroundColor: brandData.accentColor }}
                      >
                        Accent
                      </div>
                      <p className="text-xs text-gray-600 text-center font-mono">
                        {brandData.accentColor}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-end gap-4 mt-12 pb-12">
              <motion.button
                onClick={onPrevious}
                className="relative overflow-hidden px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
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
  )
}

