'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useUser } from '@stackframe/stack'
import { CredentialSignIn } from '@stackframe/stack'
import { useEffect } from 'react'

export default function SignInPage() {
  const router = useRouter()
  const user = useUser({ or: 'return-null' })

  // Rediriger si l'utilisateur est connecté
  useEffect(() => {
    if (user) {
      console.log('👤 SignIn - Utilisateur connecté:', user.primaryEmail)
      
      // Vérifier s'il y a une intention de téléchargement
      const downloadIntent = localStorage.getItem('downloadIntent') || sessionStorage.getItem('downloadIntent')
      const brandData = localStorage.getItem('pendingBrandData') || sessionStorage.getItem('brandData')
      
      console.log('🔍 SignIn - Vérification:')
      console.log('  - downloadIntent:', downloadIntent)
      console.log('  - brandData:', brandData ? 'PRÉSENT' : 'ABSENT')
      
      if (downloadIntent && brandData) {
        const data = JSON.parse(brandData)
        console.log('✅ SignIn - Redirection vers preview:', data.id)
        router.push(`/brand/preview/${data.id}`)
      } else {
        console.log('➡️ SignIn - Redirection vers dashboard (pas de branding en attente)')
        router.push('/dashboard')
      }
    }
  }, [user, router])

  // Traduire les labels en français
  useEffect(() => {
    const translateLabels = () => {
      const translations: Record<string, string> = {
        'Email': 'Email',
        'Password': 'Mot de passe',
        'Sign In': 'Se connecter',
        'Sign in': 'Se connecter',
        'Enter your email': 'Entrez votre email',
        'Enter your password': 'Entrez votre mot de passe',
        'Forgot password?': 'Mot de passe oublié ?',
        "Don't have an account?": "Vous n'avez pas de compte ?",
        'Sign up': "S'inscrire",
        'Sign Up': "S'inscrire",
      }

      // Traduire les labels
      document.querySelectorAll('.stack-auth-custom label').forEach((label) => {
        const text = label.textContent?.trim()
        if (text && translations[text]) {
          label.textContent = translations[text]
        }
      })

      // Traduire les placeholders
      document.querySelectorAll('.stack-auth-custom input').forEach((input) => {
        const placeholder = input.getAttribute('placeholder')
        if (placeholder && translations[placeholder]) {
          input.setAttribute('placeholder', translations[placeholder])
        }
      })

      // Traduire les boutons
      document.querySelectorAll('.stack-auth-custom button').forEach((button) => {
        const text = button.textContent?.trim()
        if (text && translations[text]) {
          button.textContent = translations[text]
        }
      })

      // Traduire les liens
      document.querySelectorAll('.stack-auth-custom a').forEach((link) => {
        const text = link.textContent?.trim()
        if (text && translations[text]) {
          link.textContent = translations[text]
        }
      })
    }

    // Exécuter immédiatement
    translateLabels()

    // Observer les changements du DOM
    const observer = new MutationObserver(translateLabels)
    const authContainer = document.querySelector('.stack-auth-custom')
    
    if (authContainer) {
      observer.observe(authContainer, {
        childList: true,
        subtree: true,
        characterData: true,
      })
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white flex">
      {/* Image gauche - 1/2 - hidden on mobile */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1758551015352-fa735f167422?q=80&w=2600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Authentication"
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
              Créez votre identité de marque
            </h2>
            <p className="text-white/80 text-lg">
              Des outils professionnels pour donner vie à votre vision
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contenu droite - 1/2 */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Bouton retour */}
          <motion.button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
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

          {/* Carte de connexion */}
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
                Connexion
              </motion.h2>
              <motion.p
                className="text-gray-600 text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Connectez-vous à votre compte
              </motion.p>
            </div>

            {/* Composant Stack Auth intégré */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="stack-auth-custom"
            >
              <CredentialSignIn />
            </motion.div>

            {/* Liens */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <button
                onClick={() => router.push('/auth/forgot-password')}
                className="text-gray-600 text-sm hover:text-black transition-colors"
              >
                Mot de passe oublié ?
              </button>
            </motion.div>

            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p className="text-gray-600 text-sm">
                Vous n&apos;avez pas de compte ?{' '}
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="text-black font-semibold hover:underline"
                >
                  Inscrivez-vous
                </button>
              </p>
            </motion.div>

            </motion.div>
        </div>
      </div>
    </div>
  )
}
