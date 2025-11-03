"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export const StickyBanner = ({
  className,
  hiddenPaths = [],
}: {
  className?: string
  hideOnScroll?: boolean
  hiddenPaths?: string[]
}) => {
  const pathname = usePathname()

  // Message fixe avec lien "ici" - l'annonce ne peut pas être fermée
  const fixedMessage = "Utilisé dans +20 Pays dans le monde "
  const linkText = " "
  const linkHref = "https://create.guidiqo.com"

  const shouldHide = hiddenPaths.some((path) => pathname.startsWith(path))

  if (shouldHide) return null

  return (
    <motion.div
      className={cn(
        'fixed inset-x-0 top-0 z-[60] flex min-h-14 w-full items-center bg-gradient-to-r from-gray-400 via-red-800 to-gray-200 overflow-hidden',
        className,
      )}
      initial={{
        y: -100,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
    >
      <div className="relative flex overflow-hidden w-full justify-center">
        <motion.div className="flex whitespace-nowrap">
          <span className="text-white text-sm font-medium px-4 text-center w-full flex items-center justify-center gap-1">
            {fixedMessage}{' '}
            <a
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline font-semibold transition-all"
            >
              {linkText}
            </a>
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}
