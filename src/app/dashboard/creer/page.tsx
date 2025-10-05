'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, X } from 'lucide-react'
import { useUser } from '@stackframe/stack'

// Import des étapes
import Step1BasicInfo from '@/components/onboarding/Step1BasicInfo'
import Step2Colors from '@/components/onboarding/Step2Colors'
import Step3Typography from '@/components/onboarding/Step3Typography'
import Step4Personality from '@/components/onboarding/Step4Personality'

interface BrandData {
  id?: string
  prompt: string
  name: string
  description?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  primaryFont?: string
  secondaryFont?: string
  brandPersonality?: string
  targetAudience?: string
  coverImage?: string
  currentStep: number
}

export default function CreerPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const user = useUser({ or: 'redirect' })
  const [brandData, setBrandData] = useState<BrandData>({
    prompt: '',
    name: 'Mon Nouveau Branding',
    currentStep: 1
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [brandId, setBrandId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const steps = [
    { number: 1, title: 'Informations', component: Step1BasicInfo },
    { number: 2, title: 'Couleurs', component: Step2Colors },
    { number: 3, title: 'Typographie', component: Step3Typography },
    { number: 4, title: 'Personnalité', component: Step4Personality },
  ]

  useEffect(() => {
    // Charger l'étape depuis l'URL
    const step = parseInt(searchParams.get('step') || '1')
    setCurrentStep(step)
  }, [searchParams])

  // Sauvegarder automatiquement à chaque changement
  const updateBrandData = async (newData: Partial<BrandData>) => {
    const updated = { ...brandData, ...newData }
    setBrandData(updated)

    // Sauvegarder automatiquement dans la base de données
    await autoSave(updated)
  }

  const autoSave = async (data: BrandData) => {
    if (!user) return

    setSaving(true)
    try {
      if (brandId) {
        // Mettre à jour le brand existant
        const response = await fetch(`/api/brands/${brandId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            isCompleted: false,
            currentStep: currentStep
          }),
        })

        if (!response.ok) {
          console.error('Erreur lors de la sauvegarde')
        }
      } else {
        // Créer un nouveau brand
        const response = await fetch('/api/brands', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            isCompleted: false,
            currentStep: currentStep
          }),
        })

        if (response.ok) {
          const newBrand = await response.json()
          setBrandId(newBrand.id)
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde automatique:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleNext = async () => {
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      await updateBrandData({ currentStep: nextStep })
      router.push(`/dashboard/creer?step=${nextStep}`)
    } else {
      // Dernière étape : marquer comme terminé et rediriger
      await finalizeBrand()
    }
  }

  const finalizeBrand = async () => {
    if (!brandId) return

    setSaving(true)
    try {
      const response = await fetch(`/api/brands/${brandId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isCompleted: true,
          currentStep: 4
        }),
      })

      if (response.ok) {
        router.push(`/brand/${brandId}`)
      }
    } catch (error) {
      console.error('Erreur lors de la finalisation:', error)
    } finally {
      setSaving(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      router.push(`/dashboard/creer?step=${prevStep}`)
    } else {
      // À l'étape 1, afficher le modal d'annulation
      setShowCancelModal(true)
    }
  }

  const handleCancelCreation = async () => {
    // Supprimer le brand en cours si il existe
    if (brandId) {
      try {
        await fetch(`/api/brands/${brandId}`, {
          method: 'DELETE',
        })
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }
    
    // Nettoyer le sessionStorage et localStorage
    sessionStorage.removeItem('brandData')
    sessionStorage.removeItem('downloadIntent')
    localStorage.removeItem('pendingBrandData')
    localStorage.removeItem('downloadIntent')
    
    // Retourner au dashboard
    router.push('/dashboard')
  }

  const CurrentStepComponent = steps[currentStep - 1].component

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gray-100 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-stone-900 via-gray-800 to-stone-900"
          initial={{ width: `${(currentStep / steps.length) * 100}%` }}
          animate={{ width: `${(currentStep / steps.length) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Auto-save indicator */}
      <AnimatePresence>
        {saving && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-4 py-2 bg-black text-white text-sm rounded-full shadow-lg flex items-center gap-2"
          >
            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sauvegarde en cours...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Header - En haut à droite */}
      <div className="fixed top-6 right-6 z-40">
        <motion.button
          onClick={() => currentStep === 1 ? setShowCancelModal(true) : handlePrevious()}
          className={`flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-colors ${
            currentStep === 1 ? 'border border-red-300 text-red-600 hover:bg-red-50' : ''
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">{currentStep === 1 ? 'Annuler' : 'Retour'}</span>
        </motion.button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <CurrentStepComponent
            brandData={brandData}
            updateBrandData={updateBrandData}
            currentStep={currentStep}
            totalSteps={steps.length}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </motion.div>
      </AnimatePresence>

      {/* Modal de confirmation d'annulation */}
      <AnimatePresence>
        {showCancelModal && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
              onClick={() => setShowCancelModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
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
                  <h3 className="text-2xl font-bold text-black mb-3">
                    Annuler la création ?
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Êtes-vous sûr de vouloir annuler ? Toutes vos modifications seront définitivement perdues.
                  </p>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      onClick={() => setShowCancelModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continuer la création
                    </motion.button>
                    
                    <motion.button
                      onClick={handleCancelCreation}
                      disabled={saving}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-semibold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50"
                      whileHover={{ scale: saving ? 1 : 1.02 }}
                      whileTap={{ scale: saving ? 1 : 0.98 }}
                    >
                      {saving ? 'Suppression...' : 'Oui, annuler'}
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

