'use client'

import { useUser } from '@stackframe/stack'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Calendar, Trash2, Menu, X, AlertTriangle, Check } from 'lucide-react'
import { LiquidButton } from '@/components/LiquidGlassButton'
import Sidebar from '@/components/Sidebar'
import AvatarUpload from '@/components/AvatarUpload'

export default function ProfilPage() {
  const user = useUser({ or: 'return-null' })
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteReason, setDeleteReason] = useState('')
  const [deletionRequested, setDeletionRequested] = useState(false)
  const [deletionDate, setDeletionDate] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Rediriger si pas connecté
  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
    } else {
      setName(user.displayName || '')
      setEmail(user.primaryEmail || '')
    }
  }, [user, router])

  const handleUpdateProfile = async () => {
    if (!user) return

    setSaving(true)
    setSuccessMessage('')

    try {
      // Update via Stack Auth
      await user.update({
        displayName: name,
      })

      setSuccessMessage('Profil mis à jour avec succès')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Erreur lors de la mise à jour du profil')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return

    setDeleting(true)
    try {
      const response = await fetch('/api/account/delete-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: deleteReason }),
      })

      const data = await response.json()

      if (response.ok) {
        setDeletionRequested(true)
        setDeletionDate(data.deletionDate)
        setShowDeleteModal(false)
      } else {
        alert(data.error || 'Erreur lors de la demande de suppression')
      }
    } catch (error) {
      console.error('Erreur suppression:', error)
      alert('Erreur lors de la demande de suppression')
    } finally {
      setDeleting(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  const getInitials = () => {
    const displayName = user.displayName || user.primaryEmail || ''
    if (displayName.includes('@')) {
      return displayName.substring(0, 2).toUpperCase()
    }
    const names = displayName.trim().split(' ')
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase()
    }
    return displayName.substring(0, 2).toUpperCase()
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-6 left-4 z-50 p-3 bg-white/70 backdrop-blur-md rounded-full shadow-lg border border-white/20"
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 lg:mb-12 mt-12 lg:mt-0"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-3">
              Mon Profil
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Gérez vos informations personnelles et votre compte
            </p>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-3xl p-6 sm:p-8 mb-6"
          >
            {/* Avatar & Basic Info */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
              <AvatarUpload
                currentImage={user?.profileImageUrl || undefined}
                onImageChange={(imageUrl) => {
                  // L'image sera automatiquement mise à jour via Stack Auth
                  console.log('Image de profil mise à jour:', imageUrl)
                }}
              />
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                  {user.displayName || 'Utilisateur'}
                </h2>
                <p className="text-gray-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.primaryEmail}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Cliquez sur votre photo pour la modifier
                </p>
              </div>
            </div>

            {/* Edit Form */}
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d&apos;affichage
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                  placeholder="votre@email.com"
                />
                <p className="text-xs text-gray-500 mt-2">
                  L&apos;email ne peut pas être modifié pour des raisons de sécurité
                </p>
              </div>
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl mb-6"
                >
                  <Check className="w-5 h-5 text-green-600" />
                  <p className="text-green-800 font-medium">{successMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Save Button */}
            <LiquidButton
              onClick={handleUpdateProfile}
              disabled={saving || !name.trim()}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-stone-900 to-gray-800 text-white rounded-full font-semibold hover:from-red-900 hover:to-red-600 transition-all disabled:opacity-50"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sauvegarde...
                </span>
              ) : (
                'Enregistrer les modifications'
              )}
            </LiquidButton>
          </motion.div>

          {/* Confirmation Banner */}
          {deletionRequested && deletionDate && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-orange-50 border border-orange-200 rounded-3xl p-6 sm:p-8 mb-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-orange-900 mb-2">
                    Demande de suppression enregistrée
                  </h3>
                  <p className="text-orange-700 text-sm leading-relaxed mb-4">
                    Votre compte sera supprimé le <strong>{deletionDate}</strong>. 
                    Un email de confirmation vous a été envoyé.
                  </p>
                  <button
                    onClick={() => router.push('/profil/cancel-deletion')}
                    className="px-6 py-2 bg-orange-600 text-white rounded-full font-semibold hover:bg-orange-700 transition-colors text-sm"
                  >
                    Annuler la suppression
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-red-50 border border-red-200 rounded-3xl p-6 sm:p-8"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-900 mb-2">
                  Zone de danger
                </h3>
                <p className="text-red-700 text-sm leading-relaxed">
                  La suppression de votre compte est irréversible. Tous vos brandings et données seront définitivement supprimés.
                </p>
              </div>
            </div>

            <motion.button
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trash2 className="w-4 h-4" />
              Supprimer mon compte
            </motion.button>
          </motion.div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
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
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative">
                {/* Decorative gradient */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 to-red-800 rounded-t-3xl" />
                
                <div className="text-center">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <AlertTriangle className="w-10 h-10 text-red-600" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-black mb-3">
                    Demande de suppression de compte
                  </h3>

                  {/* Description */}
                  <div className="text-left mb-6">
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      Votre compte sera supprimé dans <span className="font-bold text-red-600">7 jours ouvrés</span>. 
                      Vous recevrez un email de confirmation avec un lien pour annuler si vous changez d&apos;avis.
                    </p>

                    {/* Raison (optionnelle) */}
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Pourquoi quittez-vous Guidiqo ? (optionnel)
                    </label>
                    <textarea
                      value={deleteReason}
                      onChange={(e) => setDeleteReason(e.target.value)}
                      placeholder="Cela nous aide à améliorer notre service..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      onClick={() => {
                        setShowDeleteModal(false)
                        setDeleteReason('')
                      }}
                      disabled={deleting}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                      whileHover={{ scale: deleting ? 1 : 1.02 }}
                      whileTap={{ scale: deleting ? 1 : 0.98 }}
                    >
                      Annuler
                    </motion.button>
                    
                    <motion.button
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                      whileHover={{ scale: deleting ? 1 : 1.02 }}
                      whileTap={{ scale: deleting ? 1 : 0.98 }}
                    >
                      {deleting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Envoi...
                        </span>
                      ) : (
                        'Confirmer la demande'
                      )}
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

