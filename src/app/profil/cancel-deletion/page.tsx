'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function CancelDeletionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleCancel = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/account/cancel-deletion', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      } else {
        setError(data.error || 'Erreur lors de l\'annulation')
      }
    } catch (err) {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-black mb-4">
            Compte conservé !
          </h2>
          <p className="text-gray-600 mb-8">
            Votre demande de suppression a été annulée. 
            Votre compte et tous vos projets sont sécurisés.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white border border-gray-200 rounded-3xl p-8 md:p-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
            Annuler la suppression
          </h2>
          <p className="text-gray-600">
            Vous êtes sur le point d'annuler la suppression de votre compte.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm">{error}</p>
          </motion.div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="w-full py-4 bg-black text-white rounded-3xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Annulation en cours...
              </>
            ) : (
              'Oui, conserver mon compte'
            )}
          </button>

          <button
            onClick={() => router.push('/profil')}
            disabled={loading}
            className="w-full py-4 border border-gray-300 text-gray-700 rounded-3xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Retour
          </button>
        </div>
      </motion.div>
    </div>
  )
}
