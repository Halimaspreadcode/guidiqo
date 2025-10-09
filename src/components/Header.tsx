"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUser } from '@stackframe/stack';
import { LiquidButton } from './LiquidGlassButton';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useUserProfile } from '@/hooks/useUserProfile';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const router = useRouter();
  const user = useUser({ or: 'return-null' });
  const { profile } = useUserProfile();
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const response = await fetch('/api/check-admin');
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.isAdmin);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [user]);

  // Vérifier si la banner a été fermée
  useEffect(() => {
    const checkBannerStatus = () => {
      const dismissed = localStorage.getItem('stickyBannerDismissed');
      setBannerDismissed(dismissed === 'true');
    };

    checkBannerStatus();
    
    // Écouter les changements de localStorage
    const handleStorageChange = () => {
      checkBannerStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier périodiquement (pour les changements dans le même onglet)
    const interval = setInterval(checkBannerStatus, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleSignIn = () => {
    router.push('/auth/signin');
  };

  const handleSignOut = async () => {
    // Nettoyer toutes les données en attente avant de se déconnecter
    localStorage.removeItem('pendingBrandData')
    localStorage.removeItem('downloadIntent')
    sessionStorage.removeItem('brandData')
    sessionStorage.removeItem('downloadIntent')
    
    await user?.signOut();
    // Forcer la redirection vers la page d'accueil
    window.location.href = '/';
  };

  // Obtenir les initiales de l'utilisateur
  const getInitials = () => {
    if (!user) return '';
    
    const displayName = user.displayName || user.primaryEmail || '';
    
    // Si c'est un email, prendre les 2 premières lettres
    if (displayName.includes('@')) {
      return displayName.substring(0, 2).toUpperCase();
    }
    
    // Si c'est un nom, prendre les initiales
    const names = displayName.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    
    // Sinon, prendre les 2 premières lettres
    return displayName.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <motion.header 
        className={`fixed left-0 right-0 z-[55] flex justify-center px-3 sm:px-4 md:px-6 py-3 sm:py-4 transition-all duration-300 ${
          bannerDismissed ? 'top-0' : 'top-12'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div 
          className="flex items-center justify-between gap-3 sm:gap-6 md:gap-8 rounded-full px-4 sm:px-6 py-2 sm:py-3 bg-white/70 dark:bg-black/70 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-sm"
          style={{ fontFamily: "'Raleway', sans-serif" }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
           
            <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-black dark:text-white">Guidiqo</span>
          </div>
          
          {/* Menu Hamburger - Visible seulement sur mobile */}
          <motion.button
            className="sm:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-black dark:text-white" /> : <Menu className="w-5 h-5 text-black dark:text-white" />}
          </motion.button>

          {/* Navigation Desktop */}
          <nav className="hidden sm:flex items-center gap-4 md:gap-6 lg:gap-8 text-xs sm:text-sm">
            <a href="/" className="text-gray-600 dark:text-white hover:text-red-900 dark:hover:text-gray-300 transition-colors duration-200">Accueil</a>
            <a href="/bibliotheque" className="text-gray-600 dark:text-white hover:text-red-900 dark:hover:text-gray-300 transition-colors duration-200">Bibliothèque</a>
            {isAdmin && (
              <a href="/superadmin" className="text-gray-600 dark:text-white hover:text-red-900 dark:hover:text-gray-300 transition-colors duration-200">Admin</a>
            )}
          </nav>
          
          {/* Theme Toggle & User/Login Button */}
          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <motion.button
                    onClick={() => router.push('/dashboard')}
                    className="w-10 h-10 rounded-full overflow-hidden hover:from-red-900 hover:to-red-600 transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={user.displayName || user.primaryEmail || 'Mon compte'}
                  >
                    {profile?.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-stone-900 to-gray-800 text-white font-semibold flex items-center justify-center">
                        {getInitials()}
                      </div>
                    )}
                  </motion.button>
                  {profile?.isVerified && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://e7msojy1cjnzyvsj.public.blob.vercel-storage.com/images/1759665603040-verified-badge-profile-icon-png.webp"
                        alt="Verified"
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <LiquidButton 
                onClick={handleSignIn}
                
                className="bg-gradient-to-r from-stone-900 to-gray-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium hover:from-red-900 hover:to-red-600 transition-all duration-200"
              >
                Se connecter
              </LiquidButton>
            )}
          </div>

          {/* User Avatar - Mobile (à droite du hamburger) */}
          {user && (
            <div className="relative sm:hidden">
              <motion.button
                onClick={() => router.push('/dashboard')}
                className="w-10 h-10 rounded-full overflow-hidden hover:from-red-900 hover:to-red-600 transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={user.displayName || user.primaryEmail || 'Mon compte'}
              >
                {profile?.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-stone-900 to-gray-800 text-white font-semibold flex items-center justify-center">
                    {getInitials()}
                  </div>
                )}
              </motion.button>
              {profile?.isVerified && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://e7msojy1cjnzyvsj.public.blob.vercel-storage.com/images/1759665603040-verified-badge-profile-icon-png.webp"
                    alt="Verified"
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.header>

      {/* Menu Mobile Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`fixed left-3 right-3 z-40 sm:hidden transition-all duration-300 ${
              bannerDismissed ? 'top-20' : 'top-32'
            }`}
          >
            <motion.div 
              className="bg-white/95 dark:bg-black/95 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg rounded-3xl p-6"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              <nav className="flex flex-col gap-4">
                <a 
                  href="/" 
                  className="text-gray-600 dark:text-white hover:text-red-900 dark:hover:text-gray-300 transition-colors duration-200 py-2 text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Accueil
                </a>
                <a 
                  href="/bibliotheque" 
                  className="text-gray-600 dark:text-white hover:text-red-900 dark:hover:text-gray-300 transition-colors duration-200 py-2 text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Bibliothèque
                </a>
                {isAdmin && (
                  <a 
                    href="/superadmin" 
                    className="text-gray-600 dark:text-white hover:text-red-900 dark:hover:text-gray-300 transition-colors duration-200 py-2 text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </a>
                )}
                
                {/* Theme Toggle pour mobile */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 dark:text-white text-base font-medium">Mode sombre</span>
                  <ThemeToggle />
                </div>
                
                {/* Séparateur */}
                <div className="h-px bg-gray-200 dark:bg-white/20 my-2" />
                
                {/* Bouton de connexion/dashboard pour mobile */}
                {!user && (
                  <LiquidButton 
                    onClick={() => {
                      handleSignIn();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-stone-900 to-gray-800 text-white px-6 py-3 rounded-full text-sm font-medium hover:from-red-900 hover:to-red-600 transition-all duration-200 w-full text-center"
                  >
                    Se connecter
                  </LiquidButton>
                )}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
