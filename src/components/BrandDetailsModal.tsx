'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, User, Download, Eye, CheckCircle, XCircle } from 'lucide-react'

interface Brand {
  id: string
  name: string
  description: string | null
  primaryColor: string | null
  secondaryColor: string | null
  accentColor: string | null
  primaryFont: string | null
  secondaryFont: string | null
  brandPersonality: string | null
  targetAudience: string | null
  isCompleted: boolean
  isInLibrary: boolean
  pdfDownloads?: number
  createdAt: string
  user: {
    name: string | null
    email: string
  }
}

interface BrandDetailsModalProps {
  brand: Brand | null
  isOpen: boolean
  onClose: () => void
}

export default function BrandDetailsModal({ brand, isOpen, onClose }: BrandDetailsModalProps) {
  if (!brand) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-3xl">
                <div>
                  <h2 className="text-2xl font-bold text-black">{brand.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Créé le {new Date(brand.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Utilisateur */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Utilisateur</h3>
                  </div>
                  <p className="text-gray-700">{brand.user.name || 'Sans nom'}</p>
                  <p className="text-gray-600 text-sm">{brand.user.email}</p>
                </div>

                {/* Description */}
                {brand.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700">{brand.description}</p>
                  </div>
                )}

                {/* Statistiques */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Download className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Téléchargements</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{brand.pdfDownloads || 0}</p>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Statut</span>
                    </div>
                    <p className="text-sm font-semibold text-green-600">
                      {brand.isCompleted ? 'Complété' : 'En cours'}
                    </p>
                  </div>
                </div>

                {/* Palette de couleurs */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Palette de Couleurs</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {brand.primaryColor && (
                      <div>
                        <div
                          className="w-full h-20 rounded-xl border border-gray-200"
                          style={{ backgroundColor: brand.primaryColor }}
                        />
                        <p className="text-sm text-gray-600 mt-2">Primaire</p>
                        <p className="text-xs font-mono text-gray-500">{brand.primaryColor}</p>
                      </div>
                    )}
                    {brand.secondaryColor && (
                      <div>
                        <div
                          className="w-full h-20 rounded-xl border border-gray-200"
                          style={{ backgroundColor: brand.secondaryColor }}
                        />
                        <p className="text-sm text-gray-600 mt-2">Secondaire</p>
                        <p className="text-xs font-mono text-gray-500">{brand.secondaryColor}</p>
                      </div>
                    )}
                    {brand.accentColor && (
                      <div>
                        <div
                          className="w-full h-20 rounded-xl border border-gray-200"
                          style={{ backgroundColor: brand.accentColor }}
                        />
                        <p className="text-sm text-gray-600 mt-2">Accent</p>
                        <p className="text-xs font-mono text-gray-500">{brand.accentColor}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Typographie */}
                {(brand.primaryFont || brand.secondaryFont) && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Typographie</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {brand.primaryFont && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm text-gray-600 mb-1">Police Principale</p>
                          <p className="font-semibold text-gray-900">{brand.primaryFont}</p>
                        </div>
                      )}
                      {brand.secondaryFont && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm text-gray-600 mb-1">Police Secondaire</p>
                          <p className="font-semibold text-gray-900">{brand.secondaryFont}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Personnalité & Audience */}
                <div className="grid grid-cols-2 gap-4">
                  {brand.brandPersonality && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Personnalité</h3>
                      <p className="text-gray-700 bg-gray-50 rounded-xl p-4">{brand.brandPersonality}</p>
                    </div>
                  )}
                  {brand.targetAudience && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Audience Cible</h3>
                      <p className="text-gray-700 bg-gray-50 rounded-xl p-4">{brand.targetAudience}</p>
                    </div>
                  )}
                </div>

                {/* Statuts */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    {brand.isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-700">
                      {brand.isCompleted ? 'Complété' : 'Non complété'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {brand.isInLibrary ? (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-700">
                      {brand.isInLibrary ? 'Dans la bibliothèque' : 'Pas dans la bibliothèque'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => window.open(`/brand/${brand.id}`, '_blank')}
                    className="flex-1 px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-5 h-5" />
                    Voir le Branding
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

