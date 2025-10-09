"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Moon, Palette, Download, Users, Zap, Wand2, 
  Type, Share2, Eye, Lock, Clock, Edit3, FileText,
  Image, Grid, Layers, Settings, ChevronRight, Menu, X
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function FeaturesPage() {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Vérifier si la banner a été fermée
  useEffect(() => {
    const checkBannerStatus = () => {
      const dismissed = localStorage.getItem('stickyBannerDismissed');
      setBannerDismissed(dismissed === 'true');
    };

    checkBannerStatus();
    
    // Vérifier périodiquement
    const interval = setInterval(checkBannerStatus, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const features = [
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: "Génération IA Intelligente",
      description: "Notre IA crée des identités de marque complètes en quelques secondes. Décrivez simplement votre vision et obtenez un branding professionnel instantanément.",
      category: "IA & Création",
      longDescription: "Notre système d'intelligence artificielle utilise des modèles de traitement du langage naturel (NLP) pour analyser votre description textuelle et extraire les éléments clés de votre vision de marque. L'algorithme identifie automatiquement le secteur d'activité, la personnalité souhaitée, l'audience cible et les valeurs à transmettre. Il applique ensuite des règles de design basées sur la psychologie des couleurs, la théorie de la typographie et les principes de l'identité visuelle pour générer des propositions cohérentes et professionnelles.",
      benefits: [
        "Analyse automatique du contexte et du secteur d'activité",
        "Application de la psychologie des couleurs et de la typographie",
        "Génération basée sur des principes de design éprouvés",
        "Cohérence visuelle garantie entre tous les éléments générés"
      ],
      code: `const brandData = await generateBranding({
  prompt: "Un branding moderne pour startup tech",
  style: "minimal",
  audience: "entrepreneurs"
});
// Résultat en < 5 secondes ✨`,
      demo: true
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Palettes de Couleurs Harmonieuses",
      description: "Générez automatiquement des combinaisons de couleurs parfaites basées sur la psychologie des couleurs et les tendances du design moderne.",
      category: "Design",
      longDescription: "Notre moteur de génération de couleurs utilise des algorithmes basés sur la théorie des couleurs de Johannes Itten et les principes de l'harmonie chromatique. Le système analyse les relations entre les couleurs selon le cercle chromatique et génère des palettes selon différentes harmonies : complémentaires (couleurs opposées), analogues (couleurs adjacentes), triadiques (couleurs équidistantes) et tétradiques (deux paires complémentaires). Chaque palette est testée pour respecter les standards d'accessibilité WCAG 2.1 niveau AA minimum, avec des ratios de contraste optimisés pour la lisibilité sur tous les supports.",
      benefits: [
        "Génération basée sur la théorie des couleurs d'Itten",
        "Harmonies chromatiques : complémentaires, analogues, triadiques, tétradiques",
        "Respect des standards WCAG 2.1 niveau AA pour l'accessibilité",
        "Export multi-formats : HEX, RGB, HSL, CMYK, Pantone"
      ],
      colors: ["#2D3142", "#BFC0C0", "#FFFFFF", "#EF8354", "#4F5D75"],
      colorDemo: true
    },
    {
      icon: <Type className="w-6 h-6" />,
      title: "Suggestions Typographiques",
      description: "Recevez des recommandations de polices professionnelles qui correspondent à la personnalité de votre marque et assurent une excellente lisibilité.",
      category: "Design",
      longDescription: "Notre système de recommandation typographique utilise une base de données de plus de 1000 polices Google Fonts et analyse leur compatibilité avec votre secteur d'activité et votre personnalité de marque. L'algorithme évalue chaque police selon des critères techniques : lisibilité à différentes tailles, rendu sur écrans haute résolution, support des caractères spéciaux, et performance de chargement. Il applique également des principes de hiérarchie typographique pour suggérer des combinaisons cohérentes entre titres, sous-titres et corps de texte, en respectant les standards d'accessibilité WCAG 2.1.",
      benefits: [
        "Base de données de 1000+ polices Google Fonts analysées",
        "Évaluation technique : lisibilité, rendu, performance",
        "Hiérarchie typographique cohérente (titres, sous-titres, corps)",
        "Conformité WCAG 2.1 pour l'accessibilité numérique"
      ],
      fonts: {
        primary: "Inter",
        secondary: "Playfair Display"
      },
      fontDemo: true
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export PDF Professionnel",
      description: "Téléchargez vos brand guidelines complets au format PDF, prêts à être partagés avec votre équipe ou vos clients.",
      category: "Export & Partage",
      longDescription: "Notre générateur de brand guidelines produit automatiquement un document PDF structuré de 3 à 5 pages, conforme aux standards professionnels de l'identité visuelle. Le document inclut une présentation de la marque, la palette de couleurs complète avec codes HEX, RGB, HSL et références Pantone, les spécifications typographiques avec exemples d'usage, les variantes de logos et leurs applications, des exemples d'application sur différents supports (cartes de visite, en-têtes, signatures email), et des recommandations d'usage détaillées. Le PDF est optimisé pour l'impression (300 DPI) et le partage digital (compression optimisée).",
      benefits: [
        "Document PDF structuré de 3-5 pages professionnelles",
        "Codes couleurs complets : HEX, RGB, HSL, Pantone",
        "Spécifications typographiques avec exemples d'usage",
        "Optimisation pour impression (300 DPI) et partage digital"
      ],
      code: `// Un clic = PDF complet
downloadPDF({
  brand: yourBrand,
  format: "A4",
  quality: "high"
});`
    },
    {
      icon: <Image className="w-6 h-6" />,
      title: "Images de Couverture Personnalisées",
      description: "Ajoutez vos propres images ou laissez l'IA générer des visuels cohérents avec votre identité de marque.",
      category: "Design",
      longDescription: "Notre système de gestion d'images supporte l'upload de fichiers JPG, PNG, SVG et WebP jusqu'à 10MB par fichier. L'outil d'optimisation automatique redimensionne et compresse les images selon leur usage prévu : 1920x1080px pour les bannières web, 1080x1080px pour Instagram, 1200x630px pour les aperçus sociaux, et 300 DPI pour l'impression. L'algorithme d'harmonisation chromatique analyse la palette de couleurs de votre branding et ajuste automatiquement la saturation, la luminosité et le contraste des images pour maintenir la cohérence visuelle. Les images sont converties au format WebP pour le web (réduction de 30% de la taille) et conservées en haute résolution pour l'impression.",
      benefits: [
        "Support multi-formats : JPG, PNG, SVG, WebP (max 10MB)",
        "Optimisation automatique selon l'usage (web, print, social)",
        "Harmonisation chromatique avec votre palette de couleurs",
        "Conversion WebP pour le web (30% de réduction de taille)"
      ]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Bibliothèque Publique",
      description: "Explorez des milliers de créations de la communauté pour vous inspirer. Découvrez les tendances et partagez vos propres projets.",
      category: "Communauté",
      longDescription: "Notre bibliothèque communautaire permet de découvrir des créations d'identité visuelle partagées par d'autres utilisateurs. Chaque création inclut les spécifications techniques complètes : codes couleurs HEX/RGB, noms des polices utilisées, et contexte d'application. Le système de filtrage avancé permet de rechercher par secteur d'activité (tech, finance, santé, éducation, etc.), style visuel (minimaliste, corporate, créatif, vintage), couleurs dominantes, et date de création. Les créations sont organisées par popularité, récence, et pertinence selon vos préférences. Chaque utilisateur peut choisir de rendre ses créations publiques ou privées, et la communauté peut interagir via un système de likes et de commentaires.",
      benefits: [
        "Bibliothèque communautaire avec spécifications techniques complètes",
        "Filtrage avancé : secteur, style, couleurs, date",
        "Organisation par popularité, récence et pertinence",
        "Système d'interaction communautaire (likes, commentaires)"
      ]
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Partage Social Intégré",
      description: "Partagez vos brandings sur les réseaux sociaux en un clic. Générez automatiquement des aperçus optimisés pour chaque plateforme.",
      category: "Export & Partage",
      longDescription: "Notre système de partage social génère automatiquement des aperçus optimisés selon les spécifications techniques de chaque plateforme : Instagram (1080x1080px pour posts, 1080x1920px pour stories), LinkedIn (1200x627px pour articles, 1200x1200px pour posts), Twitter (1200x675px pour images), Facebook (1200x630px pour liens, 1200x1200px pour photos). Chaque aperçu applique automatiquement votre palette de couleurs, typographie et éléments de branding. Le système génère également des textes d'accompagnement optimisés selon les meilleures pratiques de chaque réseau social, avec des hashtags pertinents et des appels à l'action adaptés au contexte de votre marque.",
      benefits: [
        "Aperçus optimisés pour Instagram, LinkedIn, Twitter, Facebook",
        "Dimensions techniques précises selon les spécifications de chaque plateforme",
        "Application automatique de votre branding (couleurs, typographie)",
        "Génération de textes et hashtags optimisés par plateforme"
      ]
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Prévisualisation en Temps Réel",
      description: "Visualisez vos modifications instantanément avec notre système de prévisualisation en direct. Voyez exactement ce que vous créez.",
      category: "Interface",
      longDescription: "Notre moteur de rendu en temps réel utilise des technologies Web modernes (CSS-in-JS, WebGL pour les effets visuels) pour afficher instantanément chaque modification. Le système de prévisualisation supporte le rendu multi-résolution : 1920x1080px pour desktop, 1024x768px pour tablet, et 375x667px pour mobile. Chaque changement de couleur, police ou image est appliqué en moins de 16ms (60 FPS) grâce à l'optimisation des re-rendus React et l'utilisation de CSS custom properties. L'aperçu inclut également des simulations d'impression (gamut de couleurs CMYK) et des tests d'accessibilité en temps réel (contraste, lisibilité).",
      benefits: [
        "Rendu en temps réel à 60 FPS (16ms de latence)",
        "Support multi-résolution : desktop, tablet, mobile",
        "Simulation d'impression et tests d'accessibilité",
        "Optimisation des re-rendus React et CSS custom properties"
      ]
    },
    {
      icon: <Edit3 className="w-6 h-6" />,
      title: "Modification Facile",
      description: "Modifiez n'importe quel élément de votre branding à tout moment. Changez les couleurs, la typographie ou la personnalité en quelques clics.",
      category: "Édition",
      longDescription: "Notre éditeur avancé intègre un sélecteur de couleurs avec pipette (support des formats HEX, RGB, HSL, CMYK), une bibliothèque complète de 1000+ polices Google Fonts avec aperçu en temps réel, et un système d'upload d'images avec redimensionnement automatique et optimisation. L'éditeur utilise des contrôles intuitifs basés sur les standards de l'industrie (Adobe Creative Suite, Figma) avec des raccourcis clavier personnalisables. Le système de sauvegarde automatique fonctionne par incréments de 30 secondes et maintient un historique de 50 versions par projet avec diff visuel des modifications. Chaque changement est validé en temps réel (contraste, lisibilité, cohérence visuelle).",
      benefits: [
        "Sélecteur de couleurs avancé avec pipette (HEX, RGB, HSL, CMYK)",
        "Bibliothèque de 1000+ polices Google Fonts avec aperçu temps réel",
        "Upload d'images avec redimensionnement et optimisation automatiques",
        "Système de versioning avec 50 versions et diff visuel des modifications"
      ]
    },
    {
      icon: <Moon className="w-6 h-6" />,
      title: "Mode Sombre Complet",
      description: "Interface élégante en mode sombre pour réduire la fatigue oculaire et travailler confortablement à toute heure.",
      category: "Interface",
      longDescription: "Notre implémentation du mode sombre utilise un système de design tokens basé sur les standards Material Design 3 et Apple Human Interface Guidelines. L'interface applique des couleurs optimisées pour réduire la fatigue oculaire : fonds en noir pur (#000000) pour les écrans OLED, gris foncés (#1a1a1a, #2d2d2d) pour les éléments de surface, et blancs avec opacité réduite (90%, 70%, 50%) pour la hiérarchie textuelle. Le système de thème utilise CSS custom properties et React Context pour un basculement instantané sans rechargement de page. Tous les composants (formulaires, boutons, cartes, aperçus) sont adaptés avec des contrastes respectant WCAG 2.1 niveau AA.",
      benefits: [
        "Design tokens basés sur Material Design 3 et Apple HIG",
        "Couleurs optimisées pour écrans OLED et réduction fatigue oculaire",
        "Système de thème avec CSS custom properties et React Context",
        "Contrastes conformes WCAG 2.1 niveau AA sur tous les composants"
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Contrôle de Visibilité",
      description: "Choisissez qui peut voir vos créations. Rendez-les publiques dans la bibliothèque ou gardez-les privées.",
      category: "Confidentialité",
      longDescription: "Notre système de contrôle de visibilité utilise des permissions basées sur des rôles (RBAC) avec 3 niveaux de confidentialité : privé (accès limité au propriétaire avec authentification JWT), public (visible dans la bibliothèque communautaire avec indexation SEO), et partage par lien (accès via token unique avec expiration configurable). Chaque niveau implémente des contrôles de sécurité spécifiques : validation des permissions, audit trail des accès, et chiffrement des données sensibles. Le système de partage par lien génère des URLs uniques avec tokens cryptographiquement sécurisés et permet de définir des dates d'expiration et des limites d'accès.",
      benefits: [
        "Système RBAC avec 3 niveaux de confidentialité",
        "Authentification JWT et audit trail des accès",
        "Partage par lien avec tokens cryptographiques sécurisés",
        "Contrôles d'expiration et limites d'accès configurables"
      ]
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Génération Ultra-Rapide",
      description: "Créez un branding complet en moins de 30 secondes. De l'idée à la réalisation, notre IA travaille à la vitesse de la lumière.",
      category: "Performance",
      longDescription: "Notre infrastructure utilise des microservices containerisés avec Docker et Kubernetes pour assurer une scalabilité horizontale. Le pipeline de génération IA fonctionne en 4 étapes parallèles : analyse NLP (5-8 secondes), génération de couleurs (2-3 secondes), sélection typographique (3-4 secondes), et création du document PDF (8-12 secondes). L'architecture utilise Redis pour la mise en cache des résultats fréquents, PostgreSQL pour la persistance des données, et CloudFlare pour la distribution CDN. Le système peut traiter jusqu'à 1000 requêtes simultanées avec une latence moyenne de 15 secondes et un uptime de 99.9%.",
      benefits: [
        "Architecture microservices avec Docker et Kubernetes",
        "Pipeline parallèle en 4 étapes (15 secondes total)",
        "Cache Redis et distribution CDN CloudFlare",
        "Capacité de 1000 requêtes simultanées avec 99.9% uptime"
      ]
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Brand Guidelines Complets",
      description: "Obtenez un document de marque professionnel incluant logos, couleurs, typographies, exemples d'usage et recommandations.",
      category: "Documentation",
      longDescription: "Notre générateur de brand guidelines produit automatiquement un document PDF structuré de 20 à 30 pages, conforme aux standards professionnels de l'identité visuelle. Le document inclut une présentation de la marque, la palette de couleurs complète avec codes HEX, RGB, HSL et références Pantone, les spécifications typographiques avec exemples d'usage, les variantes de logos et leurs applications, des exemples d'application sur différents supports (cartes de visite, en-têtes, signatures email), et des recommandations d'usage détaillées. Le PDF est optimisé pour l'impression (300 DPI) et le partage digital (compression optimisée).",
      benefits: [
        "Document PDF structuré de 20-30 pages professionnelles",
        "Codes couleurs complets : HEX, RGB, HSL, Pantone",
        "Spécifications typographiques avec exemples d'usage",
        "Optimisation pour impression (300 DPI) et partage digital"
      ]
    },
    {
      icon: <Grid className="w-6 h-6" />,
      title: "Dashboard Intuitif",
      description: "Gérez tous vos projets depuis un tableau de bord moderne et facile à utiliser. Organisez et retrouvez vos brandings en un instant.",
      category: "Interface",
      longDescription: "Notre dashboard utilise une architecture de composants React optimisée avec des hooks personnalisés pour la gestion d'état. L'interface implémente un système de grille responsive avec CSS Grid et Flexbox, supportant l'affichage de 12, 24, ou 48 projets par page selon la résolution d'écran. Le système de recherche utilise Elasticsearch pour l'indexation full-text avec support des filtres avancés (date, catégorie, tags, statut). Les statistiques sont calculées en temps réel avec des graphiques interactifs utilisant Chart.js, incluant des métriques de performance, d'engagement, et d'évolution temporelle. L'historique des modifications utilise un système de versioning Git-like avec diff visuel.",
      benefits: [
        "Architecture React optimisée avec hooks personnalisés",
        "Système de grille responsive (12/24/48 projets par page)",
        "Recherche Elasticsearch avec filtres avancés",
        "Statistiques temps réel avec graphiques Chart.js interactifs"
      ]
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Profils Créateurs",
      description: "Créez votre profil de créateur et partagez votre portfolio. Montrez vos réalisations et gagnez en visibilité.",
      category: "Communauté",
      longDescription: "Construisez votre présence en tant que créateur. Créez un profil personnalisé avec photo, bio, spécialités, et partagez votre portfolio. Gagnez en visibilité grâce au système de likes, commentaires et partages. Connectez-vous avec d'autres créateurs et collaborez sur des projets.",
      benefits: [
        "Profil personnalisé avec photo et bio",
        "Portfolio professionnel avec statistiques",
        "Système de likes, commentaires, partages",
        "Réseau de créateurs et collaborations"
      ]
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Suggestions IA Contextuelles",
      description: "Recevez des recommandations intelligentes basées sur votre secteur d'activité, votre audience cible et vos préférences.",
      category: "IA & Création",
      longDescription: "L'IA analyse votre contexte pour fournir des suggestions pertinentes. Secteur d'activité, audience cible, tendances actuelles : tout est pris en compte pour des recommandations sur mesure.",
      benefits: [
        "Suggestions contextuelles",
        "Analyse du secteur d'activité",
        "Tendances actuelles intégrées",
        "Recommandations personnalisées"
      ]
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Personnalisation Avancée",
      description: "Ajustez chaque détail de votre branding. Mode manuel ou assisté par IA, vous avez le contrôle total.",
      category: "Édition",
      longDescription: "Choisissez entre le mode assisté par IA ou le mode manuel complet. Ajustez les couleurs pixel par pixel avec le sélecteur avancé, modifiez les polices avec la bibliothèque Google Fonts, et affinez chaque détail selon vos besoins exacts. Sauvegarde automatique et historique des versions.",
      benefits: [
        "Mode manuel complet + assistance IA",
        "Sélecteur de couleurs avancé (HSL, LAB)",
        "Bibliothèque Google Fonts complète",
        "Sauvegarde automatique + historique des versions"
      ]
    }
  ];

  const categories = Array.from(new Set(features.map(f => f.category)));

  const currentFeature = features[activeFeature];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      
      <main className={`pb-20 transition-all duration-300 ${
        bannerDismissed ? 'pt-20 sm:pt-24' : 'pt-32 sm:pt-36'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-black dark:text-white tracking-tight mt-24">
             Fonctionnalités
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
              Explorez en détail chaque fonctionnalité de Guidiqo
            </p>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              console.log('Mobile button clicked, sidebarOpen:', sidebarOpen);
              setSidebarOpen(!sidebarOpen);
            }}
            className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-2xl"
            type="button"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Documentation Layout */}
          <div className="flex gap-8 relative">
            {/* Sidebar */}
            <AnimatePresence>
              <motion.aside
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className={`${
                  sidebarOpen ? 'fixed inset-0 z-50 bg-black/50 lg:bg-transparent lg:relative' : 'hidden lg:block'
                } lg:w-80 flex-shrink-0`}
                onClick={(e) => {
                  console.log('Sidebar overlay clicked');
                  if (e.target === e.currentTarget) {
                    console.log('Closing sidebar from overlay click');
                    setSidebarOpen(false);
                  }
                }}
              >
                  <div 
                    className={`lg:sticky bg-white dark:bg-black lg:bg-transparent h-full lg:h-auto overflow-y-auto lg:overflow-visible max-w-sm lg:max-w-none ml-auto lg:ml-0 transition-all duration-300 ${
                      bannerDismissed ? 'lg:top-20' : 'lg:top-32'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6 lg:p-0">
                      <div className="lg:hidden mb-6 flex justify-between items-center pt-4">
                        <h3 className="text-xl font-bold text-black dark:text-white">Menu</h3>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('X button clicked, closing sidebar');
                            setSidebarOpen(false);
                          }}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                          type="button"
                        >
                          <X className="w-6 h-6 text-black dark:text-white" />
                        </button>
                      </div>

                      <nav className="space-y-2">
                        {features.map((feature, index) => (
                          <motion.button
                            key={index}
                            onClick={() => {
                              setActiveFeature(index);
                              setSidebarOpen(false);
                            }}
                            className={`w-full text-left p-4 rounded-xl transition-all ${
                              activeFeature === index
                                ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg'
                                : 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10'
                            }`}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`flex-shrink-0 ${activeFeature === index ? '' : 'opacity-70'}`}>
                                {feature.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{feature.title}</p>
                                <p className="text-xs opacity-70 truncate">{feature.category}</p>
                              </div>
                              {activeFeature === index && (
                                <ChevronRight className="w-4 h-4 flex-shrink-0" />
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </nav>
                    </div>
                  </div>
                </motion.aside>
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-gray-50/50 to-white dark:from-black dark:to-black border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-12"
                >
                  {/* Feature Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black">
                      {currentFeature.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1 text-black dark:text-white">
                        {currentFeature.title}
                      </h2>
                      <p className="text-gray-600 dark:text-white/70">
                        {currentFeature.description}
                      </p>
                    </div>
                  </div>

                  {/* Long Description */}
                  {currentFeature.longDescription && (
                    <div className="mb-6">
                      <p className="text-gray-700 dark:text-white/80 leading-relaxed">
                        {currentFeature.longDescription}
                      </p>
                    </div>
                  )}

                  {/* Benefits */}
                  {currentFeature.benefits && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">Points clés</h3>
                      <ul className="space-y-2">
                        {currentFeature.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-white/80">
                            <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Code Demo */}
                  {currentFeature.code && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">Exemple d&apos;utilisation</h3>
                      <div className="p-4 rounded-lg bg-gray-900 dark:bg-gray-800 overflow-x-auto">
                        <pre className="text-sm text-green-400 dark:text-green-300 font-mono">
                          <code>{currentFeature.code}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Color Demo */}
                  {currentFeature.colorDemo && currentFeature.colors && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">Palette générée</h3>
                      <div className="flex gap-2">
                        {currentFeature.colors.map((color, idx) => (
                          <div key={idx} className="flex-1">
                            <div
                              className="h-16 rounded-lg shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                            <p className="text-xs font-mono text-center mt-2 text-gray-600 dark:text-white/60">
                              {color}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Font Demo */}
                  {currentFeature.fontDemo && currentFeature.fonts && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">Typographies suggérées</h3>
                      <div className="space-y-3">
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5">
                          <p className="text-sm text-gray-500 dark:text-white/60 mb-1">Principale</p>
                          <p 
                            className="text-2xl font-bold text-black dark:text-white"
                            style={{ fontFamily: currentFeature.fonts.primary }}
                          >
                            {currentFeature.fonts.primary}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5">
                          <p className="text-sm text-gray-500 dark:text-white/60 mb-1">Secondaire</p>
                          <p 
                            className="text-2xl font-bold text-black dark:text-white"
                            style={{ fontFamily: currentFeature.fonts.secondary }}
                          >
                            {currentFeature.fonts.secondary}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 flex justify-between">
                    <button
                      onClick={() => setActiveFeature(Math.max(0, activeFeature - 1))}
                      disabled={activeFeature === 0}
                      className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/10 text-black dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                    >
                      ← Précédent
                    </button>
                    <button
                      onClick={() => setActiveFeature(Math.min(features.length - 1, activeFeature + 1))}
                      disabled={activeFeature === features.length - 1}
                      className="px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    >
                      Suivant →
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
