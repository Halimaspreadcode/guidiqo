import { NextResponse } from 'next/server'

type FontSuggestion = {
  primaryFont: string
  secondaryFont: string
  explanation: string
}

const fontPairByPersonality: Record<
  string,
  { pair: Omit<FontSuggestion, 'explanation'>; rationale: string }
> = {
  professionnel: {
    pair: { primaryFont: 'Inter', secondaryFont: 'Source Sans Pro' },
    rationale:
      'Inter + Source Sans Pro : duo sans-serif très lisible, idéal pour la crédibilité corporate.'
  },
  moderne: {
    pair: { primaryFont: 'Space Grotesk', secondaryFont: 'DM Sans' },
    rationale:
      'Space Grotesk + DM Sans : géométrie travaillée pour des interfaces design et contemporaines.'
  },
  amical: {
    pair: { primaryFont: 'Poppins', secondaryFont: 'Nunito' },
    rationale:
      'Poppins + Nunito : courbes généreuses pour un ton chaleureux et accessible.'
  },
  luxe: {
    pair: { primaryFont: 'Playfair Display', secondaryFont: 'Raleway' },
    rationale:
      'Playfair Display + Raleway : contraste serif / sans-serif chic pour un positionnement premium.'
  },
  dynamique: {
    pair: { primaryFont: 'Montserrat', secondaryFont: 'Roboto' },
    rationale:
      'Montserrat + Roboto : combinaison énergique et très lisible pour soutenir des messages impactants.'
  },
  minimaliste: {
    pair: { primaryFont: 'Work Sans', secondaryFont: 'Karla' },
    rationale:
      'Work Sans + Karla : sans-serif épurées pour un rendu discret et minimal.'
  }
}

const audienceTweaks: Record<
  string,
  { override?: Partial<Omit<FontSuggestion, 'explanation'>>; note: string }
> = {
  b2b: {
    note: 'Maintient un ton professionnel et structuré, adapté aux décideurs.'
  },
  b2c: {
    override: { secondaryFont: 'Open Sans' },
    note: 'Secondaire plus souple pour fluidifier la lecture côté consommateurs.'
  },
  jeunes: {
    override: { primaryFont: 'Urbanist', secondaryFont: 'Plus Jakarta Sans' },
    note: 'Duo trendy inspiré du digital pour parler aux jeunes audiences.'
  },
  professionnels: {
    note: 'Met l’accent sur la lisibilité et la rigueur pour des experts métiers.'
  },
  creatifs: {
    override: { primaryFont: 'Raleway', secondaryFont: 'Montserrat' },
    note: 'Mix plus expressif pour soutenir des marques créatives.'
  },
  tech: {
    override: { primaryFont: 'IBM Plex Sans', secondaryFont: 'IBM Plex Mono' },
    note: 'Couple technique rappelant l’univers interface / code.'
  }
}

const defaultSuggestion: FontSuggestion = {
  primaryFont: 'Inter',
  secondaryFont: 'Roboto',
  explanation:
    'Duo sans-serif polyvalent et hautement lisible. Sélectionnez une personnalité pour des recommandations ciblées.'
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

    if (!personality || !fontPairByPersonality[personality]) {
      return NextResponse.json(defaultSuggestion)
    }

    const base = fontPairByPersonality[personality]
    const suggestion: FontSuggestion = {
      ...base.pair,
      explanation: base.rationale
    }

    if (targetAudience && audienceTweaks[targetAudience]) {
      const tweak = audienceTweaks[targetAudience]
      suggestion.primaryFont =
        tweak.override?.primaryFont ?? suggestion.primaryFont
      suggestion.secondaryFont =
        tweak.override?.secondaryFont ?? suggestion.secondaryFont
      suggestion.explanation = `${base.rationale} ${tweak.note}`
    } else {
      suggestion.explanation = `${base.rationale} Duo équilibré pour rester polyvalent quel que soit le support.`
    }

    return NextResponse.json(suggestion)
  } catch (error) {
    console.error('❌ Error generating font suggestions:', error)
    return NextResponse.json(defaultSuggestion)
  }
}
