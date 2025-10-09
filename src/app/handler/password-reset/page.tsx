'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { PasswordReset } from '@stackframe/stack'

export default function PasswordResetPage() {
  const router = useRouter()

  // Traduire automatiquement en français
  useEffect(() => {
    const translateLabels = () => {
      const translations: Record<string, string> = {
        'New Password': 'Nouveau mot de passe',
        'Confirm Password': 'Confirmer le mot de passe',
        'Password': 'Mot de passe',
        'Reset Password': 'Réinitialiser',
        'Reset password': 'Réinitialiser',
        'Change Password': 'Changer le mot de passe',
        'Confirm password': 'Confirmer le mot de passe',
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
      document.querySelectorAll('.stack-auth-custom input[type="password"]').forEach((input) => {
        const placeholder = (input as HTMLInputElement).placeholder
        if (placeholder.includes('password')) {
          (input as HTMLInputElement).placeholder = 'Entrez votre mot de passe'
        }
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
    <div className="min-h-screen bg-white dark:bg-black flex">
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
            className="flex items-center gap-2 text-gray-600 hover:text-black dark:text-white transition-colors mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à la connexion
          </motion.button>

          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-black dark:text-white">Guidiqo</h1>
          </div>

          {/* Carte */}
          <motion.div
            className="bg-white dark:bg-black lg:border lg:border-gray-200 rounded-3xl p-8 md:p-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-2">
                Nouveau mot de passe
              </h2>
              <p className="text-gray-600">
                Choisissez un mot de passe fort et sécurisé
              </p>
            </div>

            {/* Composant Stack Auth avec styles */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
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
                .stack-auth-custom button:not([type="submit"]) {
                  background: transparent;
                  border: none;
                  padding: 0;
                  cursor: pointer;
                }
              `}</style>
              {/* 
                Correction : 
                - Suppression de l'attribut searchParams={undefined} qui provoquait une erreur de typage.
                - Le composant PasswordReset doit recevoir un objet searchParams de type Record<string, string>.
                - Si vous n'avez pas de searchParams à passer, transmettez un objet vide.
              */}
              <PasswordReset searchParams={{}} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}