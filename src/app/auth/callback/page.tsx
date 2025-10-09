'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@stackframe/stack'

export default function AuthCallbackPage() {
  const router = useRouter()
  const user = useUser({ or: 'return-null' })

  useEffect(() => {
    // Attendre que l'utilisateur soit chargé
    if (user) {
      // Vérifier s'il y a un branding en attente
      const brandData = sessionStorage.getItem('brandData')
      const downloadIntent = sessionStorage.getItem('downloadIntent')

      if (brandData && downloadIntent === 'true') {
        // Rediriger vers la page preview pour sauvegarde automatique
        const data = JSON.parse(brandData)
        router.push(`/brand/preview/${data.id}`)
      } else {
        // Sinon, rediriger vers le dashboard
        router.push('/dashboard')
      }
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-white/80">Finalisation de la connexion...</p>
      </div>
    </div>
  )
}

