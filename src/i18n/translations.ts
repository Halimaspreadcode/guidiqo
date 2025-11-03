'use client'

export type Locale = 'fr' | 'en'

export const locales: Locale[] = ['fr', 'en']
export const defaultLocale: Locale = 'fr'

export type TranslationReplacements = Record<string, string | number>

type TranslationDictionary = Record<string, string | Record<string, any>>

export const translations: Record<Locale, TranslationDictionary> = {
  fr: {
    language: {
      switchLabel: 'Langue',
      switchToFrench: 'Français',
      switchToEnglish: 'Anglais',
      shortFrench: 'FR',
      shortEnglish: 'EN',
    },
    actions: {
      previous: 'Précédent',
      next: 'Suivant',
      finish: 'Terminer',
      cancel: 'Annuler',
      send: 'Envoyer',
      regenerate: 'Régénérer',
      customize: 'Personnaliser',
      loading: 'Chargement…',
      refresh: 'Autres suggestions',
      save: 'Enregistrer',
      saving: 'Enregistrement…',
      close: 'Fermer',
      signIn: 'Se connecter',
      dashboard: 'Tableau de bord',
      signOut: 'Se déconnecter',
    },
    header: {
      home: 'Accueil',
      library: 'Bibliothèque',
      admin: 'Admin',
      account: 'Mon compte',
    },
    onboarding: {
      stepIndicator: '{current}/{total}',
      step1: {
        title: 'Informations',
        subtitle:
          'Commençons par les fondamentaux de votre projet pour personnaliser les prochaines étapes.',
        promptLabel: 'IDÉE INITIALE',
        nameLabel: 'Nom du projet',
        descriptionLabel: 'Description',
        descriptionHint:
          'Présentez votre mission, vos valeurs clés ou ce qui vous rend unique.',
        namePlaceholder: 'Ex: TechFlow, CreaSpace...',
        descriptionPlaceholder: 'Décrivez votre projet, ses valeurs, sa mission...',
        ai: {
          buttonIdle: 'IA',
          buttonGenerating: 'Génération…',
          errorNoName: 'Veuillez d’abord saisir un nom de projet',
          errorGeneration: 'Erreur lors de la génération',
          errorDescription: 'Erreur lors de la génération de la description',
          modalTitle: 'Suggestions IA',
          mainDescription: 'Description principale',
          useDescription: 'Utiliser cette description',
          alternatives: 'Suggestions alternatives',
          use: 'Utiliser',
          regenerate: 'Régénérer',
          close: 'Fermer',
        },
      },
      step2: {
        title: 'Couleurs',
        subtitle:
          'Sélectionnez une palette harmonieuse ou laissez l’IA composer un trio sur-mesure pour votre marque.',
        aiButton: 'Suggérer avec IA',
        regenerate: 'Régénérer',
        customize: 'Personnaliser',
        toggleManual: {
          show: 'Personnaliser',
          hide: 'Masquer',
        },
        aiExplanationPrefix: 'Suggestion IA : ',
        ai: {
          error: 'Erreur lors de la génération IA. Veuillez réessayer.',
          generating: 'Génération...',
          suggestion: 'Suggérer avec IA',
        },
        manualTitle: 'Personnalisation manuelle',
        primaryLabel: 'Couleur principale',
        secondaryLabel: 'Couleur secondaire',
        accentLabel: 'Couleur accent',
        hexPlaceholder: '#000000',
        previewTitle: 'Aperçu de la palette',
        primarySwatch: 'Primaire',
        secondarySwatch: 'Secondaire',
        accentSwatch: 'Accent',
        palettes: {
          techModern: { name: 'Tech Modern' },
          nature: { name: 'Nature' },
          sunset: { name: 'Coucher de soleil' },
          ocean: { name: 'Océan' },
          purpleDream: { name: 'Rêve violet' },
          roseGold: { name: 'Rose gold' },
        },
        paletteMeta: {
          downloads: 'Téléchargements',
          shares: 'Partages',
          inLibrary: 'En bibliothèque',
          notPublished: 'Non publié',
        },
      },
      step3: {
        title: 'Typographie',
        subtitle:
          'Associez deux typographies complémentaires pour articuler titres et textes courants de votre identité.',
        aiButton: 'Suggérer avec IA',
        toggleManual: {
          show: 'Personnaliser',
          hide: 'Masquer',
        },
        ai: {
          suggestion: 'Suggérer avec IA',
          generating: 'Génération...',
          error: 'Erreur lors de la génération IA. Veuillez réessayer.',
        },
        aiExplanationPrefix: 'Suggestion IA : ',
        manualTitle: 'Personnalisation manuelle',
        primaryFontLabel: 'Police principale',
        secondaryFontLabel: 'Police secondaire',
        selectPlaceholder: 'Sélectionnez une police',
        previewTitle: 'Votre Marque',
        previewBody:
          'Ceci est un exemple de texte utilisant votre police secondaire. Elle sera utilisée pour tous les contenus de votre branding.',
        previewBadge: 'Aperçu typographique',
        fontPairs: {
          modern: { name: 'Moderne' },
          elegant: { name: 'Élégant' },
          tech: { name: 'Tech' },
          classic: { name: 'Classique' },
          creative: { name: 'Créatif' },
          minimal: { name: 'Minimal' },
        },
      },
      step4: {
        title: 'Personnalité',
        subtitle:
          'Sélectionnez le ton et l’audience qui guideront toutes les productions visuelles de votre marque.',
        sections: {
          personality: {
            title: '1. Personnalité de votre marque',
            description:
              'Choisissez un archétype : nous adapterons ensuite les couleurs, les typos et l’image de couverture.',
          },
          audience: {
            title: '2. Audience à séduire',
            description:
              'Le focus audience affine les recommandations IA et le choix des visuels.',
          },
          cover: {
            title: '3. Image de couverture',
            optional: '(optionnel)',
            description:
              'Sélectionnez un visuel parmi notre curation ou indiquez une URL. Vous pouvez aussi laisser vide : nous générerons une couverture automatiquement.',
            curatedTitle: 'Inspirations alignées',
            curatedDescription: 'Visuels {tone} adaptés à cet archétype.',
            curatedFallback: 'Choisissez une personnalité pour débloquer nos suggestions.',
            curatedAudience: 'Audience ciblée : {audience}',
            emptyPersonality: 'Sélectionnez une personnalité pour afficher des inspirations visuelles alignées.',
            emptyInitial: 'Choisissez d’abord une personnalité. Les images correspondantes apparaîtront ici.',
          },
        },
        personalities: {
          professionnel: {
            label: 'Professionnel',
            description: 'Sérieux, méthodique, fiabilité',
            tone: 'Corporate lumineux, équipe concentrée',
          },
          moderne: {
            label: 'Moderne',
            description: 'Innovant, orienté design',
            tone: 'Architecture audacieuse, néons futuristes',
          },
          amical: {
            label: 'Amical',
            description: 'Accessible, chaleureux, humain',
            tone: 'Moments de partage, créativité artisanale',
          },
          luxe: {
            label: 'Luxe',
            description: 'Élégant, haut de gamme',
            tone: 'Textures premium, ambiance feutrée',
          },
          dynamique: {
            label: 'Dynamique',
            description: 'Énergique, audacieux',
            tone: 'Mouvement, sport urbain, couleurs vibrantes',
          },
          minimaliste: {
            label: 'Minimaliste',
            description: 'Épuré, clair, sans superflu',
            tone: 'Lignes géométriques, tonalités neutres',
          },
        },
        audiences: {
          b2b: {
            label: 'Entreprises (B2B)',
            focus: 'Décideurs, relation long terme',
          },
          b2c: {
            label: 'Consommateurs (B2C)',
            focus: 'Lifestyle, émotion, proximité',
          },
          jeunes: {
            label: 'Jeunes 18-30 ans',
            focus: 'Culture pop, réseaux sociaux',
          },
          professionnels: {
            label: 'Professionnels',
            focus: 'Experts métiers, crédibilité',
          },
          creatifs: {
            label: 'Créatifs',
            focus: 'Originalité, atelier, process artisanal',
          },
          tech: {
            label: 'Tech-savvy',
            focus: 'Interfaces futuristes, data, innovation',
          },
        },
        curated: {
          source: 'Curations Unsplash sélectionnées',
          vibeWithAudience: '{vibe} · {audience}',
        },
        search: {
          heading: 'Rechercher des images par mots-clés',
          clear: 'Effacer',
          placeholder: 'Ex: startup tech, bureau moderne, équipe créative...',
          button: 'Rechercher',
          loading: 'Recherche...',
          refresh: 'Actualiser',
          resultsSingular: 'résultat trouvé',
          resultsPlural: 'résultats trouvés',
          noResults: 'Aucune image trouvée pour "{query}". Essayez d’autres mots-clés.',
        },
        urlLabel: 'Collez l’URL de votre propre image',
        urlPlaceholder: 'https://exemple.com/mon-image.jpg',
        urlClear: 'Effacer l’URL personnalisée',
        invalidUrl: 'Veuillez entrer une URL valide (http:// ou https://)',
        customSelected: 'Image personnalisée sélectionnée',
        summaryTitle: 'Synthèse marque',
        summary: {
          personality: 'Personnalité',
          audience: 'Audience',
          cover: 'Couverture',
          coverSelected: 'Sélectionnée',
          coverAuto: 'Design généré automatiquement',
        },
        tips: {
          title: 'Conseils',
          items: {
            adjust: 'Vous pourrez ajuster ces choix après la génération du kit.',
            coverQuality: 'Privilégiez une image nette et contrastée pour la couverture.',
            clarity: 'Un univers visuel clair renforce la mémorisation.',
          },
        },
        errors: {
          search: 'Erreur lors de la recherche d’images',
        },
        galleries: {
          professionnel: {
            strategy: {
              title: 'Réunion stratégique',
              vibe: 'Ambiance corporate, équipe concentrée',
            },
            collaboration: {
              title: 'Collaboration agile',
              vibe: 'Open-space moderne, travail d’équipe',
            },
            atelier: {
              title: 'Atelier full white',
              vibe: 'Matériaux premium, environnement lumineux',
            },
          },
          moderne: {
            neon: {
              title: 'Design néon',
              vibe: 'Palette saturée, ambiance futuriste',
            },
            geometry: {
              title: 'Archis géométriques',
              vibe: 'Formes graphiques, contraste marqué',
            },
            studio: {
              title: 'Studio créatif',
              vibe: 'Lumières colorées, silhouette urbaine',
            },
          },
          amical: {
            workshop: {
              title: 'Atelier chaleureux',
              vibe: 'Textures naturelles, ambiance conviviale',
            },
            coffee: {
              title: 'Café collaboratif',
              vibe: 'Moments partagés, tonalités douces',
            },
            creativity: {
              title: 'Créativité spontanée',
              vibe: 'Couleurs pastel, énergie positive',
            },
          },
          luxe: {
            lounge: {
              title: 'Salon feutré',
              vibe: 'Matériaux nobles, ambiance feutrée',
            },
            details: {
              title: 'Détails dorés',
              vibe: 'Lumière dorée, textures raffinées',
            },
            architecture: {
              title: 'Architecture iconique',
              vibe: 'Perspective élégante, noir et or',
            },
          },
          dynamique: {
            city: {
              title: 'Ville en mouvement',
              vibe: 'Traînées lumineuses, énergie nocturne',
            },
            startup: {
              title: 'Startup en action',
              vibe: 'Technologie, momentum',
            },
            sport: {
              title: 'Sport urbain',
              vibe: 'Contraste intense, mouvement',
            },
          },
          minimaliste: {
            hall: {
              title: 'Hall minimaliste',
              vibe: 'Lignes verticales, teintes douces',
            },
            interior: {
              title: 'Intérieur épuré',
              vibe: 'Bois clair, lumière douce',
            },
            decor: {
              title: 'Décor géométrique',
              vibe: 'Volumes simples, tons neutres',
            },
          },
        },
      },
    },
    passwordReset: {
      back: 'Retour à la connexion',
      title: 'Nouveau mot de passe',
      subtitle: 'Choisissez un mot de passe fort et sécurisé',
    },
    forgotPassword: {
      title: 'Réinitialiser le mot de passe',
      subtitle: 'Entrez votre email pour recevoir un lien de réinitialisation',
      successTitle: 'Email envoyé !',
      successDescription:
        'Un lien de réinitialisation a été envoyé à votre adresse email. Vérifiez votre boîte de réception (et vos spams).',
    },
    newsletter: {
      sectionTitle: 'Envoyer une newsletter',
      sectionSubtitle: 'Diffusez une actualité à vos abonnés via Resend.',
      subjectLabel: 'Sujet',
      previewLabel: 'Texte d’aperçu (optionnel)',
      recipientsModeLabel: 'Destinataires',
      modeManual: 'Saisir manuellement',
      modeAll: 'Tous les utilisateurs inscrits',
      modeSelected: 'Sélectionner des utilisateurs',
      manualPlaceholder: 'contact@example.com\nhello@example.com',
      manualHint: 'Un email par ligne ou séparé par des virgules.',
      additionalLabel: 'Destinataires supplémentaires (optionnel)',
      contentLabel: 'Contenu',
      sendButton: 'Envoyer la newsletter',
      sending: 'Envoi en cours…',
      success: 'Newsletter envoyée à {count} destinataire(s).',
      missingSelection: 'Sélectionnez au moins un destinataire ou ajoutez une adresse.',
    },
    banner: {
      sectionTitle: 'Bannière d’actualité',
      sectionSubtitle: 'Modifiez le message affiché en haut du site.',
      messageLabelFr: 'Message (français)',
      messageLabelEn: 'Message (anglais)',
      ctaLabelFr: 'Texte du bouton (français, optionnel)',
      ctaLabelEn: 'Texte du bouton (anglais, optionnel)',
      ctaHrefLabel: 'Lien du bouton (optionnel)',
      enabledLabel: 'Afficher la bannière',
      lastUpdated: 'Dernière mise à jour : {date}',
      saveButton: 'Enregistrer la bannière',
      saving: 'Enregistrement…',
    },
    superadmin: {
      heroTitle: 'Super Admin',
      heroSubtitle: 'Gestion de la plateforme et curation de la bibliothèque',
      stats: {
        users: 'Utilisateurs',
        creations: 'Créations',
        library: 'En bibliothèque',
      },
      tabs: {
        users: 'Utilisateurs',
        brands: 'Créations',
        spotlighted: 'Mis en avant',
        deletions: 'Suppressions',
        communications: 'Communications',
      },
      spotlight: {
        info:
          'Sélectionnez jusqu’à 5 brands à mettre en avant sur la page d’accueil. Ces brands seront affichés dans la section "Explorez et inspirez-vous".',
        badge: 'En avant',
      },
      deletions: {
        empty: 'Aucune demande de suppression',
      },
      communications: {
        selectedUsers: 'Utilisateurs sélectionnés',
        searchPlaceholder: 'Rechercher un utilisateur…',
        selectAll: 'Tout sélectionner',
        clearSelection: 'Tout désélectionner',
        additionalRecipients: 'Adresses supplémentaires (optionnel)',
      },
    },
    forms: {
      emailPlaceholder: 'votre@email.com',
    },
    stickyBanner: {
      fallback: 'Nouveauté : Mode sombre disponible ! Découvrez toutes les fonctionnalités',
      ctaDefault: 'Découvrir',
    },
    theme: {
      darkMode: 'Mode sombre',
    },
    modals: {
      cancelCreation: {
        title: 'Annuler la création ?',
        description:
          'Êtes-vous sûr de vouloir annuler ? Toutes vos modifications seront perdues et ne seront pas sauvegardées.',
        keepEditing: 'Non, continuer',
        confirm: 'Oui, annuler',
      },
    },
  },
  en: {
    language: {
      switchLabel: 'Language',
      switchToFrench: 'French',
      switchToEnglish: 'English',
      shortFrench: 'FR',
      shortEnglish: 'EN',
    },
    actions: {
      previous: 'Back',
      next: 'Next',
      finish: 'Finish',
      cancel: 'Cancel',
      send: 'Send',
      regenerate: 'Regenerate',
      customize: 'Customize',
      loading: 'Loading…',
      refresh: 'More suggestions',
      save: 'Save',
      saving: 'Saving…',
      close: 'Close',
      signIn: 'Sign in',
      dashboard: 'Dashboard',
      signOut: 'Sign out',
    },
    header: {
      home: 'Home',
      library: 'Library',
      admin: 'Admin',
      account: 'My account',
    },
    onboarding: {
      stepIndicator: '{current}/{total}',
      step1: {
        title: 'Basic information',
        subtitle:
          'Let’s start with the fundamentals of your project to personalize the upcoming steps.',
        promptLabel: 'INITIAL IDEA',
        nameLabel: 'Project name',
        descriptionLabel: 'Description',
        descriptionHint:
          'Share your mission, core values, or what makes you unique.',
        namePlaceholder: 'e.g. TechFlow, CreaSpace…',
        descriptionPlaceholder: 'Describe your project, its values, its mission…',
        ai: {
          buttonIdle: 'AI',
          buttonGenerating: 'Generating…',
          errorNoName: 'Please enter a project name first',
          errorGeneration: 'Error during generation',
          errorDescription: 'Error generating the description',
          modalTitle: 'AI suggestions',
          mainDescription: 'Main description',
          useDescription: 'Use this description',
          alternatives: 'Alternative suggestions',
          use: 'Use',
          regenerate: 'Regenerate',
          close: 'Close',
        },
      },
      step2: {
        title: 'Colors',
        subtitle:
          'Pick a harmonious palette or let the AI craft a tailored trio for your brand.',
        aiButton: 'Suggest with AI',
        regenerate: 'Regenerate',
        customize: 'Customize',
        toggleManual: {
          show: 'Customize',
          hide: 'Hide',
        },
        aiExplanationPrefix: 'AI suggestion: ',
        ai: {
          error: 'Error while generating colors. Please try again.',
          generating: 'Generating...',
          suggestion: 'Suggest with AI',
        },
        manualTitle: 'Manual customization',
        primaryLabel: 'Primary color',
        secondaryLabel: 'Secondary color',
        accentLabel: 'Accent color',
        hexPlaceholder: '#000000',
        previewTitle: 'Palette preview',
        primarySwatch: 'Primary',
        secondarySwatch: 'Secondary',
        accentSwatch: 'Accent',
        palettes: {
          techModern: { name: 'Tech Modern' },
          nature: { name: 'Nature' },
          sunset: { name: 'Sunset Glow' },
          ocean: { name: 'Ocean' },
          purpleDream: { name: 'Purple Dream' },
          roseGold: { name: 'Rose Gold' },
        },
        paletteMeta: {
          downloads: 'Downloads',
          shares: 'Shares',
          inLibrary: 'In library',
          notPublished: 'Not published',
        },
      },
      step3: {
        title: 'Typography',
        subtitle:
          'Combine two complementary fonts to balance headings and body copy.',
        aiButton: 'Suggest with AI',
        toggleManual: {
          show: 'Customize',
          hide: 'Hide',
        },
        ai: {
          suggestion: 'Suggest with AI',
          generating: 'Generating...',
          error: 'Error while generating fonts. Please try again.',
        },
        aiExplanationPrefix: 'AI suggestion: ',
        manualTitle: 'Manual selection',
        primaryFontLabel: 'Primary font',
        secondaryFontLabel: 'Secondary font',
        selectPlaceholder: 'Select a font',
        previewTitle: 'Your Brand',
        previewBody:
          'This is an example using your secondary font. It will be used across your brand assets.',
        previewBadge: 'Typography preview',
        fontPairs: {
          modern: { name: 'Modern' },
          elegant: { name: 'Elegant' },
          tech: { name: 'Tech' },
          classic: { name: 'Classic' },
          creative: { name: 'Creative' },
          minimal: { name: 'Minimal' },
        },
      },
      step4: {
        title: 'Personality',
        subtitle:
          'Select the tone and audience that will guide every future visual asset.',
        sections: {
          personality: {
            title: '1. Brand personality',
            description:
              'Pick an archetype and we’ll align the colors, fonts, and cover imagery accordingly.',
          },
          audience: {
            title: '2. Audience to engage',
            description:
              'Audience focus sharpens AI suggestions and influences the imagery we recommend.',
          },
          cover: {
            title: '3. Cover image',
            optional: '(optional)',
            description:
              'Select one of our curated visuals or paste your own URL. Leave it blank and we’ll generate a cover automatically.',
            curatedTitle: 'Aligned inspirations',
            curatedDescription: 'Imagery {tone} aligned with this archetype.',
            curatedFallback: 'Pick a personality to unlock tailored suggestions.',
            curatedAudience: 'Target audience: {audience}',
            emptyPersonality: 'Select a personality to see curated image ideas.',
            emptyInitial: 'Choose a personality first and related visuals will appear here.',
          },
        },
        personalities: {
          professionnel: {
            label: 'Professional',
            description: 'Serious, methodical, trustworthy',
            tone: 'Bright corporate, focused team',
          },
          moderne: {
            label: 'Modern',
            description: 'Innovative, design-driven',
            tone: 'Bold architecture, futuristic neon',
          },
          amical: {
            label: 'Friendly',
            description: 'Warm, approachable, human',
            tone: 'Shared moments, handcrafted creativity',
          },
          luxe: {
            label: 'Luxury',
            description: 'Elegant, high-end',
            tone: 'Premium textures, hushed ambiance',
          },
          dynamique: {
            label: 'Dynamic',
            description: 'Energetic, daring',
            tone: 'Motion, urban sport, vibrant colors',
          },
          minimaliste: {
            label: 'Minimalist',
            description: 'Clean, clear, essentials only',
            tone: 'Geometric lines, neutral tones',
          },
        },
        audiences: {
          b2b: {
            label: 'Businesses (B2B)',
            focus: 'Decision makers, long-term relationships',
          },
          b2c: {
            label: 'Consumers (B2C)',
            focus: 'Lifestyle, emotion, proximity',
          },
          jeunes: {
            label: 'Young adults (18-30)',
            focus: 'Pop culture, social media',
          },
          professionnels: {
            label: 'Professionals',
            focus: 'Industry experts, credibility',
          },
          creatifs: {
            label: 'Creatives',
            focus: 'Originality, studio, craft process',
          },
          tech: {
            label: 'Tech-savvy',
            focus: 'Futuristic interfaces, data, innovation',
          },
        },
        curated: {
          source: 'Curated Unsplash picks',
          vibeWithAudience: '{vibe} · {audience}',
        },
        search: {
          heading: 'Search images by keywords',
          clear: 'Clear',
          placeholder: 'e.g. tech startup, modern office, creative team…',
          button: 'Search',
          loading: 'Searching...',
          refresh: 'Refresh',
          resultsSingular: 'result found',
          resultsPlural: 'results found',
          noResults: 'No images found for "{query}". Try different keywords.',
        },
        urlLabel: 'Or paste your own image URL',
        urlPlaceholder: 'https://example.com/my-image.jpg',
        urlClear: 'Clear custom URL',
        invalidUrl: 'Please enter a valid URL (http:// or https://)',
        customSelected: 'Custom image selected',
        summaryTitle: 'Brand summary',
        summary: {
          personality: 'Personality',
          audience: 'Audience',
          cover: 'Cover',
          coverSelected: 'Selected',
          coverAuto: 'Automatic design',
        },
        tips: {
          title: 'Tips',
          items: {
            adjust: 'You can tweak these choices after the kit is generated.',
            coverQuality: 'Prefer a sharp, high-contrast image for the cover.',
            clarity: 'A clear visual universe strengthens memorability.',
          },
        },
        errors: {
          search: 'Error while searching images',
        },
        galleries: {
          professionnel: {
            strategy: {
              title: 'Strategic meeting',
              vibe: 'Corporate mood, focused team',
            },
            collaboration: {
              title: 'Agile collaboration',
              vibe: 'Modern open space, teamwork',
            },
            atelier: {
              title: 'White workshop',
              vibe: 'Premium materials, bright environment',
            },
          },
          moderne: {
            neon: {
              title: 'Neon design',
              vibe: 'Bold palette, futuristic mood',
            },
            geometry: {
              title: 'Geometric architecture',
              vibe: 'Graphic shapes, strong contrast',
            },
            studio: {
              title: 'Creative studio',
              vibe: 'Colored lights, urban silhouette',
            },
          },
          amical: {
            workshop: {
              title: 'Warm workshop',
              vibe: 'Natural textures, friendly atmosphere',
            },
            coffee: {
              title: 'Collaborative café',
              vibe: 'Shared moments, soft palette',
            },
            creativity: {
              title: 'Spontaneous creativity',
              vibe: 'Pastel colors, positive energy',
            },
          },
          luxe: {
            lounge: {
              title: 'Velvet lounge',
              vibe: 'Noble materials, hushed ambiance',
            },
            details: {
              title: 'Golden details',
              vibe: 'Golden light, refined textures',
            },
            architecture: {
              title: 'Iconic architecture',
              vibe: 'Elegant perspective, black & gold',
            },
          },
          dynamique: {
            city: {
              title: 'City in motion',
              vibe: 'Light trails, nocturnal energy',
            },
            startup: {
              title: 'Startup in action',
              vibe: 'Technology, forward momentum',
            },
            sport: {
              title: 'Urban sport',
              vibe: 'High contrast, dynamic movement',
            },
          },
          minimaliste: {
            hall: {
              title: 'Minimalist hall',
              vibe: 'Vertical lines, soft tones',
            },
            interior: {
              title: 'Clean interior',
              vibe: 'Light wood, gentle daylight',
            },
            decor: {
              title: 'Geometric décor',
              vibe: 'Simple volumes, neutral palette',
            },
          },
        },
      },
    },
    passwordReset: {
      back: 'Back to sign in',
      title: 'New password',
      subtitle: 'Choose a strong and secure password',
    },
    forgotPassword: {
      title: 'Reset password',
      subtitle: 'Enter your email to receive a reset link.',
      successTitle: 'Email sent!',
      successDescription:
        'We just emailed you a reset link. Please check your inbox (and spam folder).',
    },
    newsletter: {
      sectionTitle: 'Send a newsletter',
      sectionSubtitle: 'Share an update with your subscribers via Resend.',
      subjectLabel: 'Subject',
      previewLabel: 'Preview text (optional)',
      recipientsModeLabel: 'Recipients',
      modeManual: 'Enter manually',
      modeAll: 'All registered users',
      modeSelected: 'Select users',
      manualPlaceholder: 'contact@example.com\nhello@example.com',
      manualHint: 'One email per line or separated by commas.',
      additionalLabel: 'Additional recipients (optional)',
      contentLabel: 'Content',
      sendButton: 'Send newsletter',
      sending: 'Sending…',
      success: 'Newsletter sent to {count} recipient(s).',
      missingSelection: 'Select at least one recipient or add an email address.',
    },
    banner: {
      sectionTitle: 'News banner',
      sectionSubtitle: 'Update the announcement displayed at the top of the site.',
      messageLabelFr: 'Message (French)',
      messageLabelEn: 'Message (English)',
      ctaLabelFr: 'Button text (French, optional)',
      ctaLabelEn: 'Button text (English, optional)',
      ctaHrefLabel: 'Button link (optional)',
      enabledLabel: 'Display the banner',
      lastUpdated: 'Last updated: {date}',
      saveButton: 'Save banner',
      saving: 'Saving…',
    },
    superadmin: {
      heroTitle: 'Super Admin',
      heroSubtitle: 'Platform management and library curation',
      stats: {
        users: 'Users',
        creations: 'Creations',
        library: 'In library',
      },
      tabs: {
        users: 'Users',
        brands: 'Creations',
        spotlighted: 'Spotlight',
        deletions: 'Deletion requests',
        communications: 'Communications',
      },
      spotlight: {
        info:
          'Select up to 5 brands to feature on the homepage. They will appear in the “Explore & be inspired” section.',
        badge: 'Featured',
      },
      deletions: {
        empty: 'No deletion requests',
      },
      communications: {
        selectedUsers: 'Selected users',
        searchPlaceholder: 'Search a user…',
        selectAll: 'Select all',
        clearSelection: 'Clear selection',
        additionalRecipients: 'Additional addresses (optional)',
      },
    },
    forms: {
      emailPlaceholder: 'your@email.com',
    },
    stickyBanner: {
      fallback: 'New: Dark mode is now available! Discover every feature',
      ctaDefault: 'Discover',
    },
    theme: {
      darkMode: 'Dark mode',
    },
    modals: {
      cancelCreation: {
        title: 'Cancel creation?',
        description:
          'Are you sure you want to cancel? All your changes will be lost.',
        keepEditing: 'No, keep editing',
        confirm: 'Yes, cancel',
      },
    },
  },
}

function resolveKey(locale: Locale, key: string): string | undefined {
  const parts = key.split('.')
  let node: unknown = translations[locale]

  for (const part of parts) {
    if (typeof node !== 'object' || node === null || !(part in (node as Record<string, unknown>))) {
      return undefined
    }
    node = (node as Record<string, unknown>)[part]
  }

  return typeof node === 'string' ? node : undefined
}

export function translate(
  locale: Locale,
  key: string,
  replacements?: TranslationReplacements,
): string {
  const template =
    resolveKey(locale, key) ??
    resolveKey(defaultLocale, key) ??
    key

  if (!replacements) {
    return template
  }

  return Object.entries(replacements).reduce((acc, [placeholder, value]) => {
    return acc.replace(new RegExp(`{${placeholder}}`, 'g'), String(value))
  }, template)
}
