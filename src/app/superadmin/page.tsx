'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Users, Palette, Eye, Check, X, Crown, TrendingUp, Calendar, Download, Trash2, AlertTriangle, Share2 } from 'lucide-react'
import { useUser } from '@stackframe/stack'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BrandDetailsModal from '@/components/BrandDetailsModal'

interface User {
  id: string
  name: string | null
  email: string
  createdAt: string
  _count: {
    brands: number
  }
}

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
  isCompleted: boolean
  isInLibrary: boolean
  isPublic: boolean
  pdfDownloads: number
  shareCount: number
  createdAt: string
  user: {
    name: string | null
    email: string
  }
}

interface DeletionRequest {
  id: string
  reason: string | null
  status: string
  requestedAt: string
  scheduledFor: string
  user: {
    id: string
    email: string
    name: string | null
    brands: Array<{
      id: string
      name: string
    }>
  }
}

export default function SuperAdminPage() {
  const router = useRouter()
  const user = useUser({ or: 'return-null' })
  const [users, setUsers] = useState<User[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [deletionRequests, setDeletionRequests] = useState<DeletionRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'brands' | 'deletions'>('users')
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [showBrandModal, setShowBrandModal] = useState(false)

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false)
        return
      }

      try {
        // On va appeler une API pour vérifier le role
        const response = await fetch('/api/check-admin')
        if (response.ok) {
          const data = await response.json()
          setIsAdmin(data.isAdmin)
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      }
    }

    checkAdmin()
  }, [user])

  useEffect(() => {
    if (!user) {
      console.log('❌ No user, redirecting to signin...')
      router.push('/auth/signin')
      return
    }

    console.log('🔐 SuperAdmin - isAdmin:', isAdmin, 'user:', user.primaryEmail)

    // Attendre que isAdmin soit vérifié avant de rediriger
    if (user && isAdmin === true) {
      console.log('✅ User is admin, fetching data...')
      fetchData()
    } else if (user && isAdmin === false) {
      console.log('❌ User is NOT admin, will redirect...')
      // Attendre un peu au cas où isAdmin change
      const timer = setTimeout(() => {
        if (isAdmin === false) {
          console.log('🔄 Redirecting non-admin user to home...')
          router.push('/')
        }
      }, 2000) // Attendre 2 secondes
      return () => clearTimeout(timer)
    }
  }, [user, isAdmin, router])

  const fetchData = async () => {
    try {
      const [usersResponse, brandsResponse, deletionsResponse] = await Promise.all([
        fetch('/api/superadmin/users'),
        fetch('/api/superadmin/brands'),
        fetch('/api/superadmin/deletion-requests')
      ])

      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData)
      }

      if (brandsResponse.ok) {
        const brandsData = await brandsResponse.json()
        setBrands(brandsData)
      }

      if (deletionsResponse.ok) {
        const deletionsData = await deletionsResponse.json()
        setDeletionRequests(deletionsData)
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const openBrandDetails = (brand: Brand) => {
    setSelectedBrand(brand)
    setShowBrandModal(true)
  }

  const toggleBrandLibrary = async (brandId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/superadmin/brands/${brandId}/library`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isInLibrary: !currentStatus })
      })

      if (response.ok) {
        setBrands(brands.map(brand => 
          brand.id === brandId 
            ? { ...brand, isInLibrary: !currentStatus }
            : brand
        ))
      }
    } catch (error) {
      console.error('Error updating brand library status:', error)
    }
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 md:mb-24"
          >
            <div className="flex items-center gap-4 mb-6">
              
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black">
                  Super Admin
                </h1>
                <p className="text-gray-600 text-lg">
                  Gestion de la plateforme et curation de la bibliothèque
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <motion.div
                className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-6"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  
                  <span className="text-sm font-medium text-gray-600">Utilisateurs</span>
                </div>
                <p className="text-3xl font-bold text-black">{users.length}</p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-6"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-gray-600">Créations</span>
                </div>
                <p className="text-3xl font-bold text-black">{brands.length}</p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-6"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-gray-600">En Bibliothèque</span>
                </div>
                <p className="text-3xl font-bold text-black">
                  {brands.filter(b => b.isInLibrary).length}
                </p>
              </motion.div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 flex-wrap">
              <motion.button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeTab === 'users'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Utilisateurs
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('brands')}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeTab === 'brands'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Créations
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('deletions')}
                className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'deletions'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 className="w-4 h-4" />
                Suppressions ({deletionRequests.filter(r => r.status === 'PENDING').length})
              </motion.button>
            </div>
          </motion.div>

          {/* Content */}
          {activeTab === 'users' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-black">
                        {user.name || user.email.split('@')[0]}
                      </h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {user._count.brands} création{user._count.brands > 1 ? 's' : ''}
                    </span>
                    <span className="text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'brands' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brands.map((brand, index) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                  whileHover={{ y: -4 }}
                >
                  {/* Color Preview */}
                  <div className="flex gap-2 mb-4">
                    {brand.primaryColor && (
                      <div
                        className="w-8 h-8 rounded-lg"
                        style={{ backgroundColor: brand.primaryColor }}
                      />
                    )}
                    {brand.secondaryColor && (
                      <div
                        className="w-8 h-8 rounded-lg"
                        style={{ backgroundColor: brand.secondaryColor }}
                      />
                    )}
                    {brand.accentColor && (
                      <div
                        className="w-8 h-8 rounded-lg"
                        style={{ backgroundColor: brand.accentColor }}
                      />
                    )}
                  </div>

                  <h3 className="font-bold text-black mb-2">{brand.name}</h3>
                  {brand.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{brand.description}</p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-500">
                      Par {brand.user.name || brand.user.email.split('@')[0]}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(brand.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  {/* Analytics */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {/* Nombre de téléchargements */}
                    <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-3">
                      <Download className="w-4 h-4 text-blue-600" />
                      <div className="flex flex-col">
                        <span className="text-xs text-blue-500">Téléchargements</span>
                        <span className="text-sm font-semibold text-blue-600">
                          {brand.pdfDownloads || 0}
                        </span>
                      </div>
                    </div>
                    
                    {/* Nombre de partages */}
                    <div className="flex items-center gap-2 bg-purple-50 rounded-lg p-3">
                      <Share2 className="w-4 h-4 text-purple-600" />
                      <div className="flex flex-col">
                        <span className="text-xs text-purple-500">Partages</span>
                        <span className="text-sm font-semibold text-purple-600">
                          {brand.shareCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col gap-2">
                      {/* Statut Bibliothèque */}
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => toggleBrandLibrary(brand.id, brand.isInLibrary)}
                          className={`p-2 rounded-lg transition-all ${
                            brand.isInLibrary
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title={brand.isInLibrary ? 'Retirer de la bibliothèque' : 'Ajouter à la bibliothèque'}
                        >
                          {brand.isInLibrary ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </motion.button>
                        <span className="text-xs text-gray-500">
                          {brand.isInLibrary ? 'En bibliothèque' : 'Non publié'}
                        </span>
                      </div>
                      
                      {/* Statut Public/Privé */}
                      <div className="flex items-center gap-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          brand.isPublic
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {brand.isPublic ? ' Public' : ' Privé'}
                        </div>
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={() => openBrandDetails(brand)}
                      className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Voir les détails"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'deletions' && (
            <div className="space-y-6">
              {deletionRequests.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Aucune demande de suppression</p>
                </div>
              ) : (
                deletionRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`border-2 rounded-2xl p-6 ${
                      request.status === 'PENDING' 
                        ? 'bg-red-50 border-red-200' 
                        : request.status === 'CANCELLED'
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center text-white font-bold">
                          {(request.user.name || request.user.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-black">
                            {request.user.name || request.user.email.split('@')[0]}
                          </h3>
                          <p className="text-sm text-gray-600">{request.user.email}</p>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        request.status === 'PENDING'
                          ? 'bg-red-600 text-white'
                          : request.status === 'CANCELLED'
                          ? 'bg-gray-600 text-white'
                          : 'bg-green-600 text-white'
                      }`}>
                        {request.status === 'PENDING' ? 'En attente' : request.status === 'CANCELLED' ? 'Annulée' : 'Complétée'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Demandé le</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(request.requestedAt).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Suppression prévue le</p>
                        <p className="text-sm font-semibold text-red-600">
                          {new Date(request.scheduledFor).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>

                    {request.reason && (
                      <div className="bg-white/50 rounded-lg p-4 mb-4">
                        <p className="text-xs text-gray-600 mb-2">Raison :</p>
                        <p className="text-sm text-gray-900 italic">{request.reason}</p>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-xs text-gray-600 mb-2">Projets de l&apos;utilisateur :</p>
                      {request.user.brands.length === 0 ? (
                        <p className="text-sm text-gray-500">Aucun projet</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {request.user.brands.map((brand) => (
                            <span
                              key={brand.id}
                              className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-700"
                            >
                              {brand.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}  
        </div>
      </section>

      {/* Brand Details Modal */}
      <BrandDetailsModal
        brand={selectedBrand}
        isOpen={showBrandModal}
        onClose={() => setShowBrandModal(false)}
      />

      <Footer />
    </div>
  )
}
