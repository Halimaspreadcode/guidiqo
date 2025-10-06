'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Mail, ArrowRight, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import { useUser } from '@stackframe/stack'
import { EmailVerification } from '@stackframe/stack'

type VerificationState = 'verifying' | 'success' | 'error' | 'already-verified'

export default function EmailVerificationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const user = useUser({ or: 'return-null' })
  const [verificationState, setVerificationState] = useState<VerificationState>('verifying')
  const [countdown, setCountdown] = useState(5)
  const code = searchParams.get('code')

  // Vérifier le statut de l'email
  useEffect(() => {
    if (user?.primaryEmail) {
      setVerificationState('already-verified')
    }

    const error = searchParams.get('error')
    const success = searchParams.get('success')

    if (error) {
      setVerificationState('error')
    } else if (success === 'true') {
      setVerificationState('success')
    }
  }, [user, searchParams])

  // Redirection automatique après succès
  useEffect(() => {
    if (verificationState === 'success' || verificationState === 'already-verified') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            const brandData = localStorage.getItem('pendingBrandData') || sessionStorage.getItem('brandData')
            const downloadIntent = localStorage.getItem('downloadIntent') || sessionStorage.getItem('downloadIntent')
            
            if (brandData && downloadIntent === 'true') {
              const data = JSON.parse(brandData)
              router.push(`/brand/preview/${data.id}`)
            } else {
              router.push('/dashboard')
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [verificationState, router])

  // Si on a un code, afficher le composant Stack Auth avec design custom
  if (code) {
    return (
      <div className="min-h-screen bg-white flex">
        {/* Section gauche - Image/Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col justify-between p-12 w-full">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-white text-5xl font-bold">Guidiqo</h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-white text-4xl font-bold leading-tight">
                Dernière étape
              </h2>
              <p className="text-gray-300 text-lg">
                Vérifiez votre email pour commencer votre aventure créative.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Section droite - Formulaire */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12">
          <div className="w-full max-w-md">
            {/* Logo mobile */}
            <motion.div
              className="lg:hidden mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-black text-4xl md:text-5xl font-bold text-center">
                Guidiqo
              </h1>
            </motion.div>

            {/* Bouton retour */}
            <motion.button
              onClick={() => router.push('/')}
              className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </motion.button>

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
                  Vérification d&apos;email
                </motion.h2>
                <motion.p
                  className="text-gray-600 text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Confirmation en cours...
                </motion.p>
              </div>

              {/* Composant Stack Auth intégré avec design custom */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="stack-auth-custom"
              >
                <EmailVerification fullPage={false} />
              </motion.div>
            </motion.div>

            {/* Footer */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <p className="text-gray-600 text-sm">
                Besoin d&apos;aide ?{' '}
                <a
                  href="mailto:support@guidiqo.com"
                  className="text-black font-semibold hover:underline"
                >
                  Contactez-nous
                </a>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Styles globaux pour Stack Auth */}
        <style jsx global>{`
          .stack-auth-custom {
            --font-family: inherit;
          }

          .stack-auth-custom input {
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            padding: 0.875rem 1rem;
            font-size: 1rem;
            width: 100%;
            transition: all 0.2s;
            font-family: inherit;
          }

          .stack-auth-custom input:focus {
            outline: none;
            border-color: #000;
            box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
          }

          .stack-auth-custom label {
            font-size: 0.875rem;
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.5rem;
            display: block;
            font-family: inherit;
          }

          .stack-auth-custom button[type='submit'] {
            background-color: #000;
            color: #fff;
            padding: 0.875rem 1.5rem;
            border-radius: 9999px;
            font-weight: 600;
            font-size: 1rem;
            width: 100%;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
            margin-top: 1rem;
          }

          .stack-auth-custom button[type='submit']:hover {
            background-color: #1f2937;
            transform: translateY(-1px);
          }

          .stack-auth-custom button[type='submit']:active {
            transform: translateY(0);
          }

          .stack-auth-custom .error-message {
            color: #dc2626;
            font-size: 0.875rem;
            margin-top: 0.5rem;
            font-family: inherit;
          }

          .stack-auth-custom .success-message {
            color: #16a34a;
            font-size: 0.875rem;
            margin-top: 0.5rem;
            font-family: inherit;
          }

          .stack-auth-custom p {
            font-family: inherit;
          }

          .stack-auth-custom div {
            font-family: inherit;
          }
        `}</style>
      </div>
    )
  }

  // Sinon, afficher les états de vérification manuels
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Verifying State */}
        {verificationState === 'verifying' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 mx-auto mb-8"
            >
              <div className="w-24 h-24 border-4 border-gray-200 border-t-black rounded-full"></div>
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Vérification en cours...
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Nous vérifions votre adresse email. Un instant s&apos;il vous plaît.
            </p>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Besoin d&apos;aide ?{' '}
                <a href="mailto:support@guidiqo.com" className="text-black font-semibold hover:underline">
                  Contactez-nous
                </a>
              </p>
            </div>
          </motion.div>
        )}

        {/* Success State */}
        {verificationState === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-16 h-16 text-green-600" />
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 text-center">
              Email vérifié ! 🎉
            </h1>
            <p className="text-gray-600 text-lg mb-8 text-center">
              Votre adresse email a été vérifiée avec succès. Redirection dans {countdown} secondes...
            </p>

            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/dashboard')}
                className="w-full py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Aller au Dashboard
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Besoin d&apos;aide ?{' '}
                <a href="mailto:support@guidiqo.com" className="text-black font-semibold hover:underline">
                  Contactez-nous
                </a>
              </p>
            </div>
          </motion.div>
        )}

        {/* Already Verified State */}
        {verificationState === 'already-verified' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-8 bg-blue-100 rounded-full flex items-center justify-center"
            >
              <Mail className="w-16 h-16 text-blue-600" />
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 text-center">
              Email déjà vérifié
            </h1>
            <p className="text-gray-600 text-lg mb-8 text-center">
              Votre adresse email est déjà vérifiée. Redirection dans {countdown} secondes...
            </p>

            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/dashboard')}
                className="w-full py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Aller au Dashboard
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Besoin d&apos;aide ?{' '}
                <a href="mailto:support@guidiqo.com" className="text-black font-semibold hover:underline">
                  Contactez-nous
                </a>
              </p>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {verificationState === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-8 bg-red-100 rounded-full flex items-center justify-center"
            >
              <AlertCircle className="w-16 h-16 text-red-600" />
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 text-center">
              Erreur de vérification
            </h1>
            <p className="text-gray-600 text-lg mb-8 text-center">
              Le lien de vérification est invalide ou a expiré.
            </p>

            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/dashboard')}
                className="w-full py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
              >
                Aller au Dashboard
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/auth/signin')}
                className="w-full py-4 bg-white text-black border border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-colors"
              >
                Se connecter
              </motion.button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Besoin d&apos;aide ?{' '}
                <a href="mailto:support@guidiqo.com" className="text-black font-semibold hover:underline">
                  Contactez-nous
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
