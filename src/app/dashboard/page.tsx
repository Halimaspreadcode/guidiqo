'use client'

import { useUser } from '@stackframe/stack'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Palette, Menu, X } from 'lucide-react'
import { LiquidButton } from '@/components/LiquidGlassButton'
import ThemeToggle from '@/components/ThemeToggle'
import Sidebar from '@/components/Sidebar'
import BrandCard from '@/components/BrandCard'

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
  coverImage: string | null
  isCompleted: boolean
  isPublic: boolean
  currentStep: number
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const user = useUser({ or: 'return-null' })
  const router = useRouter()
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)
  const [pendingBrandData, setPendingBrandData] = useState<any>(null)
  const [savingPendingBrand, setSavingPendingBrand] = useState(false)
  
  // Rediriger si pas connecté après 1 seconde
  useEffect(() => {
    if (!user && !loading) {
      const timer = setTimeout(() => {
        router.push('/auth/signin')
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchBrands()
      // Vérifier s'il y a un travail en attente dans localStorage
      checkPendingBrand()
    } else {
      setLoading(false)
    }
  }, [user])

  const checkPendingBrand = () => {
    const pendingData = localStorage.getItem('pendingBrandData') || sessionStorage.getItem('brandData')
    
    if (pendingData) {
      try {
        const data = JSON.parse(pendingData)
        setPendingBrandData(data)
        setShowRecoveryModal(true)
      } catch (error) {
        console.error('Erreur lors de la lecture des données en attente:', error)
        // Nettoyer les données corrompues
        localStorage.removeItem('pendingBrandData')
        sessionStorage.removeItem('brandData')
      }
    }
  }

  const handleSavePendingBrand = async () => {
    if (!pendingBrandData) return

    setSavingPendingBrand(true)
    try {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pendingBrandData,
          isCompleted: true,
          currentStep: 4,
        }),
      })

      if (response.ok) {
        const savedBrand = await response.json()
        
        // Nettoyer le storage
        localStorage.removeItem('pendingBrandData')
        localStorage.removeItem('downloadIntent')
        sessionStorage.removeItem('brandData')
        sessionStorage.removeItem('downloadIntent')
        
        // Fermer le modal
        setShowRecoveryModal(false)
        
        // Rediriger vers la page du branding
        router.push(`/brand/${savedBrand.id}`)
      } else {
        alert('Erreur lors de la sauvegarde. Veuillez réessayer.')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue.')
    } finally {
      setSavingPendingBrand(false)
    }
  }

  const handleDiscardPendingBrand = () => {
    // Nettoyer le storage
    localStorage.removeItem('pendingBrandData')
    localStorage.removeItem('downloadIntent')
    sessionStorage.removeItem('brandData')
    sessionStorage.removeItem('downloadIntent')
    
    setShowRecoveryModal(false)
    setPendingBrandData(null)
  }

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands')
      
      if (response.ok) {
        const data = await response.json()
        setBrands(data)
      }
    } catch (error) {
      // Erreur silencieuse
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBrand = () => {
    router.push('/dashboard/creer?step=1')
  }

  const handleDeleteBrand = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce brand ?')) return

    try {
      const response = await fetch(`/api/brands/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setBrands(brands.filter(b => b.id !== id))
      }
    } catch (error) {
      console.error('Error deleting brand:', error)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black" style={{ fontFamily: "'Raleway', sans-serif" }}>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-6 left-4 z-50 p-3 bg-white/70 dark:bg-black/70 backdrop-blur-md rounded-full shadow-lg border border-white/20 dark:border-white/10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </motion.button>

      {/* Sidebar Overlay pour mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Mobile */}
      <div className="lg:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile />
      </div>

      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="lg:ml-72 pt-8 lg:pt-12 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Greeting Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:hidden mb-6 mt-12 bg-gradient-to-br from-gray-50 to-white dark:from-black dark:to-black rounded-3xl p-6 border border-gray-100 dark:border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  {new Date().getHours() < 12 ? 'Bon matin' : new Date().getHours() < 18 ? 'Bon après-midi' : 'Bonne soirée'}
                </p>
                <h2 className="text-2xl font-bold text-black">
                  {user?.displayName || user?.primaryEmail?.split('@')[0]} !
                </h2>
              </div>
              <motion.button
                onClick={() => router.push('/dashboard')}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-stone-900 to-gray-800 text-white font-semibold flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {user?.displayName?.substring(0, 1) || user?.primaryEmail?.substring(0, 1) || 'U'}
              </motion.button>
            </div>
            
            {/* Create New Task Button - Mobile */}
            <LiquidButton
              onClick={handleCreateBrand}
              className="w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white px-6 py-4 rounded-full font-semibold text-sm"
            >
              <Plus className="w-5 h-5" />
              Créer un nouveau branding
            </LiquidButton>
          </motion.div>

          {/* Desktop Greeting & Header Section */}
          <div className="hidden lg:block mb-12">
            {/* Greeting Card Desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-black rounded-3xl p-8 border border-gray-100 dark:border-white/10 mb-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base text-gray-500 dark:text-white mb-2">
                    {new Date().getHours() < 12 ? 'Bon matin' : new Date().getHours() < 18 ? 'Bon après-midi' : 'Bonne soirée'}
                  </p>
                  <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
                    {user?.displayName || user?.primaryEmail?.split('@')[0]} !
                  </h1>
                  <p className="text-gray-600 text-lg dark:text-white">
                    Gérez tous vos projets de branding ici
                  </p>
                </div>
                
                
              </div>
            </motion.div>

            {/* Header avec bouton Create */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex justify-between items-center"
            >
              <h2 className="text-2xl font-bold text-black dark:text-white">
                Mes Brandings
              </h2>
              
              <LiquidButton
                onClick={handleCreateBrand}
                className="flex items-center gap-3 bg-gradient-to-r from-stone-900 to-gray-800 hover:from-red-900 hover:to-red-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                Créer un branding
              </LiquidButton>
            </motion.div>
          </div>

          {/* Tasks Overview - Mobile Only */}
          {user && brands.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:hidden mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-black">Aperçu</h3>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <p className="text-sm text-white/80 mb-2">Total de brandings</p>
                  <p className="text-5xl font-bold mb-1">{brands.length}</p>
                  <p className="text-sm text-white/80">
                    {brands.filter(b => b.isCompleted).length} terminés
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Section Title - Mobile */}
          {user && brands.length > 0 && (
            <div className="lg:hidden mb-4">
              <h3 className="text-lg font-semibold text-black">Mes Brandings</h3>
            </div>
          )}

          {/* Brands Grid */}
          {!user ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center py-12 sm:py-20 bg-gradient-to-br from-gray-50 to-white rounded-3xl  relative overflow-hidden"
            >
              <div className="absolute inset-0 backdrop-blur-2xl bg-white/50" />
              <div className="relative z-10">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-stone-900/10 to-red-900/10 blur-2xl rounded-full" />
                  <Palette className="relative w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                  Connectez-vous pour voir vos brandings
                </h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base max-w-md mx-auto px-4">
                  Vous devez être connecté pour accéder à vos projets de branding
                </p>
                <motion.button
                  onClick={() => router.push('/auth/signin')}
                  className="px-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Se connecter
                </motion.button>
              </div>
            </motion.div>
          ) : loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
          ) : brands.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center py-12 sm:py-20 bg-gradient-to-br from-gray-50 to-white rounded-3xl "
            >
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-900/10 to-red-900/10 blur-2xl rounded-full" />
                <Palette className="relative w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                Aucun branding pour le moment
              </h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base max-w-md mx-auto px-4">
                Commencez par créer votre premier projet de branding et donnez vie à votre identité visuelle
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {brands.map((brand, index) => (
                <BrandCard
                  key={brand.id}
                  brand={brand}
                  index={index}
                  onDelete={handleDeleteBrand}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Recovery Modal */}
      <AnimatePresence>
        {showRecoveryModal && pendingBrandData && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.target === e.currentTarget && !savingPendingBrand && handleDiscardPendingBrand()}
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative">
                {/* Decorative gradient */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-stone-900 via-red-900 to-stone-900 rounded-t-3xl" />
                
                <div className="text-center">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto w-20 h-20 bg-gradient-to-br from-stone-900 to-red-900 rounded-full flex items-center justify-center mb-6"
                  >
                    <Palette className="w-10 h-10 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-black mb-3">
                    Œuvre d&apos;art détectée !
                  </h3>
                  
                  {/* Brand Name */}
                  <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-4 mb-4">
                    <p className="text-sm text-gray-500 mb-1">Nom du branding</p>
                    <p className="text-xl font-bold text-black">{pendingBrandData.name}</p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Nous avons trouvé un branding que vous aviez commencé. Souhaitez-vous le conserver dans votre collection ?
                  </p>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      onClick={handleDiscardPendingBrand}
                      disabled={savingPendingBrand}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                      whileHover={{ scale: savingPendingBrand ? 1 : 1.02 }}
                      whileTap={{ scale: savingPendingBrand ? 1 : 0.98 }}
                    >
                      Non, supprimer
                    </motion.button>
                    
                    <LiquidButton
                      onClick={handleSavePendingBrand}
                      disabled={savingPendingBrand}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-stone-900 to-gray-800 text-white justify-center items-center rounded-full font-semibold hover:from-green-900 hover:to-green-600 transition-all disabled:opacity-50"
                    >
                      {savingPendingBrand ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sauvegarde...
                        </span>
                      ) : (
                        'Oui, conserver'
                      )}
                    </LiquidButton>
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

