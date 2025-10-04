'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Send, CheckCircle, Calendar, User } from 'lucide-react'
import Image from 'next/image'
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
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi')
      }

      setSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <Header />
      
      <main className="pt-32 pb-20">
        {/* Hero Section avec image de fond */}
        <section className="px-4 md:px-8 mb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="relative min-h-[60vh] flex items-center justify-center overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-gradient-to-br from-gray-900 to-gray-800"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
              
              {/* Content */}
              <div className="relative z-10 text-center px-6 py-16">
                <motion.h1 
                  className="text-5xl md:text-7xl font-light text-white mb-6"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Parlons de votre projet
                </motion.h1>
                <motion.p 
                  className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Une question, besoin d&apos;aide ou envie de discuter de votre branding ? 
                  Je suis là pour vous accompagner.
                </motion.p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section principale */}
        <section className="px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Carte de présentation avec photo */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-16"
            >
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-3xl p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Photo */}
                  <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full" />
                    <Image
                      src="https://e7msojy1cjnzyvsj.public.blob.vercel-storage.com/images/1759420176922-Gemini_Generated_Image_fm2idkfm2idkfm2i.png"
                      alt="Halima - Fondatrice de Guidiqo"
                      fill
                      className="rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-light text-black mb-2">Halima Gueye</h2>
                    <p className="text-lg text-gray-600 mb-4">Ingénieure & Designer</p>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Passionnée par le design et l&apos;innovation, je suis là pour vous aider à créer 
                      une identité de marque qui vous ressemble. Parlons de votre projet ensemble !
                    </p>

                    {/* Bouton Cal.com */}
                    <motion.a
                      href="#book-call"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Calendar className="w-5 h-5" />
                      Réserver un appel gratuit
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Contact Cards */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-4">
                  <Mail className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-semibold text-black mb-2">Email</h3>
                <p className="text-gray-600 mb-4">Pour toute question ou demande de partenariat</p>
                <a href="mailto:contact@guidiqo.com" className="text-black font-semibold hover:underline">
                  contact@guidiqo.com
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-4">
                  <MessageSquare className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-semibold text-black mb-2">Support</h3>
                <p className="text-gray-600 mb-4">Nous répondons sous 24h ouvrées</p>
                <p className="text-black font-semibold">Lun-Ven, 9h-18h CET</p>
              </motion.div>
            </div>

            {/* Section Cal.com */}
            <motion.div
              id="book-call"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-16"
            >
             

              <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                <iframe
                  src="https://cal.com/halima-gueye-1kppgr"
                  className="w-full border-0"
                  style={{ height: '700px' }}
                  title="Réserver un appel avec Halima"
                  loading="lazy"
                />
              </div>
            </motion.div>

            {/* Formulaire de contact alternatif */}
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <h3 className="text-3xl font-light text-black mb-6">
                  Ou envoyez-moi un message
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Vous préférez écrire ? Pas de problème ! Remplissez ce formulaire 
                  et je vous répondrai dans les plus brefs délais.
                </p>

                {/* FAQ rapide */}
                <div className="space-y-4">
                  <div className="border-l-4 border-black pl-4">
                    <p className="text-sm font-semibold text-black mb-1">Temps de réponse</p>
                    <p className="text-sm text-gray-600">Maximum 24h ouvrées</p>
                  </div>
                  <div className="border-l-4 border-black pl-4">
                    <p className="text-sm font-semibold text-black mb-1">Appel gratuit</p>
                    <p className="text-sm text-gray-600">25 minutes pour discuter de votre projet</p>
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
        </section>
      </main>

      <Footer />
    </div>
  )
  }

