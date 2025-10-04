import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(request: Request) {
  try {
    const { description, personality, targetAudience } = await request.json()

    if (!description) {
      return NextResponse.json({ error: 'Description manquante' }, { status: 400 })
    }

    const prompt = `Tu es un expert en typographie et branding. Suggère 2 polices Google Fonts pour un branding avec les caractéristiques suivantes:

Description: ${description}
${personality ? `Personnalité: ${personality}` : ''}
${targetAudience ? `Audience cible: ${targetAudience}` : ''}

Choisis UNIQUEMENT parmi ces polices Google Fonts populaires:
- Raleway, Montserrat, Roboto, Open Sans, Lato, Poppins, Nunito, Playfair Display, Merriweather, Bebas Neue, Oswald, Source Sans Pro, Inter, Work Sans, Space Grotesk, DM Sans, Manrope, Urbanist, Outfit, Plus Jakarta Sans

Retourne UNIQUEMENT un objet JSON avec cette structure exacte (sans markdown, sans backticks):
{
  "primaryFont": "Nom de la police principale",
  "secondaryFont": "Nom de la police secondaire",
  "explanation": "Courte explication du choix typographique (2 phrases max)"
}`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en typographie et design de marque. Tu réponds toujours en JSON valide sans markdown. Tu choisis uniquement parmi les polices listées.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('Aucune réponse de l\'IA')
    }

    const fonts = JSON.parse(response)
    
    return NextResponse.json(fonts)
  } catch (error) {
    console.error('❌ Error generating font suggestions:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération des polices' },
      { status: 500 }
    )
  }
}

