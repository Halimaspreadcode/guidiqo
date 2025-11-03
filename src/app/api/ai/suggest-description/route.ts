import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

// Fonction de fallback pour générer des descriptions sans IA
function generateFallbackDescription(name: string, idea: string) {
  const descriptions = [
    `${name} est une entreprise innovante qui révolutionne son secteur d'activité. Notre mission est de ${idea.toLowerCase()} en offrant des solutions modernes et efficaces à nos clients.`,
    `Chez ${name}, nous croyons en la puissance de ${idea.toLowerCase()}. Notre équipe passionnée s'engage à fournir des services exceptionnels et à créer de la valeur pour nos partenaires.`,
    `${name} se positionne comme un leader dans son domaine grâce à ${idea.toLowerCase()}. Nous nous efforçons d'innover constamment pour répondre aux besoins évolutifs de notre marché.`,
    `Notre vision chez ${name} est de transformer ${idea.toLowerCase()} en une expérience unique et mémorable. Nous combinons expertise technique et créativité pour offrir des résultats exceptionnels.`
  ]

  const tones = ['professionnel', 'innovant', 'créatif', 'moderne']
  const sectors = ['technologie', 'services', 'créatif', 'consulting']

  return {
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    suggestions: descriptions.filter((_, index) => index !== Math.floor(Math.random() * descriptions.length)).slice(0, 3),
    tone: tones[Math.floor(Math.random() * tones.length)],
    sector: sectors[Math.floor(Math.random() * sectors.length)]
  }
}

export async function POST(request: Request) {
  try {
    const { name, idea } = await request.json()

    if (!name || !idea) {
      return NextResponse.json({ error: 'Nom et idée sont requis' }, { status: 400 })
    }

    // Vérifier si la clé API Groq est disponible
    if (!process.env.GROQ_API_KEY) {
      console.error('❌ GROQ_API_KEY is not defined in environment variables')
      return NextResponse.json(
        { error: 'Configuration API manquante' },
        { status: 500 }
      )
    }

    // Debug: vérifier la clé API
    console.log('🔑 GROQ_API_KEY length:', process.env.GROQ_API_KEY?.length)
    console.log('🔑 GROQ_API_KEY starts with:', process.env.GROQ_API_KEY?.substring(0, 10))

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    })

    const prompt = `Tu es un expert en branding et marketing. Génère une description professionnelle et engageante pour un projet de marque basée sur ces informations:

Nom du projet: ${name}
Idée générale: ${idea}

La description doit:
- Être entre 50 et 400 caractères
- Capturer l'essence et la valeur unique du projet
- Être professionnelle mais accessible
- Inclure la mission ou la vision du projet
- Utiliser un ton adapté au secteur d'activité
- Être en français

Retourne UNIQUEMENT un objet JSON avec cette structure exacte (sans markdown, sans backticks):
{
  "description": "Description générée ici",
  "suggestions": [
    "Suggestion alternative 1",
    "Suggestion alternative 2",
    "Suggestion alternative 3"
  ],
  "tone": "Ton identifié (professionnel, créatif, tech, etc.)",
  "sector": "Secteur d'activité identifié"
}`

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en branding et rédaction marketing. Tu génères des descriptions de marque professionnelles, engageantes et adaptées au contexte. Tu réponds toujours en JSON valide sans markdown.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'openai/gpt-oss-120b',
        temperature: 1,
        max_completion_tokens: 8192,
        top_p: 1,
        reasoning_effort: 'medium',
        response_format: { type: 'json_object' }
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('Aucune réponse de l\'IA')
      }

      const result = JSON.parse(response)
      
      return NextResponse.json(result)
    } catch (groqError) {
      console.error('❌ Groq API error, using fallback:', groqError)
      
      // Fallback: génération de description basique
      const fallbackResult = generateFallbackDescription(name, idea)
      return NextResponse.json(fallbackResult)
    }
  } catch (error) {
    console.error('❌ Error generating description suggestions:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération de la description' },
      { status: 500 }
    )
  }
}
