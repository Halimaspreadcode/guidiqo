'use client'

import { useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Mail, MessageSquare, Send, CheckCircle, Calendar } from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const { scrollYProgress } = useScroll()
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.5])
  
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
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20 md:pt-24">
        {/* Hero Section - Ultra minimal */}
        <section className="px-4 md:px-8 mb-32 md:mb-48">
          <motion.div 
            className="relative min-h-[85vh] flex items-center justify-center overflow-hidden rounded-3xl bg-black"
            style={{ scale: heroScale, opacity: heroOpacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1758551015352-fa735f167422?q=80&w=2600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Contact"
              fill
              className="object-cover opacity-90"
              priority
            />

            <div className="relative z-10 text-center px-6 max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-bold tracking-tighter text-white mb-8">
                  Contact
                </h1>
                <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-light">
                  Parlons de votre projet ensemble
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Profil - Inspired by About page */}
        <section className="px-4 md:px-8 mb-32 md:mb-48">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-150px" }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-2 gap-12 md:gap-16 items-center"
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full" />
                <Image
                  src="https://e7msojy1cjnzyvsj.public.blob.vercel-storage.com/images/1759420176922-Gemini_Generated_Image_fm2idkfm2idkfm2i.png"
                  alt="Halima Gueye"
                  fill
                  className="rounded-full object-cover border-8 border-white shadow-2xl"
                  priority
                />
              </div>

              <div>
                <motion.h2 
                  className="text-5xl md:text-7xl font-bold text-black mb-4"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Halima Gueye
                </motion.h2>
                <motion.p 
                  className="text-xl md:text-2xl text-gray-500 mb-6"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  Owner
                </motion.p>
                <motion.p 
                  className="text-lg text-gray-600 leading-relaxed mb-8"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
J&apos;utilise le design et l&apos;innovation comme clés pour que le digital serve à changer les choses.                </motion.p>

                <motion.a
                  href="#book-call"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full font-semibold text-lg"
                >
                  <Calendar className="w-5 h-5" />
                  Réserver un appel
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="px-4 md:px-8 mb-32 md:mb-48">
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-black mb-16 md:mb-24"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-150px" }}
              transition={{ duration: 0.8 }}
            >
              Contactez-moi
            </motion.h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="group relative"
              >
                <motion.div
                  className="p-8 border border-gray-200 rounded-2xl bg-white"
                  whileHover={{ y: -4, borderColor: '#000', transition: { duration: 0.2 } }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-black" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-black mb-2">
                        Email
                      </h3>
                      <p className="text-gray-600 text-lg mb-2">
                        Pour toute question
                      </p>
                      <a href="mailto:contact@guidiqo.com" className="text-black font-semibold hover:underline">
                        contact@guidiqo.com
                      </a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="group relative"
              >
                <motion.div
                  className="p-8 border border-gray-200 rounded-2xl bg-white"
                  whileHover={{ y: -4, borderColor: '#000', transition: { duration: 0.2 } }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-black" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-black mb-2">
                        Support
                      </h3>
                      <p className="text-gray-600 text-lg mb-2">
                        Réponse sous 24h
                      </p>
                      <p className="text-black font-semibold">
                        Lun-Ven, 9h-18h CET
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Cal.com Section */}
        <section id="book-call" className="px-4 md:px-8 mb-32 md:mb-48">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-150px" }}
              transition={{ duration: 0.8 }}
              className="border border-gray-200 rounded-3xl overflow-hidden bg-white"
            >
              <iframe
                src="https://cal.com/halima-gueye-1kppgr"
                className="w-full border-0"
                style={{ height: '700px' }}
                title="Réserver un appel avec Halima"
                loading="lazy"
              />
            </motion.div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="px-4 md:px-8 mb-32 md:mb-48">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-150px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-black mb-8 md:mb-12">
                Ou envoyez un message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-black transition-all text-lg"
                      placeholder="Nom complet"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-black transition-all text-lg"
                      placeholder="Email"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-black transition-all text-lg"
                    placeholder="Sujet"
                  />
                </div>

                <div>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-black transition-all resize-none text-lg"
                    placeholder="Votre message..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading || success}
                  className="w-full px-8 py-5 bg-black text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
                      <span>Envoyer</span>
                    </>
                  )}
                </motion.button>

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-green-50 border-2 border-green-200 rounded-2xl text-green-800 text-center"
                  >
                    Merci pour votre message ! Je vous répondrai dans les plus brefs délais.
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
