'use client'

import { motion } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { Home, Palette, BookOpen, Settings, LogOut, Crown, User } from 'lucide-react'
import { useUser } from '@stackframe/stack'
import { useEffect, useState } from 'react'
import { useUserProfile } from '@/hooks/useUserProfile'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  isMobile?: boolean
}

export default function Sidebar({ isOpen = false, onClose, isMobile = false }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useUser({ or: 'return-null' })
  const { profile } = useUserProfile()
  const [isAdmin, setIsAdmin] = useState(false)

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false)
        return
      }

      try {
        const response = await fetch('/api/check-admin')
        if (response.ok) {
          const data = await response.json()
          setIsAdmin(data.isAdmin)
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      }
    }

    checkAdmin()
  }, [user])

  // Fonction de déconnexion
  const handleSignOut = async () => {
    // Nettoyer toutes les données en attente avant de se déconnecter
    localStorage.removeItem('pendingBrandData')
    localStorage.removeItem('downloadIntent')
    sessionStorage.removeItem('brandData')
    sessionStorage.removeItem('downloadIntent')
    
    await user?.signOut()
    window.location.href = '/'
  }

  // Récupère les initiales de l'utilisateur
  const getInitials = () => {
    if (!user) return ''
    const displayName = user.displayName || user.primaryEmail || ''
    if (displayName.includes('@')) {
      return displayName.substring(0, 2).toUpperCase()
    }
    const names = displayName.trim().split(' ')
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase()
    }
    return displayName.substring(0, 2).toUpperCase()
  }

  // Définition des liens de navigation
  const navLinks = [
    {
      href: '/',
      label: 'Accueil',
      icon: Home,
      match: (path: string) => path === '/',
    },
    {
      href: '/dashboard',
      label: 'Mes Brandings',
      icon: Palette,
      match: (path: string) => path.startsWith('/dashboard'),
    },
    {
      href: '/bibliotheque',
      label: 'Bibliothèque',
      icon: BookOpen,
      match: (path: string) => path.startsWith('/bibliotheque'),
    },
    {
      href: '/profil',
      label: 'Mon Profil',
      icon: User,
      match: (path: string) => path.startsWith('/profil'),
    },
    // Lien SuperAdmin (seulement si l'utilisateur est admin)
    ...(isAdmin ? [{
      href: '/superadmin',
      label: 'Super Admin',
      icon: Crown,
      match: (path: string) => path.startsWith('/superadmin'),
    }] : []),
    // {
    //   href: '#',
    //   label: 'Paramètres',
    //   icon: Settings,
    //   match: (path: string) => false, // Pas de route active pour paramètres
    // },
  ]

  // Contenu de la sidebar
  const sidebarContent = (
    <div className="p-6 pt-8 h-full flex flex-col relative font-raleway">


      {/* Logo */}
      <motion.div
        className="relative mb-8 cursor-pointer overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-white/90 to-gray-50/80 backdrop-blur-xl border border-white/30"
        onClick={() => {
          router.push('/')
          onClose?.()
        }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute inset-0 backdrop-blur-md" />
        <motion.div
          className="absolute inset-0 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -top-10 -right-10 w-32 h-32  rounded-full blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <h1 className="relative z-10 text-2xl font-bold text-black text-left tracking-tight">Guidiqo</h1>
      </motion.div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1 relative z-10">
        {navLinks.map(({ href, label, icon: Icon, match }, idx) => {
          const isActive = match(pathname)
          return (
            <motion.a
              key={href}
              href={href}
              onClick={e => {
                e.preventDefault()
                if (href !== '#') {
                  router.push(href)
                  onClose?.()
                }
              }}
              className={
                [
                  "relative flex items-center gap-3 px-4 py-3 rounded-3xl overflow-hidden group backdrop-blur-sm transition-all",
                  "font-medium",
                  isActive
                    ? "border border-black/5 bg-white/80 text-black"
                    : "border border-white/20 text-gray-600",
                  isActive
                    ? "shadow-md"
                    : "",
                  "hover:scale-[1.02] hover:-translate-y-[1px]"
                ].join(' ')
              }
              style={isActive ? { boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' } : undefined}
              whileHover={{ scale: 1.02, y: -1 }}
            >
              {/* Effet de fond animé uniquement au hover */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}
              
              />
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent ${isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <Icon className="relative z-10 w-5 h-5" />
              <span className={`relative z-10 transition-colors ${isActive ? 'text-black' : 'group-hover:text-black'}`}>{label}</span>
            </motion.a>
          )
        })}
      </nav>

      {/* Section utilisateur et bouton déconnexion en bas */}
      <div className="mt-auto flex flex-col gap-4">
        {/* User Info */}
        <motion.div
          className="relative px-4 py-4 rounded-2xl border border-white/30 backdrop-blur-xl overflow-hidden bg-gradient-to-br from-white/95 to-gray-50/90"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-white/20 backdrop-blur-md" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-stone-900/8 to-blue-700/8 rounded-full blur-xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="relative z-10 flex items-center gap-3">
            <div className="relative">
              <motion.div
                className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 shadow-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {profile?.profileImage || user?.profileImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile?.profileImage || user?.profileImageUrl || ''}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-900 to-red-950 text-white font-bold flex items-center justify-center">
                    {getInitials()}
                  </div>
                )}
              </motion.div>
              {profile?.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://e7msojy1cjnzyvsj.public.blob.vercel-storage.com/images/1759665603040-verified-badge-profile-icon-png.webp"
                    alt="Verified"
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-black truncate text-sm">
                {user?.displayName || user?.primaryEmail?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-600 truncate">{user?.primaryEmail}</p>
            </div>
          </div>
        </motion.div>

        {/* Bouton Déconnexion */}
        <motion.button
          onClick={handleSignOut}
          className="relative w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl overflow-hidden group backdrop-blur-sm border border-black/5"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-gray-50 to-transparent  hover:bg-red-900 backdrop-blur-md opacity-100 transition-opacity duration-300" />
          <motion.div
            className="absolute inset-0 "
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          <LogOut className="relative z-10 w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
          <span className="relative z-10 font-medium text-gray-600 group-hover:text-white transition-colors">Se déconnecter</span>
        </motion.button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        className="fixed top-0 left-0 h-full w-72 bg-white/95 backdrop-blur-2xl border-r border-white/30 z-40 "
        transition={{ duration: 0.3 }}
      >
        {sidebarContent}
      </motion.aside>
    )
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-72 bg-white/95 backdrop-blur-2xl border-r border-black/5 z-20 ">
      {sidebarContent}
    </aside>
  )
}
