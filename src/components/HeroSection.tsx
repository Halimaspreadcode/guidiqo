"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUser } from '@stackframe/stack';
import { LiquidButton } from './LiquidGlassButton';
import { WandSparkles } from 'lucide-react';

export default function HeroSection() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = useUser({ or: 'return-null' });

  // Animation d'écriture - phrases qui changent
  const phrases = [
    "en un clic",
    "avec l'IA",
    "pour ta startup tech",
    "prêt à publier partout",
    "pour ton idée révolutionnaire",
  ];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Écriture
        if (displayedText.length < currentPhrase.length) {
          setDisplayedText(currentPhrase.slice(0, displayedText.length + 1));
        } else {
          // Pause avant de commencer à effacer
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Effacement
        if (displayedText.length > 0) {
          setDisplayedText(displayedText.slice(0, -1));
        } else {
          // Passer à la phrase suivante
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, isDeleting ? 50 : 100); // Vitesse d'effacement plus rapide

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentPhraseIndex]);

  const handleCreateBrand = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    
    // Sauvegarder le prompt et créer un ID temporaire
    const tempBrandId = `temp-${Date.now()}`;
    sessionStorage.setItem('brandData', JSON.stringify({
      id: tempBrandId,
      prompt: prompt,
      name: 'Mon Branding',
      currentStep: 1,
      isTemp: true
    }));

    // Rediriger vers l'onboarding sans authentification
    router.push(`/onboarding/${tempBrandId}?step=1`);
  };

  return (
    <section className="px-3 sm:px-4 md:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-4 sm:pb-6">
      <motion.div 
        className="relative min-h-[85vh] sm:min-h-[80vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-gray-400"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Background Image from Unsplash */}
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <Image
            src="https://images.unsplash.com/photo-1758551015352-fa735f167422?q=80&w=2600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Music studio background"
            fill
            className="object-cover opacity-80"
            priority
          />
          {/* Overlay gradient pour améliorer la lisibilité sur mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        </motion.div>
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto text-center px-4 sm:px-6 py-8 sm:py-12 md:py-16">
          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            {/* Title avec animation d'écriture */}
            <motion.h1 
              className="text-5xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-[1.1] tracking-tight text-white drop-shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              Crée ton branding<br className="hidden sm:inline" />
              <span className="sm:hidden"> </span>
              <span className="inline-block relative">
                {displayedText}
                <motion.span
                  className="inline-block w-0.5 h-[0.8em] bg-white ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              className="text-white/90 text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl sm:max-w-3xl mx-auto font-light leading-relaxed px-2 drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              Décrivez simplement ce que vous voulez<br className="hidden sm:inline" />
              <span className="sm:hidden"> </span>et l&apos;IA créera un branding unique pour vous.
            </motion.p>
            
            {/* Search Box - Layout horizontal unifié mobile & desktop */}
            <motion.div 
              className="w-full max-w-2xl sm:max-w-3xl mx-auto mt-8 sm:mt-12 px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              <div className="flex flex-row gap-2 bg-white/95 backdrop-blur-lg border border-white/30 rounded-full p-2 shadow-2xl items-center">
                <input
                  type="text"
                  placeholder="Ex: Un branding pour une entreprise de tech..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateBrand()}
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-transparent text-black placeholder-gray-500 focus:outline-none text-sm sm:text-lg rounded-full"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                />
                <motion.button
                  onClick={handleCreateBrand}
                  disabled={loading || !prompt.trim()}
                  className="bg-black hover:bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-all duration-200 text-sm sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg whitespace-nowrap"
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="hidden sm:inline">Création...</span>
                    </div>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Créer mon branding</span>
                      <span className="sm:hidden">Créer</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}

