"use client";
import React, { useState, useEffect } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

export const StickyBanner = ({
  className,
  hideOnScroll = false,
  hiddenPaths = [],
}: {
  className?: string;
  hideOnScroll?: boolean;
  hiddenPaths?: string[];
}) => {
  const [open, setOpen] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  
  // Vérifier si le banner a été fermé dans localStorage
  useEffect(() => {
    const dismissed = localStorage.getItem('stickyBannerDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      setOpen(false);
    }
  }, []);

  // Vérifier si on est sur une page où le banner doit être caché
  const shouldHide = hiddenPaths.some(path => pathname.startsWith(path));

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (hideOnScroll && latest > 40 && !isDismissed) {
      setOpen(false);
    } else if (!isDismissed) {
      setOpen(true);
    }
  });

  const handleDismiss = () => {
    setOpen(false);
    setIsDismissed(true);
    localStorage.setItem('stickyBannerDismissed', 'true');
  };
  
  if (shouldHide || isDismissed) return null;

  return (
    <motion.div
      className={cn(
        "fixed inset-x-0 top-0 z-[60] flex min-h-14 w-full items-center bg-gradient-to-r from-gray-400 via-red-800 to-gray-200  overflow-hidden",
        className,
      )}
      initial={{
        y: -100,
        opacity: 0,
      }}
      animate={{
        y: open ? 0 : -100,
        opacity: open ? 1 : 0,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      {/* Texte défilant */}
      <div className="relative flex overflow-hidden w-full justify-center">
        <motion.div
          className="flex whitespace-nowrap"
         
        >
          <span className="text-white text-sm font-medium px-4 text-center w-full">
            Nouveauté : Mode sombre disponible ! Découvrez toutes les fonctionnalités
          </span>
        </motion.div>
      </div>

      <motion.button
        initial={{
          scale: 0,
        }}
        animate={{
          scale: 1,
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-70 transition-opacity p-1.5 bg-black/10 rounded-full"
        onClick={handleDismiss}
        aria-label="Fermer la bannière"
      >
        <X className="h-4 w-4 text-black" />
      </motion.button>
    </motion.div>
  );
};

