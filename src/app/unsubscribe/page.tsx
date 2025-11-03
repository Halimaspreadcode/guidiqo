"use client"

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react'
import Link from 'next/link'

export default function UnsubscribePage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const emailFromUrl = searchParams.get('email')
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')
  const [reason, setReason] = useState<string>('')
  const [showReasonInput, setShowReasonInput] = useState(false)
  const [emailInput, setEmailInput] = useState<string>('')

  const handleUnsubscribe = async () => {
    const emailToUse = emailFromUrl || emailInput.trim()
    
    if (!emailToUse && !token) {
      setStatus('error')
      setMessage('Veuillez entrer votre adresse email ou utiliser le lien fourni dans l\'email.')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailFromUrl || emailInput.trim() || '',
          token: token || '',
          reason: reason || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || 'Vous avez été désabonné avec succès.')
      } else {
        setStatus('error')
        setMessage(data.error || 'Une erreur est survenue lors du désabonnement.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Une erreur est survenue. Veuillez réessayer plus tard.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-black dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Mail className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Désabonnement de la Newsletter
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Nous sommes désolés de vous voir partir. Vous pouvez vous désabonner ci-dessous.
          </p>
        </div>

        {emailFromUrl && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email :</p>
            <p className="text-base font-medium text-gray-900 dark:text-white">{emailFromUrl}</p>
          </div>
        )}

        {!emailFromUrl && !token && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email à désabonner
            </label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value)
                setMessage('')
              }}
              placeholder="votre@email.com"
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
        )}

        {status === 'idle' && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Souhaitez-vous nous dire pourquoi vous vous désabonnez ? (optionnel)
              </label>
              <button
                onClick={() => setShowReasonInput(!showReasonInput)}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline"
              >
                {showReasonInput ? 'Masquer' : 'Partager une raison'}
              </button>
              
              {showReasonInput && (
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Par exemple : trop d'emails, contenu non pertinent..."
                  rows={4}
                  className="mt-2 w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white placeholder-gray-400 resize-none"
                />
              )}
            </div>

            <button
              onClick={handleUnsubscribe}
              disabled={status !== 'idle'}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Se désabonner
            </button>
          </>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Désabonnement confirmé
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              Vous ne recevrez plus d&apos;emails de notre part. Vous pouvez vous réabonner à tout moment.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm"
            >
            Retour à l&apos;accueil
            </Link>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Erreur
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            <button
              onClick={() => {
                setStatus('idle')
                setMessage('')
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm underline"
            >
              Réessayer
            </button>
          </motion.div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Si vous rencontrez des difficultés, contactez-nous à{' '}
            <a
              href="mailto:support@guidiqo.com"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              support@guidiqo.com
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

