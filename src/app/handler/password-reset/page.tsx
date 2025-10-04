'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, Check, AlertCircle } from 'lucide-react'

export default function PasswordResetPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [code, setCode] = useState<string | null>(null)

  useEffect(() => {
    const resetCode = searchParams.get('code')
    if (!resetCode) {
      setError('Code de réinitialisation invalide ou expiré')
    } else {
      setCode(resetCode)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (!code) {
      setError('Code de réinitialisation manquant')
      return
    }

    setIsLoading(true)

    try {
      // Appel à l'API Stack Auth pour réinitialiser le mot de passe
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          password,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/auth/signin')
        }, 3000)
      } else {
        const data = await response.json()
        setError(data.error || 'Erreur lors de la réinitialisation')
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
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
            <Check className="w-10 h-10 text-green-600" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-black mb-4">
            Mot de passe changé !
          </h2>
          <p className="text-gray-600 mb-8">
            Votre mot de passe a été réinitialisé avec succès.
            Vous allez être redirigé vers la page de connexion...
          </p>
          
          <button
            onClick={() => router.push('/auth/signin')}
            className="px-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            Se connecter maintenant
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Image gauche */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1758551015352-fa735f167422?q=80&w=2600&auto=format&fit=crop"
          alt="Reset Password"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
        
        <div className="absolute top-8 left-8">
          <motion.h1
            className="text-4xl font-bold text-white"
            style={{ fontFamily: "'Raleway', sans-serif" }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Guidiqo
          </motion.h1>
        </div>

        <div className="absolute bottom-12 left-8 right-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Nouveau départ
            </h2>
            <p className="text-white/80 text-lg">
              Définissez un nouveau mot de passe sécurisé pour votre compte
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contenu droite */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Bouton retour */}
          <motion.button
            onClick={() => router.push('/auth/signin')}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à la connexion
          </motion.button>

          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-black">Guidiqo</h1>
          </div>

          {/* Carte */}
          <motion.div
            className="bg-white lg:border lg:border-gray-200 rounded-3xl p-8 md:p-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
                Nouveau mot de passe
              </h2>
              <p className="text-gray-600">
                Choisissez un mot de passe fort et sécurisé
              </p>
            </div>

            {error && !code && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-600 text-sm font-medium">
                    {error}
                  </p>
                  <button
                    onClick={() => router.push('/auth/forgot-password')}
                    className="text-red-700 text-sm underline mt-2"
                  >
                    Demander un nouveau lien
                  </button>
                </div>
              </motion.div>
            )}

            {code && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Nouveau mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Au moins 8 caractères"
                      required
                      className="w-full px-6 py-4 pr-12 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirmer mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Retapez votre mot de passe"
                      required
                      className="w-full px-6 py-4 pr-12 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Critères de mot de passe */}
                <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-600">
                  <p className="font-medium mb-2">Votre mot de passe doit contenir :</p>
                  <ul className="space-y-1">
                    <li className={password.length >= 8 ? 'text-green-600' : ''}>
                      • Au moins 8 caractères
                    </li>
                    <li className={password !== confirmPassword && confirmPassword ? 'text-red-600' : password === confirmPassword && password ? 'text-green-600' : ''}>
                      • Les deux mots de passe doivent correspondre
                    </li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !password || !confirmPassword}
                  className="w-full py-4 bg-black text-white rounded-3xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Changement en cours...' : 'Changer le mot de passe'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
