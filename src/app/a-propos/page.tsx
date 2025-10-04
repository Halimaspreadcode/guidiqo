'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { Target, Compass, Zap, ArrowRight, Check } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AboutPage() {
  const { scrollYProgress } = useScroll()
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.5])

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
              alt="About"
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
                  Guidiqo
                </h1>
                
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Concept - Minimal split */}
        <section className="px-4 md:px-8 mb-32 md:mb-48">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-150px" }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-2 gap-12 md:gap-16"
            >
              <div>
                <motion.h2 
                  className="text-5xl md:text-7xl font-bold text-black mb-8"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Guide + IQ
                </motion.h2>
                <motion.p 
                  className="text-xl md:text-2xl text-gray-500 leading-relaxed"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  Un système intelligent qui t&apos;accompagne pour créer une identité de marque professionnelle en quelques minutes. Guidiqo c'est ton assistant créatif.
                </motion.p>
              </div>

              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12  rounded-xl flex items-center justify-center flex-shrink-0">
                      <Compass className="w-6 h-6 text-black" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-black mb-2">
                        Structure
                      </h3>
                      <p className="text-gray-600 text-lg">
                        Processus clair, étape par étape
                      </p>
                    </div>
                  </div>
                  <motion.div 
                    className="h-px bg-gray-200"
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12  rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-black" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-black mb-2">
                        Intelligence
                      </h3>
                      <p className="text-gray-600 text-lg">
                        Décisions guidées par des règles de design
                      </p>
                    </div>
                  </div>
                  <motion.div 
                    className="h-px bg-gray-200"
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mission - Full width statement */}
        <section className="px-4 md:px-8 mb-32 md:mb-48">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-150px" }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
           

            <motion.h2 
              className="text-5xl md:text-7xl font-bold text-black mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Un branding pro,
              <br />
              en quelques minutes
            </motion.h2>

            <motion.p 
              className="text-xl md:text-2xl text-gray-600 mb-6 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Les fondateurs perdent des semaines pour un kit basique. Beaucoup finissent avec un joli visuel… mais pas utilisable.
            </motion.p>

            <motion.p 
              className="text-xl md:text-2xl text-black font-medium max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Guidiqo génère un système de marque complet, cohérent et prêt à être publier. Aider de l'IA pour créer un branding unique et professionnel, les possibilités deviennent infinis.
            </motion.p>
          </motion.div>
        </section>

        {/* Features Grid - Minimal */}
        <section className="px-4 md:px-8 mb-32 md:mb-48">
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-black mb-16 md:mb-24"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-150px" }}
              transition={{ duration: 0.8 }}
            >
              Ce que tu obtiens
            </motion.h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Palette couleurs validée",
                "Typographie & échelle",
                "Guidelines PDF",
                "Assets exportables",
                "Historique & versions",
                "Admin équipes"
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  <motion.div
                    className="p-8 border border-gray-200 rounded-2xl bg-white"
                    whileHover={{ y: -4, borderColor: '#000', transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-start gap-3">
                      <motion.div
                        className="w-6 h-6 border-2 border-gray-300 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                        whileHover={{ borderColor: '#000' }}
                      >
                        <Check className="w-4 h-4 text-black opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={3} />
                      </motion.div>
                      <p className="text-lg md:text-xl text-black font-medium">
                        {feature}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA - Minimal black section */}
        <section className="px-4 md:px-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-150px" }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl bg-black p-16 md:p-32 text-center"
          >
            <div className="relative z-10 max-w-4xl mx-auto">
              <motion.h2 
                className="text-6xl md:text-8xl font-bold text-white mb-8"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Et si tout commençait ici ?
              </motion.h2>

              <motion.button
                onClick={() => window.location.href = '/'}
                className="group px-12 py-5 bg-white text-black rounded-full font-semibold text-lg inline-flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                C'est parti !
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
              </motion.button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  )
}