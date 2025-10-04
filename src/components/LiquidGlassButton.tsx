'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface LiquidButtonProps {
  children: ReactNode
  className?: string
  disabled?: boolean  
  color?: string
  textColor?: string
  onClick?: () => void
}

export function LiquidButton({ children, className = '', onClick, disabled, color, textColor}: LiquidButtonProps) {
  return (
    <motion.button
      className={`relative px-6 py-3 rounded-full font-medium text-white overflow-hidden flex flex-row items-center gap-2 ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      disabled={disabled}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Effet verre */}
      <div className={`absolute inset-0 bg-${color}/10 backdrop-blur-sm`} />

      {/* Effet liquide animé */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-${color}/20 to-transparent`}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Contenu aligné en ligne */}
      <span className={`relative z-10 flex flex-row items-center gap-2 text-${textColor}`}>{children}</span>
    </motion.button>
  )
}
