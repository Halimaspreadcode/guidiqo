'use client'

import { motion } from 'framer-motion'
import { Target, Lightbulb, Users, Rocket, Heart, Zap } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AboutPage() {
  const values = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation",
      description: "Nous repoussons les limites de l'IA pour simplifier la création de branding."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Accessibilité",
      description: "Un outil puissant accessible à tous, des entrepreneurs aux grandes entreprises."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Passion",
      description: "Une équipe passionnée par le design et l'expérience utilisateur exceptionnelle."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Rapidité",
      description: "Créez votre branding en quelques minutes, pas en plusieurs jours."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="px-4 md:px-8 mb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-7xl font-light text-black mb-6" style={{ fontFamily: "'Raleway', sans-serif" }}>
                À propos de Guidiqo
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                Nous transformons la manière dont les entrepreneurs et les créateurs 
                développent leur identité de marque grâce à l&apos;intelligence artificielle.
              </p>
            </motion.div>

            {/* Mission Statement */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-3xl p-8 md:p-12 mb-16"
            >
              <div className="flex items-start gap-6">
                <div className="p-4 bg-black rounded-2xl">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-light text-black mb-4">Notre Mission</h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Démocratiser le branding professionnel en le rendant accessible, rapide et abordable. 
                    Guidiqo permet à chacun de créer une identité visuelle cohérente et impactante, 
                    sans avoir besoin de compétences en design ou d&apos;un budget conséquent.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="px-4 md:px-8 mb-20 bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2 className="text-4xl font-light text-black mb-6">
                  Comment tout a commencé
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Guidiqo est né d&apos;une frustration simple : créer une identité de marque professionnelle 
                    prend trop de temps et coûte trop cher.
                  </p>
                  <p>
                    En tant qu&apos;entrepreneurs et designers, nous avons vécu cette difficulté. 
                    Nous avons donc décidé de créer un outil qui combine l&apos;intelligence artificielle 
                    et les principes du design pour générer des brand guidelines complets en quelques minutes.
                  </p>
                  <p>
                    Aujourd&apos;hui, des milliers de créateurs utilisent Guidiqo pour donner vie à leurs projets, 
                    qu&apos;il s&apos;agisse de startups tech, de restaurants, de boutiques e-commerce ou d&apos;agences créatives.
                  </p>
                </div>
              </div>

              <motion.div
                className="relative h-96 bg-gradient-to-br from-black to-gray-800 rounded-3xl overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Rocket className="w-32 h-32 text-white/20" />
                </div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <p className="text-6xl font-bold mb-2">2024</p>
                  <p className="text-lg opacity-90">L&apos;année de lancement</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="px-4 md:px-8 mb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-light text-black mb-6">
                Nos Valeurs
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Les principes qui guident chaque décision et chaque ligne de code que nous écrivons.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-8 bg-white border border-gray-200 rounded-3xl hover:shadow-lg transition-shadow"
                  whileHover={{ y: -5 }}
                >
                  <div className="p-3 bg-gray-100 rounded-2xl inline-block mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-black mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="px-4 md:px-8 mb-20 bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-light text-black mb-6">
                Propulsé par les meilleures technologies
              </h2>
              <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
                Nous utilisons des technologies de pointe pour vous offrir 
                une expérience rapide, sécurisée et intuitive.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {['Next.js', 'TypeScript', 'AI / Groq', 'PostgreSQL'].map((tech, index) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-6 bg-white rounded-2xl border border-gray-200"
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="font-semibold text-black">{tech}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-black to-gray-800 rounded-3xl p-12 md:p-16 text-center text-white"
            >
              <h2 className="text-4xl md:text-5xl font-light mb-6">
                Prêt à créer votre branding ?
              </h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Rejoignez les milliers de créateurs qui font confiance à Guidiqo 
                pour développer leur identité de marque.
              </p>
              <motion.button
                onClick={() => window.location.href = '/'}
                className="px-10 py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Commencer gratuitement
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

