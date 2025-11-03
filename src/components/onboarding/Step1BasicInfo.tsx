'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { X, Wand2, Loader2, RefreshCw } from 'lucide-react'
import Footer from '@/components/Footer'
import { useTranslations } from '@/contexts/LanguageContext'

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
  const [showNameWarningModal, setShowNameWarningModal] = useState(false)
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<{
    description: string
    suggestions: string[]
    tone: string
    sector: string
  } | null>(null)
  const t = useTranslations()
  const safeCurrentStep = Math.max(currentStep, 1)
  const safeTotalSteps = Math.max(totalSteps, safeCurrentStep)
  const stepIndicator = t('onboarding.stepIndicator', { current: safeCurrentStep, total: safeTotalSteps })
  const aiTexts = useMemo(() => ({
    buttonIdle: t('onboarding.step1.ai.buttonIdle'),
    buttonGenerating: t('onboarding.step1.ai.buttonGenerating'),
    errorNoName: t('onboarding.step1.ai.errorNoName'),
    errorGeneration: t('onboarding.step1.ai.errorGeneration'),
    errorDescription: t('onboarding.step1.ai.errorDescription'),
    modalTitle: t('onboarding.step1.ai.modalTitle'),
    mainDescription: t('onboarding.step1.ai.mainDescription'),
    useDescription: t('onboarding.step1.ai.useDescription'),
    alternatives: t('onboarding.step1.ai.alternatives'),
    use: t('onboarding.step1.ai.use'),
    regenerate: t('onboarding.step1.ai.regenerate'),
    close: t('onboarding.step1.ai.close'),
  }), [t])
  const cancelTexts = useMemo(() => ({
    title: t('modals.cancelCreation.title'),
    description: t('modals.cancelCreation.description'),
    keepEditing: t('modals.cancelCreation.keepEditing'),
    confirm: t('modals.cancelCreation.confirm'),
  }), [t])
  const descriptionLength = useMemo(() => (brandData.description || '').trim().length, [brandData.description])

  const handleCancel = () => {
    // Nettoyer le sessionStorage
    sessionStorage.removeItem('brandData')
    sessionStorage.removeItem('downloadIntent')
    // Rediriger vers la page d'accueil
    router.push('/')
  }

  const handleNext = () => {
    // Vérifier si le prompt (idée initiale) est rempli
    if (!brandData.prompt || brandData.prompt.trim().length === 0) {
      alert('Veuillez d\'abord remplir l\'idée initiale avant de continuer.')
      return
    }
    
    // Vérifier si le nom est toujours la valeur par défaut
    if (brandData.name.trim() === 'Mon Branding') {
      setShowNameWarningModal(true)
      return
    }
    onNext()
  }

  const handleConfirmNameContinue = () => {
    setShowNameWarningModal(false)
    onNext()
  }

  const generateAIDescription = async () => {
    if (!brandData.name.trim()) {
      alert(aiTexts.errorNoName)
      return
    }

    if (!brandData.prompt || brandData.prompt.trim().length === 0) {
      alert("Veuillez d'abord remplir l'idée initiale avant de générer une description.")
      return
    }

    setIsGeneratingDescription(true)
    try {
      const response = await fetch('/api/ai/suggest-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: brandData.name,
          idea: brandData.prompt
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAiSuggestions(data)
        setShowAISuggestions(true)
      } else {
        const error = await response.json()
        alert(error.error || aiTexts.errorGeneration)
      }
    } catch (error) {
      console.error('Error generating description:', error)
      alert(aiTexts.errorDescription)
    } finally {
      setIsGeneratingDescription(false)
    }
  }

  const applyAISuggestion = (description: string) => {
    updateBrandData({ description })
    setShowAISuggestions(false)
  }

  const regenerateAIDescription = () => {
    generateAIDescription()
  }
  return (
    <div className="fixed inset-0 flex flex-col md:flex-row">
      {/* Image gauche - 1/4 - hidden on mobile */}
      <div className="hidden md:block md:w-1/4 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1575041051612-323e644ca1b8?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Brand Identity"
          fill
          sizes="(min-width: 768px) 25vw"
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
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <h2 className="text-4xl sm:text-5xl font-bold text-black dark:text-white">
                {t('onboarding.step1.title')}
              </h2>
              <span className="text-gray-400 text-2xl sm:text-3xl">{stepIndicator}</span>
            </div>
            <p className="text-gray-600 text-lg mb-12">
              {t('onboarding.step1.subtitle')}
            </p>

            {/* Champ de saisie pour l'idée initiale */}
            <div className="mb-12">
              <label htmlFor="prompt" className={`block text-sm font-medium mb-3 ${
                !brandData.prompt || brandData.prompt.trim().length === 0 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {t('onboarding.step1.promptLabel')} {(!brandData.prompt || brandData.prompt.trim().length === 0) && <span className="text-red-500">*</span>}
              </label>
              <textarea
                id="prompt"
                value={brandData.prompt || ''}
                onChange={(e) => updateBrandData({ prompt: e.target.value })}
                placeholder="Décrivez votre idée de branding, votre projet, vos besoins..."
                rows={4}
                className={`w-full px-6 py-4 bg-white dark:bg-black border rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent text-black dark:text-white placeholder-gray-400 resize-none transition-all ${
                  !brandData.prompt || brandData.prompt.trim().length === 0 
                    ? 'border-red-300 dark:border-red-800/50 focus:ring-red-500' 
                    : 'border-gray-200 dark:border-white/20 focus:ring-black'
                }`}
              />
              {(!brandData.prompt || brandData.prompt.trim().length === 0) && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-2">
                  L&apos;idée initiale est obligatoire pour continuer
                </p>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-3">
                  {t('onboarding.step1.nameLabel')}
                </label>
                <input
                  type="text"
                  id="name"
                  value={brandData.name}
                  onChange={(e) => updateBrandData({ name: e.target.value })}
                  placeholder={t('onboarding.step1.namePlaceholder')}
                  className="w-full px-6 py-4 bg-white dark:bg-black border border-gray-200 dark:border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black dark:text-white placeholder-gray-400 text-lg transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                    {t('onboarding.step1.descriptionLabel')}
                  </label>
                  <motion.button
                    onClick={generateAIDescription}
                    disabled={
                      isGeneratingDescription || 
                      !brandData.name.trim() || 
                      !brandData.prompt || 
                      brandData.prompt.trim().length === 0
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white text-sm font-medium rounded-full transition-all duration-200 disabled:cursor-not-allowed"
                    whileHover={{ scale: isGeneratingDescription ? 1 : 1.05 }}
                    whileTap={{ scale: isGeneratingDescription ? 1 : 0.95 }}
                  >
                    {isGeneratingDescription ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {aiTexts.buttonGenerating}
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        {aiTexts.buttonIdle}
                      </>
                    )}
                  </motion.button>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>{t('onboarding.step1.descriptionHint')}</span>
                  <span>{descriptionLength}/400</span>
                </div>
                <textarea
                  id="description"
                  value={brandData.description || ''}
                  maxLength={400}
                  onChange={(e) => updateBrandData({ description: e.target.value })}
                  placeholder={t('onboarding.step1.descriptionPlaceholder')}
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
                <span className="relative z-10">{t('actions.cancel')}</span>
              </motion.button>

              <motion.button
                onClick={handleNext}
                disabled={
                  !brandData.name || 
                  brandData.name.trim().length === 0 ||
                  !brandData.prompt ||
                  brandData.prompt.trim().length === 0
                }
                className="relative overflow-hidden px-8 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ 
                  scale: (!brandData.name || brandData.name.trim().length === 0 || !brandData.prompt || brandData.prompt.trim().length === 0) ? 1 : 1.02 
                }}
                whileTap={{ 
                  scale: (!brandData.name || brandData.name.trim().length === 0 || !brandData.prompt || brandData.prompt.trim().length === 0) ? 1 : 0.98 
                }}
              >
                <span className="relative z-10 text-white dark:text-black">{t('actions.next')}</span>
              </motion.button>
            </div>
            </div>
          </div>
        </div>
        <Footer hideLinks={true} />
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
                    {cancelTexts.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {cancelTexts.description}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      onClick={() => setShowCancelModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {cancelTexts.keepEditing}
                    </motion.button>
                    
                    <motion.button
                      onClick={handleCancel}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-semibold hover:from-red-600 hover:to-red-700 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {cancelTexts.confirm}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI Suggestions Modal */}
      <AnimatePresence>
        {showAISuggestions && aiSuggestions && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
              onClick={() => setShowAISuggestions(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-black rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
                {/* Decorative gradient */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-red-600 to-red-500 rounded-t-3xl" />
                
                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mb-4"
                    >
                      <Wand2 className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
                      {aiTexts.modalTitle}
                    </h3>
                    
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                        {aiSuggestions.tone}
                      </span>
                      <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                        {aiSuggestions.sector}
                      </span>
                    </div>
                  </div>

                  {/* Main Description */}
                  <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black border border-gray-200 dark:border-white/20 rounded-2xl p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{aiTexts.mainDescription}</p>
                    <p className="text-gray-900 dark:text-white leading-relaxed mb-4">
                      {aiSuggestions.description}
                    </p>
                    <motion.button
                      onClick={() => applyAISuggestion(aiSuggestions.description)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full font-semibold transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {aiTexts.useDescription}
                    </motion.button>
                  </div>

                  {/* Alternative Suggestions */}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{aiTexts.alternatives}</p>
                    <div className="space-y-3">
                      {aiSuggestions.suggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/20 rounded-xl p-4 hover:border-red-300 dark:hover:border-red-500 transition-colors"
                        >
                          <p className="text-gray-900 dark:text-white text-sm leading-relaxed mb-3">
                            {suggestion}
                          </p>
                          <motion.button
                          onClick={() => applyAISuggestion(suggestion)}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-700 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-300 rounded-full text-xs font-medium transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {aiTexts.use}
                        </motion.button>
                      </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <motion.button
                      onClick={regenerateAIDescription}
                      disabled={isGeneratingDescription}
                      className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      whileHover={{ scale: isGeneratingDescription ? 1 : 1.02 }}
                      whileTap={{ scale: isGeneratingDescription ? 1 : 0.98 }}
                    >
                      <RefreshCw className={`w-4 h-4 ${isGeneratingDescription ? 'animate-spin' : ''}`} />
                      {aiTexts.regenerate}
                    </motion.button>
                    
                    <motion.button
                      onClick={() => setShowAISuggestions(false)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-full font-semibold transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {aiTexts.close}
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
