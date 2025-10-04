'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DebugDeletionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const resetDeletion = async () => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/account/reset-deletion', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`✅ ${data.message}`)
        setTimeout(() => {
          router.push('/profil')
        }, 2000)
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch (error) {
      setMessage('❌ Erreur lors de la réinitialisation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-black mb-4">
          🔧 Debug - Réinitialiser la demande
        </h2>
        
        <p className="text-gray-600 mb-6">
          Si vous avez une erreur &quot;Cette demande ne peut plus être annulée&quot;, 
          cliquez sur le bouton ci-dessous pour réinitialiser votre demande de suppression.
        </p>

        {message && (
          <div className={`mb-4 p-4 rounded-2xl ${
            message.startsWith('✅') 
              ? 'bg-green-50 text-green-600 border border-green-200' 
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <button
          onClick={resetDeletion}
          disabled={loading}
          className="w-full py-4 bg-black text-white rounded-3xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 mb-4"
        >
          {loading ? 'Réinitialisation...' : 'Réinitialiser la demande'}
        </button>

        <button
          onClick={() => router.push('/profil')}
          className="w-full py-4 border border-gray-300 text-gray-700 rounded-3xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Retour au profil
        </button>
      </div>
    </div>
  )
}
