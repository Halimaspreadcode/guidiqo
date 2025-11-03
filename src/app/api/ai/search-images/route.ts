import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { query, personality, targetAudience } = await request.json()

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: 'Mots-clés requis' }, { status: 400 })
    }

    // Vérifier si la clé API Unsplash est disponible
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      console.error('❌ UNSPLASH_ACCESS_KEY is not defined in environment variables')
      return NextResponse.json(
        { error: 'Configuration API manquante pour la recherche d\'images' },
        { status: 500 }
      )
    }

    // Construire une requête enrichie basée sur les mots-clés et le contexte
    const enhancedQuery = enhanceImageQuery(query, personality, targetAudience)
    
    console.log('🔍 Unsplash search:', {
      query: enhancedQuery,
      apiKeyPresent: !!process.env.UNSPLASH_ACCESS_KEY,
      apiKeyLength: process.env.UNSPLASH_ACCESS_KEY?.length || 0
    })
    
    try {
      // Recherche via l'API Unsplash - Augmenter à 20 résultats
      const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(enhancedQuery)}&per_page=20&orientation=landscape`
      
      console.log('📡 Calling Unsplash API:', unsplashUrl.substring(0, 100) + '...')
      
      const response = await fetch(unsplashUrl, {
        headers: {
          'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Unsplash API error:', response.status, errorText)
        throw new Error(`Unsplash API error: ${response.status} - ${errorText.substring(0, 200)}`)
      }

      const data = await response.json()
      
      console.log('✅ Unsplash API response:', {
        total: data.total,
        resultsCount: data.results?.length || 0,
        source: 'unsplash'
      })
      
      // Transformer les résultats pour correspondre au format attendu
      // IMPORTANT: Utiliser les URLs hotlink d'Unsplash (urls.raw ou urls.full)
      const images = data.results?.map((photo: any) => ({
        id: photo.id, // Nécessaire pour déclencher le download
        url: photo.urls?.raw || photo.urls?.full || photo.urls?.regular, // Hotlink vers l'URL originale
        title: photo.description || photo.alt_description || `Image pour ${query}`,
        vibe: generateVibeDescription(photo, personality),
        photographer: {
          name: photo.user?.name || 'Unknown',
          url: photo.user?.links?.html || `https://unsplash.com/@${photo.user?.username || ''}`,
          username: photo.user?.username || ''
        },
        unsplashUrl: photo.links?.html || `https://unsplash.com/photos/${photo.id}`,
        downloadLocation: photo.links?.download_location || '' // Pour déclencher le download
      })) || []

      console.log('🖼️ Processed images:', images.length)

      return NextResponse.json({
        images,
        query: enhancedQuery,
        total: data.total || 0,
        source: 'unsplash'
      })

    } catch (unsplashError: any) {
      console.error('❌ Unsplash API error, using fallback:', unsplashError)
      console.error('Error details:', {
        message: unsplashError?.message,
        stack: unsplashError?.stack?.substring(0, 200)
      })
      
      // Fallback: générer des URLs Unsplash basées sur la requête
      const fallbackImages = generateFallbackImages(query, personality)
      console.log('⚠️ Using fallback images:', fallbackImages.length)
      
      return NextResponse.json({
        images: fallbackImages,
        query: enhancedQuery,
        total: fallbackImages.length,
        source: 'fallback',
        error: unsplashError?.message
      })
    }

  } catch (error) {
    console.error('❌ Error searching images:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la recherche d\'images' },
      { status: 500 }
    )
  }
}

// Fonction pour enrichir la requête de recherche
function enhanceImageQuery(query: string, personality?: string, targetAudience?: string): string {
  const baseQuery = query.toLowerCase().trim()
  
  // Mots-clés de contexte basés sur la personnalité
  const personalityKeywords: Record<string, string[]> = {
    'professionnel': ['business', 'office', 'corporate', 'professional', 'team'],
    'moderne': ['modern', 'contemporary', 'futuristic', 'tech', 'innovation'],
    'amical': ['friendly', 'warm', 'cozy', 'community', 'people'],
    'luxe': ['luxury', 'premium', 'elegant', 'sophisticated', 'gold'],
    'dynamique': ['dynamic', 'energy', 'movement', 'vibrant', 'action'],
    'minimaliste': ['minimal', 'clean', 'simple', 'minimalist', 'white']
  }

  // Mots-clés basés sur l'audience
  const audienceKeywords: Record<string, string[]> = {
    'b2b': ['business', 'corporate', 'professional'],
    'b2c': ['lifestyle', 'consumer', 'people'],
    'jeunes': ['young', 'trendy', 'social', 'colorful'],
    'professionnels': ['professional', 'expert', 'corporate'],
    'creatifs': ['creative', 'artistic', 'design', 'studio'],
    'tech': ['technology', 'digital', 'innovation', 'startup']
  }

  let enhancedQuery = baseQuery

  // Ajouter des mots-clés de personnalité
  if (personality && personalityKeywords[personality]) {
    const personalityWords = personalityKeywords[personality]
    enhancedQuery += ` ${personalityWords.join(' ')}`
  }

  // Ajouter des mots-clés d'audience
  if (targetAudience && audienceKeywords[targetAudience]) {
    const audienceWords = audienceKeywords[targetAudience]
    enhancedQuery += ` ${audienceWords.join(' ')}`
  }

  // Ajouter des mots-clés génériques pour améliorer la qualité
  enhancedQuery += ' high quality professional photography'

  return enhancedQuery
}

// Générer une description de vibe basée sur l'image et la personnalité
function generateVibeDescription(photo: any, personality?: string): string {
  const color = photo.color || '#666666'
  const isDark = isColorDark(color)
  
  const vibeDescriptions: Record<string, string[]> = {
    'professionnel': ['Ambiance corporate', 'Équipe concentrée', 'Environnement professionnel'],
    'moderne': ['Design contemporain', 'Esthétique futuriste', 'Innovation visuelle'],
    'amical': ['Atmosphère chaleureuse', 'Moments partagés', 'Énergie positive'],
    'luxe': ['Élégance raffinée', 'Matériaux premium', 'Ambiance feutrée'],
    'dynamique': ['Énergie en mouvement', 'Contraste intense', 'Momentum créatif'],
    'minimaliste': ['Lignes épurées', 'Tons neutres', 'Simplicité élégante']
  }

  const baseVibes = vibeDescriptions[personality || 'moderne'] || ['Design contemporain', 'Esthétique moderne']
  const randomVibe = baseVibes[Math.floor(Math.random() * baseVibes.length)]
  
  return `${randomVibe}${isDark ? ', tonalités sombres' : ', luminosité douce'}`
}

// Vérifier si une couleur est sombre
function isColorDark(hexColor: string): boolean {
  const hex = hexColor.replace('#', '')
  if (hex.length !== 6) return false
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness < 128
}

// Générer des images de fallback basées sur Unsplash
function generateFallbackImages(query: string, personality?: string): Array<{url: string, title: string, vibe: string}> {
  const baseQuery = query.toLowerCase().replace(/\s+/g, '-')
  const personalitySuffix = personality ? `-${personality}` : ''
  
  return [
    {
      url: `https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
      title: `Image pour ${query}`,
      vibe: 'Design professionnel, ambiance moderne'
    },
    {
      url: `https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
      title: `Inspiration ${query}`,
      vibe: 'Esthétique contemporaine, couleurs harmonieuses'
    },
    {
      url: `https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
      title: `Contexte ${query}`,
      vibe: 'Environnement créatif, lumière naturelle'
    }
  ]
}
