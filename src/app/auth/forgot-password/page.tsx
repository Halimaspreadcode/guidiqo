'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useUser } from '@stackframe/stack'
import { ForgotPassword } from '@stackframe/stack'
import { useEffect } from 'react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const user = useUser({ or: 'return-null' })

  // Rediriger si l'utilisateur est connecté
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

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

            {/* Composant Stack Auth intégré */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="stack-auth-custom"
            >
              <ForgotPassword />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}