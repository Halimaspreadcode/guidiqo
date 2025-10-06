'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'
import { useUser } from '@stackframe/stack'

type VerificationState = 'verifying' | 'success' | 'error' | 'already-verified'

export default function EmailVerificationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const user = useUser({ or: 'return-null' })
  const [verificationState, setVerificationState] = useState<VerificationState>('verifying')
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Vérifier si l'email est déjà vérifié
    if (user?.primaryEmail) {
      setVerificationState('already-verified')
    }

    // Vérifier les paramètres de l'URL pour le statut
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
            // Vérifier s'il y a un branding en attente
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

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Verifying State */}
        {verificationState === 'verifying' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 mx-auto mb-6"
            >
              <Loader2 className="w-20 h-20 text-black" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-black mb-4">
              Vérification en cours...
            </h1>
            <p className="text-gray-600">
              Nous vérifions votre adresse email. Un instant s'il vous plaît.
            </p>
          </motion.div>
        )}

        {/* Success State */}
        {verificationState === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-black mb-4">
              Email vérifié ! 🎉
            </h1>
            <p className="text-gray-600 mb-8">
              Votre adresse email a été vérifiée avec succès. Vous allez être redirigé vers votre dashboard dans {countdown} secondes...
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard')}
              className="w-full py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              Aller au Dashboard
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {/* Already Verified State */}
        {verificationState === 'already-verified' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center"
            >
              <Mail className="w-12 h-12 text-blue-600" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-black mb-4">
              Email déjà vérifié
            </h1>
            <p className="text-gray-600 mb-8">
              Votre adresse email est déjà vérifiée. Redirection vers votre dashboard dans {countdown} secondes...
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard')}
              className="w-full py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              Aller au Dashboard
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {/* Error State */}
        {verificationState === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
            >
              <AlertCircle className="w-12 h-12 text-red-600" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-black mb-4">
              Erreur de vérification
            </h1>
            <p className="text-gray-600 mb-8">
              Le lien de vérification est invalide ou a expiré. Veuillez demander un nouvel email de vérification.
            </p>

            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard')}
                className="w-full py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
              >
                Aller au Dashboard
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/auth/signin')}
                className="w-full py-4 bg-white text-black border border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-colors"
              >
                Se connecter
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            Besoin d'aide ? <a href="mailto:support@guidiqo.com" className="text-black font-semibold hover:underline">Contactez-nous</a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

