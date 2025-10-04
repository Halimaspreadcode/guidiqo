'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { ForgotPassword } from '@stackframe/stack'

export default function HandlerForgotPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [emailSent, setEmailSent] = useState(false)

  // Vérifier si un email a été envoyé (paramètre dans l'URL)
  useEffect(() => {
    if (searchParams.get('sent') === 'true') {
      setEmailSent(true)
    }
  }, [searchParams])

  // Traduire les labels Stack Auth
  useEffect(() => {
    const translateLabels = () => {
      const translations: Record<string, string> = {
        'Email': 'Email',
        'Send reset email': 'Envoyer le lien',
        'Send password reset email': 'Envoyer le lien',
        'Reset password': 'Envoyer le lien',
      }

      // Traduire les labels
      document.querySelectorAll('.stack-auth-custom label').forEach((label) => {
        const text = label.textContent?.trim()
        if (text && translations[text]) {
          label.textContent = translations[text]
        }
      })

      // Traduire les boutons
      document.querySelectorAll('.stack-auth-custom button[type="submit"]').forEach((button) => {
        const text = button.textContent?.trim()
        if (text && translations[text]) {
          button.textContent = translations[text]
        }
      })

      // Traduire les placeholders
      document.querySelectorAll('.stack-auth-custom input[type="email"]').forEach((input) => {
        (input as HTMLInputElement).placeholder = 'votre@email.com'
      })
    }

    const timer = setTimeout(translateLabels, 100)
    const observer = new MutationObserver(translateLabels)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

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
            {emailSent ? (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </motion.div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                  Email envoyé !
                </h2>
                <p className="text-gray-600 mb-6">
                  Un lien de réinitialisation a été envoyé à votre adresse email. 
                  Vérifiez votre boîte de réception (et vos spams).
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
                  <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
                    Réinitialiser le mot de passe
                  </h2>
                  <p className="text-gray-600 text-base">
                    Entrez votre email pour recevoir un lien de réinitialisation
                  </p>
                </div>

                {/* Composant Stack Auth intégré avec style personnalisé */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="stack-auth-custom"
                >
                  <style jsx global>{`
                    .stack-auth-custom input {
                      width: 100%;
                      padding: 16px 24px;
                      border: 1px solid #d1d5db;
                      border-radius: 24px;
                      font-size: 16px;
                      transition: all 0.2s;
                      outline: none;
                    }
                    .stack-auth-custom input:focus {
                      border-color: #000;
                      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
                    }
                    .stack-auth-custom button[type="submit"] {
                      width: 100%;
                      padding: 16px 24px;
                      background: #000;
                      color: white;
                      border: none;
                      border-radius: 24px;
                      font-weight: 600;
                      font-size: 16px;
                      cursor: pointer;
                      transition: all 0.2s;
                      margin-top: 24px;
                    }
                    .stack-auth-custom button[type="submit"]:hover {
                      background: #333;
                    }
                    .stack-auth-custom button[type="submit"]:disabled {
                      opacity: 0.5;
                      cursor: not-allowed;
                    }
                    .stack-auth-custom label {
                      display: block;
                      font-weight: 500;
                      color: #111827;
                      margin-bottom: 12px;
                      font-size: 14px;
                    }
                    .stack-auth-custom form > div {
                      margin-bottom: 24px;
                    }
                  `}</style>
                  <ForgotPassword />
                </motion.div>

                {/* Lien retour */}
                <motion.div
                  className="mt-6 text-center"
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
                      Se connecter
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
