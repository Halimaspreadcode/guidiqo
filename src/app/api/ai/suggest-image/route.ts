import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { description, personality, category } = await request.json()

    if (!description) {
      return NextResponse.json({ error: 'Description manquante' }, { status: 400 })
    }

    // Construire une requête Unsplash intelligente basée sur la description et la personnalité
    const keywords: string[] = []
    const desc = (description || '').toLowerCase()
    const pers = (personality || '').toLowerCase()

    // Analyse de la description pour déterminer le type d'entreprise
    if (desc.includes('tech') || desc.includes('technologie') || desc.includes('digital') || desc.includes('software')) {
      keywords.push('technology', 'digital', 'abstract', 'innovation')
    } else if (desc.includes('nature') || desc.includes('écologique') || desc.includes('bio') || desc.includes('environnement')) {
      keywords.push('nature', 'green', 'organic', 'sustainability')
    } else if (desc.includes('mode') || desc.includes('fashion') || desc.includes('vêtement') || desc.includes('luxe')) {
      keywords.push('fashion', 'style', 'elegant', 'luxury')
    } else if (desc.includes('food') || desc.includes('restaurant') || desc.includes('cuisine') || desc.includes('café')) {
      keywords.push('food', 'culinary', 'gourmet', 'restaurant')
    } else if (desc.includes('art') || desc.includes('créatif') || desc.includes('design') || desc.includes('studio')) {
      keywords.push('art', 'creative', 'design', 'artistic')
    } else if (desc.includes('sport') || desc.includes('fitness') || desc.includes('gym') || desc.includes('santé')) {
      keywords.push('fitness', 'sport', 'active', 'wellness')
    } else if (desc.includes('voyage') || desc.includes('tourisme') || desc.includes('hôtel')) {
      keywords.push('travel', 'adventure', 'destination', 'vacation')
    } else if (desc.includes('immobilier') || desc.includes('architecture') || desc.includes('construction')) {
      keywords.push('architecture', 'building', 'modern', 'real-estate')
    } else {
      keywords.push('business', 'professional', 'modern', 'minimal')
    }

    // Ajouter la personnalité
    if (pers.includes('élégant') || pers.includes('elegant') || pers.includes('luxe')) {
      keywords.push('elegant', 'sophisticated')
    } else if (pers.includes('moderne') || pers.includes('modern') || pers.includes('contemporain')) {
      keywords.push('modern', 'contemporary')
    } else if (pers.includes('dynamique') || pers.includes('energique') || pers.includes('vibrant')) {
      keywords.push('dynamic', 'energy', 'vibrant')
    } else if (pers.includes('minimaliste') || pers.includes('minimal') || pers.includes('épuré')) {
      keywords.push('minimal', 'clean', 'simple')
    } else if (pers.includes('créatif') || pers.includes('artistique')) {
      keywords.push('creative', 'artistic', 'colorful')
    }

    // Choisir les mots-clés en fonction de la catégorie
    let selectedKeywords: string[] = []
    
    if (category === 'hero') {
      // Pour le hero: image large, inspirante, professionnelle
      selectedKeywords = keywords.slice(0, 2)
      selectedKeywords.push('professional', 'abstract')
    } else if (category === 'typography') {
      // Pour la typographie: textures, patterns, arrière-plans intéressants
      selectedKeywords = ['typography', 'letters', 'text', 'design']
    } else if (category === 'personality') {
      // Pour la personnalité: image émotionnelle, lifestyle
      selectedKeywords = keywords.slice(0, 2)
      selectedKeywords.push('lifestyle', 'people')
    } else if (category === 'accent') {
      // Pour l'accent: patterns, textures abstraites
      selectedKeywords = ['pattern', 'texture', 'abstract', 'geometric']
    } else if (category === 'application') {
      // Pour l'application finale: scène de vie, contexte d'utilisation
      selectedKeywords = keywords.slice(0, 2)
      selectedKeywords.push('workspace', 'lifestyle')
    } else if (category === 'dashboard') {
      // Pour le dashboard: image d'ambiance du secteur
      selectedKeywords = keywords.slice(0, 3)
    } else {
      selectedKeywords = keywords.slice(0, 2)
    }

    // Construire l'URL Unsplash
    const query = selectedKeywords.join(',')
    const randomSeed = Math.floor(Math.random() * 10000)
    
    // Utiliser l'API Source Unsplash avec des paramètres aléatoires pour varier les images
    const imageUrl = `https://source.unsplash.com/featured/1600x900/?${encodeURIComponent(query)}&sig=${randomSeed}`

    return NextResponse.json({
      imageUrl,
      keywords: selectedKeywords,
      query
    })
  } catch (error) {
    console.error('❌ Error generating image suggestion:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'image' },
      { status: 500 }
    )
  }
}

