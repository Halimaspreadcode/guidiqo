"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Afficher le popup après un court délai pour une meilleure expérience
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleVisitCreate = () => {
    window.open('https://create.guidiqo.com', '_blank');
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999]"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
          >
            <div className="bg-white dark:bg-black rounded-3xl shadow-2xl max-w-md w-full p-8 relative border border-gray-200 dark:border-gray-800">
              {/* Bouton de fermeture */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Contenu */}
              <div className="text-center space-y-6">
                {/* Logo */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
                >
                  <Image
                    src="https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/72b8bb91-83fe-4d08-9fc1-7a3c0f3b31e1_320w.png"
                    alt="Guidiqo Logo"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Titre */}
                <div>
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
                    Découvrez Guidiqo Create
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                    Guidiqo Create est un générateur IA qui vous aide à concevoir des contenus percutants pour les réseaux sociaux, plus vite et avec plus d&apos;idées.
                  </p>
                </div>

                {/* Bouton CTA */}
                <motion.button
                  onClick={handleVisitCreate}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-full transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Visiter Create.guidiqo.com</span>
                  <ExternalLink className="w-5 h-5" />
                </motion.button>

                {/* Lien secondaire */}
                <button
                  onClick={handleClose}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  Peut-être plus tard
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

