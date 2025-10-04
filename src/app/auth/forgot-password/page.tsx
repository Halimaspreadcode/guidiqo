'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail } from 'lucide-react'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Simuler l'envoi d'email (Stack Auth gère cela automatiquement)
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccess(true)
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Image gauche - 1/2 - hidden on mobile */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1758551015352-fa735f167422?q=80&w=2600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Forgot Password"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
        
        {/* Logo sur l'image */}
        <div className="absolute top-8 left-8">
          <motion.h1
            className="text-4xl font-bold text-white"
            style={{ fontFamily: "'Raleway', sans-serif" }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Guidiqo
          </motion.h1>
        </div>

        {/* Texte sur l'image */}
        <div className="absolute bottom-12 left-8 right-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Mot de passe oublié ?
            </h2>
            <p className="text-white/80 text-lg">
              Pas de problème, nous vous enverrons un lien de réinitialisation
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contenu droite - 1/2 */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Bouton retour */}
          <motion.button
            onClick={() => router.push('/auth/signin')}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à la connexion
          </motion.button>

          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <motion.h1
              className="text-3xl font-bold text-black"
              style={{ fontFamily: "'Raleway', sans-serif" }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Guidiqo
            </motion.h1>
          </div>

          {/* Carte */}
          <motion.div
            className="bg-white lg:border lg:border-gray-200 rounded-3xl p-8 md:p-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {success ? (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center"
                >
                  <Mail className="w-8 h-8 text-green-600" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-3">
                  Email envoyé !
                </h2>
                <p className="text-gray-600 mb-6">
                  Un lien de réinitialisation a été envoyé à <strong>{email}</strong>. 
                  Vérifiez votre boîte de réception.
                </p>
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="w-full py-4 bg-black text-white rounded-3xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  Retour à la connexion
                </button>
              </div>
            ) : (
              <>
                {/* Titre */}
                <div className="mb-8">
                  <motion.h2
                    className="text-2xl md:text-3xl font-bold text-black mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Réinitialiser le mot de passe
                  </motion.h2>
                  <motion.p
                    className="text-gray-600 text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    Entrez votre email pour recevoir un lien de réinitialisation
                  </motion.p>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <motion.div
                      className="p-4 bg-red-50 border-2 border-red-200 rounded-3xl text-red-600 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-3">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        required
                        className="w-full pl-14 pr-6 py-5 bg-white border-2 border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black text-base placeholder-gray-400 transition-all"
                        style={{ height: '60px', fontSize: '16px' }}
                      />
                    </div>
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-5 bg-black text-white rounded-3xl font-semibold text-base hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    style={{ height: '60px' }}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Envoi en cours...
                      </span>
                    ) : (
                      'Envoyer le lien'
                    )}
                  </motion.button>
                </form>

                {/* Lien vers connexion */}
                <motion.div
                  className="mt-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <p className="text-gray-600 text-sm">
                    Vous vous souvenez de votre mot de passe ?{' '}
                    <button
                      onClick={() => router.push('/auth/signin')}
                      className="text-black font-semibold hover:underline"
                    >
                      Connectez-vous
                    </button>
                  </p>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

