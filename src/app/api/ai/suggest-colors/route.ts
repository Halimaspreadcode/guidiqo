import { NextResponse } from 'next/server'

type Palette = {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  explanation: string
}

const basePalettes: Record<
  string,
  { colors: Omit<Palette, 'explanation'>; rationale: string }
> = {
  professionnel: {
    colors: {
      primaryColor: '#0F172A',
      secondaryColor: '#1E293B',
      accentColor: '#38BDF8'
    },
    rationale: 'Palette bleu nuit / acier pensée pour inspirer sérieux et fiabilité.'
  },
  moderne: {
    colors: {
      primaryColor: '#111827',
      secondaryColor: '#312E81',
      accentColor: '#F97316'
    },
    rationale: 'Contraste sombre / accent vibrant pour refléter une image moderne et innovante.'
  },
  amical: {
    colors: {
      primaryColor: '#F97316',
      secondaryColor: '#FBBF24',
      accentColor: '#10B981'
    },
    rationale: 'Couleurs chaudes et positives pour installer confiance et proximité.'
  },
  luxe: {
    colors: {
      primaryColor: '#0B0F19',
      secondaryColor: '#312E2B',
      accentColor: '#D4AF37'
    },
    rationale: 'Mélange noir carbone et doré pour souligner un positionnement premium.'
  },
  dynamique: {
    colors: {
      primaryColor: '#111827',
      secondaryColor: '#EF4444',
      accentColor: '#F97316'
    },
    rationale: 'Teintes punchy et contrasts nets pour traduire le mouvement et l’énergie.'
  },
  minimaliste: {
    colors: {
      primaryColor: '#111827',
      secondaryColor: '#E5E7EB',
      accentColor: '#6366F1'
    },
    rationale: 'Base monochrome sobre avec une pointe de couleur pour éviter la froideur.'
  }
}

const audienceAdjustments: Record<
  string,
  { tweak: Partial<Palette>; note: string }
> = {
  b2b: {
    tweak: { accentColor: '#38BDF8' },
    note: 'Accent froid pour garder un ton corporate crédible.'
  },
  b2c: {
    tweak: { accentColor: '#F472B6' },
    note: 'Point de couleur plus émotionnel pour parler aux consommateurs.'
  },
  jeunes: {
    tweak: { accentColor: '#22D3EE', secondaryColor: '#1E293B' },
    note: 'Accent flash et secondaires sombres pour un rendu pop et digital.'
  },
  professionnels: {
    tweak: { secondaryColor: '#334155' },
    note: 'Secondaire renforcé pour conserver une lecture sobre et experte.'
  },
  creatifs: {
    tweak: { accentColor: '#A855F7' },
    note: 'Accent vibrant pour souligner la créativité.'
  },
  tech: {
    tweak: { accentColor: '#14B8A6', secondaryColor: '#0F172A' },
    note: 'Duo turquoise / nuit pour évoquer la tech et les interfaces.'
  }
}

const defaultPalette: Palette = {
  primaryColor: '#111827',
  secondaryColor: '#374151',
  accentColor: '#22C55E',
  explanation:
    'Palette polyvalente pensée pour rester lisible tout en conservant une touche de modernité.'
}

export async function POST(request: Request) {
  try {
    const { description, personality, targetAudience } = await request.json()

    if (!description) {
      return NextResponse.json(
        { error: 'Description manquante' },
        { status: 400 }
      )
    }

    if (!personality || !basePalettes[personality]) {
      return NextResponse.json({
        ...defaultPalette,
        explanation:
          'Palette générique adaptée à la plupart des projets. Sélectionnez une personnalité pour une recommandation plus ciblée.'
      })
    }

    const base = basePalettes[personality]

    const palette: Palette = {
      ...base.colors,
      explanation: base.rationale
    }

    if (targetAudience && audienceAdjustments[targetAudience]) {
      const adjustment = audienceAdjustments[targetAudience]
      palette.primaryColor =
        adjustment.tweak.primaryColor ?? palette.primaryColor
      palette.secondaryColor =
        adjustment.tweak.secondaryColor ?? palette.secondaryColor
      palette.accentColor =
        adjustment.tweak.accentColor ?? palette.accentColor
      palette.explanation = `${base.rationale} ${adjustment.note}`
    } else {
      palette.explanation = `${base.rationale} Palette neutre par défaut pour rester polyvalente.`
    }

    return NextResponse.json(palette)
  } catch (error) {
    console.error('❌ Error generating color suggestions:', error)
    return NextResponse.json(defaultPalette)
  }
}
