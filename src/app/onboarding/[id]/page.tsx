'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

// Import des étapes
import Step1BasicInfo from '@/components/onboarding/Step1BasicInfo'
import Step2Colors from '@/components/onboarding/Step2Colors'
import Step3Typography from '@/components/onboarding/Step3Typography'
import Step4Personality from '@/components/onboarding/Step4Personality'

interface BrandData {
  id: string
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
  currentStep: number
  isTemp: boolean
}

export default function OnboardingPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [brandData, setBrandData] = useState<BrandData | null>(null)
  const [currentStep, setCurrentStep] = useState(1)

  const steps = [
    { number: 1, title: 'Informations', component: Step1BasicInfo },
    { number: 2, title: 'Couleurs', component: Step2Colors },
    { number: 3, title: 'Typographie', component: Step3Typography },
    { number: 4, title: 'Personnalité', component: Step4Personality },
  ]

  useEffect(() => {
    const loadBrandData = async () => {
      // D'abord, essayer de charger depuis sessionStorage (nouveau brand)
      const stored = sessionStorage.getItem('brandData')
      if (stored) {
        const data = JSON.parse(stored)
        setBrandData(data)
        const step = parseInt(searchParams.get('step') || '1')
        setCurrentStep(step)
        return
      }

      // Sinon, essayer de charger depuis l'API (modification d'un brand existant)
      try {
        const response = await fetch(`/api/brands/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          // Convertir les données de l'API vers le format BrandData
          const brandData: BrandData = {
            id: data.id,
            prompt: data.prompt || '',
            name: data.name,
            description: data.description || '',
            primaryColor: data.primaryColor || '',
            secondaryColor: data.secondaryColor || '',
            accentColor: data.accentColor || '',
            primaryFont: data.primaryFont || '',
            secondaryFont: data.secondaryFont || '',
            brandPersonality: data.brandPersonality || '',
            targetAudience: data.targetAudience || '',
            currentStep: data.currentStep || 1,
            isTemp: false
          }
          setBrandData(brandData)
          sessionStorage.setItem('brandData', JSON.stringify(brandData))
          const step = parseInt(searchParams.get('step') || String(data.currentStep || 1))
          setCurrentStep(step)
        } else {
          // Si le brand n'est pas trouvé, rediriger
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error loading brand:', error)
        router.push('/dashboard')
      }
    }

    loadBrandData()
  }, [params.id, searchParams, router])

  const updateBrandData = (updates: Partial<BrandData>) => {
    if (!brandData) return
    
    const newData = { ...brandData, ...updates }
    setBrandData(newData)
    sessionStorage.setItem('brandData', JSON.stringify(newData))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      updateBrandData({ currentStep: nextStep })
      router.push(`/onboarding/${params.id}?step=${nextStep}`)
    } else {
      // Dernière étape : rediriger vers le preview
      router.push(`/brand/preview/${params.id}`)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      router.push(`/onboarding/${params.id}?step=${prevStep}`)
    }
  }

  if (!brandData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  const CurrentStepComponent = steps[currentStep - 1].component

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background gradient animé */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"
        animate={{
          background: [
            "linear-gradient(135deg, #f9fafb 0%, #ffffff 50%, #f3f4f6 100%)",
            "linear-gradient(135deg, #f3f4f6 0%, #ffffff 50%, #f9fafb 100%)",
            "linear-gradient(135deg, #f9fafb 0%, #ffffff 50%, #f3f4f6 100%)"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Progress bar globale */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-stone-900 to-red-900"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / steps.length) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ 
            duration: 0.4,
            ease: "easeInOut"
          }}
          className="relative z-10"
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

      {/* Indicateur de step flottant */}
      <motion.div
        className="fixed bottom-8 right-8 z-40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-white/90 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-white/20">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index + 1 <= currentStep 
                      ? 'bg-black' 
                      : 'bg-gray-300'
                  }`}
                  animate={{
                    scale: index + 1 === currentStep ? 1.2 : 1,
                    backgroundColor: index + 1 <= currentStep ? '#000000' : '#d1d5db'
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {currentStep}/{steps.length}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

