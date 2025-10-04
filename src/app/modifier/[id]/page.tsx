'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { LiquidButton } from '@/components/LiquidGlassButton'
import Header from '@/components/Header'

interface Brand {
  id: string
  name: string
  description: string | null
  primaryColor: string | null
  secondaryColor: string | null
  accentColor: string | null
  primaryFont: string | null
  secondaryFont: string | null
  brandPersonality: string | null
  targetAudience: string | null
  currentStep: number
}

const modificationOptions = [
  {
    id: 'colors',
    title: 'Couleurs',
    description: 'Modifier la palette de couleurs',
    question: 'Quelles couleurs souhaitez-vous utiliser ?',
    step: 2
  },
  {
    id: 'typography',
    title: 'Typographie',
    description: 'Changer les polices',
    question: 'Quelles polices préférez-vous ?',
    step: 3
  },
  {
    id: 'personality',
    title: 'Personnalité',
    description: 'Ajuster la personnalité de la marque',
    question: 'Comment décririez-vous votre marque ?',
    step: 4
  },
  {
    id: 'name',
    title: 'Nom',
    description: 'Changer le nom de la marque',
    question: 'Quel est le nouveau nom ?',
    step: 1
  }
]

export default function ModifierPage() {
  const params = useParams()
  const router = useRouter()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [aiInput, setAiInput] = useState('')
  const [generating, setGenerating] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<any>(null)

  useEffect(() => {
    if (params.id) {
      fetchBrand()
    }
  }, [params.id])

  const fetchBrand = async () => {
    try {
      const response = await fetch(`/api/brands/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setBrand(data)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error fetching brand:', error)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleAISuggestion = async () => {
    if (!aiInput.trim() || !selectedOption) return

    setGenerating(true)
    setAiSuggestion(null)

    try {
      const option = modificationOptions.find(opt => opt.id === selectedOption)
      
      if (selectedOption === 'colors') {
        const response = await fetch('/api/ai/suggest-colors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: aiInput,
            personality: brand?.brandPersonality,
            targetAudience: brand?.targetAudience
          })
        })

        if (response.ok) {
          const data = await response.json()
          setAiSuggestion(data)
        }
      } else if (selectedOption === 'typography') {
        const response = await fetch('/api/ai/suggest-fonts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: aiInput,
            personality: brand?.brandPersonality,
            targetAudience: brand?.targetAudience
          })
        })

        if (response.ok) {
          const data = await response.json()
          setAiSuggestion(data)
        }
      }
    } catch (error) {
      console.error('Error getting AI suggestion:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleApplySuggestion = async () => {
    if (!aiSuggestion || !brand) return

    try {
      const updateData: any = {}

      if (selectedOption === 'colors') {
        updateData.primaryColor = aiSuggestion.primaryColor
        updateData.secondaryColor = aiSuggestion.secondaryColor
        updateData.accentColor = aiSuggestion.accentColor
      } else if (selectedOption === 'typography') {
        updateData.primaryFont = aiSuggestion.primaryFont
        updateData.secondaryFont = aiSuggestion.secondaryFont
      } else if (selectedOption === 'name') {
        updateData.name = aiInput
      } else if (selectedOption === 'personality') {
        updateData.brandPersonality = aiInput
      }

      const response = await fetch(`/api/brands/${brand.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        router.push(`/brand/${brand.id}`)
      }
    } catch (error) {
      console.error('Error updating brand:', error)
    }
  }

  const handleDirectModification = () => {
    const option = modificationOptions.find(opt => opt.id === selectedOption)
    if (option && brand) {
      router.push(`/onboarding/${brand.id}?step=${option.step}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!brand) return null

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="pt-32 md:pt-40 pb-12 md:pb-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Bouton retour */}
          <motion.button
            onClick={() => router.push(`/brand/${brand.id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-8"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Modifier {brand.name}
            </h1>
            <p className="text-lg text-gray-600">
              Que souhaitez-vous modifier ?
            </p>
          </motion.div>

          {/* Options Grid */}
          {!selectedOption ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modificationOptions.map((option, index) => (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedOption(option.id)}
                  className="p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-lg transition-all text-left"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="text-xl font-bold text-black mb-2">{option.title}</h3>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                </motion.button>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Selected Option */}
                <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-black">
                      {modificationOptions.find(opt => opt.id === selectedOption)?.title}
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedOption(null)
                        setAiInput('')
                        setAiSuggestion(null)
                      }}
                      className="text-gray-500 hover:text-black transition-colors"
                    >
                      Changer
                    </button>
                  </div>
                  <p className="text-gray-600">
                    {modificationOptions.find(opt => opt.id === selectedOption)?.question}
                  </p>
                </div>

                {/* AI Input */}
                <div className="space-y-4">
                  <textarea
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Décrivez ce que vous souhaitez..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent resize-none"
                    rows={4}
                  />

                  <div className="flex gap-3">
                    <LiquidButton
                      onClick={handleAISuggestion}
                      disabled={!aiInput.trim() || generating}
                      className="flex-1 py-3 bg-gradient-to-r from-stone-900 to-gray-800 text-white rounded-full font-semibold hover:from-red-900 hover:to-red-600 transition-all disabled:opacity-50"
                    >
                      {generating ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Génération...
                        </span>
                      ) : (
                        'Suggérer avec IA'
                      )}
                    </LiquidButton>

                    <motion.button
                      onClick={handleDirectModification}
                      className="px-6 py-3 bg-white border border-gray-200 text-black rounded-full font-semibold hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Modifier manuellement
                    </motion.button>
                  </div>
                </div>

                {/* AI Suggestion */}
                {aiSuggestion && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-2xl p-6"
                  >
                    <h4 className="text-lg font-bold text-black mb-4">Suggestion IA</h4>
                    
                    {selectedOption === 'colors' && (
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          {[aiSuggestion.primaryColor, aiSuggestion.secondaryColor, aiSuggestion.accentColor]
                            .filter(Boolean)
                            .map((color, idx) => (
                              <div key={idx} className="flex-1">
                                <div
                                  className="w-full h-20 rounded-xl border border-gray-200"
                                  style={{ backgroundColor: color }}
                                />
                                <p className="text-xs font-mono text-gray-600 mt-2">{color}</p>
                              </div>
                            ))}
                        </div>
                        {aiSuggestion.explanation && (
                          <p className="text-sm text-gray-600">{aiSuggestion.explanation}</p>
                        )}
                      </div>
                    )}

                    {selectedOption === 'typography' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-2">Police Principale</p>
                            <p className="text-2xl font-bold" style={{ fontFamily: aiSuggestion.primaryFont }}>
                              {aiSuggestion.primaryFont}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-2">Police Secondaire</p>
                            <p className="text-2xl font-bold" style={{ fontFamily: aiSuggestion.secondaryFont }}>
                              {aiSuggestion.secondaryFont}
                            </p>
                          </div>
                        </div>
                        {aiSuggestion.explanation && (
                          <p className="text-sm text-gray-600">{aiSuggestion.explanation}</p>
                        )}
                      </div>
                    )}

                    <LiquidButton
                      onClick={handleApplySuggestion}
                      className="w-full mt-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
                    >
                      Appliquer cette suggestion
                    </LiquidButton>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  )
}

