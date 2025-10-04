'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Users, Palette, Eye, Check, X, Crown, TrendingUp, Calendar } from 'lucide-react'
import { useUser } from '@stackframe/stack'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
  brandPersonality: string | null
  targetAudience: string | null
  isCompleted: boolean
  isInLibrary: boolean
  createdAt: string
  user: {
    name: string | null
    email: string
  }
}

export default function SuperAdminPage() {
  const router = useRouter()
  const user = useUser({ or: 'return-null' })
  const [users, setUsers] = useState<User[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'brands'>('users')
  const [isAdmin, setIsAdmin] = useState(false)

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
      const [usersResponse, brandsResponse] = await Promise.all([
        fetch('/api/superadmin/users'),
        fetch('/api/superadmin/brands')
      ])

      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData)
      }

      if (brandsResponse.ok) {
        const brandsData = await brandsResponse.json()
        setBrands(brandsData)
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
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
            <div className="flex gap-2 mb-8">
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
            </div>
          </motion.div>

          {/* Content */}
          {activeTab === 'users' ? (
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
          ) : (
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

                  <div className="flex items-center justify-between">
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
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
