'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface SpotlightedCreator {
  id: string
  name: string | null
  email: string
  profileImage: string | null
  isVerified: boolean
  spotlightedCount: number
  totalBrandsCount: number
  latestBrand: {
    id: string
    name: string
    primaryColor: string | null
    secondaryColor: string | null
    accentColor: string | null
    coverImage: string | null
  } | null
}

const LiquidButton = ({ children, className = '', onClick }: any) => {
  return (
    <motion.button
      className={`relative px-8 py-4 rounded-full font-medium overflow-hidden flex items-center gap-3 ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{
          x: '100%',
          transition: { duration: 0.6, ease: 'easeInOut' }
        }}
      />
      <span className="relative z-10 flex items-center gap-3">{children}</span>
    </motion.button>
  )
}

const Card3D = ({ creator, index }: { creator: SpotlightedCreator; index: number }) => {
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
    stiffness: 300,
    damping: 30,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const percentX = (e.clientX - centerX) / (rect.width / 2)
    const percentY = (e.clientY - centerY) / (rect.height / 2)
    mouseX.set(percentX)
    mouseY.set(percentY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const displayName = creator.name || creator.email.split('@')[0]

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => router.push(`/createur/${creator.id}`)}
      className="cursor-pointer"
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="relative w-full aspect-square"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {/* Shadow layer */}
        <div 
          className="absolute inset-0 bg-black/10 rounded-2xl blur-xl"
          style={{ 
            transform: 'translateZ(-50px)',
            transformStyle: 'preserve-3d',
          }}
        />

        {/* Main card */}
        <div
          className="absolute inset-0 bg-white/90 backdrop-blur-xl rounded-full overflow-hidden"
          style={{ 
            transform: 'translateZ(0px)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Cover image */}
          {creator.latestBrand && (
            <div 
              className="absolute inset-0"
              style={{ 
                backgroundColor: creator.latestBrand.primaryColor || '#000',
                transform: 'translateZ(10px)',
                transformStyle: 'preserve-3d',
              }}
            >
              {creator.latestBrand.coverImage && (
                <img
                  src={creator.latestBrand.coverImage}
                  alt={creator.latestBrand.name}
                  className="w-full h-full object-cover opacity-40"
                />
              )}
            </div>
          )}

          {/* Content layer */}
          <div 
            className="absolute inset-0 p-6 flex flex-col justify-between"
            style={{ 
              transform: 'translateZ(30px)',
              transformStyle: 'preserve-3d',
            }}
          >
           

            {/* Bottom - Profile */}
            <div>
              <div className="flex items-center gap-3 mb-3 mt-5 ml-5">
                <div className="relative">
                  <div 
                    className="w-16 h-16 rounded-full bg-black flex items-center justify-center overflow-hidden "
                    style={{ 
                      transform: 'translateZ(20px)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {creator.profileImage ? (
                      <img
                        src={creator.profileImage}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-lg font-bold">
                        {displayName.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {creator.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function SpotlightedCreators() {
  const router = useRouter()
  const [creators, setCreators] = useState<SpotlightedCreator[]>([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Animations de parallax
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

  useEffect(() => {
    fetchSpotlightedCreators()
  }, [])

  const fetchSpotlightedCreators = async () => {
    try {
      const response = await fetch('/api/creators/spotlighted', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCreators(data)
      }
    } catch (error) {
      console.error('Error fetching spotlighted creators:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  if (creators.length === 0) {
    return null
  }

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 px-4 md:px-8 overflow-hidden">
      {/* Background animated gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 -z-10"
        style={{ opacity }}
      />
      
      {/* Floating shapes with parallax */}
      <motion.div 
        className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-stone-200/30 to-gray-200/30 rounded-full blur-3xl -z-10"
        style={{ y: y1 }}
      />
      <motion.div 
        className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-stone-100/40 to-gray-100/40 rounded-full blur-3xl -z-10"
        style={{ y: y2 }}
      />

      <motion.div 
        className="max-w-7xl mx-auto"
        style={{ scale }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:sticky lg:top-32"
            style={{ y: y2 }}
          >
            <motion.h2 
              className="text-4xl md:text-7xl font-bold leading-tight mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-stone-900 to-gray-400 font-medium bg-clip-text text-transparent">
                Les créateurs qui façonnent notre communauté
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-600 leading-relaxed mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Découvre les talents dont les créations nous inspirent chaque jour
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <LiquidButton
                onClick={() => router.push('/bibliotheque')}
                className="bg-black text-white border border-gray-200"
              >
                Explorer tous les créateurs
                <ArrowRight className="w-5 h-5" strokeWidth={2} />
              </LiquidButton>
            </motion.div>
          </motion.div>

          {/* Right Side - 3D Cards Grid with stagger animation */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {creators.map((creator, index) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
              >
                <Card3D creator={creator} index={index} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}