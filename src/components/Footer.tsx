"use client";

import { Instagram, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="py-12 sm:py-16 px-3 sm:px-4 md:px-6 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-black dark:text-white">Guidiqo</h3>
            <p className="text-gray-600 dark:text-white/70 text-sm sm:text-base max-w-sm">
              L&apos;application IA #1 pour créer des brandings de qualité professionnelle en quelques secondes.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-black dark:text-white text-sm sm:text-base">Produit</h4>
            <ul className="space-y-2 text-gray-600 dark:text-white/70 text-sm">
              <li><a href="/" className="hover:text-black dark:hover:text-white transition-colors duration-200">Accueil</a></li>
              <li><a href="/features" className="hover:text-black dark:hover:text-white transition-colors duration-200">Fonctionnalités</a></li>
              <li><a href="/bibliotheque" className="hover:text-black dark:hover:text-white transition-colors duration-200">Bibliothèque</a></li>
              <li><a href="/dashboard" className="hover:text-black dark:hover:text-white transition-colors duration-200">Dashboard</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-black dark:text-white text-sm sm:text-base">Entreprise</h4>
            <ul className="space-y-2 text-gray-600 dark:text-white/70 text-sm">
              <li><a href="/a-propos" className="hover:text-black dark:hover:text-white transition-colors duration-200">À propos</a></li>
              <li><a href="/contact" className="hover:text-black dark:hover:text-white transition-colors duration-200">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-black dark:text-white text-sm sm:text-base">Suivez-nous</h4>
            <div className="flex gap-3 sm:gap-4">
              <motion.a 
                href="https://www.linkedin.com/in/halima-gueye-532b40a5/" 
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" />
              </motion.a>
              <motion.a 
                href="https://www.instagram.com/halimaspreadlove/" 
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" />
              </motion.a>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="pt-6 sm:pt-8 border-t border-gray-200 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-white/70"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p>2025 Guidiqo. Tous droits réservés.</p>
          <div className="flex gap-4 sm:gap-6">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors duration-200">Confidentialité</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors duration-200">Conditions</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors duration-200">Cookies</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

