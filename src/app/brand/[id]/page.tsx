'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Edit, Download, X, Eye } from 'lucide-react'
import { useUser } from '@stackframe/stack'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialShare from '@/components/SocialShare'
import { generateModernBrandPDF } from '@/utils/generatePDF'

interface Brand {
  id: string
  name: string
  description: string | null
  prompt: string
  primaryColor: string | null
  secondaryColor: string | null
  accentColor: string | null
  primaryFont: string | null
  secondaryFont: string | null
  brandPersonality: string | null
  targetAudience: string | null
  isCompleted: boolean
  currentStep: number
}

export default function BrandPage() {
  const params = useParams()
  const router = useRouter()
  const user = useUser({ or: 'return-null' })
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [images, setImages] = useState<{[key: string]: string}>({
    hero: '',
    typography: '',
    personality: '',
    accent: '',
    application: ''
  })

  const handleDownloadPDF = async () => {
    if (!brand) return
    setDownloadingPDF(true)
    try {
      await generateModernBrandPDF(brand, images)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setDownloadingPDF(false)
      setShowPreviewModal(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchBrand()
    }
  }, [params.id])

  const generateImages = async (brandData: Brand) => {
    const searchTerms = [
      brandData.description || brandData.name,
      brandData.brandPersonality,
      brandData.targetAudience
    ].filter(Boolean).join(' ')

    // Définir les requêtes pour chaque catégorie avec diversité
    const queries = {
      hero: `${searchTerms} business brand black professional`,
      typography: 'typography design text black professional',
      personality: `${brandData.brandPersonality || 'modern'} lifestyle black professional`,
      accent: `abstract ${brandData.brandPersonality || 'modern'} pattern black`,
      application: `${searchTerms} office workspace black professional`
    }

    const newImages: {[key: string]: string} = {}

    // Récupérer les images en parallèle avec un seed unique pour chaque
    await Promise.all(
      Object.entries(queries).map(async ([key, query]) => {
        try {
          const response = await fetch('/api/get-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              query,
              seed: `${brandData.id}-${key}` // Seed unique pour chaque image
            })
          })

          if (response.ok) {
            const data = await response.json()
            newImages[key] = data.image?.url || data.imageUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=900&fit=crop'
          }
        } catch (error) {
          console.error(`Error fetching ${key} image:`, error)
          // Fallback vers une image par défaut
          newImages[key] = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=900&fit=crop'
        }
      })
    )

    setImages(newImages)
  }

  const fetchBrand = async () => {
    try {
      const response = await fetch(`/api/brands/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setBrand(data)
        // Générer les images IA
        generateImages(data)
        
        // Vérifier si l'utilisateur est le propriétaire
        if (user) {
          const userResponse = await fetch('/api/user')
          if (userResponse.ok) {
            const userData = await userResponse.json()
            setIsOwner(userData.id === data.userId)
          }
        }
      } else {
        // Si non autorisé, rediriger vers la page d'accueil au lieu du dashboard
        if (response.status === 401 || response.status === 403) {
          router.push('/')
        } else {
          router.push(user ? '/dashboard' : '/')
        }
      }
    } catch (error) {
      console.error('Error fetching brand:', error)
      router.push(user ? '/dashboard' : '/')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!brand) {
    return null
  }

  const gradient1 = `linear-gradient(135deg, ${brand.primaryColor || '#000'}, ${brand.secondaryColor || '#333'})`
  const gradient2 = `linear-gradient(135deg, ${brand.secondaryColor || '#333'}, ${brand.accentColor || '#666'})`
  const gradient3 = `linear-gradient(135deg, ${brand.accentColor || '#666'}, ${brand.primaryColor || '#000'})`

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 px-4 md:px-8">
        {/* Bouton retour */}
        <div className="max-w-7xl mx-auto mb-8">
          <motion.button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au dashboard
          </motion.button>
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 md:mb-24 flex justify-between items-start"
          >
            <div>
              <motion.h1
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-6 md:mb-8 tracking-tighter text-black"
                style={{ fontFamily: brand.primaryFont || 'sans-serif' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {brand.name}
              </motion.h1>

              {brand.description && (
                <motion.p
                  className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {brand.description}
                </motion.p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {/* Bouton de partage - visible pour tous */}
              <SocialShare
                brandName={brand.name}
                brandDescription={brand.description || undefined}
                brandUrl={typeof window !== 'undefined' ? window.location.href : ''}
              />
              
              {/* Actions propriétaire */}
              {isOwner && (
                <>
                  <motion.button
                    onClick={() => router.push(`/modifier/${brand.id}`)}
                    className="p-4 bg-white border border-black/10 rounded-full hover:bg-black hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title="Modifier le branding"
                  >
                    <Edit className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={() => setShowPreviewModal(true)}
                    className="p-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title="Télécharger en PDF"
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>

          {/* Le même Bento Grid que dans preview */}
          <div className="grid grid-cols-4 md:grid-cols-12 gap-3 md:gap-4">
            
            {/* Card 1: Primary Brand */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="col-span-4 md:col-span-6 h-[300px] md:h-[400px] rounded-3xl relative overflow-hidden group"
              style={{ background: gradient1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <h2
                  className="text-7xl md:text-8xl font-bold text-white text-center"
                  style={{ fontFamily: brand.primaryFont || 'sans-serif' }}
                >
                  {brand.name}
                </h2>
              </div>

              {brand.primaryColor && (
                <div className="absolute bottom-6 right-6 px-4 py-2 rounded-full bg-white/90 backdrop-blur-xl">
                  <p className="text-gray-800 text-sm font-mono">
                    {brand.primaryColor}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Card 2: Color Palette */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="col-span-4 md:col-span-6 h-[300px] md:h-[400px] rounded-3xl bg-white border border-gray-200 p-6 md:p-8"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-xs font-bold text-gray-400 mb-6 md:mb-8 uppercase tracking-widest">
                Palette Chromatique
              </p>

              <div className="space-y-4 md:space-y-5">
                {[
                  { color: brand.primaryColor, label: 'Primary' },
                  { color: brand.secondaryColor, label: 'Secondary' },
                  { color: brand.accentColor, label: 'Accent' }
                ]
                  .filter(item => item.color)
                  .map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-4"
                      initial={{ x: -30, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                    >
                      <motion.div
                        className="w-16 h-16 md:w-20 md:h-20 rounded-xl border border-gray-200"
                        style={{ backgroundColor: item.color! }}
                        whileHover={{
                          scale: 1.1,
                          rotate: 5,
                          transition: { duration: 0.3 }
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-400 text-xs md:text-sm mb-1">
                          {item.label}
                        </p>
                        <p className="text-black font-mono text-sm md:text-base truncate">
                          {item.color}
                        </p>
                        <motion.div
                          className="h-1 rounded-full mt-2"
                          style={{ backgroundColor: item.color! }}
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.3 + idx * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>

              {/* Card 3: Typography */}
            {brand.primaryFont && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="col-span-4 md:col-span-4 h-[280px] md:h-[350px] rounded-2xl md:rounded-3xl relative overflow-hidden group"
                style={{ background: gradient2 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                {images.typography && (
                  <img
                    src={images.typography}
                    alt="Typography"
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                  />
                )}

                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                  <p className="text-xs font-bold text-white/80 uppercase tracking-widest">
                    Typographie
                  </p>

                  <div>
                    <motion.p
                      className="text-7xl md:text-8xl font-bold text-white mb-3 md:mb-4"
                      style={{ fontFamily: brand.primaryFont }}
                      whileHover={{ rotate: 5, transition: { duration: 0.4 } }}
                    >
                      Aa
                    </motion.p>
                    <div className="px-3 md:px-4 py-2 rounded-full bg-white/90 backdrop-blur-xl inline-block">
                      <p className="text-gray-800 text-xs md:text-sm">
                        {brand.primaryFont}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Card 4: Personality */}
            {brand.brandPersonality && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="col-span-4 md:col-span-8 h-[280px] md:h-[350px] rounded-2xl md:rounded-3xl relative overflow-hidden group"
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                {images.personality ? (
                  <img
                    src={images.personality}
                    alt="Brand Personality"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />

                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
                  <p className="text-xs font-bold text-white/60 mb-4 md:mb-6 uppercase tracking-widest">
                    Personnalité de Marque
                  </p>
                  <motion.h3
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 capitalize"
                    style={{ fontFamily: brand.primaryFont || 'sans-serif' }}
                    initial={{ x: -30, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    {brand.brandPersonality}
                  </motion.h3>
                  {brand.targetAudience && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <motion.div
                        className="h-px w-full sm:flex-1 bg-white/30"
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                      <div className="px-4 md:px-6 py-2 md:py-3 rounded-full bg-white/90 backdrop-blur-xl">
                        <p className="text-black text-sm md:text-base lg:text-lg capitalize whitespace-nowrap">
                          {brand.targetAudience}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Card 5: Secondary Typography */}
            {brand.secondaryFont && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="col-span-4 md:col-span-7 h-[280px] md:h-[350px] rounded-2xl md:rounded-3xl relative overflow-hidden"
                style={{ background: gradient3 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between">
                  <p className="text-xs font-bold text-white/80 uppercase tracking-widest">
                    Typographie Secondaire
                  </p>

                  <div>
                    <motion.p
                      className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 md:mb-6"
                      style={{ fontFamily: brand.secondaryFont }}
                      initial={{ y: 30, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                    >
                      {brand.name}
                    </motion.p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="px-4 md:px-6 py-2 md:py-3 rounded-full bg-white/90 backdrop-blur-xl">
                        <p className="text-black text-xs md:text-sm">{brand.secondaryFont}</p>
                      </div>
                      <motion.div
                        className="h-px w-full sm:flex-1 bg-white/30"
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Card 6: Accent Showcase */}
            {brand.accentColor && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="col-span-4 md:col-span-5 h-[280px] md:h-[350px] rounded-2xl md:rounded-3xl relative overflow-hidden group"
                style={{ backgroundColor: brand.accentColor }}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                {images.accent && (
                  <img
                    src={images.accent}
                    alt="Accent Color"
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                  />
                )}

                <div className="absolute inset-0 p-6 md:p-8 flex flex-col items-center justify-center text-center">
                  <p className="text-xs font-bold mt-7 text-white/80 mb-6 md:mb-8 uppercase tracking-widest">
                    Couleur d&apos;Accent
                  </p>

                  <div className="px-4 md:px-6 py-2 md:py-3 rounded-full bg-white/90 backdrop-blur-xl">
                    <p className="text-gray-800 font-mono text-xs md:text-sm">
                      {brand.accentColor}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Card 7: Full Application */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="col-span-4 md:col-span-12 h-[400px] md:h-[500px] rounded-2xl md:rounded-3xl relative overflow-hidden group"
              whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
            >
              {images.application ? (
                <img
                  src={images.application}
                  alt="Brand Application"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

              <div className="absolute inset-0 p-6 md:p-12 lg:p-16 flex flex-col justify-between">
                <div />

                <div>
                  <motion.h2
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 md:mb-8"
                    style={{ fontFamily: brand.primaryFont || 'sans-serif' }}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    {brand.name}
                  </motion.h2>

                  <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-8">
                    {brand.description && (
                      <motion.p
                        className="text-base md:text-xl lg:text-2xl text-white/90 max-w-2xl"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        {brand.description}
                      </motion.p>
                    )}

                    <div className="flex gap-3 md:gap-4">
                      {[brand.primaryColor, brand.secondaryColor, brand.accentColor]
                        .filter(Boolean)
                        .map((color, idx) => (
                          <motion.div
                            key={idx}
                            className="w-12 h-24 md:w-16 md:h-32 lg:w-20 lg:h-40 rounded-xl md:rounded-2xl"
                            style={{ backgroundColor: color! }}
                            initial={{ y: 30, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            whileHover={{
                              y: -10,
                              scale: 1.05,
                              transition: { duration: 0.3 }
                            }}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* Modal d'aperçu PDF */}
      <AnimatePresence>
        {showPreviewModal && brand && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]"
              onClick={() => !downloadingPDF && setShowPreviewModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4"
              onClick={(e) => e.target === e.currentTarget && !downloadingPDF && setShowPreviewModal(false)}
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
                {/* Close button */}
                {!downloadingPDF && (
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto w-20 h-20 bg-gradient-to-br from-stone-900 to-red-900 rounded-full flex items-center justify-center mb-6"
                  >
                    <Eye className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-black mb-3">
                    Aperçu du PDF
                  </h3>
                  <p className="text-gray-600">
                    Votre Brand Guideline sera généré au format 16:9 (1920x1080px)
                  </p>
                </div>

                {/* Preview Cards */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {/* Page 1 */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div 
                      className="w-full aspect-video flex items-center justify-center text-white relative"
                      style={{ 
                        background: `linear-gradient(135deg, ${brand.primaryColor || '#000'}, ${brand.secondaryColor || '#333'})`
                      }}
                    >
                      <div className="text-center">
                        <h4 className="text-4xl font-light tracking-tight">{brand.name}</h4>
                        <p className="text-xs mt-2 tracking-[0.3em] uppercase">Brand Guidelines</p>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-[10px]">
                        Page 1
                      </div>
                    </div>
                  </div>

                  {/* Page 2 - Colors */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="w-full aspect-video bg-gray-50 p-4 relative">
                      <p className="text-xs font-semibold mb-2">Palette de Couleurs</p>
                      <div className="flex gap-2">
                        {[brand.primaryColor, brand.secondaryColor, brand.accentColor]
                          .filter(Boolean)
                          .map((color, idx) => (
                            <div 
                              key={idx}
                              className="w-12 h-12 rounded-lg"
                              style={{ backgroundColor: color! }}
                            />
                          ))}
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/10 backdrop-blur-sm px-2 py-1 rounded text-[10px]">
                        Page 2
                      </div>
                    </div>
                  </div>

                  {/* Page 3 - Typography */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="w-full aspect-video bg-white p-4 flex items-center justify-center relative">
                      <div className="text-center">
                        <p className="text-6xl font-light" style={{ fontFamily: brand.primaryFont || 'sans-serif' }}>
                          Aa
                        </p>
                        <p className="text-xs mt-2 text-gray-500">{brand.primaryFont || 'Default'}</p>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/10 backdrop-blur-sm px-2 py-1 rounded text-[10px]">
                        Page 3
                      </div>
                    </div>
                  </div>

                  {/* Page 4 - Personality */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div 
                      className="w-full aspect-video flex items-center justify-center text-white relative"
                      style={{ 
                        background: `linear-gradient(135deg, ${brand.secondaryColor || brand.primaryColor || '#000'}, ${brand.primaryColor || '#333'})`
                      }}
                    >
                      <div className="text-center">
                        <p className="text-xs tracking-[0.2em] uppercase mb-2">Personnalité</p>
                        <p className="text-2xl font-light capitalize">{brand.brandPersonality || 'Moderne'}</p>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-[10px]">
                        Page 4
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <h4 className="font-semibold text-black mb-3">Contenu du PDF</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>  Page de couverture personnalisée</li>
                    <li>  Palette de couleurs complète avec codes hex</li>
                    <li>  Typographie primaire et secondaire</li>
                    <li>  Personnalité de marque et audience cible</li>
                    <li>  Règles d&apos;application et guidelines</li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => setShowPreviewModal(false)}
                    disabled={downloadingPDF}
                    className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                    whileHover={{ scale: downloadingPDF ? 1 : 1.02 }}
                    whileTap={{ scale: downloadingPDF ? 1 : 0.98 }}
                  >
                    Annuler
                  </motion.button>
                  
                  <motion.button
                    onClick={handleDownloadPDF}
                    disabled={downloadingPDF}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-stone-900 to-gray-800 text-white rounded-full font-semibold hover:from-red-900 hover:to-red-600 transition-all disabled:opacity-50"
                    whileHover={{ scale: downloadingPDF ? 1 : 1.02 }}
                    whileTap={{ scale: downloadingPDF ? 1 : 0.98 }}
                  >
                    {downloadingPDF ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Génération en cours...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Download className="w-5 h-5" />
                        Télécharger le PDF
                      </span>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

