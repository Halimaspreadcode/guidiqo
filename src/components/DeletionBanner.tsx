'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DeletionBanner() {
  const router = useRouter()
  const [deletionInfo, setDeletionInfo] = useState<{
    scheduledFor: string
    requestId: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkDeletionStatus = async () => {
      try {
        const response = await fetch('/api/account/deletion-status')
        if (response.ok) {
          const data = await response.json()
          if (data.hasPendingDeletion) {
            setDeletionInfo({
              scheduledFor: data.scheduledFor,
              requestId: data.requestId,
            })
          }
        }
      } catch (error) {
        console.error('Erreur vérification suppression:', error)
      } finally {
        setLoading(false)
      }
    }

    checkDeletionStatus()
  }, [])

  if (loading || !deletionInfo) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-red-600 to-red-700 text-white shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            </motion.div>
            
            <div className="flex-1">
              <p className="font-bold text-sm sm:text-base">
                Votre compte sera supprimé le {deletionInfo.scheduledFor}
              </p>
              <p className="text-xs sm:text-sm text-red-100 mt-1">
                Toutes vos données seront définitivement perdues. Vous avez encore le temps d&apos;annuler.
              </p>
            </div>
          </div>

          <motion.button
            onClick={() => router.push('/profil/cancel-deletion')}
            className="px-4 py-2 bg-white text-red-600 rounded-full font-semibold text-sm hover:bg-red-50 transition-colors whitespace-nowrap flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Annuler la suppression
          </motion.button>
        </div>

        {/* Barre de progression animée */}
        <motion.div
          className="h-1 bg-white/30"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
        />
      </motion.div>
    </AnimatePresence>
  )
}
