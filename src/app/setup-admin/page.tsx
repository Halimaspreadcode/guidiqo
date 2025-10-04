'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function SetupAdminPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSetAdmin = async () => {
    if (!email.trim()) {
      setMessage('❌ Veuillez entrer un email')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/set-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`✅ L'utilisateur ${data.user.email} a été promu ADMIN avec succès !`)
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        setMessage(`❌ Erreur: ${data.error}`)
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('❌ Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-black mb-2">Configuration Admin</h1>
        <p className="text-gray-600 mb-8">
          Définissez un utilisateur comme super administrateur
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de l&apos;utilisateur
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@Guidiqo.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-black"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleSetAdmin}
            disabled={loading || !email.trim()}
            className="w-full bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Traitement...' : 'Définir comme Admin'}
          </button>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl text-sm font-medium ${
                message.includes('✅')
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {message}
            </motion.div>
          )}
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-xs text-yellow-800">
            ⚠️ <strong>Important:</strong> Cette page est temporaire pour la configuration initiale.
            Supprimez-la après avoir défini votre administrateur.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

