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

    const prompt = `Tu es un expert en design et branding. Génère une palette de 3 couleurs HEX pour un branding avec les caractéristiques suivantes:

Description: ${description}
${personality ? `Personnalité: ${personality}` : ''}
${targetAudience ? `Audience cible: ${targetAudience}` : ''}

Retourne UNIQUEMENT un objet JSON avec cette structure exacte (sans markdown, sans backticks):
{
  "primaryColor": "#HEXCODE",
  "secondaryColor": "#HEXCODE",
  "accentColor": "#HEXCODE",
  "explanation": "Courte explication du choix de couleurs (2 phrases max)"
}`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en design de marque et théorie des couleurs. Tu réponds toujours en JSON valide sans markdown.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('Aucune réponse de l\'IA')
    }

    const colors = JSON.parse(response)
    
    return NextResponse.json(colors)
  } catch (error) {
    console.error('❌ Error generating color suggestions:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération des couleurs' },
      { status: 500 }
    )
  }
}

