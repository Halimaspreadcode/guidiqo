'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Download, ArrowRight, Sparkles } from 'lucide-react'
import { useUser } from '@stackframe/stack'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { LiquidButton } from '@/components/LiquidGlassButton'
import SocialShare from '@/components/SocialShare'
import Link from 'next/link'

interface BrandData {
  id: string
  name: string
  description?: string
  prompt: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  primaryFont?: string
  secondaryFont?: string
  brandPersonality?: string
  targetAudience?: string
  isTemp: boolean
}

export default function PreviewPage() {
  const router = useRouter()
  const user = useUser({ or: 'return-null' })
  const [brandData, setBrandData] = useState<BrandData | null>(null)
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState<{[key: string]: string}>({
    hero: '',
    typography: '',
    personality: '',
    accent: '',
    application: ''
  })

  const { scrollYProgress } = useScroll()
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.95])

  useEffect(() => {
    // Essayer d'abord sessionStorage, puis localStorage
    const sessionStored = sessionStorage.getItem('brandData')
    const localStored = localStorage.getItem('pendingBrandData')
    
    const stored = sessionStored || localStored
    
    if (stored) {
      const data = JSON.parse(stored)
      setBrandData(data)
      // Générer les images IA
      generateImages(data)
      
      // Si on a chargé depuis localStorage, le copier dans sessionStorage
      if (localStored && !sessionStored) {
        sessionStorage.setItem('brandData', localStored)
      }
    } else {
      router.push('/')
    }
  }, [router])

  // Détecter quand l'utilisateur vient de se connecter et sauvegarder automatiquement
  useEffect(() => {
    const autoSave = async () => {
      const downloadIntent = localStorage.getItem('downloadIntent') || sessionStorage.getItem('downloadIntent')
      
      if (user && brandData && downloadIntent === 'true') {
        // Attendre un peu pour s'assurer que tout est chargé
        setTimeout(async () => {
          await saveBrandToDatabase(brandData)
        }, 500)
      }
    }

    autoSave()
  }, [user, brandData])

  const generateImages = async (data: BrandData) => {
    const searchTerms = [
      data.description || data.name,
      data.brandPersonality,
      data.targetAudience
    ].filter(Boolean).join(' ')

    // Définir les requêtes pour chaque catégorie avec diversité
    const queries = {
      hero: `${searchTerms} business brand black professional`,
      typography: 'typography design text black professional',
      personality: `${data.brandPersonality || 'modern'} lifestyle black professional`,
      accent: `abstract ${data.brandPersonality || 'modern'} pattern black`,
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
              seed: `${data.id}-${key}`,  // Seed unique pour chaque image
              provider: 'pexels'  // Forcer l'utilisation de Pexels
            })
          })

          if (response.ok) {
            const result = await response.json()
            newImages[key] = result.image?.url || result.imageUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=900&fit=crop'
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

  const saveBrandToDatabase = async (data: BrandData) => {
    setSaving(true)
    try {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          isCompleted: true,
          currentStep: 4,
        }),
      })

      if (response.ok) {
        const savedBrand = await response.json()
        // Nettoyer tous les storage
        sessionStorage.removeItem('brandData')
        sessionStorage.removeItem('downloadIntent')
        localStorage.removeItem('pendingBrandData')
        localStorage.removeItem('downloadIntent')
        // Rediriger vers le dashboard
        router.push('/dashboard')
        return true
      } else {
        const errorData = await response.json()
        console.error('❌ Erreur de sauvegarde:', errorData)
        return false
      }
    } catch (error) {
      console.error('Error saving brand:', error)
      alert('Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.')
      return false
    } finally {
      setSaving(false)
    }
  }

  const handleDownload = async () => {
    if (!user || !brandData) return
    await saveBrandToDatabase(brandData)
  }

  if (!brandData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  const gradient1 = `linear-gradient(135deg, ${brandData.primaryColor || '#000'}, ${brandData.secondaryColor || '#333'})`
  const gradient2 = `linear-gradient(135deg, ${brandData.secondaryColor || '#333'}, ${brandData.accentColor || '#666'})`
  const gradient3 = `linear-gradient(135deg, ${brandData.accentColor || '#666'}, ${brandData.primaryColor || '#000'})`

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 px-4 md:px-8 relative">
        {/* Overlay de floutage si pas connecté */}
        {!user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 bg-white/30 backdrop-blur-sm flex items-center justify-center"
            onClick={() => router.push('/auth/signin')}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl max-w-md mx-4 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">
                Connectez-vous pour sauvegarder
              </h3>
              <p className="text-gray-600 mb-8">
                Créez un compte pour sauvegarder votre branding et y accéder depuis votre dashboard
              </p>
              <div className="flex flex-col gap-3">
                <LiquidButton
                  onClick={() => {
                    // FORCER la sauvegarde dans localStorage
                    const dataToSave = brandData || JSON.parse(sessionStorage.getItem('brandData') || '{}')
                    
                    if (dataToSave && dataToSave.id) {
                      localStorage.setItem('pendingBrandData', JSON.stringify(dataToSave))
                      localStorage.setItem('downloadIntent', 'true')
                    }
                    router.push('/auth/signup')
                  }}
                  className="w-full py-4 items-center justify-center bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
                >
                  Créer un compte
                </LiquidButton>
                <motion.button
                  onClick={() => {
                    // FORCER la sauvegarde dans localStorage
                    const dataToSave = brandData || JSON.parse(sessionStorage.getItem('brandData') || '{}')
                    
                    if (dataToSave && dataToSave.id) {
                      localStorage.setItem('pendingBrandData', JSON.stringify(dataToSave))
                      localStorage.setItem('downloadIntent', 'true')
                    }
                    router.push('/auth/signin')
                  }}
                  className="w-full py-4  text-black  rounded-full font-semibold hover:bg-gray-50 transition-colors"
                >
                  Se connecter
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        <div className={`max-w-7xl mx-auto ${!user ? 'blur-sm pointer-events-none' : ''}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 md:mb-24"
          >
            <motion.h1
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-6 md:mb-8 tracking-tighter text-black"
              style={{ fontFamily: brandData.primaryFont || 'sans-serif' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {brandData.name}
            </motion.h1>

            {brandData.description && (
              <motion.p
                className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {brandData.description}
              </motion.p>
            )}
          </motion.div>

          {/* Bento Grid - Responsive */}
          <div className="grid grid-cols-4 md:grid-cols-12 gap-3 md:gap-4">
            
            {/* Card 1: Primary Brand */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="col-span-4 md:col-span-6 h-[300px] md:h-[400px] rounded-2xl md:rounded-3xl relative overflow-hidden group cursor-pointer"
              style={{ background: gradient1 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              {images.hero && (
                <img
                  src={images.hero}
                  alt={brandData.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                />
              )}
              
              <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8">
                <motion.h2
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white text-center"
                  style={{ fontFamily: brandData.primaryFont || 'sans-serif' }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                >
                  {brandData.name}
                </motion.h2>
              </div>

              {brandData.primaryColor && (
                <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 px-3 md:px-4 py-2 rounded-full bg-white/90 backdrop-blur-xl">
                  <p className="text-gray-800 text-xs md:text-sm font-mono">
                    {brandData.primaryColor}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Card 2: Color Palette */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="col-span-4 md:col-span-6 h-[300px] md:h-[400px] rounded-2xl md:rounded-3xl bg-white border border-gray-200 p-6 md:p-8"
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <p className="text-xs font-bold text-gray-400 mb-6 md:mb-8 uppercase tracking-widest">
                Palette Chromatique
              </p>

              <div className="space-y-4 md:space-y-5">
                {[
                  { color: brandData.primaryColor, label: 'Primary' },
                  { color: brandData.secondaryColor, label: 'Secondary' },
                  { color: brandData.accentColor, label: 'Accent' }
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
                        style={{ backgroundColor: item.color }}
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
                          style={{ backgroundColor: item.color }}
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
            {brandData.primaryFont && (
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
                      style={{ fontFamily: brandData.primaryFont }}
                      whileHover={{ rotate: 5, transition: { duration: 0.4 } }}
                    >
                      Aa
                    </motion.p>
                    <div className="px-3 md:px-4 py-2 rounded-full bg-white/90 backdrop-blur-xl inline-block">
                      <p className="text-gray-800 text-xs md:text-sm">
                        {brandData.primaryFont}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Card 4: Personality */}
            {brandData.brandPersonality && (
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
                    style={{ fontFamily: brandData.primaryFont || 'sans-serif' }}
                    initial={{ x: -30, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    {brandData.brandPersonality}
                  </motion.h3>
                  {brandData.targetAudience && (
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
                          {brandData.targetAudience}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Card 5: Secondary Typography */}
            {brandData.secondaryFont && (
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
                      style={{ fontFamily: brandData.secondaryFont }}
                      initial={{ y: 30, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                    >
                      {brandData.name}
                    </motion.p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="px-4 md:px-6 py-2 md:py-3 rounded-full bg-white/90 backdrop-blur-xl">
                        <p className="text-black text-xs md:text-sm">{brandData.secondaryFont}</p>
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
            {brandData.accentColor && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="col-span-4 md:col-span-5 h-[280px] md:h-[350px] rounded-2xl md:rounded-3xl relative overflow-hidden group"
                style={{ backgroundColor: brandData.accentColor }}
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
                      {brandData.accentColor}
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
                <div>
                  
                </div>

                <div>
                  <motion.h2
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 md:mb-8"
                    style={{ fontFamily: brandData.primaryFont || 'sans-serif' }}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    {brandData.name}
                  </motion.h2>

                  <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-8">
                    {brandData.description && (
                      <motion.p
                        className="text-base md:text-xl lg:text-2xl text-white/90 max-w-2xl"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        {brandData.description}
                      </motion.p>
                    )}

                    <div className="flex gap-3 md:gap-4">
                      {[brandData.primaryColor, brandData.secondaryColor, brandData.accentColor]
                        .filter(Boolean)
                        .map((color, idx) => (
                          <motion.div
                            key={idx}
                            className="w-12 h-24 md:w-16 md:h-32 lg:w-20 lg:h-40 rounded-xl md:rounded-2xl"
                            style={{ backgroundColor: color }}
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

      {/* CTA Section with Buttons */}
      <motion.section
        className="py-16 md:py-24 px-4 md:px-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className=" text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 md:mb-8"
           
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Chaud devant ! <br /> Votre Branding est prêt
          </motion.h2>

          <motion.p
            className="text-base md:text-lg lg:text-xl text-gray-600 mb-10 md:mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Téléchargez votre guide complet ou continuez à créer dans notre studio
          </motion.p>

          {/* Boutons d'action */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Bouton Studio si connecté */}
            {user && (
              <motion.button
                onClick={handleDownload}
                disabled={saving}
                className="relative overflow-hidden px-8 md:px-10 py-4 rounded-full font-semibold text-base md:text-lg bg-black border border-black text-white hover:bg-gray-800 hover:text-white transition-colors duration-300 w-full sm:w-auto disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      On prepare votre espace...
                    </>
                  ) : (
                    'Aller au Studio'
                  )}
                </span>
              </motion.button>
            )}

            {/* Bouton de partage */}
            <SocialShare
              brandId={brandData.id}
              brandName={brandData.name}
              brandDescription={brandData.description}
              brandUrl={typeof window !== 'undefined' ? window.location.href : ''}
              className="w-full sm:w-auto"
            />
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  )
}