'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simuler l'envoi (à remplacer par une vraie API)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setLoading(false)
    setSuccess(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    
    setTimeout(() => setSuccess(false), 5000)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-light text-black mb-6" style={{ fontFamily: "'Raleway', sans-serif" }}>
              Contactez-nous
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Une question, une suggestion ou besoin d&apos;aide ? Nous sommes là pour vous écouter.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Informations de contact */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-light text-black mb-8">
                  Restons en contact
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Notre équipe est à votre disposition pour répondre à toutes vos questions concernant Guidiqo, 
                  notre plateforme de création de branding ou pour toute demande de partenariat.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <motion.div
                  className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-3 bg-black rounded-full">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Email</h3>
                    <p className="text-gray-600">contact@guidiqo.com</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-3 bg-black rounded-full">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Support</h3>
                    <p className="text-gray-600">Réponse sous 24h ouvrées</p>
                  </div>
                </motion.div>
              </div>

              {/* Social Links (optionnel) */}
              <div className="pt-8">
                <p className="text-sm text-gray-500 mb-4">Suivez-nous</p>
                <div className="flex gap-4">
                  {['Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                    <motion.button
                      key={social}
                      className="px-6 py-2 border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {social}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Formulaire de contact */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="Jean Dupont"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="jean@exemple.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="Demande d'information"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                    placeholder="Bonjour, je souhaiterais..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading || success}
                  className="w-full px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: loading || success ? 1 : 1.02 }}
                  whileTap={{ scale: loading || success ? 1 : 0.98 }}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Message envoyé !</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Envoyer le message</span>
                    </>
                  )}
                </motion.button>

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-800 text-sm"
                  >
                    Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

