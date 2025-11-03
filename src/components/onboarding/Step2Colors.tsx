'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import Footer from '@/components/Footer'
import { RefreshCw, Palette } from 'lucide-react'
import { LiquidButton } from '@/components/LiquidGlassButton'
import { useTranslations } from '@/contexts/LanguageContext'

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

const paletteConfigs = [
  { id: 'techModern', primary: '#000000', secondary: '#6B7280', accent: '#3B82F6' },
  { id: 'nature', primary: '#10B981', secondary: '#059669', accent: '#34D399' },
  { id: 'sunset', primary: '#F59E0B', secondary: '#EF4444', accent: '#F97316' },
  { id: 'ocean', primary: '#0EA5E9', secondary: '#0284C7', accent: '#06B6D4' },
  { id: 'purpleDream', primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA' },
  { id: 'roseGold', primary: '#EC4899', secondary: '#DB2777', accent: '#F472B6' },
]

export default function Step2Colors({ brandData, updateBrandData, currentStep, totalSteps, onNext, onPrevious }: Step2Props) {
  const [selectedPalette, setSelectedPalette] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<any>(null)
  const [showManualInput, setShowManualInput] = useState(false)
  const safeCurrentStep = Math.max(currentStep, 1)
  const safeTotalSteps = Math.max(totalSteps, safeCurrentStep)
  const t = useTranslations()
  const colorPalettes = useMemo(
    () =>
      paletteConfigs.map((palette) => ({
        ...palette,
        name: t(`onboarding.step2.palettes.${palette.id}.name`),
      })),
    [t]
  )
  const stepIndicator = t('onboarding.stepIndicator', { current: safeCurrentStep, total: safeTotalSteps })
  const hasPaletteSelection = Boolean(brandData.primaryColor && brandData.secondaryColor && brandData.accentColor)
  const aiTexts = {
    suggestion: t('onboarding.step2.ai.suggestion'),
    generating: t('onboarding.step2.ai.generating'),
    error: t('onboarding.step2.ai.error'),
  }

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
      alert(aiTexts.error)
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
          sizes="(min-width: 768px) 25vw"
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
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <h2 className="text-4xl sm:text-5xl font-bold text-black dark:text-white">
                {t('onboarding.step2.title')}
              </h2>
              <span className="text-gray-400 text-2xl sm:text-3xl">{stepIndicator}</span>
            </div>
            <p className="text-gray-600 text-lg mb-8">
              {t('onboarding.step2.subtitle')}
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
                    <span>{aiTexts.generating}</span>
                  </>
                ) : (
                  <>
                    <span>{aiTexts.suggestion}</span>
                  </>
                )}
              </LiquidButton>

              {brandData.primaryColor && (
                <motion.button
                  onClick={handleAiSuggestion}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-black dark:text-white rounded-full font-semibold hover:bg-gray-200 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{t('onboarding.step2.regenerate')}</span>
                </motion.button>
              )}

              <motion.button
                onClick={() => setShowManualInput(!showManualInput)}
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-black border border-gray-200 dark:border-white/20 text-black dark:text-white rounded-full font-semibold hover:bg-gray-50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Palette className="w-4 h-4" />
                <span>{showManualInput ? t('onboarding.step2.toggleManual.hide') : t('onboarding.step2.toggleManual.show')}</span>
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
                  <span className="font-semibold">{t('onboarding.step2.aiExplanationPrefix')}</span>
                  {aiSuggestion.explanation}
                </p>
              </motion.div>
            )}

            {/* Manual Color Input */}
              {showManualInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 p-6 bg-gray-50 border border-gray-200 dark:border-white/20 rounded-2xl space-y-4"
                >
                  <h3 className="text-sm font-semibold text-gray-700">{t('onboarding.step2.manualTitle')}</h3>
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700 w-32">{t('onboarding.step2.primaryLabel')}</label>
                    <input
                      type="color"
                      value={brandData.primaryColor || '#000000'}
                      onChange={(e) => handleManualColorChange('primary', e.target.value)}
                      className="w-16 h-12 rounded-lg cursor-pointer border border-gray-300 dark:border-white/30"
                  />
                  <input
                    type="text"
                      value={brandData.primaryColor || ''}
                      onChange={(e) => handleManualColorChange('primary', e.target.value)}
                      placeholder={t('onboarding.step2.hexPlaceholder')}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-white/30 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700 w-32">{t('onboarding.step2.secondaryLabel')}</label>
                    <input
                      type="color"
                      value={brandData.secondaryColor || '#666666'}
                      onChange={(e) => handleManualColorChange('secondary', e.target.value)}
                      className="w-16 h-12 rounded-lg cursor-pointer border border-gray-300 dark:border-white/30"
                  />
                  <input
                    type="text"
                      value={brandData.secondaryColor || ''}
                      onChange={(e) => handleManualColorChange('secondary', e.target.value)}
                      placeholder={t('onboarding.step2.hexPlaceholder')}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-white/30 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700 w-32">{t('onboarding.step2.accentLabel')}</label>
                    <input
                      type="color"
                      value={brandData.accentColor || '#999999'}
                      onChange={(e) => handleManualColorChange('accent', e.target.value)}
                      className="w-16 h-12 rounded-lg cursor-pointer border border-gray-300 dark:border-white/30"
                  />
                  <input
                    type="text"
                      value={brandData.accentColor || ''}
                      onChange={(e) => handleManualColorChange('accent', e.target.value)}
                      placeholder={t('onboarding.step2.hexPlaceholder')}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-white/30 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      : 'border-gray-200 dark:border-white/20 hover:border-gray-300 dark:hover:border-white/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-black dark:text-white text-lg">{palette.name}</span>
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
                  <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-gray-500 uppercase tracking-wide">
                    <span>{palette.primary}</span>
                    <span>{palette.secondary}</span>
                    <span>{palette.accent}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {brandData.primaryColor && (
              <div className="relative rounded-2xl p-8 overflow-hidden border border-gray-200 dark:border-white/20 bg-gray-50">
                <div className="absolute inset-0 bg-white dark:bg-black/40" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                <div className="relative z-10">
                  <p className="text-xs font-medium text-gray-500 mb-6 tracking-wide uppercase">
                    {t('onboarding.step2.previewTitle')}
                  </p>
                  <div className="flex gap-6">
                    <div className="flex-1 space-y-3">
                      <div
                        className="h-24 rounded-xl flex items-center justify-center text-white font-medium shadow-sm"
                        style={{ backgroundColor: brandData.primaryColor || '#000000' }}
                      >
                        {t('onboarding.step2.primarySwatch')}
                      </div>
                      <p className="text-xs text-gray-600 text-center font-mono">
                        {brandData.primaryColor}
                      </p>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div
                        className="h-24 rounded-xl flex items-center justify-center text-white font-medium shadow-sm"
                        style={{ backgroundColor: brandData.secondaryColor || '#6B7280' }}
                      >
                        {t('onboarding.step2.secondarySwatch')}
                      </div>
                      <p className="text-xs text-gray-600 text-center font-mono">
                        {brandData.secondaryColor}
                      </p>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div
                        className="h-24 rounded-xl flex items-center justify-center text-white font-medium shadow-sm"
                        style={{ backgroundColor: brandData.accentColor || '#A855F7' }}
                      >
                        {t('onboarding.step2.accentSwatch')}
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
                <span className="relative z-10">{t('actions.previous')}</span>
              </motion.button>

              <motion.button
                onClick={onNext}
                disabled={!hasPaletteSelection}
                className="relative overflow-hidden px-8 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                whileHover={{ scale: hasPaletteSelection ? 1.02 : 1 }}
                whileTap={{ scale: hasPaletteSelection ? 0.98 : 1 }}
              >
                <span className="relative z-10 text-white dark:text-black">{t('actions.next')}</span>
              </motion.button>
            </div>
          </div>
        </div>
        <Footer hideLinks={true} />
      </div>
    </div>
  )
}
